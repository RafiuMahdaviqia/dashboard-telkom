// src/app/login/actions.ts

'use server';

import { createClient } from '@/utils/supabase/server'; // Kita akan buat file ini
import { redirect } from 'next/navigation';

export async function login(formData: { email?: string; password?: string }) {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email!,
    password: formData.password!,
  });

  if (error) {
    return { error: 'Email atau password salah.' };
  }

  redirect('/');
}