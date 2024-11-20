import * as ai from 'openai';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
export const generateTextV2 = onCall(async (request) => {
 try {
    const client = new ai.OpenAI({
        apiKey: `${process.env.OPENAI_API_KEY}`
    });
    const { messages } = request.data;
    const chatCompletion = await client.chat.completions.create({
      messages: messages,
      model: `${process.env.CHATGPT_MODEL}`,
    });
    const message = chatCompletion.choices[0].message.content;
    return { message }
 } catch(e) {
    throw new HttpsError('internal', `Internal Server Error: ${e}`);
 }
});
