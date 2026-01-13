import { useState, useEffect } from "react";
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    AreaChart, 
    Area,
    BarChart,
    Bar
} from "recharts";
import { Calendar, Zap, Thermometer, Droplets, Wind, Activity, Download } from "lucide-react";
import { motion } from "framer-motion";
import { fetchWithAuth } from "../utils/api";
import type { SensorData } from "../types";



const ranges = [
  { label: "24 Hours", value: "24h" },
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
];

interface AnalyticsData {
    time: string;
    temperature: number;
    humidity: number;
    power: number;
    gas: number;
    voltage: number;
}

export const Analytics = () => {
    const [selectedRange, setSelectedRange] = useState("24h");
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [viewMode, setViewMode] = useState<'range' | 'date'>('range');

    const [data, setData] = useState<AnalyticsData[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        avgTemp: "0",
        avgHumidity: "0",
        avgPower: "0",
        avgGas: "0",
        tempTrend: "+0%",
        humidityTrend: "+0%",
        powerTrend: "+0%",
        gasTrend: "+0%"
    });

    const calculateStartTime = () => {
        const now = new Date();
        if (viewMode === 'date') {
            const date = new Date(selectedDate);
            return date.getTime();
        } else {
            switch (selectedRange) {
                case "24h": return now.getTime() - 24 * 60 * 60 * 1000;
                case "7d": return now.getTime() - 7 * 24 * 60 * 60 * 1000;
                case "30d": return now.getTime() - 30 * 24 * 60 * 60 * 1000;
                default: return now.getTime() - 24 * 60 * 60 * 1000;
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const startTime = calculateStartTime();
                // Use the full URL https://ruki-api.duckdns.org/mqtt/sensor-data/:date
                const url = `api/mqtt/sensor-data/${startTime}`;
                const response = await fetchWithAuth(url);
                if (!response.ok) throw new Error('Failed to fetch data');
                
                const rawData: SensorData[] = await response.json();
                console.log("Raw Analytics Data:", rawData);
                
                const formattedData: AnalyticsData[] = rawData.map((item) => {
                    const timestamp = item.createdAt || Date.now();
                    const date = new Date(timestamp);
                    const timeFormat = (viewMode === 'range' && selectedRange === '24h') 
                        ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

                    return {
                        time: timeFormat,
                        temperature: Number(item.tempeture) || Number(item.temperature) || 0,
                        humidity: Number(item.humidity) || 0,
                        power: Number(item.acs_power) || 0,
                        gas: Number(item.mq_value) || 0,
                        voltage: Number(item.zmpt_value) || 0,
                    };
                });

                setData(formattedData);

                if (formattedData.length > 0) {
                    const avgT = formattedData.reduce((acc, curr) => acc + curr.temperature, 0) / formattedData.length;
                    const avgH = formattedData.reduce((acc, curr) => acc + curr.humidity, 0) / formattedData.length;
                    const avgP = formattedData.reduce((acc, curr) => acc + curr.power, 0) / formattedData.length;
                    const avgG = formattedData.reduce((acc, curr) => acc + curr.gas, 0) / formattedData.length;

                    setStats({
                        avgTemp: avgT.toFixed(1),
                        avgHumidity: avgH.toFixed(0),
                        avgPower: avgP.toFixed(0),
                        avgGas: avgG.toFixed(0),
                        tempTrend: "+0%",
                        humidityTrend: "+0%",
                        powerTrend: "+0%",
                        gasTrend: "+0%"
                    });
                } else {
                     setStats({
                        avgTemp: "0",
                        avgHumidity: "0",
                        avgPower: "0",
                        avgGas: "0",
                        tempTrend: "0%",
                        humidityTrend: "0%",
                        powerTrend: "0%",
                        gasTrend: "0%"
                    });
                }
            } catch (error) {
                console.error("Error fetching analytics data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedDate, selectedRange, viewMode]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.value) {
            setSelectedDate(e.target.value);
            setViewMode('date');
            setSelectedRange(''); // Clear range selection visually
        }
    };

    const handleRangeChange = (rangeValue: string) => {
        setSelectedRange(rangeValue);
        setViewMode('range');
        // We keep selectedDate as is, or maybe reset it to today? preserving it is fine.
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Analytics</h1>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
                        {ranges.map((range) => (
                            <button
                                key={range.value}
                                onClick={() => handleRangeChange(range.value)}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                                    selectedRange === range.value && viewMode === 'range'
                                        ? "bg-blue-600 text-white shadow-md" 
                                        : "text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                 <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <>
                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard 
                            title="Avg Temperature" 
                            value={`${stats.avgTemp}°C`}
                            trend={stats.tempTrend}
                            trendUp={true}
                            icon={Thermometer}
                            color="text-orange-600 bg-orange-50"
                        />
                        <StatCard 
                            title="Avg Humidity" 
                            value={`${stats.avgHumidity}%`}
                            trend={stats.humidityTrend}
                            trendUp={false}
                            icon={Droplets}
                            color="text-blue-600 bg-blue-50"
                        />
                        <StatCard 
                            title="Avg Power" 
                            value={`${stats.avgPower}W`}
                            trend={stats.powerTrend}
                            trendUp={true}
                            icon={Zap}
                            color="text-yellow-600 bg-yellow-50"
                        />
                        <StatCard 
                            title="Avg Gas Level" 
                            value={`${stats.avgGas} ppm`}
                            trend={stats.gasTrend}
                            trendUp={false}
                            icon={Wind}
                            color="text-green-600 bg-green-50"
                        />
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        
                        {/* Temperature & Humidity Chart */}
                        <ChartCard title="Climate Trends">
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                                                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area type="monotone" dataKey="temperature" stackId="1" stroke="#f97316" fill="url(#colorTemp)" strokeWidth={2} name="Temp (°C)" />
                                        <Area type="monotone" dataKey="humidity" stackId="2" stroke="#3b82f6" fill="url(#colorHum)" strokeWidth={2} name="Humidity (%)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </ChartCard>

                        {/* Power Consumption Chart */}
                        <ChartCard title="Power Consumption (Watts)">
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.2}/>
                                                <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area type="monotone" dataKey="power" stroke="#fbbf24" fill="url(#colorPower)" strokeWidth={2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </ChartCard>

                        {/* Voltage Stability Chart */}
                        <ChartCard title="Voltage Stability (V)">
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                        <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Line type="stepAfter" dataKey="voltage" stroke="#ef4444" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </ChartCard>

                        {/* Gas / Air Quality Chart */}
                        <ChartCard title="Air Quality Index (ppm)">
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="gas" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </ChartCard>

                    </div>
                </>
            )}
        </div>
    );
};

// --- Components ---

const StatCard = ({ title, value, trend, trendUp, icon: Icon, color }: any) => (
    <motion.div 
        whileHover={{ y: -5 }}
        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
    >
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${color}`}>
                <Icon size={22} />
            </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
            <span className={`text-sm font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
                {trend}
            </span>
            <span className="text-sm text-gray-400">vs last period</span>
        </div>
    </motion.div>
);

const ChartCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900">{title}</h3>
            <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 transition-colors">
                <Activity size={18} />
            </button>
        </div>
        {children}
    </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-4 border border-gray-100 shadow-xl rounded-xl">
                <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-gray-500">{entry.name || entry.dataKey}:</span>
                        <span className="font-medium text-gray-900">
                             {Number(entry.value).toFixed(1)}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};
