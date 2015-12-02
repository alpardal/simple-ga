import {Utils} from './utils';

const GA = {

    nextGeneration(population) {
        population.totalFitness = population.reduce((sum, p) => sum + p.fitness, 0);
        population.probabilities = population.map(p => p.fitness/population.totalFitness);

        return Utils.fillArray(population.length, ()=> {
            let p1 = this.selectParent(population),
                p2 = p1;
            while (p2 === p1) { p2 = this.selectParent(population); }

            return this.breed(p1, p2);
        });
    },

    selectParent(population) {
        let parentIndex = Utils.indexByProbabilities(population.probabilities);

        return population[parentIndex];
    },

    breed(parent1, parent2) {
        if (Math.random() < 0.9) {

            let child = [];
            // uniform crosssover:
            for (let i = 0; i < parent1.length; i++) {
                if (Math.random() < 0.5) {
                    child.push(parent1[i]);
                } else {
                    child.push(parent2[i]);
                }
            }

            return child;
        } else {
            return mutate(parent1);
        }
    },

    MUTATION_PROB: 0.0005
};

function mutate(genome) {
    let mutated = [];

    for (let i = 0; i < genome.length; i++) {
        if (Math.random() < GA.MUTATION_PROB) {
            mutated.push(Utils.randInt(256));
        } else {
            mutated.push(genome[i]);
        }
    }

    return mutated;
}


export {GA};
