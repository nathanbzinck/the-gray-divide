"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Character = {
  id: string;
  first_name: string;
  last_name: string;
  alias: string | null;
  background: string;
  current_faction: string;
  rank: number;
  xp: number;
  dirty_money: number;
  clean_money: number;
  heat: number;
  reputation: number;
};

export default function Dashboard() {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadCharacter() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/sign-in");
        return;
      }

      const { data, error } = await supabase
        .from("characters")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error || !data) {
        router.push("/create-character");
        return;
      }

      setCharacter(data);
      setLoading(false);
    }

    loadCharacter();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!character) return null;

  const backgroundNames: Record<string, string> = {
    street_kid: "Street Kid",
    academy_graduate: "Academy Graduate",
    civilian: "Civilian",
  };

  const factionColors: Record<string, string> = {
    neutral: "text-gray-400",
    criminal: "text-red-400",
    law_enforcement: "text-blue-400",
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">The Gray Divide</h1>
          <div className="text-right">
            <p className="text-xl font-semibold">
              {character.first_name} {character.last_name}
              {character.alias && (
                <span className="text-gray-400"> "{character.alias}"</span>
              )}
            </p>
            <p
              className={`text-sm ${
                factionColors[character.current_faction] || "text-gray-400"
              }`}
            >
              {character.current_faction === "neutral"
                ? "Unaligned"
                : character.current_faction.replace("_", " ")}
            </p>
            <button
              onClick={async () => {
                const supabase = createClient();
                await supabase.auth.signOut();
                router.push("/");
              }}
              className="mt-2 text-sm text-gray-400 hover:text-white underline"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-gray-400 text-sm">Rank</p>
            <p className="text-2xl font-bold">{character.rank}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-gray-400 text-sm">XP</p>
            <p className="text-2xl font-bold">{character.xp}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-gray-400 text-sm">Reputation</p>
            <p className="text-2xl font-bold">{character.reputation}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-gray-400 text-sm">Heat</p>
            <p className="text-2xl font-bold text-orange-400">
              {character.heat}%
            </p>
          </div>
        </div>

        {/* Money */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Clean Money</p>
            <p className="text-2xl font-bold text-green-400">
              ${character.clean_money.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
  <p className="text-gray-400 text-sm">Dirty Money</p>
  <p className="text-2xl font-bold text-red-400">
    ${character.dirty_money.toLocaleString()}
  </p>
</div>

        </div>

        {/* Character Info */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Character Info</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Background</p>
              <p>{backgroundNames[character.background] ?? character.background}</p>
            </div>
            <div>
              <p className="text-gray-400">Current Faction</p>
              <p className={factionColors[character.current_faction]}>
                {character.current_faction === "neutral"
                  ? "Unaligned"
                  : character.current_faction.replace("_", " ").toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        {/* Placeholder for future features */}
        <div className="bg-gray-800 p-6 rounded-lg border-2 border-dashed border-gray-600">
          <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
          <p className="text-gray-400">
            Operations, Territory Map, Organizations, and more...
          </p>
        </div>
      </div>
    </div>
  );
}
