import { supabase } from "./supabaseClient";

/**
 * Parses the filename to extract version and build number.
 * Expected format: app-arm64-v8a-release-<version>+<build>.apk
 * Example: app-arm64-v8a-release-2.0.8+12.apk
 */
const parseApkFilename = (filename) => {
    // Regex matches the version and build number at the end of the filename
    // Looks for: - (version) + (build) .apk
    const regex = /[-]([\d\.]+)\+(\d+)\.apk$/;
    const match = filename.match(regex);

    if (match && match.length === 3) {
        return {
            version: match[1],
            build_number: parseInt(match[2], 10)
        };
    }
    return null;
};

// Module-level flag to prevent concurrent syncs (e.g. React Strict Mode)
let isSyncing = false;

/**
 * Syncs the latest APKs from Storage to the app_versions table.
 * checks the top 5 most recent files to ensure we don't miss anything.
 */
export async function syncLatestApkFromStorage() {
    if (isSyncing) {
        console.log("APK sync already in progress, skipping.");
        return;
    }
    
    isSyncing = true;
    try {
        console.log("Starting APK sync...");
        
        // 1. List files from "App versions" bucket
        const { data: files, error: storageError } = await supabase.storage
            .from("App versions")
            .list("", {
                sortBy: { column: "created_at", order: "desc" },
                limit: 5 // Check top 5 latest files
            });

        if (storageError) {
            console.error("Error fetching APK list from storage:", storageError);
            return;
        }

        if (!files || files.length === 0) {
            console.log("No files found in storage.");
            return;
        }

        // 2. Fetch existing versions from DB to avoid duplicates
        // We only need to check against the ones we found in storage, but fetching all recent ones is easier/safer
        const { data: existingVersions, error: dbError } = await supabase
            .from('app_versions')
            .select('version, build_number')
            .order('created_at', { ascending: false })
            .limit(20);

        if (dbError) {
            console.error("Error fetching existing versions from DB:", dbError);
            return;
        }

        const existingSet = new Set(
            existingVersions.map(v => `${v.version}+${v.build_number}`)
        );

        let addedCount = 0;

        // 3. Process each file
        for (const file of files) {
            const parsed = parseApkFilename(file.name);
            
            if (!parsed) {
                console.warn(`Skipping file with invalid name format: ${file.name}`);
                continue;
            }

            const key = `${parsed.version}+${parsed.build_number}`;

            if (existingSet.has(key)) {
                // Already exists in DB
                continue;
            }

            // 4. It's new! Insert into DB.
            const { data: urlData } = supabase.storage
                .from("App versions")
                .getPublicUrl(file.name);

            const newVersion = {
                version: parsed.version,
                build_number: parsed.build_number,
                platform: 'android', // Assuming android based on filename
                force_update: false, // Default to false
                download_url: urlData.publicUrl,
                created_at: file.created_at // Use the file's creation time if possible, or let DB default to now()
            };

            // Using upsert or insert. Insert is fine since we checked existence.
            const { error: insertError } = await supabase
                .from('app_versions')
                .insert([newVersion]);

            if (insertError) {
                console.error(`Failed to insert version ${key}:`, insertError);
            } else {
                console.log(`Successfully added version ${key} from storage.`);
                addedCount++;
            }
        }

        if (addedCount > 0) {
            console.log(`Sync complete. Added ${addedCount} new versions.`);
        } else {
            console.log("Sync complete. No new versions found.");
        }

    } catch (err) {
        console.error("Unexpected error during APK sync:", err);
    } finally {
        isSyncing = false;
    }
}
