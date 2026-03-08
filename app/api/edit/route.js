import { NextResponse } from "next/server";
// put
export async function PUT(req) {
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });
    const data = await req.text();
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: data },
      ],
      model: "liquid/lfm-2.5-1.2b-thinking:free",
      response_format: { type: "json_object" },
    });
    console.log("🚀 ~ POST ~ completion:", completion)
  
    const flashcards = JSON.parse(completion.choices[0].message.content);
  
    return NextResponse.json(flashcards.flashcards);
  }
// post

export async function POST(req) {
    
    const data = await req.newCard();
    const front = data.front
    const back = data.back
 
    return NextResponse.json(flashcards.flashcards);
  }
