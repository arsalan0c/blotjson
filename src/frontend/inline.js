var Inliner = require('inliner');
var fs = require('fs');

const OUT_DIR = '../dist/';

new Inliner('./src/index.html', function (error, html) {
    if (error) {
        console.log(error);
    } else {
        fs.mkdirSync(OUT_DIR);
        fs.writeFileSync(OUT_DIR + 'index.html', html);
    }
});
