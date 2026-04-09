import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // The user will provide credentials later, so this is a placeholder/mock of the external API logic.
    // Replace the URL and headers when credentials are provided.

    const baseUrl = process.env.LLM_API_BASE_URL || "https://api.openai.com/v1";
    const externalApiUrl = `${baseUrl}/chat/completions`;
    const apiKey = process.env.QWEN_CODE_API_KEY || process.env.EXTERNAL_LLM_API_KEY;

    if (!apiKey) {
      // Return a simulated spiritually grounded response if no API key is present
      const mockResponses = [
        "In the quiet of your mind, you will find the answers you seek. Breathe deeply and trust the journey.",
        "Your feelings are like clouds passing over the mountain of your soul. Let them drift, remaining rooted in peace.",
        "When the path is unclear, take a step softly. Wisdom reveals itself not in rushing, but in being present.",
        "You are exactly where you need to be. Embrace this moment with compassion.",
        "Seek the light within; even the smallest spark can illuminate the darkest night."
      ];
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      return NextResponse.json({
        role: "assistant",
        content: `(Simulated) ${randomResponse}`
      });
    }

    const response = await fetch(externalApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "coder-model",
        messages: [
          {
            role: "system",
            content: "You are a spiritually grounded conversational assistant. Respond thoughtfully, with deep empathy and spiritual wisdom."
          },
          ...messages
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`External API error: ${errorData}`);
    }

    const data = await response.json();
    return NextResponse.json({
      role: "assistant",
      content: data.choices[0].message.content
    });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("API error:", errorMsg);
    return NextResponse.json({ error: "Failed to fetch response." }, { status: 500 });
  }
}
