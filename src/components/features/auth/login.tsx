import React, { useState } from "react";

const LoginModal = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onClose,
  error,
}: {
  email: string;
  password: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  error: string;
}) => {
  // Reset password modal state
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [resetConfirm, setResetConfirm] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError("");
    setResetSuccess("");
    if (!resetEmail || !resetPassword || !resetConfirm) {
      setResetError("All fields are required");
      return;
    }
    if (resetPassword !== resetConfirm) {
      setResetError("Passwords do not match");
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, newPassword: resetPassword })
      });
      if (res.ok) {
        setResetSuccess("Password reset successfully. You can now log in.");
        setResetEmail("");
        setResetPassword("");
        setResetConfirm("");
      } else {
        const data = await res.json();
        setResetError(data.message || "Failed to reset password");
      }
    } catch (err) {
      setResetError("Failed to reset password");
    }
  };

  // Only show one modal at a time
  if (showReset) {
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
          <button
            onClick={() => { setShowReset(false); setResetError(""); setResetSuccess(""); }}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
          <form onSubmit={handleResetPassword} className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">Reset Password</h2>
            <div>
              <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="reset-email"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Enter your email"
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="reset-password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                id="reset-password"
                type="password"
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                placeholder="Enter new password"
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="reset-confirm" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                id="reset-confirm"
                type="password"
                value={resetConfirm}
                onChange={(e) => setResetConfirm(e.target.value)}
                placeholder="Confirm new password"
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
              />
            </div>
            {resetError && <p className="text-red-500 text-sm">{resetError}</p>}
            {resetSuccess && <p className="text-green-600 text-sm">{resetSuccess}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Reset Password
            </button>
            <div className="mt-2 text-center">
              <button
                type="button"
                className="text-blue-600 hover:underline text-sm"
                onClick={() => { setShowReset(false); setResetError(""); setResetSuccess(""); }}
              >
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Login modal (default)
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <form onSubmit={onSubmit} className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            Login
          </h2>
          <div>
            <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="loginEmail"
              type="email"
              value={email}
              onChange={onEmailChange}
              placeholder="Enter your email"
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="loginPassword"
              type="password"
              value={password}
              onChange={onPasswordChange}
              placeholder="Enter your password"
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            className="text-blue-600 hover:underline text-sm"
            onClick={() => setShowReset(true)}
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
