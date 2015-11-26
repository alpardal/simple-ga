import {Color} from './color';

const Utils = {

    sample(array) {
        const index = Math.random() * array.length | 0;
        return array[index];
    },

    fillArray(size, generator) {
        const array = [];

        for (let i = 0; i < size; i++) {
            array.push(generator(i));
        }

        return array;
    },

    maxBy(transform, items) {
        return items.map(i => (
            {item: i, value: transform(i)}
        )).reduce((best, current) => (
            (current.value > best.value) ? current : best
        )).item;
    },

    shallowCopy(array) {
        const copy = [];
        array.forEach(e => copy.push(e));
        return copy;
    },

    imageDifference(image1, image2) {
        let score = image1.length * Color.MAX_YUV_DISTANCE;

        for (let i = 0; i < image1.length; i++) {
            score -= Color.distance(image1[i], image2[i]);
        }

        return score;
    },

    indexByProbabilities(probs) {
        const prob = Math.random();
        let accu = probs[0],
            i = 0;

        while (accu < prob) {
            accu += probs[++i];
        }

        return i;
    }
};


export {Utils};
