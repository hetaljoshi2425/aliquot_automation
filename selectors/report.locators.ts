  export const ReportLocators = {
      systemDropdown: '[data-testid="system-dropdown"]',
      reportTypeDropdown: '[data-testid="report-type-dropdown"]',
      reportTemplateDropdown: '[data-testid="report-template-dropdown"]',
      reportTitleInput: '[data-testid="report-title-input"]',
      toggleDriveTime: '[data-testid="toggle-drive-time"]',
      toggleReportNumber: '[data-testid="toggle-report-number"]',
      toggleInventory: '[data-testid="toggle-inventory"]',
      createReportBtn: '[data-testid="create-report-btn"]',
      testResultInput: (testName: string) => `[data-testid="test-${testName}-input"]`,
      testCommentBtn: (testName: string) => `[data-testid="test-${testName}-comment-btn"]`,
      commentWindow: '[data-testid="comment-window"]',
      commentField: '[data-testid="comment-field"]',
      attachmentsField: '[data-testid="attachments-field"]',
      lastThreeResults: '[data-testid="last-three-results"]',
      reportPhrasesBtn: '[data-testid="report-phrases-btn"]',
      phraseItem: (phrase: string) => `[data-testid="phrase-${phrase}"]`,
      addPhraseBtn: '[data-testid="add-phrase-btn"]',
      inventoryInput: '[data-testid="inventory-input"]',
      saveDraftBtn: '[data-testid="save-draft-btn"]',
      reportList: '[data-testid="report-list"]'
    };
    