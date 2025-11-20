#!/usr/bin/env node

/**
 * Data-TestId Attribute Addition Script
 * 
 * This script helps identify and add data-testid attributes to your application codebase.
 * It provides templates and examples for different frameworks and elements.
 */

const fs = require('fs');
const path = require('path');

// Data-testid mappings based on your selector system
const dataTestIdMappings = {
  // Login Page Elements
  login: {
    'login-form': 'Main login form container',
    'username-input': 'Username/email input field',
    'password-input': 'Password input field',
    'login-button': 'Login submit button',
    'login-error-message': 'Error message display',
    'login-success-message': 'Success message display',
    'login-loading-spinner': 'Loading spinner during login'
  },

  // Home Page Elements
  home: {
    'home-page-title': 'Home page title/heading',
    'dashboard-tab': 'Dashboard navigation tab',
    'my-dashboards-menu': 'My Dashboards dropdown menu',
    'trends-charting-link': 'Trends Charting navigation link',
    'utilities-tab': 'Utilities navigation tab',
    'site-management-menu': 'Site Management menu',
    'search-form': 'Main search form',
    'search-input': 'Search input field',
    'client-search-input': 'Client search input',
    'customer-search-input': 'Customer search input',
    'facility-search-input': 'Facility search input',
    'building-search-input': 'Building search input',
    'manage-types-button': 'Manage Types button',
    'clear-filters-button': 'Clear Filters button',
    'manage-buildings-button': 'Manage Buildings button',
    'select-customer-button': 'Select Customer button',
    'select-facility-button': 'Select Facility button',
    'select-building-button': 'Select Building button',
    'show-all-tab': 'Show All tab',
    'user-management-tab': 'User Management tab',
    'client-dropdown': 'Client selection dropdown',
    'customer-dropdown': 'Customer selection dropdown',
    'facility-dropdown': 'Facility selection dropdown',
    'building-dropdown': 'Building selection dropdown',
    'system-dropdown': 'System selection dropdown',
    'test-types-list': 'Test Types list',
    'client-list': 'Client list table',
    'customer-list': 'Customer list table',
    'client-name-display': 'Displayed client name',
    'success-message': 'Success message display',
    'error-message': 'Error message display',
    'page-loading-spinner': 'Page loading spinner'
  },

  // Trends Charting Page Elements
  trends: {
    'trends-page-title': 'Trends Charting page title',
    'filter-form': 'Filter form container',
    'template-form': 'Template form container',
    'manage-template-button': 'Manage Template button',
    'save-as-template-button': 'Save as Template button',
    'generate-graph-button': 'Generate Graph button',
    'clear-filters-button': 'Clear Filters button',
    'filter-customer-input': 'Filter Customer input field',
    'template-name-input': 'Template Name input field',
    'date-from-input': 'Date From input field',
    'date-to-input': 'Date To input field',
    'client-dropdown': 'Client selection dropdown',
    'customer-dropdown': 'Customer selection dropdown',
    'facility-dropdown': 'Facility selection dropdown',
    'building-dropdown': 'Building selection dropdown',
    'system-dropdown': 'System selection dropdown',
    'source-dropdown': 'Data Source selection dropdown',
    'component-dropdown': 'Component selection dropdown',
    'test-dropdown': 'Test selection dropdown',
    'template-dropdown': 'Template selection dropdown',
    'template-modal': 'Template Management modal',
    'template-success-message': 'Template success message',
    'template-error-message': 'Template error message',
    'graph-error-message': 'Graph error message',
    'graph-loading-spinner': 'Graph loading spinner',
    'template-loading-spinner': 'Template loading spinner',
    'trends-graph': 'Trends graph canvas'
  },

  // Client Management Page Elements
  client: {
    'client-page-title': 'Client Management page title',
    'client-form': 'Client form container',
    'client-search-form': 'Client search form',
    'create-client-button': 'Create Client button',
    'save-client-button': 'Save Client button',
    'update-client-button': 'Update Client button',
    'edit-client-button': 'Edit Client button',
    'delete-client-button': 'Delete Client button',
    'search-button': 'Search button',
    'clear-filters-button': 'Clear Filters button',
    'client-name-input': 'Client Name input field',
    'address-input': 'Address input field',
    'phone-input': 'Phone Number input field',
    'email-input': 'Email input field',
    'max-drafts-input': 'Max Drafts input field',
    'legal-statement-input': 'Legal Statement input field',
    'client-search-input': 'Client search input field',
    'timezone-dropdown': 'Timezone selection dropdown',
    'client-list-table': 'Client list table',
    'client-table-row': 'Client table row',
    'delete-confirmation-modal': 'Delete confirmation modal',
    'client-modal': 'Client details modal',
    'client-created-success-message': 'Client created success message',
    'client-updated-success-message': 'Client updated success message',
    'client-deleted-success-message': 'Client deleted success message',
    'validation-error-message': 'Validation error message',
    'client-loading-spinner': 'Client loading spinner'
  },

  // Customer Management Page Elements
  customer: {
    'customer-page-title': 'Customer Management page title',
    'customer-form': 'Customer form container',
    'customer-search-form': 'Customer search form',
    'customers-button': 'Customers button',
    'customer-list-button': 'Customer List button',
    'clear-filters-button': 'Clear Filters button',
    'create-customer-button': 'Create Customer button',
    'clone-customer-button': 'Clone Customer button',
    'filter-customers-button': 'Filter Customers button',
    'filter-by-location-button': 'Filter by Location button',
    'search-button': 'Search button',
    'previous-button': 'Previous pagination button',
    'next-button': 'Next pagination button',
    'customer-search-box': 'Customer search box',
    'customer-search-input': 'Customer search input field',
    'customer-table': 'Customer list table',
    'customer-row': 'Customer table row',
    'customer-created-success-message': 'Customer created success message',
    'customer-updated-success-message': 'Customer updated success message',
    'customer-deleted-success-message': 'Customer deleted success message',
    'validation-error-message': 'Validation error message',
    'customer-loading-spinner': 'Customer loading spinner'
  }
};

