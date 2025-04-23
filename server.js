import { chromium } from 'playwright';
import axios from 'axios';

const URL = 'https://mypod.io.vn/';
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
    console.log(`[${new Date().toISOString()}] ✅ OK`);
  } catch (err) {
    const errorMsg = `[${new Date().toISOString()}] ❌ ERROR: ${err.message}`;
    await sendTelegramMessage(`❌ Lỗi truy cập ${URL} lúc ${new Date().toLocaleString()}\nError: ${err.message}`);
    console.error(errorMsg);
  } finally {
    await browser.close();
  }
}

// 👇 Đây là phần thêm vào để GitHub Action chạy trực tiếp
checkWebsite();
