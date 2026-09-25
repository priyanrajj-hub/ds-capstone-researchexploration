const { chromium } = require('playwright');
(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    console.log("Navigating to bfs-nhop...");
    await page.goto('http://localhost:3000/algorithms/bfs-nhop');
    await page.waitForTimeout(2000);
    console.log("Clicking 3D WebGL...");
    try {
        await page.click('text="3D WebGL"');
    } catch (e) {
        console.log("Failed to click 3D WebGL mode", e.message);
    }
    await page.waitForTimeout(3000);
    await browser.close();
})();
