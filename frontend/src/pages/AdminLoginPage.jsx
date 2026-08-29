import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff, Shield } from 'lucide-react';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const [isSubmittingForgot, setIsSubmittingForgot] = useState(false);

  // If already logged in, go straight to admin panel
  useEffect(() => {
    if (sessionStorage.getItem('qrs-admin-session') === 'true') {
      navigate('/?admin=1', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        sessionStorage.setItem('qrs-admin-session', 'true');
        sessionStorage.setItem('qrs-admin-username', data.admin.username);
        sessionStorage.setItem('qrs-admin-email', data.admin.email);
        // Navigate to home with admin=1 so the AdminPanel auto-opens
        navigate('/?admin=1', { replace: true });
      } else {
        setError(data.message || 'Invalid username or password.');
      }
    } catch (err) {
      setError('Network error. Make sure XAMPP is running and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsSubmittingForgot(true);
    setForgotMessage('');

    try {
      const response = await fetch('/api/auth/forgot-password.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();
      setForgotMessage(data.message || (data.success ? 'Reset link sent!' : 'Failed to send reset link.'));
      if (data.success) setForgotEmail('');
    } catch (err) {
      setForgotMessage('Network error. Please try again.');
    } finally {
      setIsSubmittingForgot(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-navy mb-4">
            <Shield className="w-8 h-8 text-gold" />
          </div>
          <p className="text-sm uppercase tracking-[0.2em] text-gold font-medium">Admin Login</p>
          <h1 className="mt-1 text-2xl font-bold text-navy">Website Control</h1>
          <p className="mt-1 text-sm text-slate-500">Quality Rental Business Services</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {!showForgotPassword ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  autoComplete="username"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-800 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    autoComplete="current-password"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 pr-10 text-slate-800 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-gold px-4 py-3 text-sm font-semibold text-white hover:bg-navy transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span>Logging in...</span>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Login
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="w-full text-sm text-gold hover:underline"
              >
                Forgot Password?
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-navy mb-1">Reset Password</h2>
                <p className="text-sm text-slate-500 mb-4">Enter your email address to receive a reset link.</p>
                <label htmlFor="forgot-email" className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-800 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
              </div>

              {forgotMessage && (
                <div className={`rounded-lg px-4 py-3 text-sm border ${forgotMessage.toLowerCase().includes('sent') ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                  {forgotMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmittingForgot}
                className="w-full rounded-lg bg-navy px-4 py-3 text-sm font-semibold text-white hover:bg-gold transition-colors disabled:opacity-60"
              >
                {isSubmittingForgot ? 'Sending...' : 'Send Reset Link'}
              </button>

              <button
                type="button"
                onClick={() => { setShowForgotPassword(false); setForgotEmail(''); setForgotMessage(''); }}
                className="w-full text-sm text-slate-500 hover:text-slate-800"
              >
                ← Back to Login
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          © 2026 Quality Rental Business Services
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
