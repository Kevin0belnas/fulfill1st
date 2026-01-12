import React, { useState } from 'react'
import { supabase } from '../supabaseClient';

export default function ResetPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const nuclearReset = async () => {
    setLoading(true)
    setMessage('Starting reset...')

    try {
      // First, sign out the current user to clear auth state
      setMessage('Signing out users...')
      const { error: signOutError } = await supabase.auth.signOut()
      
      if (signOutError) {
        setMessage('Sign out error: ' + signOutError.message)
        return
      }

      // Clear any remaining auth tokens from storage
      localStorage.removeItem('supabase.auth.token')
      sessionStorage.removeItem('supabase.auth.token')
      
      setMessage('Auth cleared. Resetting database...')

      // Clear your app data
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000')

      if (profileError) {
        setMessage('Error clearing profiles: ' + profileError.message)
        return
      }

      setMessage('Profiles cleared. Clearing visitors...')

      // Clear visitors table
      const { error: visitorError } = await supabase
        .from('visitors')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000')

      if (visitorError) {
        setMessage('Error clearing visitors: ' + visitorError.message)
        return
      }

      setMessage('✅ Reset complete! All data cleared and authentication reset.')

      // Force a hard refresh to ensure all state is cleared
      setTimeout(() => {
        window.location.reload()
      }, 2000)

    } catch (error) {
      setMessage('Unexpected error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Reset App Data</h1>
      <p>This will clear all profiles and visitors data, and sign out users.</p>
      
      <button 
        onClick={nuclearReset} 
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#ccc' : '#ff4444',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Resetting...' : 'Reset All Data'}
      </button>
      
      {message && (
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          backgroundColor: '#f5f5f5',
          borderRadius: '5px'
        }}>
          {message}
        </div>
      )}
    </div>
  )
}