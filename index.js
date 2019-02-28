const fs = require('fs');

function readDir() {
    const content = fs.readdirSync('./assets');
    content.forEach(function(f) {
        var dataSet = getDataSet('./assets/' + f);
        var vSlides = findVerticalSlides(dataSet);
        buildSlideshow(dataSet, vSlides);
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
}

function findVerticalSlides (verticalPhotos) {
    const possibles = [];
    verticalPhotos.forEach(function(photo, index) {
        var best = {id2: photo.id, tags: photo.tags};
        const rest = verticalPhotos.slice(index+1);
        rest.forEach(function(photo2) {
            var common = getCommonTags(photo.tags, photo2.tags);
            if (common.length > (best.common ? best.common : 0)) {
                best.id = photo2.id;
                best.common = common.length;
                // var union = best.tags.concat(photo2.tags);
                // best.tags = union.filter(function(item, pos) {
                //     return union.indexOf(item) == pos;
                // })
            }
        });
        if (best.id) possibles.push(best);
    });

    return extractRepeat(possibles, []).map(function(slide) {
        return [verticalPhotos.find(function(photo) { return photo.id == slide.id}),
        verticalPhotos.find(function(photo) { return photo.id == slide.id2})]
    });
}

function extractBest (possibilities) {
    if (possibilities.length > 1 ){
        var best = {};
        possibilities.forEach(function(slide) {
            if (slide.common > (best.common ? best.common : 0)) {
                best = slide;
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

function buildSlideshow (photos, vSlides) {
    hSlides = photos.filter(function(photo) { return photo.h}).map(function(photo){return [photo]});
    var allSlides = hSlides.concat(vSlides);
    var possibles = [];
    allSlides.forEach(function(slide, index) {
        var best = {id: index, tags: slide.tags};
        const rest = allSlides.slice(index+1);
        rest.forEach(function(slide2, index2) {
            var factor2 = interestFactor(slide, slide2);
            if ( factor2> (best.factor ? best.factor : 0)) {
                best.id2 = index2;
                best.factor = factor2;
                // var union = best.tags.concat(photo2.tags);
                // best.tags = union.filter(function(item, pos) {
                //     return union.indexOf(item) == pos;
                // })
            }
        });
        if (best.id2) possibles.push(best);
    });
}   

readDir();