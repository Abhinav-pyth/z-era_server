import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiTruck, FiSearch } from 'react-icons/fi';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Fetch orders, should probably filter by 'confirmed' or 'pending'
        fetch('/api/orders').then(r => r.json()).then(data => setOrders(data.orders));
    }, []);

    const handleShip = async (orderId) => {
        const tracking = prompt("Enter Tracking Number:");
        const courier = prompt("Enter Courier Name (e.g., Delhivery, FedEx):");

        if (!tracking || !courier) return;

        try {
            const res = await fetch(`/api/orders/${orderId}/ship`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('z-era-token')}`
                },
                body: JSON.stringify({ tracking_number: tracking, courier_name: courier })
            });
            if (!res.ok) throw new Error('Failed to ship');
            toast.success('Order marked as Shipped!');
            // Refresh list
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'shipped' } : o));
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Order Fulfillment</h1>
            <div className="mb-6 relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by order ID or phone..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm font-medium">
                        <tr>
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.filter(o => o.id.toString().includes(searchTerm)).map(order => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-800">#{order.id}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                            order.status === 'shipped' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {order.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4">₹{order.total}</td>
                                <td className="px-6 py-4">
                                    {order.status === 'confirmed' && (
                                        <button
                                            onClick={() => handleShip(order.id)}
                                            className="flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700"
                                        >
                                            <FiTruck /> Ship Now
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderManagement;
