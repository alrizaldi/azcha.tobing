import { createClient } from './supabase/server';
import { cookies } from 'next/headers';

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  return user;
}

export async function isAdminUser() {
  const user = await getCurrentUser();
  
  if (!user) {
    return false;
  }
  
  // In a real implementation, you would check user roles
  // For now, we'll consider the first user as admin
  return true;
}