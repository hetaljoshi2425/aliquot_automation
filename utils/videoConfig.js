/**
 * Video Recording Configuration Utility
 * Manages video recording settings for Playwright tests
 */

const videoConfig = {
  // Default video settings
  default: {
    mode: 'on',
    size: { width: 1280, height: 720 },
    format: 'mp4',
    quality: 'medium'
  },

  // Video recording modes
  modes: {
    // Record video for every test
    always: 'on',
    // Only keep videos for failed tests (saves disk space)
    onFailure: 'retain-on-failure',
    // Record video only on retry
    onRetry: 'on-first-retry',
    // No video recording
    off: 'off'
  },

  // Video quality presets
  quality: {
    low: {
      width: 854,
      height: 480,
      bitrate: '1000k'
    },
    medium: {
      width: 1280,
      height: 720,
      bitrate: '2000k'
    },
    high: {
      width: 1920,
      height: 1080,
      bitrate: '4000k'
    }
  },

  // Get video configuration for specific test scenarios
  getConfig(mode = 'default', quality = 'medium') {
    const baseConfig = {
      video: this.modes[mode] || this.default.mode,
      videoSize: this.quality[quality] || this.default.size
    };

    return baseConfig;
  },

  // Get video configuration for CI environments (optimized for storage)
  getCIConfig() {
    return {
      video: 'retain-on-failure', // Only keep videos for failed tests in CI
      videoSize: this.quality.medium,
      videoFormat: 'mp4'
    };
  },

  // Get video configuration for local development
  getLocalConfig() {
    return {
      video: 'on', // Record all tests locally
      videoSize: this.quality.high,
      videoFormat: 'mp4'
    };
  }
};

module.exports = videoConfig;
