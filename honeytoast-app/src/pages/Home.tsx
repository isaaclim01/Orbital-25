import { Session } from "@supabase/supabase-js";
import TripInput from "../components/TripInput";
import "./Home.css"

interface HomeProps {
  user: Session['user'];
}

function Home({ user }: HomeProps) {

  const getUsername = () => {
    const atIndex = user.email?.indexOf('@');
    return user.email?.slice(0, atIndex);
  }

  return (
    <div>
      <br></br>
      <div id="welcome">
        Welcome back, <strong>{getUsername()}</strong>
      </div>

      <main>
        <TripInput
          user={user} />
      </main>
    </div>
  )
}

export default Home;