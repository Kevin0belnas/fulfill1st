import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Environment-aware configuration
const ENV_CONFIG = {
    development: {
        apiBaseUrl:
            import.meta.env.VITE_API_BASE_URL ||
            'http://localhost:3000/api',
    },
    production: {
        apiBaseUrl:
            import.meta.env.VITE_API_BASE_URL ||
            'https://api.fulfill1st.com/api',
    }
};

const currentEnv = import.meta.env.MODE || 'development';
const config = ENV_CONFIG[currentEnv];

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${config.apiBaseUrl}/auth/reset-password/${token}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ password })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to reset password');
            }

            setMessage('Password reset successful! Redirecting...');

            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (err) {
            console.error(err);
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Reset Password
                </h2>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 font-semibold">
                            New Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full border p-3 rounded"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 font-semibold">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full border p-3 rounded"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700"
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;