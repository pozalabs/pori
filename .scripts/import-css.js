const fs = require('fs');
const path = require('path');

const bundleFilePath = path.resolve(__dirname, '../dist/index.js');
const bundleModuleFilePath = path.resolve(__dirname, '../dist/index.mjs');

const bundleFileContent = fs.readFileSync(bundleFilePath, 'utf-8');
const bundleModuleFileContent = fs.readFileSync(bundleModuleFilePath, 'utf-8');

fs.writeFileSync(
  bundleFilePath,
  `
    import './index.css';
    ${bundleFileContent}
  `,
);
fs.writeFileSync(
  bundleModuleFilePath,
  `
    import './index.css';
    ${bundleModuleFileContent}
  `,
);
