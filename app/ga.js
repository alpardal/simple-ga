
const proto = {

    selectParents(pool) {
        return pool;
    },

    breed(parent1, parent2) {
        return parent1.getImageData();
    }
};

const GA = {
    create(target) {
        return Object.create(proto);
    }
};


export {GA};