/**
 * Generate HTML templates with data-testid attributes
 */
function generateHtmlTemplates() {
  const templates = {};

  Object.keys(dataTestIdMappings).forEach(page => {
    templates[page] = generatePageTemplate(page, dataTestIdMappings[page]);
  });

  return templates;
}

/**
 * Generate HTML template for a specific page
 */
function generatePageTemplate(pageName, elements) {
  let template = `<!-- ${pageName.toUpperCase()} PAGE TEMPLATE -->\n`;
  template += `<!-- Add these data-testid attributes to your ${pageName} page elements -->\n\n`;

  Object.keys(elements).forEach(testId => {
    const description = elements[testId];
    template += `<!-- ${description} -->\n`;
    
    // Generate appropriate HTML based on element type
    if (testId.includes('button')) {
      template += `<button data-testid="${testId}" aria-label="${description}">\n  ${description}\n</button>\n\n`;
    } else if (testId.includes('input')) {
      template += `<input data-testid="${testId}" type="text" placeholder="Enter ${description.toLowerCase()}" aria-label="${description}" />\n\n`;
    } else if (testId.includes('dropdown') || testId.includes('select')) {
      template += `<select data-testid="${testId}" aria-label="${description}">\n  <option value="">Select ${description}</option>\n</select>\n\n`;
    } else if (testId.includes('form')) {
      template += `<form data-testid="${testId}" role="form">\n  <!-- Form content -->\n</form>\n\n`;
    } else if (testId.includes('table')) {
      template += `<table data-testid="${testId}" role="table" aria-label="${description}">\n  <tbody>\n    <!-- Table content -->\n  </tbody>\n</table>\n\n`;
    } else if (testId.includes('message')) {
      template += `<div data-testid="${testId}" role="status" aria-label="${description}">\n  ${description}\n</div>\n\n`;
    } else if (testId.includes('modal')) {
      template += `<div data-testid="${testId}" role="dialog" aria-label="${description}">\n  <!-- Modal content -->\n</div>\n\n`;
    } else {
      template += `<div data-testid="${testId}" aria-label="${description}">\n  ${description}\n</div>\n\n`;
    }
  });

  return template;
}

/**
 * Generate React component templates
 */
function generateReactTemplates() {
  const templates = {};

  Object.keys(dataTestIdMappings).forEach(page => {
    templates[page] = generateReactComponent(page, dataTestIdMappings[page]);
  });

  return templates;
}

