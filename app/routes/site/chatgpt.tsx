import { LoaderArgs, redirect } from "@remix-run/node";
import { Configuration, OpenAIApi } from "openai";
import { json } from "react-router";
import { getUserId } from "~/server/cookie.server";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY as string,
});

const openai = new OpenAIApi(config);

async function getChatGptResponse(prompt: string) {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: "Please keep response to a few sentences in a casual tone.",
      },
      { role: "user", content: prompt },
    ],
  });
  return response.data?.choices.map((c) => c.message?.content);
}

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);
  if (!userId) {
    return redirect("/auth/login");
  }
  const prompt = new URL(request.url).searchParams.get("prompt");
  const choices = await getChatGptResponse(prompt as string);
  return json({ choices });
};
