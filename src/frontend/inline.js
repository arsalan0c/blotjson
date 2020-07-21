var Inliner = require('inliner');
var fs = require('fs');

const OUT_DIR = '../dist/';
const OUT_HTML = 'index.html';

new Inliner('./src/index.html', function (error, html) {
    if (error) {
        console.log(error);
    } else {
        fs.mkdirSync(OUT_DIR);
        fs.writeFileSync(OUT_DIR + OUT_HTML, html);
    }
});