/**
 * Generate React component for a specific page
 */
function generateReactComponent(pageName, elements) {
  const componentName = pageName.charAt(0).toUpperCase() + pageName.slice(1) + 'Page';
  
  let template = `// ${componentName}.jsx\n`;
  template += `// Add these data-testid attributes to your ${pageName} page components\n\n`;
  template += `import React from 'react';\n\n`;
  template += `const ${componentName} = () => {\n`;
  template += `  return (\n`;
  template += `    <div>\n`;

  Object.keys(elements).forEach(testId => {
    const description = elements[testId];
    
    if (testId.includes('button')) {
      template += `      <button \n`;
      template += `        data-testid="${testId}"\n`;
      template += `        aria-label="${description}"\n`;
      template += `        onClick={handleClick}\n`;
      template += `      >\n`;
      template += `        ${description}\n`;
      template += `      </button>\n\n`;
    } else if (testId.includes('input')) {
      template += `      <input \n`;
      template += `        data-testid="${testId}"\n`;
      template += `        type="text"\n`;
      template += `        placeholder="Enter ${description.toLowerCase()}"\n`;
      template += `        aria-label="${description}"\n`;
      template += `        onChange={handleChange}\n`;
      template += `      />\n\n`;
    } else if (testId.includes('dropdown') || testId.includes('select')) {
      template += `      <select \n`;
      template += `        data-testid="${testId}"\n`;
      template += `        aria-label="${description}"\n`;
      template += `        onChange={handleChange}\n`;
      template += `      >\n`;
      template += `        <option value="">Select ${description}</option>\n`;
      template += `      </select>\n\n`;
    } else if (testId.includes('form')) {
      template += `      <form \n`;
      template += `        data-testid="${testId}"\n`;
      template += `        role="form"\n`;
      template += `        onSubmit={handleSubmit}\n`;
      template += `      >\n`;
      template += `        {/* Form content */}\n`;
      template += `      </form>\n\n`;
    } else if (testId.includes('table')) {
      template += `      <table \n`;
      template += `        data-testid="${testId}"\n`;
      template += `        role="table"\n`;
      template += `        aria-label="${description}"\n`;
      template += `      >\n`;
      template += `        <tbody>\n`;
      template += `          {/* Table content */}\n`;
      template += `        </tbody>\n`;
      template += `      </table>\n\n`;
    } else if (testId.includes('message')) {
      template += `      <div \n`;
      template += `        data-testid="${testId}"\n`;
      template += `        role="status"\n`;
      template += `        aria-label="${description}"\n`;
      template += `      >\n`;
      template += `        {message}\n`;
      template += `      </div>\n\n`;
    } else if (testId.includes('modal')) {
      template += `      <div \n`;
      template += `        data-testid="${testId}"\n`;
      template += `        role="dialog"\n`;
      template += `        aria-label="${description}"\n`;
      template += `      >\n`;
      template += `        {/* Modal content */}\n`;
      template += `      </div>\n\n`;
    } else {
      template += `      <div \n`;
      template += `        data-testid="${testId}"\n`;
      template += `        aria-label="${description}"\n`;
      template += `      >\n`;
      template += `        {content}\n`;
      template += `      </div>\n\n`;
    }
  });

  template += `    </div>\n`;
  template += `  );\n`;
  template += `};\n\n`;
  template += `export default ${componentName};\n`;

  return template;
}

/**
 * Generate Vue.js component templates
 */
function generateVueTemplates() {
  const templates = {};

  Object.keys(dataTestIdMappings).forEach(page => {
    templates[page] = generateVueComponent(page, dataTestIdMappings[page]);
  });

  return templates;
}

/**
 * Generate Vue component for a specific page
 */
