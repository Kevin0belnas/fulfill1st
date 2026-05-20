import React, { useState } from 'react';

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

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage('');
        setError('');
        setLoading(true);

        try {
            const response = await fetch(
                `${config.apiBaseUrl}/auth/forgot-password`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ email })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || 'Failed to send reset link'
                );
            }

            setMessage(
                data.message ||
                'Reset link sent successfully'
            );

        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                'Something went wrong'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">
                    Forgot Password
                </h2>

                {message && (
                    <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-3 mb-4"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg"
                    >
                        {loading
                            ? 'Sending...'
                            : 'Send Reset Link'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;