const { chromium } = require('playwright');
const axios = require('axios');

// Cấu hình
const URL = 'https://mypod.io.vn/';
const TELEGRAM_BOT_TOKEN = '7746031974:AAEc_UxWbH953RQqJqqae1BS2AmzNhi4es0';
const TELEGRAM_CHAT_ID = '-4623133536';

async function sendTelegramMessage(message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  await axios.post(url, {
    chat_id: TELEGRAM_CHAT_ID,
    text: message,
  });
}

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(URL, { timeout: 15000 }); // timeout 15s
    console.log(`[${new Date().toISOString()}] Truy cập thành công.`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Lỗi:`, err.message);
    await sendTelegramMessage(`❌ Lỗi truy cập ${URL} lúc ${new Date().toLocaleString()}\nError: ${err.message}`);
  } finally {
    await browser.close();
  }
})();
