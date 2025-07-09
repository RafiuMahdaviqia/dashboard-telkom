// src/app/login/page.tsx

import { LoginForm } from './login-form';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-900">
          Admin Login
        </h1>
        <p className="mb-6 text-center text-sm text-gray-500">
          Silakan masuk untuk mengakses dashboard.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}