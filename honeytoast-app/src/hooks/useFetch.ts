import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

// Set base URL for all Axios requests
const API_BASE_URL = "http://localhost:8800/api"; // Change to your backend URL

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true; // For cookies
axios.defaults.headers.common['Accept'] = 'application/json';

export default function useFetch<T>(endpoint: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const fetchData = async (url: string) => {
    if (!url) {
      setData(null);
      setError(null);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get<T>(url);
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err as AxiosError);
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (endpoint) { // Only fetch if endpoint exists
      fetchData(endpoint);
    } else {
      setData(null); // Clear data if endpoint becomes null
      setError(null);
    }
  }, [endpoint]);

  const reFetch = async (newUrl?: string | null) => {
    fetchData(newUrl || endpoint || ''); // Handle null cases
  };

  return { data, loading, error, reFetch };
}