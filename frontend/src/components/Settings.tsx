
import { useState, useEffect, type FormEvent } from "react";
import { Save, RefreshCw, RotateCcw, Eye, EyeOff, Server, Wifi, Thermometer, Activity, Wind, Sun, Zap } from "lucide-react";
import { fetchWithAuth } from "../utils/api";
import type { NodeConfig } from "../types";

export const Settings = () => {
    const [config, setConfig] = useState<NodeConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showWifiPassword, setShowWifiPassword] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            const response = await fetchWithAuth('/api/mqtt/status');
            if (!response.ok) throw new Error("Failed to fetch config");
            const data = await response.json();
            setConfig(data);
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: "Failed to load configuration" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        if (!config) return;
        
        setIsSaving(true);
        setMessage(null);

        try {
            const response = await fetchWithAuth('/api/mqtt/config', {
                method: 'POST',
                body: JSON.stringify({ config }),
            });

            if (!response.ok) throw new Error("Failed to update config");
            
            setMessage({ type: 'success', text: "Configuration updated successfully" });
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: "Failed to save configuration" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCommand = async (cmd: string) => {
        try {
            const response = await fetchWithAuth(`/api/mqtt/command/${cmd}`, {
                method: 'POST'
            });
            if (!response.ok) throw new Error(`Failed to send command: ${cmd}`);
            setMessage({ type: 'success', text: `Command '${cmd}' sent successfully` });
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: `Failed to send command` });
        }
    };

    const updateNestedConfig = (path: string[], value: any) => {
        if (!config) return;
        
        const newConfig = { ...config };
        let current: any = newConfig;
        
        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]];
        }
        
        const key = path[path.length - 1];
        // Handle number conversions
        if (typeof current[key] === 'number') {
            current[key] = Number(value);
        } else if (typeof current[key] === 'boolean') {
             current[key] = Boolean(value);
        } else {
            current[key] = value;
        }

        setConfig(newConfig);
    };

    if (isLoading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );
    
    if (!config) return (
        <div className="p-8 text-center bg-red-50 rounded-xl border border-red-100 text-red-600">
            Error loading settings. Please try refreshing the page.
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Settings</h1>
                    <p className="text-gray-500 mt-1">Manage connectivity, sensors, and device configuration</p>
                </div>
                <div className="flex gap-3">
                     <button
                        type="button"
                        onClick={() => handleCommand('restart')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-yellow-200 text-yellow-700 rounded-xl hover:bg-yellow-50 transition-colors shadow-sm font-medium text-sm"
                    >
                        <RefreshCw size={16} />
                        Restart
                    </button>
                    <button
                        type="button"
                        onClick={() => handleCommand('reset_config')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-red-200 text-red-700 rounded-xl hover:bg-red-50 transition-colors shadow-sm font-medium text-sm"
                    >
                        <RotateCcw size={16} />
                        Reset
                    </button>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 border ${
                    message.type === 'success' 
                        ? 'bg-green-50 text-green-700 border-green-100' 
                        : 'bg-red-50 text-red-700 border-red-100'
                }`}>
                    <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-8">
                
                {/* Device & System Config */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                                <Server size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900">Device Info</h2>
                        </div>
                        
                        <div className="space-y-5">
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Device Name</label>
                                <input
                                    type="text"
                                    value={config.nodeName || ''}
                                    onChange={(e) => updateNestedConfig(['nodeName'], e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                                    placeholder="e.g. Living Room Node"
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Sync Interval (ms)</label>
                                <input
                                    type="number"
                                    value={config.system.sync_interval}
                                    onChange={(e) => updateNestedConfig(['system', 'sync_interval'], e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
                                <Wifi size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900">Connectivity</h2>
                        </div>
                        
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">WiFi Password</label>
                                <div className="relative">
                                    <input
                                        type={showWifiPassword ? "text" : "password"}
                                        value={config.system.wifi_password || ''}
                                        onChange={(e) => updateNestedConfig(['system', 'wifi_password'], e.target.value)}
                                        className="w-full pl-4 pr-12 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowWifiPassword(!showWifiPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                                    >
                                        {showWifiPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">Enter new password to update WiFi credentials</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sensors Config */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 px-1">Sensors Configuration</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {/* DHT Sensor */}
                        <SensorCard 
                            title="DHT Sensor"
                            subtitle="Temperature & Humidity"
                            icon={Thermometer}
                            color="text-orange-600 bg-orange-50"
                            enabled={config.sensors.dht_sensor.enabled}
                            onToggle={(val) => updateNestedConfig(['sensors', 'dht_sensor', 'enabled'], val)}
                        >
                            <NumberInput label="Read Interval (ms)" value={config.sensors.dht_sensor.read_interval} onChange={(v) => updateNestedConfig(['sensors', 'dht_sensor', 'read_interval'], v)} />
                            <NumberInput label="High Temp (°C)" value={config.sensors.dht_sensor.high_temp_value} onChange={(v) => updateNestedConfig(['sensors', 'dht_sensor', 'high_temp_value'], v)} />
                            <NumberInput label="Low Temp (°C)" value={config.sensors.dht_sensor.low_temp_value} onChange={(v) => updateNestedConfig(['sensors', 'dht_sensor', 'low_temp_value'], v)} />
                        </SensorCard>

                        {/* PIR Sensor */}
                        <SensorCard 
                            title="PIR Sensor"
                            subtitle="Motion Detection"
                            icon={Activity}
                            color="text-indigo-600 bg-indigo-50"
                            enabled={config.sensors.pir_sensor.enabled}
                            onToggle={(val) => updateNestedConfig(['sensors', 'pir_sensor', 'enabled'], val)}
                        >
                            <NumberInput label="Read Interval (ms)" value={config.sensors.pir_sensor.read_interval} onChange={(v) => updateNestedConfig(['sensors', 'pir_sensor', 'read_interval'], v)} />
                        </SensorCard>

                         {/* MQ Sensor */}
                         <SensorCard 
                            title="MQ Sensor"
                            subtitle="Gas & Smoke"
                            icon={Wind}
                            color="text-emerald-600 bg-emerald-50"
                            enabled={config.sensors.mq_sensor.enabled}
                            onToggle={(val) => updateNestedConfig(['sensors', 'mq_sensor', 'enabled'], val)}
                        >
                            <NumberInput label="Read Interval (ms)" value={config.sensors.mq_sensor.read_interval} onChange={(v) => updateNestedConfig(['sensors', 'mq_sensor', 'read_interval'], v)} />
                            <NumberInput label="Detection Threshold" value={config.sensors.mq_sensor.detection_value} onChange={(v) => updateNestedConfig(['sensors', 'mq_sensor', 'detection_value'], v)} />
                        </SensorCard>

                         {/* Light Sensor */}
                         <SensorCard 
                            title="Light Sensor"
                            subtitle="Ambient Light"
                            icon={Sun}
                            color="text-yellow-600 bg-yellow-50"
                            enabled={config.sensors.light_sensor.enabled}
                            onToggle={(val) => updateNestedConfig(['sensors', 'light_sensor', 'enabled'], val)}
                        >
                            <NumberInput label="Read Interval (ms)" value={config.sensors.light_sensor.read_interval} onChange={(v) => updateNestedConfig(['sensors', 'light_sensor', 'read_interval'], v)} />
                            <NumberInput label="Trigger Value" value={config.sensors.light_sensor.trigger_value} onChange={(v) => updateNestedConfig(['sensors', 'light_sensor', 'trigger_value'], v)} />
                        </SensorCard>

                        {/* ZMPT Sensor */}
                        <SensorCard 
                            title="ZMPT Sensor"
                            subtitle="Voltage Monitoring"
                            icon={Zap}
                            color="text-red-600 bg-red-50"
                            enabled={config.sensors.zmpt_sensor.enabled}
                            onToggle={(val) => updateNestedConfig(['sensors', 'zmpt_sensor', 'enabled'], val)}
                        >
                            <NumberInput label="Read Interval (ms)" value={config.sensors.zmpt_sensor.read_interval} onChange={(v) => updateNestedConfig(['sensors', 'zmpt_sensor', 'read_interval'], v)} />
                            <NumberInput label="High Voltage (V)" value={config.sensors.zmpt_sensor.high_value} onChange={(v) => updateNestedConfig(['sensors', 'zmpt_sensor', 'high_value'], v)} />
                            <NumberInput label="Low Voltage (V)" value={config.sensors.zmpt_sensor.low_value} onChange={(v) => updateNestedConfig(['sensors', 'zmpt_sensor', 'low_value'], v)} />
                        </SensorCard>
                    </div>
                </div>
            </form>
            
             <motion.div 
                className="fixed bottom-6 right-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all disabled:opacity-50 font-medium shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95"
                >
                    <Save size={20} />
                    {isSaving ? "Saving..." : "Save Changes"}
                </button>
            </motion.div>
        </div>
    );
};

import { motion } from "framer-motion";

interface SensorCardProps {
    title: string;
    subtitle: string;
    icon: any;
    color: string;
    enabled: boolean;
    onToggle: (val: boolean) => void;
    children: React.ReactNode;
}

const SensorCard = ({ title, subtitle, icon: Icon, color, enabled, onToggle, children }: SensorCardProps) => (
    <div className={`
        relative bg-white rounded-2xl p-6 shadow-sm border transition-all duration-200
        ${enabled ? 'border-gray-200' : 'border-gray-100 opacity-80'}
    `}>
        <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${color}`}>
                    <Icon size={20} />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">{title}</h3>
                    <p className="text-xs text-gray-500">{subtitle}</p>
                </div>
            </div>
             <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={enabled} onChange={(e) => onToggle(e.target.checked)} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
        </div>
        
        <div className={`space-y-4 transition-all duration-300 ${enabled ? 'opacity-100' : 'opacity-40 pointer-events-none filter grayscale'}`}>
             {children}
        </div>
    </div>
);

const NumberInput = ({ label, value, onChange }: { label: string, value: number | undefined, onChange: (val: string) => void }) => (
    <div className="group">
        <label className="block text-xs font-medium text-gray-500 mb-1.5 group-focus-within:text-blue-600 transition-colors">{label}</label>
        <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
        />
    </div>
);
