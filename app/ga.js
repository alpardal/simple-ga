import {Utils} from './utils';

function compareByFitness(a, b) {
    return a.fitness - b.fitness;
}

const proto = {

    nextGeneration(population) {
        this.calculatePolulationFitness(population);
        const parents = this.selectParents(population);
    },

    calculatePolulationFitness(population) {
        population.forEach(p => p.fitness = this.fitnessFunction(p));
    },

    selectParents(pool) {
        const sortedPool = Utils.shallowCopy(pool)
                                .sort(compareByFitness)
                                .reverse(),
              parents = [],
              probabilities = [];

        let totalFitness = 0;
        sortedPool.forEach(e => (totalFitness += e.fitness));
        sortedPool.forEach(e => probabilities.push(e.fitness/totalFitness));

        parents.push(sortedPool[Utils.indexByProbabilities(probabilities)]);
        parents.push(sortedPool[Utils.indexByProbabilities(probabilities)]);
        parents.push(sortedPool[Utils.indexByProbabilities(probabilities)]);

        return parents;
    },

    breed(parent1, parent2) {
        const d1 = parent1.getImageData().data,
              d2 = parent2.getImageData().data,
              child1 = parent1.createImageData(),
              child2 = parent1.createImageData(),
              cd1 = child1.data,
              cd2 = child2.data,
              mutationProb = 0.0001,
              partitions = 300,
              partitionPoints = [];

        let partTemp = 0;

        for (let i = 0; i < partitions; i++) {
            partTemp += Math.random() * (d1.length - partTemp) | 0;
            partitionPoints.push(partTemp);
        }

        let currentPartition = 0, flipped = false;

        for (let i = 0; i < d1.length; i++) {
            if (i > partitionPoints[currentPartition]) {
                flipped = !flipped;
                currentPartition++;
            }

            if (!flipped) {
                cd1[i] = d1[i];
                cd2[i] = d2[i];
            } else {
                cd2[i] = d1[i];
                cd1[i] = d2[i];
            }

            if (Math.random() < mutationProb) {
                cd1[i] = mutate(cd1[i]);
            }

            if (Math.random() < mutationProb) {
                cd2[i] = mutate(cd2[i]);
            }
        }

        return [child1, child2];
    }
};

function mutate(value) {
    const maxMut = 10;
    let newValue = value + (-maxMut + 2*maxMut*Math.random()|0);
    if (newValue < 0) { newValue = 0}
    if (newValue > 255) { newValue = 255}
    return newValue;
}

const GA = {
    create(fitnessFunction) {
        const ga =  Object.create(proto)
        ga.fitnessFunction = fitnessFunction
        return ga;
    }
};


export {GA};
