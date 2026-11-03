import { PokemonType, TypeConfig } from "../types/starter.types";

export const POKEMON_TYPE_CONFIG: Record<PokemonType, TypeConfig> = {
  fire: { icon: "🔥", color: "#ff4757" },
  water: { icon: "💧", color: "#3742fa" },
  grass: { icon: "🌿", color: "#2ed573" },
  electric: { icon: "⚡", color: "#ffa502" },
  ground: { icon: "⛰️", color: "#cd853f" },
  rock: { icon: "🗿", color: "#6c757d" },
  flying: { icon: "🕊️", color: "#9c88ff" },
  ice: { icon: "❄️", color: "#70a1ff" },
};

export const getTypeConfig = (type: string): TypeConfig => {
  const normalizedType = type.toLowerCase() as PokemonType;
  return POKEMON_TYPE_CONFIG[normalizedType] || { icon: "🔷", color: "#f1f2f6" };
};

export const getTypeIcon = (type: string): string => {
  return getTypeConfig(type).icon;
};

export const getTypeColor = (type: string): string => {
  return getTypeConfig(type).color;
};
