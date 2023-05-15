import express from 'express'
import * as dotenv from 'dotenv'
dotenv.config()
import { ivr , GptToTwilio } from "./functions.js"

const app = express();
const port = 3000;

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.post('/voice', (req, res) => {
  ivr(res)
});

app.post('/gpt', async (req, res) => {
  res.send(await GptToTwilio(req))
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});