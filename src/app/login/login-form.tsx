'use client';

import { useState } from 'react';
import { login } from './actions';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    
    const result = await login({ email, password });

    if (result.error) {
      setError(result.error);
    }
  };
  
  return (
    <form onSubmit={handleLogin} className="flex w-full flex-col gap-4">
      <div>
        {/* --- PERUBAHAN DI SINI --- */}
        <label className="mb-2 block text-sm font-bold text-black" htmlFor="email">
          Email
        </label>
        <input
          // --- DAN DI SINI ---
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-black placeholder:text-gray-500"
          id="email"
          type="email"
          name="email"
          placeholder="nama@email.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        {/* --- PERUBAHAN DI SINI --- */}
        <label className="mb-2 block text-sm font-bold text-black" htmlFor="password">
          Password
        </label>
        <input
          // --- DAN DI SINI ---
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-black placeholder:text-gray-500"
          id="password"
          type="password"
          name="password"
          placeholder="••••••••"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="mt-2 w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        Log in
      </button>
      {error && (
        <div
          className="mt-2 flex items-center justify-center"
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}
    </form>
  );
}