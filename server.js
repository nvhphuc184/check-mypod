import { chromium } from 'playwright';
import axios from 'axios';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Danh sách các URL cần kiểm tra
const URLS = [
  'https://mypod.io.vn/',
];

async function sendTelegramMessage(message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  await axios.post(url, { chat_id: TELEGRAM_CHAT_ID, text: message });
}

async function checkWebsite(url) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log(`🧭 Đang kiểm tra: ${url}`);
    await page.goto(url, { timeout: 15000 });
    console.log(`[${new Date().toISOString()}] ✅ OK: ${url}`);
  } catch (err) {
    const errorMsg = `[${new Date().toISOString()}] ❌ ERROR on ${url}: ${err.message}`;

    const vnTime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    await sendTelegramMessage(`❌ Lỗi truy cập ${url} lúc ${vnTime}\nError: ${err.message}`);

    console.error(errorMsg);
  } finally {
    await browser.close();
  }
}

// 👇 Kiểm tra tất cả URL
async function runChecks() {
  for (const url of URLS) {
    await checkWebsite(url);
  }
}

runChecks();
