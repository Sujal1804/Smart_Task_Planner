import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Signup({ onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await signup(email, password, name);
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#070812' }}>
      <div className="w-full max-w-md p-8 rounded-xl border" style={{
        backgroundColor: '#0F1724',
        borderColor: 'rgba(167, 176, 195, 0.1)'
      }}>
        <div className="mb-6 text-center">
          <div className="inline-flex h-12 w-12 rounded-lg items-center justify-center mb-4" style={{
            background: 'linear-gradient(135deg, #6F8BFF 0%, #4BA3FF 100%)'
          }}>
            <span className="text-2xl font-bold text-white">✓</span>
          </div>
          <h1 className="text-2xl font-semibold text-white mb-2">Create account</h1>
          <p className="text-sm" style={{ color: '#A7B0C3' }}>Start planning your goals</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-md text-sm" style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderColor: 'rgba(239, 68, 68, 0.4)',
              color: '#FCA5A5',
              border: '1px solid'
            }}>
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#A7B0C3' }}>
              Name (optional)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#A7B0C3' }}>
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#A7B0C3' }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#A7B0C3' }}>
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: loading ? 'rgba(111, 139, 255, 0.5)' : 'linear-gradient(135deg, #6F8BFF 0%, #4BA3FF 100%)',
              transition: 'all 0.2s'
            }}
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: '#A7B0C3' }}>
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="font-medium"
              style={{ color: '#6F8BFF' }}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

