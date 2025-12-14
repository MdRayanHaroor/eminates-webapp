import { supabase } from "./supabaseClient";

export async function getLatestApkUrl() {
  // 1. List files from the "App versions" bucket
  // We sort by 'created_at' descending to ensure the first item is the newest
  const { data, error } = await supabase.storage
    .from("App versions")
    .list("", {
      sortBy: { column: "created_at", order: "desc" }, 
    });

  if (error) {
    console.error("Error fetching APK list:", error);
    return null;
  }

  if (!data || data.length === 0) {
    return null;
  }

  // 2. Pick the most recent file
  const latestFile = data[0];

  // 3. Get the Public URL for this specific file
  const { data: urlData } = supabase.storage
    .from("App versions")
    .getPublicUrl(latestFile.name);

  // 4. RETURN the url string so your component can use it
  return urlData.publicUrl;
}