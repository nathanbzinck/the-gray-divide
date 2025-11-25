"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function CreateCharacter() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [alias, setAlias] = useState("");
  const [background, setBackground] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const backgrounds = [
    {
      id: "street_kid",
      name: "Street Kid",
      description: "You grew up on the streets. You know how the underground works and have connections to the criminal world.",
      startingBonus: "+10 Street Reputation, +$50 Dirty Money"
    },
    {
      id: "academy_graduate", 
      name: "Academy Graduate",
      description: "You graduated from the police academy. You believe in justice and have connections in law enforcement.",
      startingBonus: "+10 Professional Reputation, Badge Access"
    },
    {
      id: "civilian",
      name: "Civilian",
      description: "You're an ordinary citizen. No connections, no baggage - a blank slate that can go either way.",
      startingBonus: "+$100 Clean Money, Neutral Standing"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!firstName || !lastName || !background) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setError("You must be logged in to create a character");
      setLoading(false);
      return;
    }

    // Set starting stats based on background
    let dirtyMoney = 0;
    let cleanMoney = 100;
    let reputation = 0;

    if (background === "street_kid") {
      dirtyMoney = 50;
      reputation = 10;
    } else if (background === "academy_graduate") {
      reputation = 10;
    } else if (background === "civilian") {
      cleanMoney = 200;
    }

    const { error: insertError } = await supabase
      .from("characters")
      .insert({
        user_id: user.id,
        first_name: firstName,
        last_name: lastName,
        alias: alias || null,
        background: background,
        dirty_money: dirtyMoney,
        clean_money: cleanMoney,
        reputation: reputation
      });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">The Gray Divide</h1>
        <p className="text-gray-400 text-center mb-8">Create Your Character</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Section */}
          <div className="bg-gray-800 p-6 rounded-lg space-y-4">
            <h2 className="text-xl font-semibold mb-4">Identity</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">First Name *</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Last Name *</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Street Alias (Optional)</label>
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Shadow, Ghost, etc."
              />
            </div>
          </div>

          {/* Background Section */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Choose Your Background *</h2>
            <p className="text-gray-400 text-sm mb-4">This affects your starting position but doesn't lock you into any path.</p>
            
            <div className="space-y-3">
              {backgrounds.map((bg) => (
                <div
                  key={bg.id}
                  onClick={() => setBackground(bg.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    background === bg.id
                      ? "border-blue-500 bg-gray-700"
                      : "border-gray-600 hover:border-gray-500"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{bg.name}</h3>
                    <span className="text-xs bg-gray-600 px-2 py-1 rounded">{bg.startingBonus}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{bg.description}</p>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 py-3 rounded-lg font-semibold transition-colors"
          >
            {loading ? "Creating..." : "Enter The Gray Divide"}
          </button>
        </form>
      </div>
    </div>
  );
}