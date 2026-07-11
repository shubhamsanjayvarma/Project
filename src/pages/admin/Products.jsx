import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash2, FiX, FiImage, FiVideo, FiSearch, FiChevronDown, FiTag, FiStar } from 'react-icons/fi';
import { useToast } from '../../components/common/Toast';
import { formatPrice, PRODUCT_CONDITIONS, SIZES, BRANDS, COLORS, MATERIALS, GENDERS, SEASONS, SUBCATEGORIES, PRODUCT_TAGS, VISIBILITY_OPTIONS, isYouTubeUrl, isVideoUrl } from '../../utils/helpers';
import { defaultCategories } from '../../services/categories';
import { subscribeToAllProducts, createProduct, updateProduct, deleteProduct } from '../../services/products';
import { uploadProductMedia } from '../../services/storage';
import SmartMedia from '../../components/common/SmartMedia';
import './Admin.css';

const EMPTY_FORM = {
    name: '', description: '', brand: '', sku: '',
    price: '', comparePrice: '', stock: '', lowStockAlert: '3',
    category: 'tops', subcategory: '', condition: 'good', gender: 'unisex', season: 'all-season',
    sizes: [], colors: [], materials: [],
    tags: [], featured: false, visibility: 'active',
    images: [],
};

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [form, setForm] = useState({ ...EMPTY_FORM });
    const [mediaItems, setMediaItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [tagInput, setTagInput] = useState('');
    const [youtubeInput, setYoutubeInput] = useState('');
    const [brandSearch, setBrandSearch] = useState('');
    const [showBrandDropdown, setShowBrandDropdown] = useState(false);
    const brandRef = useRef(null);
    const formRef = useRef(null);
    const toast = useToast();

    useEffect(() => {
        setLoading(true);
        const unsubscribe = subscribeToAllProducts((data) => { setProducts(data); setLoading(false); });
        return () => unsubscribe();
    }, []);

    // Close brand dropdown on outside click
    useEffect(() => {
        const handler = (e) => { if (brandRef.current && !brandRef.current.contains(e.target)) setShowBrandDropdown(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const generateSKU = () => `ST-${Date.now().toString(36).toUpperCase()}`;

    const closeForm = () => {
        mediaItems.forEach(item => {
            if (item.type === 'file' && item.preview) {
                URL.revokeObjectURL(item.preview);
            }
        });
        setMediaItems([]);
        setShowForm(false);
    };

    const openAdd = () => {
        setEditProduct(null);
        setForm({ ...EMPTY_FORM, sku: generateSKU() });
        setMediaItems([]);
        setShowForm(true);
        setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    };

    const openEdit = (product) => {
        setEditProduct(product);
        setForm({
            ...EMPTY_FORM,
            ...product,
            price: String(product.price || ''),
            comparePrice: String(product.comparePrice || ''),
            stock: String(product.stock || ''),
            lowStockAlert: String(product.lowStockAlert || '3'),
            sizes: product.sizes || [],
            colors: product.colors || [],
            materials: product.materials || [],
            tags: product.tags || [],
            images: product.images || [],
        });
        setMediaItems(product.images?.map((url, i) => ({ id: `existing-${i}-${url}`, type: 'url', value: url })) || []);
        setShowForm(true);
        setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    };

    const handleSave = async () => {
        const parsedPrice = parseFloat(form.price);
        if (!form.name || isNaN(parsedPrice)) { toast.error('Name and a valid price are required'); return; }
        setSaving(true);
        try {
            toast.success('Saving product media...');
            // Upload all new files while maintaining their index position in the array
            const images = await Promise.all(mediaItems.map(async (item) => {
                if (item.type === 'file') {
                    return await uploadProductMedia(item.value);
                }
                return item.value; // Already a URL
            }));

            const stockValue = parseInt(form.stock);
            const lowStockValue = parseInt(form.lowStockAlert);
            const productData = {
                ...form,
                price: parsedPrice,
                comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
                stock: isNaN(stockValue) ? 0 : stockValue,
                lowStockAlert: isNaN(lowStockValue) ? 3 : lowStockValue,
                images,
            };
            if (editProduct) {
                await updateProduct(editProduct.id, productData);
                toast.success('Product updated!');
            } else {
                await createProduct(productData);
                toast.success('Product added!');
            }
            setShowForm(false);
            // Revoke object URLs to avoid memory leaks
            mediaItems.forEach(item => {
                if (item.type === 'file' && item.preview) {
                    URL.revokeObjectURL(item.preview);
                }
            });
            setMediaItems([]);
        } catch (err) {
            console.error(err);
            toast.error(err.message || 'Failed to save product/media');
        } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this product?')) return;
        try {
            toast.loading('Deleting...', { id: 'delete-toast' });
            await deleteProduct(id);
            toast.success('Product permanently deleted.', { id: 'delete-toast' });
        } catch (err) {
            console.error(err);
            toast.error(err.message || 'Failed to delete product', { id: 'delete-toast' });
        }
    };

    const toggleArray = (field, value) => {
        setForm(prev => {
            const currentArray = prev[field] || [];
            return {
                ...prev,
                [field]: currentArray.includes(value) ? currentArray.filter(v => v !== value) : [...currentArray, value],
            };
        });
    };

    const addTag = (tag) => {
        const tags = tag.split(',').map(t => t.trim().toLowerCase()).filter(t => t);
        setForm(prev => {
            const currentTags = prev.tags || [];
            const newTags = tags.filter(t => !currentTags.includes(t));
            if (newTags.length === 0) return prev;
            return { ...prev, tags: [...currentTags, ...newTags] };
        });
        setTagInput('');
    };

    const removeTag = (tag) => setForm(prev => ({ ...prev, tags: (prev.tags || []).filter(t => t !== tag) }));

    const removeMediaItem = (id) => {
        setMediaItems(prev => {
            const item = prev.find(i => i.id === id);
            if (item && item.type === 'file' && item.preview) {
                URL.revokeObjectURL(item.preview);
            }
            return prev.filter(i => i.id !== id);
        });
    };

    const setAsCover = (index) => {
        setMediaItems(prev => {
            const next = [...prev];
            const [item] = next.splice(index, 1);
            next.unshift(item);
            return next;
        });
    };

    const moveItem = (index, direction) => {
        setMediaItems(prev => {
            const next = [...prev];
            const targetIndex = index + direction;
            if (targetIndex < 0 || targetIndex >= next.length) return prev;
            const temp = next[index];
            next[index] = next[targetIndex];
            next[targetIndex] = temp;
            return next;
        });
    };

    const addYoutubeLink = () => {
        const link = youtubeInput.trim();
        if (!link) return;
        if (!isYouTubeUrl(link)) {
            toast.error('Please enter a valid YouTube link');
            return;
        }
        setMediaItems(prev => [...prev, { id: `youtube-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, type: 'url', value: link }]);
        setYoutubeInput('');
        toast.success('YouTube link added');
    };

    // Filter products
    const filteredProducts = products.filter(p => {
        const matchesSearch = !searchQuery || p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const filteredBrands = brandSearch ? BRANDS.filter(b => b.toLowerCase().includes(brandSearch.toLowerCase())) : BRANDS;

    const subcats = SUBCATEGORIES[form.category] || [];

    return (
        <div>
            {/* Header */}
            <div className="admin-table-header" style={{ background: 'none', border: 'none', padding: '0', marginBottom: 'var(--space-4)' }}>
                <h1 className="admin-page-title" style={{ marginBottom: 0 }}>Products</h1>
                <button className="btn btn-primary" onClick={openAdd}><FiPlus /> Add Product</button>
            </div>

            {/* Search & Filter Bar */}
            <div className="ap-filter-bar">
                <div className="ap-search-box">
                    <FiSearch size={16} />
                    <input type="text" placeholder="Search products or brands..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="ap-filter-select">
                    <option value="all">All Categories</option>
                    {defaultCategories.map(c => <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>)}
                </select>
                <div className="ap-product-count">{filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}</div>
            </div>

            {/* Products Table */}
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th style={{ width: '50px' }}></th>
                            <th>Product</th>
                            <th>Brand</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading products...</td></tr>
                        ) : filteredProducts.length === 0 ? (
                            <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No products found</td></tr>
                        ) : filteredProducts.map(product => (
                            <tr key={product.id} className="ap-product-row">
                                <td className="ap-td-img">
                                    {product.images?.[0] ? (
                                        <SmartMedia src={product.images[0]} alt="" className="ap-table-thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} videoProps={{ autoPlay: false }} />
                                    ) : <div className="ap-table-thumb ap-no-img"><FiImage size={16} /></div>}
                                </td>
                                <td className="ap-td-name">
                                    <strong>{product.name}</strong>
                                    {product.featured && <FiStar size={12} style={{ color: '#ECC94B', marginLeft: 6 }} />}
                                </td>
                                <td className="ap-td-brand"><span className="ap-brand-badge">{product.brand || '—'}</span></td>
                                <td className="ap-td-category">{defaultCategories.find(c => c.slug === product.category)?.name || product.category}</td>
                                <td className="ap-td-price">
                                    <strong>{formatPrice(product.price)}</strong>
                                    {product.comparePrice && <span className="ap-compare-price">{formatPrice(product.comparePrice)}</span>}
                                </td>
                                <td className="ap-td-stock">
                                    <span className={`ap-stock-badge ${(product.stock || 0) <= (product.lowStockAlert || 3) ? 'low' : ''}`}>
                                        {product.stock || 0}
                                    </span>
                                </td>
                                <td className="ap-td-status">
                                    <span className={`ap-visibility-dot ${product.visibility || 'active'}`}>
                                        {VISIBILITY_OPTIONS.find(v => v.value === (product.visibility || 'active'))?.icon}
                                    </span>
                                </td>
                                <td className="ap-td-actions">
                                    <div className="admin-table-actions">
                                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(product)}><FiEdit size={14} /></button>
                                        <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(product.id)} style={{ color: 'var(--error)' }}><FiTrash2 size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ==================== ADD / EDIT FORM ==================== */}
            <AnimatePresence>
                {showForm && (
                    <motion.div className="ap-form-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeForm}>
                        <motion.div className="ap-form-panel" ref={formRef} initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }} onClick={e => e.stopPropagation()}>
                            {/* Form Header */}
                            <div className="ap-form-header">
                                <h2>{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
                                <button className="ap-close-btn" onClick={closeForm}><FiX size={22} /></button>
                            </div>

                            <div className="ap-form-body">
                                {/* ===== SECTION 1: BASIC INFO ===== */}
                                <div className="ap-section">
                                    <h3 className="ap-section-title">Basic Information</h3>
                                    <div className="ap-field">
                                        <label>Product Name *</label>
                                        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Nike Air Max 90 Vintage" />
                                    </div>
                                    <div className="ap-field">
                                        <label>Description</label>
                                        <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the product — condition details, measurements, special features..." />
                                    </div>
                                    <div className="ap-row">
                                        <div className="ap-field" ref={brandRef}>
                                            <label>Brand</label>
                                            <div className="ap-brand-picker">
                                                <div className="ap-brand-trigger" onClick={() => setShowBrandDropdown(!showBrandDropdown)}>
                                                    <span>{form.brand || 'Select brand'}</span>
                                                    <FiChevronDown className={showBrandDropdown ? 'rotate' : ''} />
                                                </div>
                                                {showBrandDropdown && (
                                                    <div className="ap-brand-dropdown">
                                                        <input type="text" placeholder="Search brands..." value={brandSearch} onChange={e => setBrandSearch(e.target.value)} autoFocus className="ap-brand-search" />
                                                        <div className="ap-brand-list">
                                                            {filteredBrands.map(b => (
                                                                <div key={b} className={`ap-brand-option ${form.brand === b ? 'selected' : ''}`} onClick={() => { setForm({ ...form, brand: b }); setShowBrandDropdown(false); setBrandSearch(''); }}>{b}</div>
                                                            ))}
                                                            {brandSearch && !filteredBrands.some(b => b.toLowerCase() === brandSearch.toLowerCase()) && (
                                                                <div className="ap-brand-option" onClick={() => { setForm({ ...form, brand: brandSearch }); setShowBrandDropdown(false); setBrandSearch(''); }}>
                                                                    <span style={{ color: 'var(--primary)' }}>+ Add "{brandSearch}"</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="ap-field">
                                            <label>SKU / Code</label>
                                            <input value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} placeholder="Auto-generated" />
                                        </div>
                                    </div>
                                </div>

                                {/* ===== SECTION 2: PRICING & STOCK ===== */}
                                <div className="ap-section">
                                    <h3 className="ap-section-title">Pricing & Stock</h3>
                                    <div className="ap-row">
                                        <div className="ap-field">
                                            <label>Price (€) * <span className="ap-hint">Final price — all inclusive</span></label>
                                            <input type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0.00" />
                                        </div>
                                        <div className="ap-field">
                                            <label>Compare-at Price (€) <span className="ap-hint">Original / crossed-out price</span></label>
                                            <input type="number" step="0.01" min="0" value={form.comparePrice} onChange={e => setForm({ ...form, comparePrice: e.target.value })} placeholder="0.00" />
                                        </div>
                                    </div>
                                    <div className="ap-row">
                                        <div className="ap-field">
                                            <label>Stock Quantity</label>
                                            <input type="number" min="0" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="0" />
                                        </div>
                                        <div className="ap-field">
                                            <label>Low Stock Alert</label>
                                            <input type="number" min="0" value={form.lowStockAlert} onChange={e => setForm({ ...form, lowStockAlert: e.target.value })} placeholder="3" />
                                        </div>
                                    </div>
                                </div>

                                {/* ===== SECTION 3: CLASSIFICATION ===== */}
                                <div className="ap-section">
                                    <h3 className="ap-section-title">Classification</h3>
                                    <div className="ap-row">
                                        <div className="ap-field">
                                            <label>Category *</label>
                                            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value, subcategory: '' })}>
                                                {defaultCategories.map(c => <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="ap-field">
                                            <label>Subcategory</label>
                                            <select value={form.subcategory} onChange={e => setForm({ ...form, subcategory: e.target.value })}>
                                                <option value="">Select subcategory</option>
                                                {subcats.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="ap-row ap-row-3">
                                        <div className="ap-field">
                                            <label>Condition</label>
                                            <select value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })}>
                                                {PRODUCT_CONDITIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                            </select>
                                        </div>
                                        <div className="ap-field">
                                            <label>Gender</label>
                                            <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                                                {GENDERS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                                            </select>
                                        </div>
                                        <div className="ap-field">
                                            <label>Season</label>
                                            <select value={form.season} onChange={e => setForm({ ...form, season: e.target.value })}>
                                                {SEASONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* ===== SECTION 4: SIZES, COLORS, MATERIALS ===== */}
                                <div className="ap-section">
                                    <h3 className="ap-section-title">Sizes, Colors & Materials</h3>
                                    <div className="ap-field">
                                        <label>Available Sizes</label>
                                        <div className="ap-chip-grid">
                                            {SIZES.map(size => (
                                                <button key={size} type="button" className={`ap-chip ${form.sizes.includes(size) ? 'active' : ''}`} onClick={() => toggleArray('sizes', size)}>{size}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="ap-field">
                                        <label>Colors</label>
                                        <div className="ap-color-grid">
                                            {COLORS.map(color => (
                                                <button key={color.name} type="button" className={`ap-color-swatch ${form.colors.includes(color.name) ? 'active' : ''}`} onClick={() => toggleArray('colors', color.name)} title={color.name}>
                                                    <span className="ap-swatch" style={{ background: color.hex }} />
                                                    <span className="ap-color-label">{color.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="ap-field">
                                        <label>Material / Fabric</label>
                                        <div className="ap-chip-grid">
                                            {MATERIALS.map(mat => (
                                                <button key={mat} type="button" className={`ap-chip ${form.materials.includes(mat) ? 'active' : ''}`} onClick={() => toggleArray('materials', mat)}>{mat}</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* ===== SECTION 5: MEDIA UPLOAD ===== */}
                                <div className="ap-section">
                                    <h3 className="ap-section-title">Images & Videos</h3>
                                    <div className="ap-media-upload">
                                        <div className="ap-upload-zone">
                                            <FiImage size={28} />
                                            <p>Click or drag to upload images & videos</p>
                                            <span>JPG, PNG, WEBP, MP4 - Max 10MB each</span>
                                            <input type="file" accept="image/jpeg,image/png,image/webp,video/mp4" multiple onChange={(e) => {
                                                if (e.target.files) {
                                                    const files = Array.from(e.target.files);
                                                    const newItems = files.map(file => ({
                                                        id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                                                        type: 'file',
                                                        value: file,
                                                        preview: URL.createObjectURL(file)
                                                    }));
                                                    setMediaItems(prev => [...prev, ...newItems]);
                                                }
                                            }} />
                                        </div>
                                    </div>
                                    <div className="ap-youtube-upload" style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                                        <input
                                            type="text"
                                            placeholder="Paste YouTube Video Link here..."
                                            value={youtubeInput}
                                            onChange={e => setYoutubeInput(e.target.value)}
                                            style={{ flex: 1, padding: '10px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--surface-color)', color: 'var(--text-color)' }}
                                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addYoutubeLink(); } }}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={addYoutubeLink}
                                            style={{ padding: '0 20px', whiteSpace: 'nowrap' }}
                                        >
                                            Add Link
                                        </button>
                                    </div>
                                    {/* Preview Grid */}
                                    {mediaItems.length > 0 && (
                                        <div className="ap-media-grid">
                                            {mediaItems.map((item, i) => {
                                                const isCover = i === 0;
                                                return (
                                                    <div key={item.id} className={`ap-media-item ${item.type === 'file' ? 'ap-media-new' : ''}`} style={{ position: 'relative' }}>
                                                        {item.type === 'url' ? (
                                                            <>
                                                                <SmartMedia src={item.value} alt="" className="ap-media-preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} videoProps={{ autoPlay: false }} isThumbnail={true} />
                                                                {(isVideoUrl(item.value) || isYouTubeUrl(item.value)) && (
                                                                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none', color: '#fff', fontSize: '24px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                                                        ▶
                                                                    </div>
                                                                )}
                                                            </>
                                                        ) : (
                                                            item.value.type.startsWith('video/') ? (
                                                                <video src={item.preview} muted className="ap-media-preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                            ) : (
                                                                <img src={item.preview} alt="" className="ap-media-preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                            )
                                                        )}

                                                        {/* Reorder and Cover Controls */}
                                                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.7)', padding: '4px 6px', zIndex: 10 }}>
                                                            {i > 0 ? (
                                                                <button type="button" onClick={() => moveItem(i, -1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '2px 4px', fontSize: '11px', lineHeight: 1 }} title="Move Left">◀</button>
                                                            ) : <div />}
                                                            {!isCover && (
                                                                <button type="button" onClick={() => setAsCover(i)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', cursor: 'pointer', padding: '2px 6px', borderRadius: '3px', fontSize: '9px', textTransform: 'uppercase', fontWeight: 'bold', lineHeight: 1 }} title="Set as Cover">Cover</button>
                                                            )}
                                                            {i < mediaItems.length - 1 ? (
                                                                <button type="button" onClick={() => moveItem(i, 1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '2px 4px', fontSize: '11px', lineHeight: 1 }} title="Move Right">▶</button>
                                                            ) : <div />}
                                                        </div>

                                                        <button type="button" className="ap-media-remove" onClick={() => removeMediaItem(item.id)}><FiX size={12} /></button>
                                                        {isCover && <span className="ap-media-badge" style={{ position: 'absolute', top: '4px', left: '4px', bottom: 'auto' }}>Cover</span>}
                                                        {item.type === 'file' && <span className="ap-media-badge new" style={{ position: 'absolute', top: '4px', left: isCover ? '55px' : '4px', bottom: 'auto' }}>New</span>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* ===== SECTION 6: TAGS & VISIBILITY ===== */}
                                <div className="ap-section">
                                    <h3 className="ap-section-title">Tags & Visibility</h3>
                                    <div className="ap-field">
                                        <label>Tags</label>
                                        <div className="ap-tags-input-wrap">
                                            {form.tags.map(tag => (
                                                <span key={tag} className="ap-tag">{tag} <button onClick={() => removeTag(tag)}><FiX size={10} /></button></span>
                                            ))}
                                            <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(tagInput); } }} placeholder="Type & press Enter..." className="ap-tag-input" />
                                        </div>
                                        <div className="ap-quick-tags">
                                            {PRODUCT_TAGS.filter(t => !form.tags.includes(t)).slice(0, 12).map(tag => (
                                                <button key={tag} type="button" className="ap-quick-tag" onClick={() => addTag(tag)}>+ {tag}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="ap-row">
                                        <div className="ap-field">
                                            <label>Visibility</label>
                                            <div className="ap-visibility-group">
                                                {VISIBILITY_OPTIONS.map(v => (
                                                    <button key={v.value} type="button" className={`ap-visibility-btn ${form.visibility === v.value ? 'active' : ''}`} onClick={() => setForm({ ...form, visibility: v.value })}>
                                                        {v.icon} {v.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="ap-field">
                                            <label>&nbsp;</label>
                                            <label className="ap-checkbox-label">
                                                <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
                                                <FiStar size={14} /> Featured Product
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Form Footer */}
                            <div className="ap-form-footer">
                                <button type="button" className="btn btn-ghost" onClick={closeForm}>Cancel</button>
                                <button className="btn btn-primary btn-lg" onClick={handleSave} disabled={saving}>
                                    {saving ? 'Saving...' : editProduct ? 'Save Changes' : 'Add Product'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminProducts;
