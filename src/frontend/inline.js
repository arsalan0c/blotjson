var Inliner = require('inliner');
var fs = require('fs');

new Inliner('./src/index.html', function (error, html) {
    if (error) {
        console.log(error);
    } else {
        fs.mkdirSync('../dist');
        fs.writeFileSync('../dist/index.html', html);
    }
});
