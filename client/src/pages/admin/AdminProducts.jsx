import { useState, useEffect } from 'react';
import { getProducts } from '../api/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getProducts().then(data => setProducts(data.products));
    }, []);

    const updateStock = async (id, newStock) => {
        try {
            await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('z-era-token')}`
                },
                body: JSON.stringify({ stock: newStock })
            });
            setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
            toast.success('Stock updated!');
        } catch (err) {
            toast.error('Failed to update stock');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Inventory Control</h1>
                <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-medium">
                    <FiPlus /> New Product
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm font-medium">
                        <tr>
                            <th className="px-6 py-4">Product</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Stock</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map(product => (
                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img src={JSON.parse(product.images)[0]} className="w-10 h-10 rounded-lg object-cover" />
                                        <div className="font-medium text-gray-800">{product.name}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">₹{product.price}</td>
                                <td className="px-6 py-4">
                                    <input
                                        type="number"
                                        className={`w-20 px-2 py-1 border rounded-lg text-sm font-semibold ${product.stock === 0 ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-200'
                                            }`}
                                        defaultValue={product.stock}
                                        onBlur={(e) => updateStock(product.id, parseInt(e.target.value))}
                                    />
                                </td>
                                <td className="px-6 py-4 flex gap-3 text-gray-400">
                                    <button className="hover:text-purple-600"><FiEdit2 /></button>
                                    <button className="hover:text-red-500"><FiTrash2 /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProducts;
