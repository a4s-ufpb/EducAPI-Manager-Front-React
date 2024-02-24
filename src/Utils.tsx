export const API_URL = import.meta.env.VITE_API_URL as string;

export type Page = {
  content: any[];
};

export type Context = {
    id: number;
    name: string;
    creator: {
        id: number;
        name: string;
        email: string;
    };
    imageUrl: string;
    soundUrl: string;
    videoUrl: string;
}
