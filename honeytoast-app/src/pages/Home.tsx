import { Session } from "@supabase/supabase-js";
import { supabase } from "../App";
import TripInput from "../components/TripInput";

interface HomeProps {
  user: Session['user'];
}

function Home({ user }: HomeProps) {

  const getUsername = () => {
    const atIndex = user.email?.indexOf('@');
    return user.email?.slice(0, atIndex);
  }

  const addNewTrip = async (start: string, destination: string,
    startDate: Date, endDate: Date, pax: number
  ) => {
    const { error } = await supabase
      .from('Trips')
      .insert([
        { start: start, destination: destination, start_date: startDate,
          end_date: endDate, pax: pax, user_id: user.id
        },
      ])
      .select()
    if (error !== null) {
      console.error("Error adding new trip: ", error.message);
    }
  }

  return (
    <div>
      <p>
        Welcome back, <strong>{getUsername()}</strong>
      </p>

      <main>
        <TripInput
          handleAddNewTrip={addNewTrip} />
      </main>
    </div>
  )
}

export default Home;