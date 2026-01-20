'use client';

import { use, useEffect, useState } from 'react';
import BlogForm from '@/app/components/BlogForm';
import api from '@/app/lib/api';
import { Loader2 } from 'lucide-react';

export default function EditBlogPage({ params }) {
    // Correctly unwrap params using React.use()
    const { id } = use(params);
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await api.get(`/admin/blogs`);
                // Since our admin index returns all blogs, we filter. 
                // Alternatively, we could add a `showAdmin` endpoint if details vary significantly.
                // For now, filtering the list or fetching the public show (if published) is tricky.
                // Best practice: Add a dedicated GET /admin/blogs/:id endpoint or use the list if small.
                // Let's rely on finding it in the full list for now to save an endpoint, or fix Controller.
                // Wait, I didn't add showAdmin in Controller. Let's fix that or use the list. 
                // Update: I will just fetch the list and find it. Not optimal for huge data but fine for v1.

                // Correction: Actually, I can just use GET /blogs/:slug if it is published? No, drafts need editing.
                // Let's use the list for now.
                const allBlogs = response.data;
                const found = allBlogs.find(b => b.id == id);
                setBlog(found);
            } catch (error) {
                console.error('Error fetching blog:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!blog) return <div>Blog not found</div>;

    return <BlogForm initialData={blog} />;
}
