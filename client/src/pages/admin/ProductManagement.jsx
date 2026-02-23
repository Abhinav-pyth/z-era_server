import { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../api/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit, FiTrash2, FiSave, FiPackage, FiTrendingUp } from 'react-icons/fi';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category_id: '',
        images: '',
        stock: '',
        sizes: '',
        is_featured: false,
        is_new: false,
        tier: 'basic',
        original_price: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data.products);
        } catch (err) {
            toast.error('Failed to fetch products');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, formData);
                toast.success('Product updated successfully');
            } else {
                await createProduct(formData);
                toast.success('Product created successfully');
            }
            setShowForm(false);
            setEditingProduct(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                category_id: '',
                images: '',
                stock: '',
                sizes: '',
                is_featured: false,
                is_new: false,
                tier: 'basic',
                original_price: ''
            });
            fetchProducts();
        } catch (err) {
            toast.error('Failed to save product');
        }
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(productId);
                toast.success('Product deleted successfully');
                fetchProducts();
            } catch (err) {
                toast.error('Failed to delete product');
            }
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            category_id: product.category_id,
            images: JSON.stringify(product.images),
            stock: product.stock,
            sizes: JSON.stringify(product.sizes),
            is_featured: product.is_featured,
            is_new: product.is_new,
            tier: product.tier,
            original_price: product.original_price
        });
        setShowForm(true);
    };

    const categories = [
        { id: 1, name: 'Electronics' },
        { id: 2, name: 'Clothing' },
        { id: 3, name: 'Accessories' }
    ];

    const tiers = ['basic', 'premium', 'luxury'];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Product Management</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-medium"
                >
                    <FiPlus /> New Product
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">
                        {editingProduct ? 'Edit Product' : 'Create New Product'}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <select
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Price
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Stock
                                </label>
                                <input
                                    type="number"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Original Price (for discount)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.original_price}
                                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tier
                                </label>
                                <select
                                    value={formData.tier}
                                    onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    {tiers.map(tier => (
                                        <option key={tier} value={tier}>
                                            {tier.charAt(0).toUpperCase() + tier.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                rows={3}
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Images (comma-separated URLs)
                            </label>
                            <input
                                type="text"
                                value={formData.images}
                                onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sizes (comma-separated numbers, e.g., 7,8,9,10)
                            </label>
                            <input
                                type="text"
                                value={formData.sizes}
                                onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div className="flex items-center gap-4 mt-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.is_featured}
                                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">Featured</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.is_new}
                                    onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
                                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">New Arrival</span>
                            </label>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                type="submit"
                                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-medium"
                            >
                                {editingProduct ? 'Update' : 'Create'} Product
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingProduct(null);
                                    setFormData({
                                        name: '',
                                        description: '',
                                        price: '',
                                        category_id: '',
                                        images: '',
                                        stock: '',
                                        sizes: '',
                                        is_featured: false,
                                        is_new: false,
                                        tier: 'basic',
                                        original_price: ''
                                    });
                                }}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm font-medium">
                        <tr>
                            <th className="px-6 py-4">Product</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Stock</th>
                            <th className="px-6 py-4">Category</th>
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
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-600">₹{product.price}</span>
                                        {product.original_price && (
                                            <span className="text-sm text-red-600 line-through">
                                                ₹{product.original_price}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <input
                                        type="number"
                                        value={product.stock}
                                        onChange={(e) => {
                                            const newStock = parseInt(e.target.value);
                                            updateProduct(product.id, { ...product, stock: newStock });
                                            setProducts(prev => prev.map(p => p.id === product.id ? { ...p, stock: newStock } : p));
                                        }}
                                        className={`w-20 px-2 py-1 border rounded-lg text-sm font-semibold ${product.stock === 0 ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-200'}`}
                                    />
                                </td>
                                <td className="px-6 py-4">{product.category?.name || 'N/A'}</td>
                                <td className="px-6 py-4 flex gap-3 text-gray-400">
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="hover:text-purple-600"
                                    >
                                        <FiEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="hover:text-red-500"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductManagement;