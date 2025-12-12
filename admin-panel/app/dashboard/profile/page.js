'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, User, Camera, ShieldCheck, AlertTriangle } from 'lucide-react';
import api from '@/app/lib/api';

export default function ProfilePage() {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });

    useEffect(() => {
        const userStr = localStorage.getItem('admin_user');
        if (userStr) {
            const userData = JSON.parse(userStr);
            setUser(userData);
            setFormData(prev => ({
                ...prev,
                name: userData.name,
                email: userData.email
            }));
            if (userData.avatar) {
                setAvatarPreview(process.env.NEXT_PUBLIC_API_URL.replace('/api', '') + userData.avatar);
            }
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSendOtp = async () => {
        try {
            setVerifying(true);
            await api.post('/email/send-otp');
            setOtpSent(true);
            alert('OTP sent to your email.');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to send OTP');
        } finally {
            setVerifying(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            alert('Please enter a valid 6-digit OTP');
            return;
        }

        try {
            setVerifying(true);
            await api.post('/email/verify-otp', { otp });

            // Update local user state
            const updatedUser = { ...user, email_verified_at: new Date().toISOString() };
            localStorage.setItem('admin_user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setOtpSent(false);
            setOtp('');

            alert('Email verified successfully!');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to verify OTP');
        } finally {
            setVerifying(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (formData.password && formData.password !== formData.password_confirmation) {
            alert("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const data = new FormData();
            data.append('_method', 'PUT'); // Method spoofing for Laravel
            data.append('name', formData.name);
            data.append('email', formData.email);
            if (formData.password) {
                data.append('password', formData.password);
                data.append('password_confirmation', formData.password_confirmation);
            }
            if (avatarFile) {
                data.append('avatar', avatarFile);
            }

            // Note: When sending FormData with files, axios usually needs Content-Type: multipart/form-data
            // But api instance might set json by default. We need to override.
            const response = await api.post(`/admin/users/${user.id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Update local storage
            const updatedUser = { ...user, ...response.data };
            if (updatedUser.avatar && !updatedUser.avatar.startsWith('http')) {
                // Ensure we store consistent URL if backend returns relative
                // Actually backend returns /storage/..., we might need to prepend base URL for display
            }

            localStorage.setItem('admin_user', JSON.stringify(updatedUser));
            setUser(updatedUser);

            // Clear password fields and file
            setFormData(prev => ({
                ...prev,
                password: '',
                password_confirmation: ''
            }));
            setAvatarFile(null);

            alert('Profile updated successfully');
        } catch (error) {
            console.error('Failed to update profile', error);
            alert(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your account settings</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-start gap-6 mb-6">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-10 h-10" />
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-sm">
                                <Camera className="w-4 h-4" />
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                                {user.email_verified_at ? (
                                    <span className="text-green-600" title="Verified Email">
                                        <ShieldCheck className="w-5 h-5" />
                                    </span>
                                ) : (
                                    <span className="text-yellow-500" title="Unverified Email">
                                        <AlertTriangle className="w-5 h-5" />
                                    </span>
                                )}
                            </div>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100 uppercase mb-3">
                                {user.role}
                            </span>

                            {!user.email_verified_at && (
                                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mt-2">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-sm text-yellow-800 font-medium mb-2">Your email is not verified.</p>

                                            {!otpSent ? (
                                                <button
                                                    type="button"
                                                    onClick={handleSendOtp}
                                                    disabled={verifying}
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-200 transition-colors"
                                                >
                                                    {verifying ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Send className="w-4 h-4" />
                                                    )}
                                                    Send Verification OTP
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-2 mt-1">
                                                    <input
                                                        type="text"
                                                        value={otp}
                                                        onChange={(e) => setOtp(e.target.value)}
                                                        placeholder="Enter OTP"
                                                        maxLength={6}
                                                        className="w-32 px-3 py-1.5 border border-yellow-300 rounded-lg text-sm focus:ring-yellow-500 focus:border-yellow-500"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleVerifyOtp}
                                                        disabled={verifying}
                                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50"
                                                    >
                                                        {verifying ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <CheckCircle className="w-4 h-4" />
                                                        )}
                                                        Verify
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-900 mb-4">Change Password</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    minLength={8}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Leave empty to keep current"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    name="password_confirmation"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    minLength={8}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Retype new password"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