function generateVueComponent(pageName, elements) {
  const componentName = pageName.charAt(0).toUpperCase() + pageName.slice(1) + 'Page';
  
  let template = `<!-- ${componentName}.vue -->\n`;
  template += `<!-- Add these data-testid attributes to your ${pageName} page components -->\n\n`;
  template += `<template>\n`;
  template += `  <div>\n`;

  Object.keys(elements).forEach(testId => {
    const description = elements[testId];
    
    if (testId.includes('button')) {
      template += `    <button \n`;
      template += `      data-testid="${testId}"\n`;
      template += `      aria-label="${description}"\n`;
      template += `      @click="handleClick"\n`;
      template += `    >\n`;
      template += `      ${description}\n`;
      template += `    </button>\n\n`;
    } else if (testId.includes('input')) {
      template += `    <input \n`;
      template += `      data-testid="${testId}"\n`;
      template += `      type="text"\n`;
      template += `      placeholder="Enter ${description.toLowerCase()}"\n`;
      template += `      aria-label="${description}"\n`;
      template += `      v-model="inputValue"\n`;
      template += `    />\n\n`;
    } else if (testId.includes('dropdown') || testId.includes('select')) {
      template += `    <select \n`;
      template += `      data-testid="${testId}"\n`;
      template += `      aria-label="${description}"\n`;
      template += `      v-model="selectedValue"\n`;
      template += `    >\n`;
      template += `      <option value="">Select ${description}</option>\n`;
      template += `    </select>\n\n`;
    } else if (testId.includes('form')) {
      template += `    <form \n`;
      template += `      data-testid="${testId}"\n`;
      template += `      role="form"\n`;
      template += `      @submit="handleSubmit"\n`;
      template += `    >\n`;
      template += `      <!-- Form content -->\n`;
      template += `    </form>\n\n`;
    } else if (testId.includes('table')) {
      template += `    <table \n`;
      template += `      data-testid="${testId}"\n`;
      template += `      role="table"\n`;
      template += `      aria-label="${description}"\n`;
      template += `    >\n`;
      template += `      <tbody>\n`;
      template += `        <!-- Table content -->\n`;
      template += `      </tbody>\n`;
      template += `    </table>\n\n`;
    } else if (testId.includes('message')) {
      template += `    <div \n`;
      template += `      data-testid="${testId}"\n`;
      template += `      role="status"\n`;
      template += `      aria-label="${description}"\n`;
      template += `    >\n`;
      template += `      {{ message }}\n`;
      template += `    </div>\n\n`;
    } else if (testId.includes('modal')) {
      template += `    <div \n`;
      template += `      data-testid="${testId}"\n`;
      template += `      role="dialog"\n`;
      template += `      aria-label="${description}"\n`;
      template += `    >\n`;
      template += `      <!-- Modal content -->\n`;
      template += `    </div>\n\n`;
    } else {
      template += `    <div \n`;
      template += `      data-testid="${testId}"\n`;
      template += `      aria-label="${description}"\n`;
      template += `    >\n`;
      template += `      {{ content }}\n`;
      template += `    </div>\n\n`;
    }
  });

  template += `  </div>\n`;
  template += `</template>\n\n`;
  template += `<script>\n`;
  template += `export default {\n`;
  template += `  name: '${componentName}',\n`;
  template += `  data() {\n`;
  template += `    return {\n`;
  template += `      // Component data\n`;
  template += `    };\n`;
  template += `  },\n`;
  template += `  methods: {\n`;
  template += `    handleClick() {\n`;
  template += `      // Handle click\n`;
  template += `    },\n`;
  template += `    handleChange() {\n`;
  template += `      // Handle change\n`;
  template += `    },\n`;
  template += `    handleSubmit() {\n`;
  template += `      // Handle submit\n`;
  template += `    }\n`;
  template += `  }\n`;
  template += `};\n`;
  template += `</script>\n`;

  return template;
}

/**
 * Generate a comprehensive data-testid reference file
 */
function generateDataTestIdReference() {
  let reference = `# Data-TestId Reference\n\n`;
  reference += `This file contains all data-testid attributes that should be added to your application codebase.\n\n`;

  Object.keys(dataTestIdMappings).forEach(page => {
    reference += `## ${page.toUpperCase()} PAGE\n\n`;
    
    Object.keys(dataTestIdMappings[page]).forEach(testId => {
      const description = dataTestIdMappings[page][testId];
      reference += `- \`${testId}\` - ${description}\n`;
    });
    
    reference += `\n`;
  });

  return reference;
}

/**
 * Main function to generate all templates
 */
