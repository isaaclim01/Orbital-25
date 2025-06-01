import { Session } from "@supabase/supabase-js";

interface HomeProps {
  user: Session['user'];  
}

function Home({user}: HomeProps) {

  const getUsername = () => {
    const atIndex = user.email?.indexOf('@');
    return user.email?.slice(0, atIndex);
  }
  return (
    <div>
      <p>
        Welcome back, <strong>{getUsername()}</strong>
      </p>
    </div>
  )
}

export default Home;