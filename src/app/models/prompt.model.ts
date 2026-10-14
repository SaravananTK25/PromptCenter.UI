export interface Prompt {
  id: number;
  title: string;
  content: string;
  type: string;
  category: string;
  promptText: string;
  negativePrompt: string;
  description: string;
  tags: string[];
  imageUrl: string;
  //createdAt: string;
}