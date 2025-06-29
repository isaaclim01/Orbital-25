import { useEffect, useState } from "react";
import axios from "axios";

export default function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get(url)
    .then((response) => {
      setData(response.data);
    })
    .catch((err) => {
      setError(err);
    })
    .finally(() => {
      setLoading(false);
    });}, [url]);
    

  const reFetch = () => {
    setLoading(true);
    axios.get(url)
    .then((response) => {
      setData(response.data);
    })
    .catch((err) => {
      setError(err);
    })
    .finally(() => {
      setLoading(false);
    });};

  return { data, loading, error, reFetch };
};