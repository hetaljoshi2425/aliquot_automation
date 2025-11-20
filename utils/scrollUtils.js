/**
 * Scroll Utilities for Playwright Tests
 * Various methods to scroll pages in different ways
 */

/**
 * Scroll to the bottom of the page
 * @param {Page} page - Playwright page object
 * @param {number} waitTime - Time to wait after scrolling (default: 1000ms)
 */
export const scrollToBottom = async (page, waitTime = 1000) => {
  console.log('📜 Scrolling to bottom of page...');
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForTimeout(waitTime);
  console.log('✅ Scrolled to bottom');
};

/**
 * Scroll to the top of the page
 * @param {Page} page - Playwright page object
 * @param {number} waitTime - Time to wait after scrolling (default: 500ms)
 */
export const scrollToTop = async (page, waitTime = 500) => {
  console.log('📜 Scrolling to top of page...');
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(waitTime);
  console.log('✅ Scrolled to top');
};

/**
 * Scroll to a specific element
 * @param {Page} page - Playwright page object
 * @param {string} selector - Element selector
 * @param {number} waitTime - Time to wait after scrolling (default: 1000ms)
 */
export const scrollToElement = async (page, selector, waitTime = 1000) => {
  console.log(`📜 Scrolling to element: ${selector}`);
  await page.locator(selector).scrollIntoViewIfNeeded();
  await page.waitForTimeout(waitTime);
  console.log('✅ Scrolled to element');
};

/**
 * Scroll by a specific amount (pixels)
 * @param {Page} page - Playwright page object
 * @param {number} x - Horizontal scroll amount
 * @param {number} y - Vertical scroll amount
 * @param {number} waitTime - Time to wait after scrolling (default: 500ms)
 */
export const scrollBy = async (page, x = 0, y = 0, waitTime = 500) => {
  console.log(`📜 Scrolling by: x=${x}, y=${y}`);
  await page.evaluate(({ x, y }) => {
    window.scrollBy(x, y);
  }, { x, y });
  await page.waitForTimeout(waitTime);
  console.log('✅ Scrolled by specified amount');
};

/**
 * Scroll to a specific position
 * @param {Page} page - Playwright page object
 * @param {number} x - Horizontal position
 * @param {number} y - Vertical position
 * @param {number} waitTime - Time to wait after scrolling (default: 500ms)
 */
export const scrollTo = async (page, x = 0, y = 0, waitTime = 500) => {
  console.log(`📜 Scrolling to position: x=${x}, y=${y}`);
  await page.evaluate(({ x, y }) => {
    window.scrollTo(x, y);
  }, { x, y });
  await page.waitForTimeout(waitTime);
  console.log('✅ Scrolled to position');
};

/**
 * Smooth scroll to bottom (gradual scrolling)
 * @param {Page} page - Playwright page object
 * @param {number} stepSize - Pixels to scroll per step (default: 100)
 * @param {number} stepDelay - Delay between steps in ms (default: 50)
 */
export const smoothScrollToBottom = async (page, stepSize = 100, stepDelay = 50) => {
  console.log('📜 Smooth scrolling to bottom...');
  
  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  const viewportHeight = await page.evaluate(() => window.innerHeight);
  const totalSteps = Math.ceil(scrollHeight / stepSize);
  
  for (let i = 0; i < totalSteps; i++) {
    await page.evaluate((step) => {
      window.scrollTo(0, step);
    }, i * stepSize);
    await page.waitForTimeout(stepDelay);
  }
  
  // Final scroll to bottom
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  
  console.log('✅ Smooth scroll to bottom completed');
};

/**
 * Scroll through the entire page and take screenshots at intervals
 * @param {Page} page - Playwright page object
 * @param {string} baseFileName - Base name for screenshot files
 * @param {number} interval - Scroll interval in pixels (default: 500)
 */
export const scrollAndScreenshot = async (page, baseFileName, interval = 500) => {
  console.log('📜 Scrolling through page and taking screenshots...');
  
  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  const viewportHeight = await page.evaluate(() => window.innerHeight);
  const totalScreenshots = Math.ceil(scrollHeight / interval);
  
  for (let i = 0; i < totalScreenshots; i++) {
    const scrollPosition = i * interval;
    
    await page.evaluate((position) => {
      window.scrollTo(0, position);
    }, scrollPosition);
    
    await page.waitForTimeout(500);
    
    const screenshotName = `${baseFileName}-scroll-${i + 1}.png`;
    await page.screenshot({ path: screenshotName, fullPage: false });
    console.log(`📸 Screenshot saved: ${screenshotName}`);
  }
  
  console.log('✅ Scroll and screenshot completed');
};

/**
 * Get current scroll position
 * @param {Page} page - Playwright page object
 * @returns {Object} Object with x and y scroll positions
 */
export const getScrollPosition = async (page) => {
  const position = await page.evaluate(() => ({
    x: window.pageXOffset || window.scrollX,
    y: window.pageYOffset || window.scrollY
  }));
  console.log(`📜 Current scroll position: x=${position.x}, y=${position.y}`);
  return position;
};

/**
 * Check if page is scrollable
 * @param {Page} page - Playwright page object
 * @returns {boolean} True if page is scrollable
 */
export const isPageScrollable = async (page) => {
  const isScrollable = await page.evaluate(() => {
    return document.body.scrollHeight > window.innerHeight;
  });
  console.log(`📜 Page is scrollable: ${isScrollable}`);
  return isScrollable;
};
