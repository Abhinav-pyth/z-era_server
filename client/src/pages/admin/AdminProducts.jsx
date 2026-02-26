import { useState, useEffect } from 'react';
import { getProducts, createProduct } from '../../api/api';
import toast from 'react-hot-toast';

const defaultForm = {
    name: '', description: '', price: '', cost_price: '', original_price: '',
    category_id: '', sizes: '', colors: '', images: '', stock: '', tier: 'budget'
};

// Safe parser to avoid runtime crashes on bad data
const safeParseJSON = (val, fallback = []) => {
    if (Array.isArray(val)) return val;
    if (!val) return fallback;
    try { return JSON.parse(val); } catch { return fallback; }
};

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(defaultForm);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState('');

    const fetchProducts = async () => {
        setError(null);
        try {
            const data = await getProducts({ limit: 100 });
            setProducts(data.products || []);
        } catch (err) {
            setError(err.message || 'Failed to load products');
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const updateStock = async (id, newStock) => {
        if (isNaN(newStock) || newStock < 0) return;
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('z-era-token')}` },
                body: JSON.stringify({ stock: parseInt(newStock) })
            });
            if (!res.ok) throw new Error('Failed');
            setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: parseInt(newStock) } : p));
            toast.success('Stock updated!');
        } catch {
            toast.error('Failed to update stock');
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                ...form,
                price: parseFloat(form.price),
                cost_price: parseFloat(form.cost_price) || 0,
                original_price: form.original_price ? parseFloat(form.original_price) : null,
                sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean),
                colors: form.colors.split(',').map(s => s.trim()).filter(Boolean),
                images: form.images.split(',').map(s => s.trim()).filter(Boolean),
                stock: parseInt(form.stock) || 0,
                category_id: parseInt(form.category_id)
            };
            await createProduct(payload);
            toast.success('Product created!');
            setForm(defaultForm);
            setShowForm(false);
            fetchProducts();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSaving(false);
        }
    };

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><div className="spinner"></div></div>;
    if (error) return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h2 style={{ color: '#ef4444' }}>Failed to load products</h2>
            <p style={{ color: '#64748b', marginBottom: '1rem' }}>{error}</p>
            <button onClick={() => { setLoading(true); fetchProducts(); }}
                style={{ padding: '10px 20px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}>
                Retry
            </button>
        </div>
    );

    return (
        <div style={{ padding: '2rem', minHeight: '100vh', background: '#f8fafc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Inventory Control</h1>
                    <p style={{ color: '#64748b', margin: '4px 0 0' }}>Manage products & stock levels</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={{
                        padding: '10px 20px', background: '#7c3aed', color: 'white',
                        border: 'none', borderRadius: '12px', cursor: 'pointer',
                        fontWeight: 600, fontSize: '0.9rem'
                    }}
                >
                    {showForm ? '✕ Cancel' : '+ New Product'}
                </button>
            </div>

            {/* Search */}
            <input
                type="text"
                placeholder="🔍 Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                    width: '100%', padding: '12px 16px', borderRadius: '12px',
                    border: '1px solid #e2e8f0', fontSize: '0.95rem', marginBottom: '1.5rem',
                    boxSizing: 'border-box', background: 'white'
                }}
            />

            {/* New Product Form */}
            {showForm && (
                <form onSubmit={handleCreate} style={{
                    background: 'white', borderRadius: '16px', padding: '2rem',
                    border: '1px solid #e2e8f0', marginBottom: '2rem'
                }}>
                    <h2 style={{ margin: '0 0 1.5rem', fontWeight: 700, color: '#0f172a' }}>Add New Product</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                        {[
                            { key: 'name', label: 'Product Name *', placeholder: 'e.g. Aurora Slide Sandal' },
                            { key: 'price', label: 'Selling Price (₹) *', placeholder: '1299', type: 'number' },
                            { key: 'cost_price', label: 'Cost Price (₹)', placeholder: '650', type: 'number' },
                            { key: 'original_price', label: 'MRP (₹)', placeholder: '1799', type: 'number' },
                            { key: 'stock', label: 'Initial Stock *', placeholder: '50', type: 'number' },
                            { key: 'sizes', label: 'Sizes (comma-separated)', placeholder: '5,6,7,8,9' },
                            { key: 'colors', label: 'Colors (comma-separated)', placeholder: 'Black,White,Pink' },
                            { key: 'images', label: 'Image URLs (comma-separated)', placeholder: '/images/product.jpg' },
                        ].map(({ key, label, placeholder, type = 'text' }) => (
                            <div key={key}>
                                <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '6px', fontSize: '0.85rem' }}>{label}</label>
                                <input
                                    type={type}
                                    placeholder={placeholder}
                                    value={form[key]}
                                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.9rem', boxSizing: 'border-box' }}
                                />
                            </div>
                        ))}
                        <div>
                            <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '6px', fontSize: '0.85rem' }}>Category ID *</label>
                            <input
                                type="number"
                                placeholder="e.g. 1"
                                value={form.category_id}
                                onChange={e => setForm(p => ({ ...p, category_id: e.target.value }))}
                                style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.9rem', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '6px', fontSize: '0.85rem' }}>Tier</label>
                            <select
                                value={form.tier}
                                onChange={e => setForm(p => ({ ...p, tier: e.target.value }))}
                                style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.9rem', boxSizing: 'border-box', background: 'white' }}
                            >
                                <option value="budget">Budget</option>
                                <option value="premium">Premium</option>
                            </select>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '6px', fontSize: '0.85rem' }}>Description</label>
                            <textarea
                                placeholder="Product description..."
                                value={form.description}
                                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                                rows={3}
                                style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.9rem', boxSizing: 'border-box', resize: 'vertical' }}
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={saving}
                        style={{
                            marginTop: '1.5rem', padding: '12px 30px', background: '#7c3aed',
                            color: 'white', border: 'none', borderRadius: '12px',
                            cursor: 'pointer', fontWeight: 700, fontSize: '1rem'
                        }}
                    >
                        {saving ? 'Creating...' : '✓ Create Product'}
                    </button>
                </form>
            )}

            {/* Products Table */}
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            {['Product', 'Price', 'Cost', 'Tier', 'Stock', 'Status'].map(h => (
                                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(product => {
                            const imgs = safeParseJSON(product.images, []);
                            return (
                                <tr key={product.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '14px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{
                                                width: 44, height: 44, borderRadius: '10px',
                                                background: '#f1f5f9', overflow: 'hidden', flexShrink: 0
                                            }}>
                                                {imgs[0] && <img src={imgs[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>{product.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>#{product.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#0f172a' }}>₹{product.price}</td>
                                    <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '0.9rem' }}>₹{product.cost_price || 0}</td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <span style={{
                                            padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600,
                                            background: product.tier === 'premium' ? '#fef3c7' : '#f0fdf4',
                                            color: product.tier === 'premium' ? '#92400e' : '#065f46'
                                        }}>
                                            {product.tier}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <input
                                            type="number"
                                            defaultValue={product.stock}
                                            min={0}
                                            onBlur={e => {
                                                if (parseInt(e.target.value) !== product.stock) {
                                                    updateStock(product.id, e.target.value);
                                                }
                                            }}
                                            style={{
                                                width: '70px', padding: '6px 10px', borderRadius: '8px', textAlign: 'center',
                                                border: `2px solid ${product.stock === 0 ? '#fca5a5' : '#e2e8f0'}`,
                                                fontWeight: 700, color: product.stock === 0 ? '#ef4444' : '#0f172a',
                                                background: product.stock === 0 ? '#fef2f2' : 'white'
                                            }}
                                        />
                                    </td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <span style={{
                                            padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600,
                                            background: product.stock > 0 ? '#d1fae5' : '#fee2e2',
                                            color: product.stock > 0 ? '#065f46' : '#991b1b'
                                        }}>
                                            {product.stock > 0 ? '✓ In Stock' : '✗ Out of Stock'}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProducts;
