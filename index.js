const fs = require('fs');

function readDir() {
    const content = fs.readdirSync('./assets');
    content.forEach(function(f) {
        const fileContent = fs.readFileSync('./assets/' + f).toString();
        console.log(fileContent);
    })
    // console.log(content);
}

function getDataSet () {
    
}

readDir();