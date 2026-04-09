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
        "«Придите ко Мне все труждающиеся и обремененные, и Я успокою вас» (Мф. 11:28). Не отчаивайтесь, доверьте свои тревоги Господу.",
        "Святые Отцы учат, что гордость и печаль часто ходят рядом. Как говорил преподобный Серафим Саровский: «Стяжи дух мирен, и тогда тысяча душ спасется около тебя».",
        "В любой непонятной ситуации самое верное — помолиться: «Господи, Иисусе Христе, Сыне Божий, помилуй мя грешнаго» / «грешную».",
        "Для чтения на каждый день лучше всего подходит Евангелие. Откройте любую главу — и Бог обязательно ответит на ваши сокровенные мысли.",
        "Не будем забывать, что всё посылается нам либо по воле Божией, либо по Его попущению для нашего укрепления."
      ];
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      return NextResponse.json({
        role: "assistant",
        content: `(Пробный ответ) ${randomResponse}`
      });
    }

    const response = await fetch(externalApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "qwen-code", // placeholder model
        messages: [
          {
            role: "system",
            content: "Ты — православный собеседник и наставник. Отвечай на вопросы пользователя с любовью, глубоким духовным рассуждением и состраданием, опираясь строго на Священное Писание (особенно Евангелие), учение Святых Отцов и традиции Православной Церкви. Избегай эзотерики и абстрактной духовности."
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
