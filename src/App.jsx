import { useEffect, useState } from 'react'
import './App.css'
import Auth from './components/Auth'
import TaskManager from './components/TaskManager'
import { supabase } from './supabase-client'

function App() {
  const [session, setSession] = useState(null)

  async function fetchSession() {
    const { data } = await supabase.auth.getSession()
    setSession(data.session)
    console.log('session', data.session)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  useEffect(() => {
    fetchSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session)
        setSession(session)
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return (
    <>
      {session ? (
        <>
          <button onClick={handleLogout}>Log Out</button>
          <TaskManager session={session} />
        </>
      ) : (
        <Auth />
      )}
    </>
  )
}

export default App
