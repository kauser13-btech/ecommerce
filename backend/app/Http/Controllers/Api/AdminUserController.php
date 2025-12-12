<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role !== 'admin') {
             return response()->json(['message' => 'Unauthorized'], 403);
        }
        // List only admin/manager users
        $admins = User::whereIn('role', ['admin', 'manager'])->latest()->get();
        return response()->json($admins);
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'admin') {
             return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:admin,manager',
        ]);

        $admin = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        return response()->json($admin, 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $currentUser = $request->user();

        // Manager can only update themselves
        if ($currentUser->role === 'manager' && $currentUser->id !== $user->id) {
             return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
            'avatar' => 'nullable|image|max:2048', // 2MB Max
        ]);

        $user->name = $request->name;
        $user->email = $request->email;
        if ($request->password) {
            $user->password = Hash::make($request->password);
        }

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = '/storage/' . $path;
        }

        $user->save();

        return response()->json($user);
    }

    public function sendOtp(Request $request) {
        $user = $request->user();
        
        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified.'], 400);
        }

        $otp = rand(100000, 999999);
        $user->otp = $otp;
        $user->otp_expires_at = now()->addMinutes(10);
        $user->save();

        // Send Email
        \Illuminate\Support\Facades\Mail::raw("Your verification OTP is: $otp", function ($message) use ($user) {
            $message->to($user->email)->subject('Verify your email');
        });

        return response()->json(['message' => 'OTP sent to your email.']);
    }

    public function verifyOtp(Request $request) {
        $request->validate([
            'otp' => 'required|string|size:6'
        ]);

        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified.'], 400);
        }

        if (!$user->otp || $user->otp !== $request->otp) {
            return response()->json(['message' => 'Invalid OTP.'], 400);
        }

        if ($user->otp_expires_at < now()) {
             return response()->json(['message' => 'OTP expired.'], 400);
        }

        $user->markEmailAsVerified();
        $user->otp = null;
        $user->otp_expires_at = null;
        $user->save();

        return response()->json(['message' => 'Email verified successfully.']);
    }

    public function sendUserOtp(Request $request, $id) {
        $user = User::findOrFail($id);
        
        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified.'], 400);
        }

        $otp = rand(100000, 999999);
        $user->otp = $otp;
        $user->otp_expires_at = now()->addMinutes(10);
        $user->save();

        // Send Email
        \Illuminate\Support\Facades\Mail::raw("Your verification OTP is: $otp", function ($message) use ($user) {
            $message->to($user->email)->subject('Verify your email');
        });

        return response()->json(['message' => 'OTP sent to user.']);
    }

    public function verifyUserOtp(Request $request, $id) {
        $request->validate([
            'otp' => 'required|string|size:6'
        ]);

        $user = User::findOrFail($id);

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified.'], 400);
        }

        if (!$user->otp || $user->otp !== $request->otp) {
            return response()->json(['message' => 'Invalid OTP.'], 400);
        }

        if ($user->otp_expires_at < now()) {
             return response()->json(['message' => 'OTP expired.'], 400);
        }

        $user->markEmailAsVerified();
        $user->otp = null;
        $user->otp_expires_at = null;
        $user->save();

        return response()->json(['message' => 'User verified successfully.']);
    }

    public function resetPassword(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
             return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::findOrFail($id);
        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json(['message' => 'Password reset successfully.']);
    }

    public function destroy(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user = User::findOrFail($id);

        // Prevent self-deletion
        if ($request->user()->id === $user->id) {
            return response()->json(['message' => 'Cannot delete your own account'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    public function verify(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
             return response()->json(['message' => 'Unauthorized'], 403);
        }
        $user = User::findOrFail($id);
        
        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'User already verified.'], 400);
        }

        $user->markEmailAsVerified();

        return response()->json(['message' => 'Admin verified successfully.']);
    }
}
