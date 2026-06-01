import puppeteer from 'https://esm.sh';

export default {
  async fetch(request, env) {
    const { searchParams } = new URL(request.url);
    let targetUrl = searchParams.get('url') || "https://example.com";

    try {
      // Launch browser via the binding defined in wrangler.toml
      const browser = await puppeteer.launch(env.MYBROWSER);
      const page = await browser.newPage();
      
      await page.setViewport({ width: 1280, height: 720 });
      await page.goto(targetUrl, { waitUntil: 'networkidle0' });
      
      const screenshotBuffer = await page.screenshot({ type: 'jpeg', quality: 85 });
      await browser.close();

      return new Response(screenshotBuffer, {
        headers: { 'Content-Type': 'image/jpeg' }
      });

    } catch (error) {
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  }
};
