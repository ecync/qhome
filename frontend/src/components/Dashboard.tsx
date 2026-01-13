import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Thermometer, 
    Droplets, 
    Zap, 
    Wind, 
    Activity, 
    Wifi, 
    WifiOff, 
    AlertTriangle, 
    X, 
    Lightbulb, 
    Power 
} from "lucide-react";
import { fetchWithAuth } from "../utils/api";
import type { SensorData } from "../types";

const API_BASE_URL = "https://ruki-api.duckdns.org";
const SOCKET_URL = "https://ruki-api.duckdns.org/mqtt";
const SOCKET_PATH = "/ws";

// --- Types ---
interface Notification {
    id: string;
    type: 'alert' | 'error' | 'info';
    message: string;
    timestamp: number;
}

interface AlertPayload {
    data: {
        alert_type: string;
        message: string;
    }
}

interface ErrorPayload {
    data: {
        error_type: string;
        message: string;
    }
}

interface SensorPayload {
    data: SensorData;
}

export const Dashboard = () => {
    const [connected, setConnected] = useState(false);
    const [sensorData, setSensorData] = useState<SensorData | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    // Light state (optimistic UI)
    const [lightStatus, setLightStatus] = useState(false); 
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // --- Socket Connection ---
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        socketRef.current = io(SOCKET_URL, {
            path: SOCKET_PATH,
            transports: ["polling", "websocket"],
            reconnectionAttempts: 5,
        });

        const socket = socketRef.current;

        socket.on("connect_error", (err) => {
            console.error("Connection Error:", err.message);
            addNotification("error", `Connection failed: ${err.message}`);
        });

        socket.on("connect", () => {
            console.log("Connected to WebSocket");
            setConnected(true);
        });

        // Debug: Log all incoming events
        socket.onAny((event, ...args) => {
            console.log("Incoming event:", event, args);
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from WebSocket");
            setConnected(false);
        });

        socket.on("sensor.data", (payload: any) => {
            console.log("Sensor Data Payload:", payload);
            
            // Robust parsing logic
            let raw = payload;
            if (payload && payload.data) {
                raw = payload.data;
                // Check if there is a double nesting (common in some API wrappers)
                if (raw.data) {
                    raw = raw.data;
                }
            }

            console.log("Parsed Raw Data:", raw);

            if (!raw) return;

            const parsedData: SensorData = {
                temperature: Number(raw.temperature ?? raw.tempeture ?? 0),
                humidity: Number(raw.humidity ?? 0),
                mq_value: Number(raw.mq_value ?? 0),
                light_value: Number(raw.light_value ?? 0),
                zmpt_value: Number(raw.zmpt_value ?? 0),
                acs_value: Number(raw.acs_value ?? 0),
                acs_power: Number(raw.acs_power ?? 0),
                acs_energy: Number(raw.acs_energy ?? 0),
                createdAt: raw.createdAt || Date.now()
            };

            console.log("Setting Sensor Data:", parsedData);
            setSensorData(parsedData);
        });

        socket.on("node.alert", (payload: AlertPayload) => {
            addNotification("alert", `${payload.data.alert_type}: ${payload.data.message}`);
        });

        socket.on("node.error", (payload: ErrorPayload) => {
            addNotification("error", `${payload.data.error_type}: ${payload.data.message}`);
        });

        socket.on("command.ack", (payload: any) => {
            console.log("Command Acknowledged:", payload);
            addNotification("info", `Command '${payload.command}' sent successfully.`);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    // --- Helpers ---
    const addNotification = (type: Notification['type'], message: string) => {
        const id = Date.now().toString() + Math.random().toString();
        setNotifications(prev => [...prev, { id, type, message, timestamp: Date.now() }]);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            removeNotification(id);
        }, 5000);
    };

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const sendCommand = async (cmd: string) => {
        try {
            // Using API Endpoint as requested
            const url = `api/mqtt/command/${cmd}`;
            const response = await fetchWithAuth(url, {
                method: 'POST'
            });

            if (response.ok) {
                // Optimistic update
                if (cmd === 'light_on') setLightStatus(true);
                if (cmd === 'light_off') setLightStatus(false);
                addNotification("info", `Command sent: ${cmd}`);
            } else {
                throw new Error("Failed to send command via API");
            }
        } catch (err) {
            console.error(err);
            addNotification("error", "Failed to send command");
        }
    };

    // --- Render ---
    return (
        <div className="min-h-screen bg-gray-50 p-6 space-y-8">
            {/* Notifications Container */}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-96 pointer-events-none">
                <AnimatePresence>
                    {notifications.map(notification => (
                        <NotificationToast 
                            key={notification.id} 
                            notification={notification} 
                            onClose={() => removeNotification(notification.id)} 
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
                    <p className="text-gray-500 font-medium">Overview & Controls</p>
                </div>
                
                <div className="flex items-center gap-6">
                    <div className="text-right hidden md:block">
                        <p className="text-2xl font-bold text-gray-900 leading-none">
                            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-sm text-gray-400 font-medium">
                            {currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
                        </p>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-sm ${
                        connected 
                        ? "bg-green-100 text-green-700 border border-green-200" 
                        : "bg-red-100 text-red-700 border border-red-200"
                    }`}>
                        <div className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                        {connected ? "System Online" : "Disconnected"}
                    </div>
                </div>
            </header>

            {/* Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                
                {/* Left Column: Metrics */}
                <div className="xl:col-span-3 space-y-8">
                    
                    {/* Environment Section */}
                    <section>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Wind size={20} className="text-blue-500" />
                            Environment
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <SensorCard 
                                title="Temperature" 
                                value={sensorData?.temperature ?? (sensorData?.tempeture ?? 0)} 
                                unit="°C" 
                                icon={Thermometer} 
                                color="bg-orange-500"
                                trend="stable"
                            />
                            <SensorCard 
                                title="Humidity" 
                                value={sensorData?.humidity ?? 0} 
                                unit="%" 
                                icon={Droplets} 
                                color="bg-blue-500"
                                trend="stable"
                            />
                            <SensorCard 
                                title="Air Quality" 
                                value={sensorData?.mq_value ?? 0} 
                                unit="ppm" 
                                icon={Wind} 
                                color="bg-green-500"
                                subtext={sensorData?.mq_value && sensorData.mq_value > 200 ? "Poor Quality" : "Good"}
                                trend={sensorData?.mq_value && sensorData.mq_value > 200 ? "warning" : "stable"}
                            />
                        </div>
                    </section>

                    {/* Power Section */}
                    <section>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Zap size={20} className="text-yellow-500" />
                            Power & System
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <SensorCard 
                                title="Real-time Power" 
                                value={sensorData?.acs_power ?? 0} 
                                unit="W" 
                                icon={Zap} 
                                color="bg-yellow-500"
                            />
                             <SensorCard 
                                title="Energy Consumed" 
                                value={sensorData?.acs_energy?.toFixed(2) ?? 0} 
                                unit="kWh" 
                                icon={Activity} 
                                color="bg-indigo-500"
                            />
                             <SensorCard 
                                title="Voltage" 
                                value={sensorData?.zmpt_value ?? 0} 
                                unit="V" 
                                icon={Activity} 
                                color="bg-purple-500"
                            />
                        </div>
                    </section>
                </div>

                {/* Right Column: Controls & Quick Actions */}
                <div className="xl:col-span-1 space-y-8">
                    <section>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Lightbulb size={20} className="text-amber-500" />
                            Smart Controls
                        </h2>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-500">Living Room Light</span>
                                <span className={`text-xs font-bold px-2 py-1 rounded-md ${lightStatus ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {lightStatus ? 'ON' : 'OFF'}
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => sendCommand('light_on')}
                                    className={`relative overflow-hidden group p-4 rounded-xl border-2 transition-all duration-200 ${
                                        lightStatus 
                                        ? 'border-amber-500 bg-amber-50' 
                                        : 'border-transparent bg-gray-50 hover:bg-gray-100'
                                    }`}
                                >
                                    <div className="relative z-10 flex flex-col items-center gap-2">
                                        <div className={`p-2 rounded-full ${lightStatus ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                            <Power size={20} />
                                        </div>
                                        <span className="font-semibold text-sm text-gray-700">Turn On</span>
                                    </div>
                                </button>

                                <button
                                    onClick={() => sendCommand('light_off')}
                                    className={`relative overflow-hidden group p-4 rounded-xl border-2 border-transparent bg-gray-50 hover:bg-red-50 hover:text-red-600 transition-all duration-200`}
                                >
                                    <div className="relative z-10 flex flex-col items-center gap-2">
                                        <div className="p-2 rounded-full bg-gray-200 text-gray-500 group-hover:bg-red-200 group-hover:text-red-600 transition-colors">
                                            <Power size={20} />
                                        </div>
                                        <span className="font-semibold text-sm text-gray-700 group-hover:text-red-700">Turn Off</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </section>
                </div>

            </div>
        </div>
    );
};

// --- Sub Components ---

const SensorCard = ({ title, value, unit, icon: Icon, color, subtext, trend }: any) => (
    <motion.div 
        whileHover={{ y: -2 }}
        className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group"
    >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Icon size={64} className={color.replace('bg-', 'text-')} />
        </div>

        <div className="flex items-center gap-3 mb-4">
            <div className={`p-2.5 rounded-xl ${color} text-white shadow-md`}>
                <Icon size={20} />
            </div>
            <h3 className="font-semibold text-gray-600 text-sm whitespace-nowrap">{title}</h3>
        </div>

        <div className="space-y-1 relative z-10">
            <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900 tracking-tight">
                    {typeof value === 'number' ? value.toFixed(1) : value}
                </span>
                <span className="text-gray-400 font-medium text-sm">{unit}</span>
            </div>
            
            {subtext && (
                <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold ${
                    trend === 'warning' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'
                }`}>
                    {subtext}
                </div>
            )}
        </div>
    </motion.div>
);

const NotificationToast = ({ notification, onClose }: { notification: Notification, onClose: () => void }) => {
    const bgColors = {
        alert: "bg-red-50 border-red-200",
        error: "bg-orange-50 border-orange-200",
        info: "bg-blue-50 border-blue-200"
    };
    
    const textColors = {
        alert: "text-red-800",
        error: "text-orange-800",
        info: "text-blue-800"
    };

    const icons = {
        alert: <AlertTriangle size={18} className="text-red-500" />,
        error: <AlertTriangle size={18} className="text-orange-500" />,
        info: <Activity size={18} className="text-blue-500" />
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm ${bgColors[notification.type]}`}
        >
            <div className="mt-0.5">{icons[notification.type]}</div>
            <div className="flex-1">
                <p className={`text-sm font-medium ${textColors[notification.type]}`}>
                    {notification.message}
                </p>
                <p className="text-xs opacity-60 mt-0.5">
                    {new Date(notification.timestamp).toLocaleTimeString()}
                </p>
            </div>
            <button onClick={onClose} className="opacity-50 hover:opacity-100 transition-opacity">
                <X size={16} />
            </button>
        </motion.div>
    );
};

