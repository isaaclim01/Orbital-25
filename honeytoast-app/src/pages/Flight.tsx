import { useEffect, useState } from "react";
import api from "../api";

type Fruit = {
  name: string;
};

function Flight() {

  const [fruits, setFruits] = useState<Fruit[]>([]);

  const fetchFruits = async () => {
    try {
      const response = await api.get('/fruits');
      setFruits(response.data.fruits);
    } catch (error) {
      console.error("Error fetching fruits", error);
    }
  };

  useEffect(() => {
    fetchFruits();
  }, []);


  return (
    // <div>
    //   Flight
    // </div>

     <div>
      <h2>Fruits List</h2>
      <ul>
        {fruits.map((fruit, index) => (
          <li key={index}>{fruit.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default Flight;
