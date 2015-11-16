const Utils = {

    sample(array) {
        const index = Math.random() * array.length | 0;
        return array[index];
    },

    minBy(transform, items) {
        return items.map(i => (
            {item: i, value: transform(i)}
        )).reduce((best, current) => (
            (current.value < best.value) ? current : best
        )).item;
    },

    imageDifference(image1, image2) {
        const data1 = image1.getImageData().data,
            data2 = image2.getImageData().data;
        let differences = 0;

        for (let i = 0; i < data1.length; i++) {
            if (data1[i] !== data2[i]) {
                differences += 1;
            }
        }

        return differences;
    }
};


export {Utils};
