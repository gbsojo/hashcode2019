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

function findVerticalSlides (verticalPhotos) {
    const possibles = [];
    verticalPhotos.forEach(function(photo, index) {
        var best = {id2: photo.id};
        const rest = verticalPhotos.slice(index+1);
        rest.forEach(function(photo2) {
            var common = getCommonTags(photo.tags, photo2.tags);
            if (common.length > (best.common ? best.common : 0)) {
                best.id = photo2.id;
                best.common = common.length;
            }
        });
        if (best.id) possibles.push(best);
    });

    return extractRepeat(possibles, []);
}

function extractBest (possibilities) {
    if (possibilities.length > 1 ){
        var best = {};
        possibilities.forEach(function(slide) {
            if (slide.common > (best.common ? best.common : 0)) {
                best = slide;
                console.log(best);
            }
        })
        return best;
    } else {
        return possibilities[0];
    }
}

function extractRepeat (possibilities, slides) {
    if (possibilities.length < 2) {
        slides.push(possibilities[0]);
    }
    else {
        var best = extractBest(possibilities);
        slides.push(best);
        slides = extractRepeat(possibilities.filter(function(slide) {
            return !(best && (slide.id == best.id || slide.id == best.id2 || slide.id2 == best.id || slide.id2 == best.id2))
        }), slides);
    }
    return slides;
}

function interestFactor (s1, s2) {
    s1Tags = getSlideTags(s1);
    s2Tags = getSlideTags(s2);
    const common = getCommonTags(s1Tags, s2Tags);
    return Math.min(s1Tags.length, s2Tags.length, common.length);
};

function getSlideTags (s1) {
    return s1.map(function(photo) {
        return photo.tags;
    }).reduce(function(prev, curr) {
        return prev.concat(curr);
    });
}

function getCommonTags (s1Tags, s2Tags) {
    var common = [];
    s1Tags.forEach(function(s1tag) {
        if (s2Tags.indexOf(s1tag) !== -1) {
            common.push(s1tag);
        }
    })
    return common;
}

const v = [
    {
        id: 0,
        h: false,
        tags: ['pepe', 'hola', 'cosa']
    },
    {
        id: 1,
        h: false,
        tags: ['pepe', 'hola', 'cosa']
    },
    {
        id: 2,
        h: false,
        tags: ['pepe3', 'hola', 'cosa']
    },
    {
        id: 3,
        h: false,
        tags: ['pepe3', 'hola2', 'cosa']
    },
];

console.log(findVerticalSlides(v));