import express from 'express';
import { chromium } from 'playwright';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3000;

const URL = 'https://mypod.io.vn.sai-url/';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function sendTelegramMessage(message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  await axios.post(url, { chat_id: TELEGRAM_CHAT_ID, text: message });
}

async function checkWebsite() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(URL, { timeout: 15000 });
    return `[${new Date().toISOString()}] ✅ OK`;
  } catch (err) {
    const errorMsg = `[${new Date().toISOString()}] ❌ ERROR: ${err.message}`;
    await sendTelegramMessage(`❌ Lỗi truy cập ${URL} lúc ${new Date().toLocaleString()}\nError: ${err.message}`);
    return errorMsg;
  } finally {
    await browser.close();
  }
}

// Endpoint cho EasyCron gọi
app.get('/check', async (req, res) => {
  const result = await checkWebsite();
  res.send(result);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
