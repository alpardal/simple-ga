import {Utils} from './utils';

const GA = {

    nextGeneration(population) {
        const parents = this.selectParents(population);

        return Utils.fillArray(population.length, ()=> {
            return this.breed(Utils.sample(parents), Utils.sample(parents))[0];
        });
    },

    selectParents(population) {
        const numberOfParents = 3,
              parents = [],
              probabilities = [],
              totalFitness = population.reduce((sum, p) => sum + p.fitness, 0);

        population.forEach(p => probabilities.push(p.fitness/totalFitness));

        for (let i = 0; i < numberOfParents; i++) {
            parents.push(population[Utils.indexByProbabilities(probabilities)]);
        }

        return parents;
    },

    breed(parent1, parent2) {
        const child1 = [],
              child2 = [],
              partitions = 300,
              partitionPoints = [];

        let partTemp = 0;

        for (let i = 0; i < partitions; i++) {
            partTemp += Math.random() * (parent1.length - partTemp) | 0;
            partitionPoints.push(partTemp);
        }

        let currentPartition = 0, flipped = false;

        for (let i = 0; i < parent1.length; i++) {
            if (i > partitionPoints[currentPartition]) {
                flipped = !flipped;
                currentPartition++;
            }

            if (!flipped) {
                child1.push(parent1[i]);
                child2.push(parent2[i]);
            } else {
                child1.push(parent2[i]);
                child2.push(parent1[i]);
            }

           mutate(child1, i);
           mutate(child2, i);
        }

        return [child1, child2];
    },

    MUTATION_PROB: 0.0001
};

function mutate(pop, index) {
}


export {GA};
