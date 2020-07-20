const jsdoc2md = require('jsdoc-to-markdown');
const fs = require('fs');

const docs = jsdoc2md.renderSync({
  files: './src/index.js'
});

fs.writeFileSync('./docs/body.md', docs);