const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Start frontend in background or assume it's running
  // Since I can't start it easily here without blocking, I'll assume it's running on port 5173
  // But wait, I need to start it.

  console.log('Connecting to frontend...');
  try {
      await page.goto('http://localhost:5173', { timeout: 10000 });
      console.log('Page loaded');

      // Check for "Trending Now" text
      const trendingText = await page.textContent('h2:has-text("Trending Now")');
      console.log('Found header:', trendingText);

      // Check color (computed style)
      const element = await page.locator('h2:has-text("Trending Now")');
      const color = await element.evaluate((el) => {
          return window.getComputedStyle(el).color;
      });
      console.log('Computed color:', color);

      if (color === 'rgb(255, 255, 255)') {
          console.log('SUCCESS: Color is white');
      } else {
          console.log('FAILURE: Color is ' + color);
          process.exit(1);
      }

  } catch (e) {
      console.error('Error:', e);
      process.exit(1);
  } finally {
      await browser.close();
  }
})();
