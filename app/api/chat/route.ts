import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  const { messages, repoContext } = await req.json();

<<<<<<< HEAD
<<<<<<< HEAD
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

=======
>>>>>>> ff21f7e670d81b8880d3aab2c3d2c994a4b5b22c
=======
>>>>>>> ff21f7e670d81b8880d3aab2c3d2c994a4b5b22c
  const systemPrompt = `You are a helpful AI assistant for hackathon judges. You are reviewing a GitHub repository.
  Here is the context of the repository:
  ${repoContext}
  
  Answer the judge's questions concisely and accurately based on the provided context. Keep it short and retro-themed if possible.`;

  const result = streamText({
<<<<<<< HEAD
<<<<<<< HEAD
    model: groq('llama-3.1-8b-instant'),
    system: systemPrompt,
    messages: formattedMessages,
  });

  return result.toUIMessageStreamResponse();
=======
=======
>>>>>>> ff21f7e670d81b8880d3aab2c3d2c994a4b5b22c
    model: groq('llama3-8b-8192'),
    system: systemPrompt,
    messages,
  });

  return result.toTextStreamResponse();
<<<<<<< HEAD
>>>>>>> ff21f7e670d81b8880d3aab2c3d2c994a4b5b22c
=======
>>>>>>> ff21f7e670d81b8880d3aab2c3d2c994a4b5b22c
}