import "./itinerary.css";
import { useState } from "react";
import OpenAI from "openai";

function Itinerary() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Initialize OpenAI client
  const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: 'sk-f74e106e0a984f039581c22d523611b5',
    dangerouslyAllowBrowser: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const completion = await openai.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are a helpful travel assistant. Generate a detailed itinerary based on the user's input."
          },
          {
            role: "user",
            content: input
          }
        ],
      });

      setResponse(completion.choices[0]?.message?.content || "No response");
    } catch (error) {
      console.error("Error calling OpenAI:", error);
      setResponse("Error generating itinerary");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="itinerary-container">
      <h1>Travel Itinerary Generator</h1>

      <form onSubmit={handleSubmit} className="itinerary-form">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your trip details (destination, dates, interests)..."
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate Itinerary"}
        </button>
      </form>

      {response && (
        <div className="itinerary-response">
          <h2>Your Itinerary:</h2>
          <pre>{response}</pre> {/* Text will now wrap properly */}
        </div>
      )}
    </div>
  );
}

export default Itinerary;