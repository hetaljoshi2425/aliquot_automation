git /**
 * Video Recording Helper Functions
 * Provides utilities for managing video recording in Playwright tests
 */

/**
 * Start video recording for a specific test step
 * @param {Page} page - Playwright page object
 * @param {string} stepName - Name of the test step for video identification
 */
async function startVideoRecording(page, stepName) {
  try {
    // This is a placeholder for custom video recording logic
    // Playwright automatically handles video recording based on config
    console.log(`🎥 Starting video recording for step: ${stepName}`);
    
    // You can add custom video recording logic here if needed
    // For example, using page.video() to get video object
    
    return true;
  } catch (error) {
    console.error('Failed to start video recording:', error);
    return false;
  }
}

/**
 * Get video file path for the current test
 * @param {TestInfo} testInfo - Playwright test info object
 * @returns {string} Path to the video file
 */
function getVideoPath(testInfo) {
  if (testInfo.video) {
    return testInfo.video.path();
  }
  return null;
}

/**
 * Check if video recording is enabled
 * @param {TestInfo} testInfo - Playwright test info object
 * @returns {boolean} True if video recording is enabled
 */
function isVideoEnabled(testInfo) {
  return testInfo.video !== null;
}

/**
 * Get video metadata for the current test
 * @param {TestInfo} testInfo - Playwright test info object
 * @returns {Object} Video metadata
 */
function getVideoMetadata(testInfo) {
  if (!testInfo.video) {
    return null;
  }
  
  return {
    path: testInfo.video.path(),
    size: testInfo.video.size(),
    duration: testInfo.video.duration(),
    format: 'mp4'
  };
}

/**
 * Attach video to test report
 * @param {TestInfo} testInfo - Playwright test info object
 * @param {string} name - Name for the video attachment
 */
function attachVideoToReport(testInfo, name = 'Test Video') {
  if (testInfo.video) {
    testInfo.attach(name, {
      path: testInfo.video.path(),
      contentType: 'video/mp4'
    });
  }
}

/**
 * Clean up video files (useful for CI environments)
 * @param {TestInfo} testInfo - Playwright test info object
 * @param {boolean} keepOnFailure - Whether to keep videos for failed tests
 */
async function cleanupVideo(testInfo, keepOnFailure = true) {
  if (testInfo.video && (!keepOnFailure || testInfo.status === 'passed')) {
    try {
      // Playwright automatically handles video cleanup based on config
      console.log('🧹 Video cleanup handled by Playwright configuration');
    } catch (error) {
      console.error('Failed to cleanup video:', error);
    }
  }
}

/**
 * Get video configuration summary
 * @param {TestInfo} testInfo - Playwright test info object
 * @returns {Object} Video configuration summary
 */
function getVideoConfigSummary(testInfo) {
  return {
    enabled: isVideoEnabled(testInfo),
    path: getVideoPath(testInfo),
    metadata: getVideoMetadata(testInfo),
    status: testInfo.status,
    testName: testInfo.title
  };
}

module.exports = {
  startVideoRecording,
  getVideoPath,
  isVideoEnabled,
  getVideoMetadata,
  attachVideoToReport,
  cleanupVideo,
  getVideoConfigSummary
};
