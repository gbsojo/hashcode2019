const fs = require('fs');

function readDir() {
    const content = fs.readdirSync('./assets');
    content.forEach(function(f) {
        const fileContent = fs.readFileSync('./assets/' + f).toString();
        console.log(fileContent);
    })
    // console.log(content);
}

function getDataSet (path) {
    const fileContent = fs.readFileSync(path).toString();
    var splitContent = fileContent.split('\n');
    const qty = splitContent.shift();
    const dataSet = []
    splitContent.forEach(function (p, index) {
        const line = p.split(' ');
        const h = line.shift() == 'H';
        line.shift();
        const tags = line;
        dataSet.push({
            id: index,
            h: h,
            tags: tags
        })
    });
    console.log(dataSet);
}

// readDir();
getDataSet('./assets/a_example.txt');