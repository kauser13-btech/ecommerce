'use client';

import { useState, useEffect } from 'react';
import api from '../../lib/api'; // Adjust path as needed
import { Plus, Edit2, Trash2, Save, X, ChevronRight, ChevronDown, Move } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function MenuManagement() {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ title: '', url: '', parent_id: null });

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [tags, setTags] = useState([]);
    const [linkType, setLinkType] = useState('custom');

    useEffect(() => {
        fetchMenu();
        fetchDependencies();
    }, []);

    const fetchDependencies = async () => {
        try {
            const [catsRes, brandsRes, tagsRes] = await Promise.all([
                api.get('/categories'),
                api.get('/brands'),
                api.get('/tags')
            ]);
            setCategories(catsRes.data.data || catsRes.data);
            setBrands(brandsRes.data.data || brandsRes.data);
            setTags(tagsRes.data.data || tagsRes.data);
        } catch (error) {
            console.error('Error fetching dependencies:', error);
        }
    };

    const fetchMenu = async () => {
        try {
            const response = await api.get('/menu');
            setMenuItems(response.data);
        } catch (error) {
            console.error('Error fetching menu:', error);
            toast.error('Failed to load menu');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (parent_id = null, item = null) => {
        setLinkType('custom'); // Reset helper
        if (item) {
            setEditingItem(item);
            setFormData({ title: item.title, url: item.url, parent_id: item.parent_id });
        } else {
            setEditingItem(null);
            setFormData({ title: '', url: '', parent_id });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await api.put(`/admin/menu/${editingItem.id}`, formData);
                toast.success('Menu item updated');
            } else {
                await api.post('/admin/menu', formData);
                toast.success('Menu item created');
            }
            setIsModalOpen(false);
            fetchMenu();
        } catch (error) {
            console.error('Error saving menu item:', error);
            toast.error('Failed to save menu item');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure? This will delete all sub-items as well.')) return;
        try {
            await api.delete(`/admin/menu/${id}`);
            toast.success('Menu item deleted');
            fetchMenu();
        } catch (error) {
            console.error('Error deleting menu item:', error);
            toast.error('Failed to delete menu item');
        }
    };

    const handleReorder = async (items) => {
        try {
            await api.post('/admin/menu/reorder', {
                items: items.map((item, index) => ({
                    id: item.id,
                    order: index + 1,
                    parent_id: item.parent_id
                }))
            });
            fetchMenu();
        } catch (error) {
            console.error('Error reordering menu:', error);
            toast.error('Failed to update order');
        }
    };

    const moveItem = (item, direction, siblings) => {
        const currentIndex = siblings.findIndex(i => i.id === item.id);
        if (currentIndex === -1) return;

        const newIndex = currentIndex + direction;
        if (newIndex < 0 || newIndex >= siblings.length) return;

        const newSiblings = [...siblings];
        const [movedItem] = newSiblings.splice(currentIndex, 1);
        newSiblings.splice(newIndex, 0, movedItem);

        handleReorder(newSiblings);
    };

    const MenuItemNode = ({ item, level = 0, siblings = [] }) => {
        const [isExpanded, setIsExpanded] = useState(true);
        const index = siblings.findIndex(s => s.id === item.id);
        const isFirst = index === 0;
        const isLast = index === siblings.length - 1;

        return (
            <div className="border border-gray-200 rounded-lg mb-2 bg-white overflow-hidden">
                <div className="flex items-center p-3 gap-2 hover:bg-gray-50">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`p-1 rounded hover:bg-gray-200 text-gray-500 ${!item.children?.length ? 'invisible' : ''}`}
                    >
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>

                    <div className="flex-1">
                        <div className="font-medium text-gray-900">{item.title}</div>
                        <div className="text-xs text-gray-500 truncate">{item.url}</div>
                    </div>

                    <div className="flex items-center gap-1 mr-4">
                        <button
                            onClick={() => moveItem(item, -1, siblings)}
                            disabled={isFirst}
                            className="p-1 text-gray-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move Up"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                        </button>
                        <button
                            onClick={() => moveItem(item, 1, siblings)}
                            disabled={isLast}
                            className="p-1 text-gray-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move Down"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                    </div>

                    <div className="flex items-center gap-2 border-l pl-2 border-gray-200">
                        <button
                            onClick={() => handleOpenModal(item.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg text-xs font-medium flex items-center gap-1"
                            title="Add Child"
                        >
                            <Plus size={14} /> Add Sub
                        </button>
                        <button
                            onClick={() => handleOpenModal(item.parent_id, item)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                            <Edit2 size={16} />
                        </button>
                        <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                {isExpanded && item.children && item.children.length > 0 && (
                    <div className="pl-8 pr-2 pb-2">
                        {item.children.map(child => (
                            <MenuItemNode key={child.id} item={child} level={level + 1} siblings={item.children} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage header navigation structure</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                    <Plus size={20} />
                    Add Root Item
                </button>
            </div>

            <div className="space-y-2">
                {menuItems.map(item => (
                    <MenuItemNode key={item.id} item={item} siblings={menuItems} />
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-900">
                                {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Link Source</label>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <select
                                        value={linkType}
                                        onChange={(e) => setLinkType(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 bg-white"
                                    >
                                        <option value="custom">Custom URL</option>
                                        <option value="category">Category</option>
                                        <option value="brand">Brand</option>
                                        <option value="tag">Tag</option>
                                    </select>

                                    {linkType !== 'custom' && (
                                        <select
                                            onChange={(e) => {
                                                const slug = e.target.value;
                                                if (!slug) return;
                                                const prefix = linkType === 'category' ? 'products?category=' : linkType === 'brand' ? '/products?brand=' : '/tag';

                                                let item;
                                                if (linkType === 'category') item = categories.find(i => i.slug === slug);
                                                if (linkType === 'brand') item = brands.find(i => i.slug === slug);
                                                if (linkType === 'tag') item = tags.find(i => i.slug === slug);

                                                setFormData(prev => ({
                                                    ...prev,
                                                    url: `${prefix}/${slug}`,
                                                    title: prev.title || (item?.name || item?.title || '')
                                                }));
                                            }}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 bg-white"
                                        >
                                            <option value="">Select Item...</option>
                                            {linkType === 'category' && categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
                                            {linkType === 'brand' && brands.map(b => <option key={b.id} value={b.slug}>{b.name}</option>)}
                                            {linkType === 'tag' && tags.map(t => <option key={t.id} value={t.slug}>{t.name}</option>)}
                                        </select>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                                    placeholder="e.g., Home"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                                <input
                                    type="text"
                                    value={formData.url}
                                    onChange={e => setFormData({ ...formData, url: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                                    placeholder="e.g., /products"
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-medium"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
