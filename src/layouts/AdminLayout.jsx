import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Sidebar from '../components/admin/Sidebar';
import Header from '../components/admin/Header';

const AdminLayout = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState(null);
    const [authorized, setAuthorized] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

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
                    throw new Error("Failed to verify user privileges.");
                };

                if (!userProfile || userProfile.role !== 'admin') {
                    throw new Error("Access Denied: You do not have admin privileges.");
                }

                setAuthorized(true);
            } catch (err) {
                console.error("Auth Error:", err);
                setAuthError(err.message);
                await supabase.auth.signOut();
            } finally {
                if (mounted) setIsLoading(false);
            }
        };

        const initAuth = async () => {
            // Check current session
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                await checkAdminRole(session.user.id);
            } else {
                // No session, check for OAuth code flow or hash params
                if (window.location.hash.includes('access_token') || window.location.search.includes('code')) {
                    // Let Supabase handle the redirect logic internally, but set a timeout just in case it hangs
                    // We don't verify role here, we wait for the subsequent "SIGNED_IN" event or page reload
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
                    // Only re-verify if we aren't already authorized to avoid loops
                    if (!authorized) {
                        setIsLoading(true);
                        await checkAdminRole(session.user.id);
                    }
                } else if (event === 'SIGNED_OUT') {
                    setAuthorized(false);
                    if (location.pathname.startsWith('/admin') && location.pathname !== '/admin/login') {
                        navigate('/admin/login', { replace: true });
                    }
                }
            });

            return () => subscription.unsubscribe();
        };

        initAuth();

        // Safety Timeout: If still loading after 15 seconds, force fail
        const timer = setTimeout(() => {
            if (mounted && isLoading) {
                console.warn("Auth timeout reached.");
                setAuthError("Authentication took too long. Please try again.");
                setIsLoading(false);
            }
        }, 15000);

        return () => {
            mounted = false;
            clearTimeout(timer);
        };
    }, [navigate, location.pathname]);

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
                    <h2 className="text-2xl font-bold mb-4 text-red-500">Access Denied</h2>
                    <p className="text-slate-300 mb-6">{authError}</p>
                    <button
                        onClick={() => {
                            setAuthError(null);
                            setIsLoading(true);
                            navigate('/admin/login', { replace: true });
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-lg transition-all"
                    >
                        Return to Login
                    </button>
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