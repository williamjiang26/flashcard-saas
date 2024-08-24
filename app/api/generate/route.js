import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `
You are a flashcard creator, you take in text and create multiple flashcards from it. 
Make sure to create exactly 10 flashcards.
Both front and back should be one sentence long.

You should return in the following JSON format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
Make sure to return pure JSON.
The front should be a question.
The back should be the answer to the question.
`;

export async function POST(req) {
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
  model: "mistralai/mistral-7b-instruct:free",
  response_format: { type: "json_object" },
 });
 console.log(completion.choices[0].message.content);
 const flashcards = JSON.parse(completion.choices[0].message.content);

 return NextResponse.json(flashcards.flashcards);
}
