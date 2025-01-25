import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const App = () => {
  const [story, setStory] = useState("Welcome to your journey!");
  const [choices, setChoices] = useState([
    { text: "Start the adventure", value: "start" },
    { text: "Turn back", value: "end" },
  ]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const fetchStory = async (choice) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choice, history }),
      });
      const data = await response.json();

      setStory(data.story);
      setChoices(data.choices);
      setHistory((prev) => [...prev, { choice, story: data.story }]);
    } catch (error) {
      console.error("Error fetching story:", error);
      setStory("Oops! Something went wrong. Try again later.");
      setChoices([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-xl p-4">
        <CardContent>
          <motion.h1
            className="text-2xl font-bold mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {story}
          </motion.h1>

          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : (
            <div className="mt-4">
              {choices.map((choice, index) => (
                <Button
                  key={index}
                  className="w-full mb-2"
                  onClick={() => fetchStory(choice.value)}
                >
                  {choice.text}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
