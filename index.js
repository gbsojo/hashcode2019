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
    return dataSet;
}

function createSlideshowFile (slides) {
    slides.map(function(photo) {
        return `${slides.join(' ')}`;
    })
    const content = `${slides.length}\n${slides.join('\n')}`;
    fs.writeFileSync('./output.txt', content);
    console.log(content);
}

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

function interestFactor (s1, s2) {
    s1Tags = getSlideTags(s1);
    s2Tags = getSlideTags(s2);
    const common = [];
    s1Tags.forEach(function(s1tag) {
        if (s2Tags.indexOf(s1tag) !== -1) {
            common.push(s1tag);
        }
    })
    return Math.min(s1Tags.length, s2Tags.length, common.length);
};

function getSlideTags (s1) {
    return s1.map(function(photo) {
        return photo.tags;
    }).reduce(function(prev, curr) {
        return prev.concat(curr);
    });
}