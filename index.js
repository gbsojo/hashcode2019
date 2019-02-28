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
        if (index >= qty) return;
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

function createSlideshowFile (slides) {
    slides.map(function(photo) {
        return `${slides.join(' ')}`;
    })
    const content = `${slides.length}\n${slides.join('\n')}`;
    fs.writeFileSync('./output.txt', content);
    // console.log(content);
}

// readDir();
// getDataSet('./assets/a_example.txt');
const slides = [[0], [1, 2], [3], [4,5]];
createSlideshowFile(slides);
getDataSet('./assets/a_example.txt');

function countSlides(photos) {
    var count = 0;
    const dataset = [];
    for (photo in photos) {
        var vertical = 0;
        if (photo.h) {
            count++;
            dataset.push({
                id: photo.id
            });
        } else {
            vertical++;
            if (vertical % 2 === 0 ){
                count++;
            }
            dataset.push({
                id: photo.id
            });
        }
    }
}