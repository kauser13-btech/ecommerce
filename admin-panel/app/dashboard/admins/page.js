'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Trash2, User, Loader2, ShieldAlert, Key } from 'lucide-react';
import api from '@/app/lib/api';

export default function AdminsPage() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [verifyingId, setVerifyingId] = useState(null);
    const [otp, setOtp] = useState('');
    const [sendingOtp, setSendingOtp] = useState(false);

    useEffect(() => {
        const userStr = localStorage.getItem('admin_user');
        if (userStr) {
            setCurrentUser(JSON.parse(userStr));
        }
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const response = await api.get('/admin/users');
            setAdmins(response.data);
        } catch (error) {
            console.error('Failed to fetch admins', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to remove this admin user?')) return;

        try {
            await api.delete(`/admin/users/${id}`);
            setAdmins(admins.filter(admin => admin.id !== id));
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete admin');
        }
    };

    const handleResetPassword = async (id) => {
        const newPassword = prompt("Enter new password for this user (min 8 chars):");
        if (!newPassword) return; // User cancelled

        if (newPassword.length < 8) {
            alert("Password must be at least 8 characters long.");
            return;
        }

        const confirmPassword = prompt("Confirm new password:");
        if (confirmPassword !== newPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            await api.post(`/admin/users/${id}/reset-password`, {
                password: newPassword,
                password_confirmation: confirmPassword
            });
            alert("Password reset successfully.");
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to reset password');
        }
    };

    const handleVerify = async (id) => {
        try {
            setSendingOtp(true);
            await api.post(`/admin/users/${id}/send-otp`);
            setVerifyingId(id);
            alert(`OTP sent to user's email.`);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to send OTP');
        } finally {
            setSendingOtp(false);
        }
    };

    const handleConfirmVerify = async (id) => {
        if (!otp || otp.length !== 6) {
            alert('Please enter a valid 6-digit OTP');
            return;
        }

        try {
            await api.post(`/admin/users/${id}/verify-otp`, { otp });
            setAdmins(admins.map(admin =>
                admin.id === id ? { ...admin, email_verified_at: new Date().toISOString() } : admin
            ));
            setVerifyingId(null);
            setOtp('');
            alert('User verified successfully');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to verify user');
        }
    };

    const cancelVerify = () => {
        setVerifyingId(null);
        setOtp('');
    };

    // ... rendering ...



    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Users</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage administrators with access to the dashboard</p>
                </div>
                <Link
                    href="/dashboard/admins/new"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm shadow-blue-200"
                >
                    <Plus className="w-4 h-4" />
                    Add New Admin
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {admins.map((admin) => (
                            <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-900 block">{admin.name}</span>
                                            {currentUser?.id === admin.id && (
                                                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">You</span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{admin.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${admin.role === 'admin'
                                        ? 'bg-purple-50 text-purple-700 border-purple-100'
                                        : 'bg-blue-50 text-blue-700 border-blue-100'
                                        }`}>
                                        <ShieldAlert className="w-3 h-3" />
                                        {admin.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {admin.email_verified_at ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                            Verified
                                        </span>
                                    ) : verifyingId === admin.id ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                placeholder="OTP"
                                                maxLength={6}
                                                className="w-20 px-2 py-1 text-xs border border-blue-300 rounded focus:outline-none focus:border-blue-500"
                                            />
                                            <button
                                                onClick={() => handleConfirmVerify(admin.id)}
                                                className="text-xs text-white bg-blue-600 px-2 py-1 rounded hover:bg-blue-700"
                                            >
                                                OK
                                            </button>
                                            <button
                                                onClick={cancelVerify}
                                                className="text-xs text-gray-500 hover:text-gray-700 px-1"
                                            >
                                                x
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-100">
                                                Unverified
                                            </span>
                                            <button
                                                onClick={() => handleVerify(admin.id)}
                                                disabled={sendingOtp}
                                                className="text-xs text-blue-600 hover:text-blue-800 font-medium underline disabled:opacity-50"
                                            >
                                                {sendingOtp ? '...' : 'Verify Now'}
                                            </button>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleResetPassword(admin.id)}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mr-1"
                                        title="Reset Password"
                                    >
                                        <Key className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(admin.id)}
                                        disabled={currentUser?.id === admin.id}
                                        className={`p-2 rounded-lg transition-colors ${currentUser?.id === admin.id
                                            ? 'text-gray-300 cursor-not-allowed'
                                            : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                                            }`}
                                        title={currentUser?.id === admin.id ? "Cannot remove yourself" : "Remove Admin"}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {admins.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                    No admin users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
