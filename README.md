# Playwright TypeScript Testing Framework

A comprehensive Playwright testing framework with TypeScript, Page Object Model, and Allure reporting.

## Features

- **TypeScript**: Strong typing and better maintainability
- **Page Object Model (POM)**: Clean separation of concerns and reusable locators/actions
- **Allure Reporting**: Rich HTML reports with detailed test information
- **BasePage**: Common actions (navigate, getTitle, validateURL)
- **Playwright's built-in expect**: No extra library needed
- **Multiple Browser Support**: Chrome, Firefox, Safari, Edge
- **Mobile Testing**: Responsive design testing
- **Parallel Execution**: Fast test execution

## Project Structure

```
├── tests/
│   ├── Customers.spec.ts
│   ├── Dashboard.spec.ts
│   ├── Inventory.spec.ts
│   ├── Reports-components.spec.ts
│   ├── Reports-surveys.spec.ts
│   ├── Reports.spec.ts
│   ├── Site-Management.spec.ts
│   └── Utilities.spec.ts
├── pages/
│   ├── BasePage.ts
│   └── LoginPage.ts
├── utils/
│   ├── config.ts
│   └── testSetup.ts
├── scripts/
│   ├── deploy-to-netlify.sh
│   └── netlify-build.sh
├── playwright.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npm run install:browsers
```

## Usage

### Running Tests

```bash
# Run all tests
npm test

# Run tests in headed mode
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run tests with UI
npm run test:ui

# Run tests with QA credentials
npm run test:qa

# Run tests with QA credentials in headed mode
npm run test:qa:headed
```

### Generating Reports

```bash
# Generate Allure report
npm run test:generate-report

# Open Allure report
npm run test:open-report

# Serve Allure report
npm run test:report
```

## Page Object Model

### BasePage
Contains common actions and utilities:
- `navigateTo(path)` - Navigate to a specific URL
- `getTitle()` - Get page title
- `validateURL(expectedUrl)` - Validate current URL
- `waitForElement(locator)` - Wait for element to be visible
- `clickAndWaitForNavigation(locator)` - Click and wait for navigation

### LoginPage
Authentication functionality:
- `goto()` - Navigate to login page
- `loginWithValidCredentials()` - Login with QA credentials
- `loginWithCredentials(email, password)` - Login with custom credentials
- `fillEmail(email)` - Fill email field
- `fillPassword(password)` - Fill password field
- `clickLoginButton()` - Submit login form
- `hasErrorMessage()` - Check for error messages
- `getErrorMessage()` - Get error message text

### TestSetup
Authentication management utilities:
- `loginWithValidCredentials()` - Perform login with QA credentials
- `ensureLoggedIn()` - Check login status and login if needed
- `isLoggedIn()` - Check if user is currently logged in
- `logout()` - Logout from the application
- `setupAuthenticatedTest()` - Setup authentication for tests
- `cleanupAfterTest()` - Cleanup after test completion

## Configuration

### Environment Variables
The framework uses environment variables for QA testing. Copy `env.example` to `.env` and configure:

#### Required Variables:
- `ALIQUOT_BASE_URL_QA` - QA environment URL
- `ALIQUOT_USERNAME_QA` - Username for authentication
- `ALIQUOT_PASSWORD_QA` - Password for authentication

#### Optional Variables:
- `HEADLESS` - Set to 'true' to run in headless mode
- `CI` - Automatically set in CI environments

### Environment Setup
1. Copy `env.example` to `.env`
2. Fill in your actual QA credentials and URL
3. Run tests with `npm run test:qa`

### Security
- Never commit `.env` file to version control
- Use environment variables in CI/CD pipelines
- Keep credentials secure and rotate regularly

### Test Configuration
The framework automatically uses environment variables. No hardcoded values:

- **Base URL**: Set via `ALIQUOT_BASE_URL_QA` environment variable
- **Credentials**: Set via `ALIQUOT_USERNAME_QA` and `ALIQUOT_PASSWORD_QA`
- **Timeouts**: Configurable in `utils/config.ts`
- **Test Data**: Uses environment variables for authentication

## Allure Reporting

The framework includes comprehensive Allure reporting:

- **Test Steps**: Detailed step-by-step execution
- **Screenshots**: Automatic screenshots on failure
- **Videos**: Video recordings of test execution
- **Traces**: Detailed execution traces
- **Environment Info**: System and browser information

## Deployment

### Netlify Deployment
The framework includes complete Netlify deployment setup:

#### **Automatic Deployment:**
1. Connect your repository to Netlify
2. Set environment variables in Netlify dashboard
3. Push to repository - automatic deployment

