import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const AdminLayout = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState(null);
    const [authorized, setAuthorized] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let mounted = true;

        const checkAdminRole = async (userId) => {
            console.log("Checking admin role for:", userId);
            try {
                // 1. Query the Public Users Table
                const { data: userProfile, error } = await supabase
                    .from('users')
                    .select('role')
                    .eq('id', userId)
                    .single();

                if (!mounted) return;

                if (error) throw new Error(`Database Error: ${error.message} (Hint: Check RLS Policies)`);
                if (!userProfile) throw new Error(`User authenticated (ID: ${userId}) but missing in 'public.users' table.`);
                if (userProfile.role !== 'admin') throw new Error(`Access Denied: Role is '${userProfile.role}', expected 'admin'.`);

                // 2. Success!
                setAuthorized(true);
            } catch (err) {
                console.error("Role Check Failed:", err);
                setAuthError(err.message);
            } finally {
                if (mounted) setIsLoading(false);
            }
        };

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!mounted) return;
            console.log("Auth Event:", event);

            // Check for OAuth errors in URL first (e.g., code exchange failure)
            const urlParams = new URLSearchParams(window.location.search);
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const oauthError = urlParams.get('error') || hashParams.get('error');
            const oauthErrorDescription = urlParams.get('error_description') || hashParams.get('error_description');

            if (oauthError) {
                console.error("OAuth Error Detected:", oauthError, oauthErrorDescription);
                setAuthError(`Google Login Failed: ${decodeURIComponent(oauthErrorDescription || oauthError)}`);
                setIsLoading(false);
                // Clean up the URL
                window.history.replaceState({}, document.title, "/admin/login");
                return;
            }

            // Helper to handle the "we have a code but no session from event" case
            const handleOAuthCode = async () => {
                console.log("OAuth code detected. Attempting manual session verification...");
                try {
                    // Immediate check
                    const { data: { session: immediateSession }, error: immediateError } = await supabase.auth.getSession();
                    if (immediateSession) {
                        console.log("Manual check: Session found!");
                        await checkAdminRole(immediateSession.user.id);
                        return;
                    }

                    if (immediateError) {
                        console.warn("Manual check error:", immediateError);
                    }

                    // Retry after delay (Supabase might still be exchanging code)
                    console.log("Manual check: No session yet. Retrying in 1s...");
                    setTimeout(async () => {
                        if (!mounted) return;
                        const { data: { session: retrySession }, error: retryError } = await supabase.auth.getSession();

                        if (retrySession) {
                            console.log("Retry check: Session found!");
                            await checkAdminRole(retrySession.user.id);
                        } else {
                            console.error("Retry check: Still no session. OAuth flow likely failed.", retryError);
                            setAuthError("Authentication failed. Please try logging in again.");
                            setIsLoading(false);
                        }
                    }, 1500);

                } catch (err) {
                    console.error("Error handling OAuth code:", err);
                    setAuthError("An unexpected error occurred during login.");
                    setIsLoading(false);
                }
            };

            if (event === 'INITIAL_SESSION') {
                if (session) {
                    await checkAdminRole(session.user.id);
                } else {
                    if (window.location.search.includes('code=')) {
                        console.log("INITIAL_SESSION null, but found OAuth code. Force checking...");
                        await handleOAuthCode();
                        return;
                    }
                    console.log("No session found. Redirecting...");
                    navigate('/admin/login');
                }
            }
            else if (event === 'SIGNED_IN') {
                if (session) await checkAdminRole(session.user.id);
            }
            else if (event === 'SIGNED_OUT') {
                if (window.location.search.includes('code=')) {
                    console.log("SIGNED_OUT detected, but OAuth code present. Force checking...");
                    await handleOAuthCode();
                    return;
                }
                setAuthorized(false);
                setIsLoading(false);
                navigate('/admin/login');
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [navigate]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <p>Verifying Credentials...</p>
                {/* Visual feedback that we see the code */}
                {window.location.search.includes('code=') && <p className="text-sm text-gray-400">Processing Google Login...</p>}
            </div>
        );
    }

    if (authError) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-8">
                <div className="bg-red-900/50 border border-red-500 p-6 rounded-lg max-w-2xl text-center">
                    <h2 className="text-2xl font-bold mb-4 text-red-400">Login Failed</h2>
                    <p className="text-lg mb-4">{authError}</p>
                    <button
                        onClick={() => { supabase.auth.signOut(); navigate('/admin/login'); }}
                        className="bg-white text-red-900 font-bold px-6 py-2 rounded hover:bg-gray-200 transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!authorized) return null;

    return (
        <div className="flex h-screen bg-gray-900 text-white">
            <aside className="w-64 bg-gray-800 p-4 flex flex-col">
                <h2 className="text-xl font-bold mb-8 text-blue-400">Admin Dashboard</h2>
                <nav className="flex-1">
                    <ul className="space-y-2">
                        <li><Link to="/admin/dashboard" className="block py-2 px-4 rounded hover:bg-gray-700 transition">Overview</Link></li>
                        <li><Link to="/admin/users" className="block py-2 px-4 rounded hover:bg-gray-700 transition">User Management</Link></li>
                        <li><Link to="/admin/requests" className="block py-2 px-4 rounded hover:bg-gray-700 transition">Requests</Link></li>
                    </ul>
                </nav>
                <button onClick={() => supabase.auth.signOut()} className="text-left text-red-400 mt-auto p-2">Logout</button>
            </aside>
            <main className="flex-1 p-8 overflow-y-auto bg-gray-900">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;