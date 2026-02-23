import { getAnalyticsStats, exportOrdersReport } from '../../api/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getAnalyticsStats();
                // Add default chart data if missing from backend for now
                setStats({
                    ...data,
                    chartData: [
                        { name: 'Mon', sales: data.today.sales / 2 },
                        { name: 'Tue', sales: data.today.sales / 3 },
                        { name: 'Wed', sales: data.today.sales / 4 },
                        { name: 'Today', sales: data.today.sales },
                    ]
                });
            } catch (err) {
                toast.error('Failed to load stats');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

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

    if (loading) return <div>Loading reports...</div>;

    return (
        <div className="admin-dashboard p-6" style={{ background: '#f8fafc', minHeight: '100vh' }}>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Mission Control</h1>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all font-medium"
                >
                    <FiDownload /> Export Order Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <StatCard icon={<FiShoppingBag />} label="Today's Orders" value={stats.today.count} color="#8b5cf6" />
                <StatCard icon={<FiTrendingUp />} label="Weekly Sales" value={`₹${stats.week.sales.toLocaleString()}`} color="#10b981" />
                <StatCard icon={<FiPackage />} label="Total Profit" value={`₹${stats.week.profit.toLocaleString()}`} color="#f59e0b" />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10">
                <h2 className="text-xl font-semibold mb-6">Weekly Performance</h2>
                <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                        <LineChart data={stats.chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="sales" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
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

export default Dashboard;