#### **Manual Deployment:**
```bash
# Generate report and deploy
npm run test:qa
npm run test:generate-report
npm run netlify:deploy
```

#### **Configuration:**
- `netlify.toml` - Netlify build configuration
- `scripts/netlify-build.sh` - Build script
- `scripts/deploy-to-netlify.sh` - Deployment script

See `README-NETLIFY.md` for detailed deployment instructions.

## Test Structure

The framework focuses on testing application functionality with automatic authentication:

### 1. **Authentication Setup**
- Tests automatically start with login authentication
- No need for separate authentication tests
- Session management handled automatically

### 2. **Application Functionality Tests**
- Focus on core application features
- Page functionality verification
- Navigation testing
- Responsiveness testing
- Performance testing

### 3. **Test Organization**
- `Customers.spec.ts` - Customer management tests
- `Dashboard.spec.ts` - Dashboard functionality tests
- `Inventory.spec.ts` - Inventory management tests
- `Reports.spec.ts` - Reporting functionality tests
- `Site-Management.spec.ts` - Site management tests
- `Utilities.spec.ts` - Utility functions tests

## Best Practices

1. **Use Page Objects**: Keep locators and actions in page objects
2. **Extend BasePage**: Use common functionality from BasePage
3. **Use Allure Steps**: Wrap test actions in allure.step()
4. **Wait for Elements**: Always wait for elements before interacting
5. **Use Data Attributes**: Prefer data-testid attributes for selectors
6. **Handle Async Operations**: Use proper async/await patterns
7. **Focus on Functionality**: Test core application features
8. **Automatic Authentication**: Let framework handle login automatically

## Troubleshooting

### Common Issues

1. **Browser Installation**: Run `npm run install:browsers`
2. **TypeScript Errors**: Check `tsconfig.json` configuration
3. **Allure Reports**: Ensure `allure-results` folder exists
4. **Timeout Issues**: Adjust timeout values in config

### Debug Mode
```bash
npm run test:debug
```

This opens the Playwright Inspector for step-by-step debugging.

## Next Steps

### 🚀 **Getting Started on New Machines**

1. **Clone the repository**:
   ```bash
   git clone https://github.com/hetaljoshi2425/aliquot_automation.git
   cd aliquot_automation
   ```

2. **Set up environment**:
   ```bash
   # Copy environment template
   cp env.example .env
   
   # Fill in your actual credentials in .env file:
   # ALIQUOT_BASE_URL_QA=https://qa.aliquot.live/
   # ALIQUOT_USERNAME_QA=your_username@example.com
   # ALIQUOT_PASSWORD_QA=your_password
   
   # Install dependencies
   npm install
   
   # Install Playwright browsers
   npm run install:browsers
   ```

3. **Run tests**:
   ```bash
   # Run all tests in headed mode (recommended for development)
   npm run test:qa:headed
   
   # Run all tests in headless mode (for CI/CD)
   npm run test:qa:headless
   
   # Run specific test files
   npx playwright test tests/Utilities.spec.ts --project=chromium-headed
   npx playwright test tests/Site-Management.spec.ts --project=chromium-headed
   ```

4. **Deploy to Netlify** (if needed):
   ```bash
   # Generate test reports
   npm run test:qa
   npm run test:generate-report
   
   # Deploy to Netlify
   npm run netlify:deploy
   ```

### 📊 **Test Execution Options**

```bash
# Development and debugging
npm run test:qa:headed          # Run with browser visible
npm run test:debug              # Debug mode with Playwright Inspector
npm run test:ui                 # Playwright UI mode

# CI/CD and automation
npm run test:qa:headless        # Run without browser UI
npm run test:qa:both            # Run both headed and headless

# Reporting
npm run test:generate-report    # Generate Allure reports
npm run test:open-report        # Open Allure reports
npm run test:report             # Serve Allure reports
```

### 🔧 **Environment Configuration**

Create a `.env` file with your credentials:
```bash
# Required Environment Variables
ALIQUOT_BASE_URL_QA=https://qa.aliquot.live/
ALIQUOT_USERNAME_QA=your_username@example.com
ALIQUOT_PASSWORD_QA=your_password

# Optional Configuration
HEADLESS=false
CI=false
```

### 🚀 **Quick Start Commands**

```bash
# 1. Clone and setup
git clone https://github.com/hetaljoshi2425/aliquot_automation.git
cd aliquot_automation
cp env.example .env
# Edit .env with your credentials

# 2. Install and run
npm install
npm run install:browsers
npm run test:qa:headed

# 3. View results
npm run test:generate-report
npm run test:open-report
```

## Contributing

1. Follow the Page Object Model pattern
2. Add proper TypeScript types
3. Include Allure steps in tests
4. Update documentation for new features
