import './index.css'
import { useState, useEffect } from 'react'
import { createClient, Session } from '@supabase/supabase-js'
import LoginPage from './pages/LoginPage'
import HoneyToast from './pages/HoneyToast'


  export const supabase = createClient('https://flipxbijdulfwahfmtro.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsaXB4YmlqZHVsZndhaGZtdHJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MjQzMDUsImV4cCI6MjA2NDEwMDMwNX0.SnQanuApSboQnx_Pr-KFPJmhFNy5NbS6pR1-yo8h_UE')

  export default function App() {
    const [session, setSession] = useState<Session | null>(null)

    useEffect(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
      })

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })

      return () => subscription.unsubscribe()
    }, [])

    if (!session) {
      return <LoginPage />
    }
    else {
      return <HoneyToast />
    }
  }


