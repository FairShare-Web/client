'use server'

import { signIn as authSignIn, signOut as authSignOut } from '@/auth'

export async function signIn(provider?: string) {
  await authSignIn(provider, { redirectTo: '/' })
}

export async function signOut() {
  await authSignOut()
}
