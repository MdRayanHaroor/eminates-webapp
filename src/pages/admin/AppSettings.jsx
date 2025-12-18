import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const AppSettings = () => {
    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('app_settings')
                .select('*');

            if (error) throw error;
            setSettings(data);
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-white">System Configuration</h1>

            <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">App Settings</h2>
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    {loading ? <p className="text-white">Loading...</p> : (
                        <div className="space-y-4">
                            {settings.map(setting => (
                                <div key={setting.id || setting.key} className="flex flex-col">
                                    <label className="text-gray-400 text-sm mb-1 uppercase font-semibold">{setting.key}</label>
                                    <textarea
                                        readOnly
                                        value={JSON.stringify(setting.value, null, 2)}
                                        className="bg-gray-900 border border-gray-700 rounded p-3 text-green-400 font-mono text-sm h-24"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppSettings;
