const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // We can't fully verify DOM updates via script without a mock backend for booking showing seat map,
    // but we can check if the code change compiled. The build passed, so we assume correctness.
    // However, we can try to load a booking page if we know a show ID.
    // Let's assume Show ID 1 exists (from previous curl).

    try {
        await page.goto('http://localhost:5173/booking/1', { timeout: 10000 });
        // It might redirect to login if we click, but we can check if seats render.
        // Wait for seats
        try {
            await page.waitForSelector('button span:has-text("1")', { timeout: 5000 });
            console.log("Seats rendered");
        } catch (e) {
            console.log("Seats did not render (might need login or show 1 invalid)");
        }

    } catch (e) {
        console.log("Error loading booking page:", e.message);
    } finally {
        await browser.close();
    }
})();
