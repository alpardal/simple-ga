import {Utils} from './utils';
import {Color} from './color';

const GA = {

    nextGeneration(population) {
        population.totalFitness = population.reduce((sum, p) => sum + p.fitness, 0);
        population.probabilities = population.map(p => p.fitness/population.totalFitness);

        return Utils.fillArray(population.length, ()=> {
            let p1 = this.selectParent(population),
                p2 = this.selectParent(population);
            return this.breed(p1, p2);
        });
    },

    selectParent(population) {
        let parentIndex = Utils.indexByProbabilities(population.probabilities);

        return population[parentIndex];
    },

    breed(parent1, parent2) {
        let parents = (Math.random() < 0.5) ? [parent1, parent2] : [parent2, parent1],
            crossoverPoint = Utils.randInt(parents.length-1),
            child = [];

        for (let i = 0; i < parent1.length; i++) {
            if (i <= crossoverPoint) {
                child.push(parents[0][i]);
            } else {
                child.push(parents[1][i]);
            }

           mutate(child, i);
        }

        return child;
    },

    MUTATION_PROB: 0.05
};

function mutate(genome, index) {
    if (Math.random() < GA.MUTATION_PROB) {
        genome[index] = Color.randomYuvColor();
    }
}


export {GA};
