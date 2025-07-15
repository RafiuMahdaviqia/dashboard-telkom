'use client';
import { useState } from 'react';
import { login } from './actions';

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      <label className="text-sm font-medium text-black">Email</label>
      <input className="rounded-md border border-gray-300 px-3 py-2 text-black" name="email" placeholder="nama@email.com" required />
      <label className="text-sm font-medium text-black">Password</label>
      <input className="rounded-md border border-gray-300 px-3 py-2 text-black" type="password" name="password" placeholder="••••••••" required />
      <button className="mt-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
        Log in
      </button>
      {error && <p className="text-center text-sm text-red-500">{error}</p>}
    </form>
  );
}