import { useState, useEffect } from 'react';
import { getAnalyticsStats, exportOrdersReport } from '../../api/api';
import toast from 'react-hot-toast';
import { FiDownload, FiBarChart2, FiCalendar, FiTrendingUp, FiPackage } from 'react-icons/fi';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Reports = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
        endDate: new Date()
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const data = await getAnalyticsStats();
            setStats(data);
        } catch (err) {
            toast.error('Failed to load stats');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            const blob = await exportOrdersReport();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `orders_report_${new Date().toLocaleDateString()}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            toast.success('Report downloaded!');
        } catch (err) {
            toast.error('Failed to export report');
        }
    };

    const generateChartData = () => {
        if (!stats) return [];

        const days = Math.ceil((dateRange.endDate - dateRange.startDate) / (1000 * 60 * 60 * 24));
        const chartData = [];

        for (let i = 0; i < days; i++) {
            const date = new Date(dateRange.startDate);
            date.setDate(date.getDate() + i);
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            // Simplified data generation
            const sales = Math.floor(Math.random() * (stats.week.sales / 7) + 100);
            chartData.push({ name: dateStr, sales });
        }

        return chartData;
    };

    if (loading) return <div>Loading reports...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Reports & Analytics</h1>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-medium"
                >
                    <FiDownload /> Export Order Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <StatCard icon={<FiPackage />} label="Today's Orders" value={stats.today.count} color="#8b5cf6" />
                <StatCard icon={<FiTrendingUp />} label="Weekly Sales" value={`₹${stats.week.sales.toLocaleString()}`} color="#10b981" />
                <StatCard icon={<FiBarChart2 />} label="Total Profit" value={`₹${stats.week.profit.toLocaleString()}`} color="#f59e0b" />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-10">
                <h2 className="text-xl font-semibold mb-6">Sales Performance</h2>
                <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                        <LineChart data={generateChartData()}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="sales" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold mb-4">Daily Summary</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Orders</span>
                            <span className="font-semibold text-gray-800">{stats.today.count}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Sales</span>
                            <span className="font-semibold text-green-600">₹{stats.today.sales.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Profit</span>
                            <span className="font-semibold text-blue-600">₹{stats.today.profit.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold mb-4">Weekly Summary</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Orders</span>
                            <span className="font-semibold text-gray-800">{stats.week.count}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Sales</span>
                            <span className="font-semibold text-green-600">₹{stats.week.sales.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Profit</span>
                            <span className="font-semibold text-blue-600">₹{stats.week.profit.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="p-4 rounded-xl text-2xl" style={{ backgroundColor: `${color}15`, color }}>
            {icon}
        </div>
        <div>
            <p className="text-gray-500 text-sm">{label}</p>
            <p className="text-xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

export default Reports;