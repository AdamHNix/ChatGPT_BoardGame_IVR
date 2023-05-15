import * as dotenv from 'dotenv'
dotenv.config()
import twilio from 'twilio'
import { Configuration, OpenAIApi } from "openai";

const VoiceResponse = twilio.twiml.VoiceResponse
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const descriptor = `You are an AI programmed to act like an employee at a small, local boardgame store. 
Your purpose is to provide suggestions for customers in regards to what game they should play after prompted. 
2-3 options and say which makes the most sense for this requester based on their question. 
When responding, take into consideration the top 100 board games from this web page https://boardgamegeek.com/browse/boardgame. 
You can suggest games outside of this web page if necessary, but should prioritize these if possible. 
If the prompt does not seem to be related to board games, just tell the customer that the request is outside of the scope of your abilities.
Let's start now. Respond to this customer's comment or question as if you were talking to them in person: `


async function ivr(response){
    const twiml = new VoiceResponse();
    const gather = twiml.gather({
      input: "speech",
      action: "/gpt"
    }
    );
    gather.say({voice: "Polly.Kimberly"}, 
    `Hi there! This is a hotline to determine what board game you should try out. This is powered by ChatGPT. 
    Try telling me the type of game you would be interested in and I will respond with some suggestions. 
    Be as descriptive as possible.`)
    response.send(twiml.toString())
  }

async function chatGPT(prompt) {
    prompt = descriptor + prompt
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 2048,
      temperature: 0.8
    });
    let gptResponse = (completion.data.choices[0].text)
    return gptResponse
  }
  
async function GptToTwilio(request) {
    const gpt = request.body.SpeechResult
    const reply = (await chatGPT(gpt))
    const twiml = new VoiceResponse();
    twiml.say({voice: "Polly.Kimberly"}, reply)
    return twiml.toString()
  }

  export { ivr , GptToTwilio}