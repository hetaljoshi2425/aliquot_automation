# Netlify Deployment for Allure Reports

This guide explains how to deploy Allure test reports to Netlify for easy sharing and access.

## 🚀 Quick Setup

### 1. **Connect to Netlify**
- Go to [netlify.com](https://netlify.com)
- Connect your GitHub repository
- Netlify will automatically detect the `netlify.toml` configuration

### 2. **Set Environment Variables**
In your Netlify dashboard, go to Site Settings > Environment Variables and add:

```
ALIQUOT_BASE_URL_QA=https://qa.aliquot.live/
ALIQUOT_USERNAME_QA=your_username@example.com
ALIQUOT_PASSWORD_QA=your_password
```

### 3. **Deploy**
- Netlify will automatically build and deploy when you push to your repository
- Or trigger a manual deploy from the Netlify dashboard

## 📋 Build Process

The Netlify build process:

1. **Install Dependencies** - Installs npm packages
2. **Install Browsers** - Downloads Playwright browsers
3. **Run Tests** - Executes test suite against QA environment
4. **Generate Report** - Creates Allure HTML report
5. **Deploy** - Publishes report to Netlify

## 🔧 Configuration Files

### `netlify.toml`
- Build configuration for Netlify
- Specifies build command and publish directory
- Sets up redirects and caching headers

### `scripts/netlify-build.sh`
- Build script that runs during Netlify deployment
- Handles the complete test execution and report generation

### `scripts/deploy-to-netlify.sh`
- Local deployment script for testing
- Validates environment variables
- Generates report locally

## 🎯 Usage

### **Automatic Deployment:**
```bash
# Push to your repository
git add .
git commit -m "Update tests"
git push origin main
# Netlify automatically builds and deploys
```

### **Manual Deployment:**
```bash
# Run tests and generate report locally
npm run test:qa
npm run test:generate-report

# Deploy to Netlify (if using Netlify CLI)
netlify deploy --prod --dir=allure-report
```

### **Local Testing:**
```bash
# Test the build process locally
npm run netlify:build

# Preview report locally
npm run test:report
```

## 🔒 Security

### **Environment Variables:**
- Never commit credentials to repository
- Set sensitive variables in Netlify dashboard
- Use environment variables for all configuration

### **Access Control:**
- Netlify provides password protection options
- Can restrict access to specific users
- IP whitelisting available for enterprise

## 📊 Report Features

### **Rich HTML Reports:**
- Interactive test results
- Screenshots and videos on failure
- Test execution timeline
- Environment information
- Performance metrics

### **Sharing:**
- Share via Netlify URL
- Embed in documentation
- Download reports
- Historical test runs

## 🛠️ Troubleshooting

### **Build Failures:**
- Check environment variables are set
- Verify QA environment is accessible
- Check browser installation logs
- Review test execution logs

### **Report Issues:**
- Ensure tests run successfully
- Check Allure report generation
- Verify file permissions
- Review Netlify build logs

### **Common Issues:**
1. **Missing Environment Variables** - Set in Netlify dashboard
2. **Browser Installation** - May take time on first build
3. **Test Failures** - Check QA environment accessibility
4. **Report Generation** - Ensure Allure is properly configured

## 📈 Benefits

### **Easy Sharing:**
- Share test results via URL
- No local setup required for viewers
- Accessible from anywhere
- Mobile-friendly reports

### **Automation:**
- Automatic deployment on code changes
- Scheduled test runs possible
- Integration with CI/CD pipelines
- Historical test data

### **Professional Reports:**
- Rich HTML interface
- Interactive test results
- Screenshots and videos
- Performance metrics
- Environment details

## 🔗 Useful Links

- [Netlify Documentation](https://docs.netlify.com/)
- [Allure Framework](https://allurereport.org/)
- [Playwright Testing](https://playwright.dev/)
- [Environment Variables](https://docs.netlify.com/environment-variables/overview/)
