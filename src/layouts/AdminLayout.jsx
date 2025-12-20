import React, { useEffect, useState, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Sidebar from '../components/admin/Sidebar';
import Header from '../components/admin/Header';

const AdminLayout = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState(null);
    const [authorized, setAuthorized] = useState(false);
    const authorizedRef = useRef(false); // Ref to track authorized state in closures
    const navigate = useNavigate();
    const location = useLocation();

    // Keep ref in sync with state
    useEffect(() => {
        authorizedRef.current = authorized;
    }, [authorized]);

    useEffect(() => {
        let mounted = true;

        const checkAdminRole = async (userId) => {
            try {
                const { data: userProfile, error } = await supabase
                    .from('users')
                    .select('role')
                    .eq('id', userId)
                    .single();

                if (!mounted) return;

                if (error) {
                    console.error("Profile check error:", error);
                    // Do NOT sign out for generic errors (network, etc.)
                    // Just throw to show the error message
                    throw new Error("Failed to verify privileges. Please check your connection.");
                };

                if (!userProfile || userProfile.role !== 'admin') {
                    // Explicitly deny entry for non-admins
                    throw new Error("Access Denied: You do not have admin privileges.");
                }

                setAuthorized(true);
                setAuthError(null);
            } catch (err) {
                console.error("Auth Error:", err);
                setAuthError(err.message);

                // Only sign out if it's explicitly an unauthorized role issue
                if (err.message.includes("Access Denied")) {
                    await supabase.auth.signOut();
                }
            } finally {
                if (mounted) setIsLoading(false);
            }
        };

        const initAuth = async () => {
            // Check current session
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                // Check Ref to avoid unnecessary re-verification due to stale closures
                if (!authorizedRef.current) {
                    await checkAdminRole(session.user.id);
                } else {
                    setIsLoading(false);
                }
            } else {
                // No session, check for OAuth code flow or hash params
                if (window.location.hash.includes('access_token') || window.location.search.includes('code')) {
                    // Let Supabase handle the redirect logic internally
                } else {
                    if (mounted) {
                        setIsLoading(false);
                        navigate('/admin/login', { replace: true });
                    }
                }
            }

            // Listen for auth changes
            const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
                if (!mounted) return;

                if (event === 'SIGNED_IN' && session) {
                    // Check REF, not state, to avoid stale closure issues
                    if (!authorizedRef.current) {
                        setIsLoading(true);
                        await checkAdminRole(session.user.id);
                    }
                } else if (event === 'SIGNED_OUT') {
                    setAuthorized(false);
                    // Use window.location to strictly check current path without React Router dependency issues
                    if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
                        navigate('/admin/login', { replace: true });
                    }
                }
            });

            return () => subscription.unsubscribe();
        };

        const cleanupPromise = initAuth();

        return () => {
            mounted = false;
            cleanupPromise.then(unsub => unsub && unsub());
        };
    }, [navigate]); // Removed location.pathname to prevent re-runs on navigation

    // Safety Timeout Effect
    useEffect(() => {
        let timer;
        if (isLoading) {
            timer = setTimeout(() => {
                console.warn("Auth timeout reached.");
                setAuthError("Authentication took too long. Please try again.");
                setIsLoading(false);
            }, 15000);
        }
        return () => clearTimeout(timer);
    }, [isLoading]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-950 text-white gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <p className="text-slate-400 animate-pulse">Verifying Admin Privileges...</p>
            </div>
        );
    }

    if (authError) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-950 text-white p-8">
                <div className="bg-red-500/10 border border-red-500/50 p-8 rounded-xl max-w-lg text-center backdrop-blur-sm shadow-2xl">
                    <h2 className="text-2xl font-bold mb-4 text-red-500">Access Restricted</h2>
                    <p className="text-slate-300 mb-6">{authError}</p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-all"
                        >
                            Retry
                        </button>
                        <button
                            onClick={() => {
                                setAuthError(null);
                                setIsLoading(true);
                                navigate('/admin/login', { replace: true });
                            }}
                            className="bg-slate-700 hover:bg-slate-600 text-white font-medium px-6 py-2 rounded-lg transition-all"
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!authorized) return null; // Should have redirected

    return (
        <div className="flex bg-slate-950 min-h-screen text-slate-100 font-sans selection:bg-blue-500/30">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col min-w-0">
                <Header />
                <main className="flex-1 mt-16 p-8 overflow-y-auto w-full">
                    <div className="max-w-7xl mx-auto w-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;