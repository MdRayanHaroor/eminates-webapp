import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

console.log("Hello from send-email-smtp!");

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const input = await req.json();
        const { user_ids, title, message, html_body } = input;

        if (!user_ids || !Array.isArray(user_ids) || user_ids.length === 0) {
            throw new Error("Missing or invalid 'user_ids'");
        }

        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Fetch user emails
        const { data: users, error: userError } = await supabase
            .from('users')
            .select('email, full_name')
            .in('id', user_ids);

        if (userError) throw userError;

        const emails = users?.map(u => u.email).filter(e => e) || [];

        if (emails.length === 0) {
            return new Response(JSON.stringify({ message: "No valid emails found for provided user IDs" }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        console.log(`Attempting to send to ${emails.length} recipients`);

        // SMTP Configuration
        const client = new SmtpClient();

        const smtpHostname = "smtp.gmail.com";
        const smtpPort = 465;
        const smtpUsername = "admin@eminates.com"; // User requested this sender
        const smtpPassword = Deno.env.get("GMAIL_APP_PASSWORD"); // App Password needs to be set in Secrets

        if (!smtpPassword) {
            throw new Error("GMAIL_APP_PASSWORD environment variable not set");
        }

        await client.connectTLS({
            hostname: smtpHostname,
            port: smtpPort,
            username: smtpUsername,
            password: smtpPassword,
        });

        const results = [];

        // Send emails sequentially to respect ANY potential limits and avoid flooding
        for (const email of emails) {
            try {
                await client.send({
                    from: smtpUsername,
                    to: email,
                    subject: title,
                    content: html_body || message || "Default Body",
                });
                results.push({ email, status: "sent" });
                console.log(`Sent to ${email}`);
            } catch (err) {
                console.error(`Failed to send to ${email}:`, err);
                results.push({ email, status: "failed", error: err.message });
            }
        }

        await client.close();

        return new Response(JSON.stringify({ results }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
