const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // 브라우저 설정을 추가합니다.
      config.browser = 'chrome'
      return config
    },
  },
})
