export const API_URL = import.meta.env.VITE_API_URL as string;

export type Page = {
  content: any[];
};

export type Context = {
  id: number;
  name: string;
  creator: Creator;
  imageUrl: string;
  soundUrl: string;
  videoUrl: string;
  challenges: Challenge[];
};

export type Creator = {
  id: number;
  name: string;
  email: string;
};

export type Challenge = {
  id: number;
  word: string;
  creator: Creator;
  imageUrl: string;
  soundUrl: string;
  videoUrl: string;
};