function main() {
  console.log('🚀 Generating data-testid implementation templates...\n');

  // Create output directory
  const outputDir = path.join(__dirname, '..', 'data-testid-templates');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate HTML templates
  console.log('📄 Generating HTML templates...');
  const htmlTemplates = generateHtmlTemplates();
  Object.keys(htmlTemplates).forEach(page => {
    const filePath = path.join(outputDir, `${page}-page.html`);
    fs.writeFileSync(filePath, htmlTemplates[page]);
    console.log(`  ✅ Created ${filePath}`);
  });

  // Generate React templates
  console.log('\n⚛️  Generating React templates...');
  const reactTemplates = generateReactTemplates();
  Object.keys(reactTemplates).forEach(page => {
    const filePath = path.join(outputDir, `${page}-page.jsx`);
    fs.writeFileSync(filePath, reactTemplates[page]);
    console.log(`  ✅ Created ${filePath}`);
  });

  // Generate Vue templates
  console.log('\n💚 Generating Vue.js templates...');
  const vueTemplates = generateVueTemplates();
  Object.keys(vueTemplates).forEach(page => {
    const filePath = path.join(outputDir, `${page}-page.vue`);
    fs.writeFileSync(filePath, vueTemplates[page]);
    console.log(`  ✅ Created ${filePath}`);
  });

  // Generate reference file
  console.log('\n📚 Generating data-testid reference...');
  const reference = generateDataTestIdReference();
  const referencePath = path.join(outputDir, 'data-testid-reference.md');
  fs.writeFileSync(referencePath, reference);
  console.log(`  ✅ Created ${referencePath}`);

  // Generate implementation checklist
  console.log('\n📋 Generating implementation checklist...');
  const checklist = generateImplementationChecklist();
  const checklistPath = path.join(outputDir, 'implementation-checklist.md');
  fs.writeFileSync(checklistPath, checklist);
  console.log(`  ✅ Created ${checklistPath}`);

  console.log('\n🎉 All templates generated successfully!');
  console.log(`📁 Templates saved to: ${outputDir}`);
  console.log('\n📖 Next steps:');
  console.log('1. Review the generated templates');
  console.log('2. Choose the appropriate framework template');
  console.log('3. Add data-testid attributes to your application code');
  console.log('4. Update your Playwright tests to use the new selectors');
  console.log('5. Test the implementation');
}

/**
 * Generate implementation checklist
 */
function generateImplementationChecklist() {
  return `# Data-TestId Implementation Checklist

## 🎯 Phase 1: Critical Elements (Week 1)
- [ ] Login form inputs and buttons
- [ ] Navigation elements (tabs, menus, links)
- [ ] Primary action buttons (Create, Save, Delete, Edit)
- [ ] Search inputs and filters
- [ ] Error and success messages

## 📝 Phase 2: Form Elements (Week 2)
- [ ] All input fields (text, email, password, number)
- [ ] All dropdowns and select elements
- [ ] All textareas
- [ ] Form submission buttons
- [ ] Form validation messages

## 📊 Phase 3: Data Display (Week 3)
- [ ] Tables and table rows
- [ ] Lists and list items
- [ ] Cards and containers
- [ ] Pagination controls
- [ ] Loading spinners

## 🪟 Phase 4: Modals and Overlays (Week 4)
- [ ] Modal dialogs
- [ ] Confirmation dialogs
- [ ] Tooltips and popovers
- [ ] Dropdown menus
- [ ] Context menus

## 🔧 Phase 5: Advanced Elements (Week 5)
- [ ] Charts and graphs
- [ ] File upload areas
- [ ] Date pickers
- [ ] Multi-select components
- [ ] Drag and drop areas

## ✅ Testing Checklist
- [ ] Verify all data-testid attributes are present
- [ ] Test selector fallbacks work correctly
- [ ] Validate accessibility is maintained
- [ ] Run existing tests to ensure no regressions
- [ ] Update test documentation

## 📚 Documentation Updates
- [ ] Update selector documentation
- [ ] Create data-testid reference guide
- [ ] Update team training materials
- [ ] Document implementation process
`;
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  dataTestIdMappings,
  generateHtmlTemplates,
  generateReactTemplates,
  generateVueTemplates,
  generateDataTestIdReference
};
