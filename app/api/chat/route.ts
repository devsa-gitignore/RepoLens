import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  const { messages, repoContext } = await req.json();

  // The Vercel AI SDK newer useChat hooks send messages with 'parts' array for text/images.
  // We need to map it back to a standard string 'content' so that streamText schema validation passes.
  const formattedMessages = messages.map((m: any) => {
    if (m.parts && Array.isArray(m.parts)) {
      return {
        role: m.role,
        content: m.parts.map((p: any) => p.text || '').join(''),
        id: m.id,
      };
    }
    return m;
  });

  const systemPrompt = `You are a helpful AI assistant for hackathon judges. You are reviewing a GitHub repository.
  Here is the context of the repository:
  ${repoContext}
  
  Answer the judge's questions concisely and accurately based on the provided context. Keep it short and retro-themed if possible.`;

  const result = streamText({
    model: groq('llama-3.1-8b-instant'),
    system: systemPrompt,
    messages: formattedMessages,
  });

  return result.toUIMessageStreamResponse();
}