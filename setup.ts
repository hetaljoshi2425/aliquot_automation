import { test as base } from '@playwright/test';
import fs from 'fs'; // File system module to check if the file exists

export const test = base.extend({});

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status === 'passed') {
    // Screenshot
    const screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach('screenshot-on-pass', {
      body: screenshot,
      contentType: 'image/png',
    });

    // Video
    const videoPath = await page.video()?.path();
    if (videoPath) {
      await testInfo.attach('video-on-pass', {
        path: videoPath,
        contentType: 'video/webm',
      });
    }

    // Trace
    const tracePath = 'D:\Aliquot\test-results\customerCreate-Aliquot-Log-2c2c5-tem-and-open-system-details';
    
    // Check if the trace file exists before attaching
    if (fs.existsSync(tracePath)) {
      await testInfo.attach('trace-on-pass', {
        path: tracePath,
        contentType: 'application/zip',
      });
    } else {
      console.log('Trace file not found:', tracePath);
    }
  } else {
    // If failed, discard video to save space
    await page.video()?.delete();
  }
});

export { expect } from '@playwright/test';
