import { useState } from 'react'
import { supabase } from '../supabase-client'

export default function Auth() {
  const [signIn, setSignIn] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email || !password) {
      console.error('Email and password are required')
      return
    }
    if (signIn) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (signInError) {
        console.error('Error signing in:', signInError.message)
        return
      }
    } else {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })
      if (signUpError) {
        console.error('Error signing up:', signUpError.message)
        return
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h1>Welcome to the Task Manager</h1>
      {signIn ? (
        <p>Please log in to manage your tasks.</p>
      ) : (
        <p>Please fill in the details to create your account.</p>
      )}
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Enter your password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className="btn">{signIn ? 'Sign In' : 'Sign Up'}</button>
      <p>
        {signIn ? "Don't have an account? " : 'Already have an account? '}
        <button type="button" onClick={() => setSignIn(!signIn)}>
          {signIn ? 'Sign Up' : 'Sign In'}
        </button>
      </p>
    </form>
  )
}
