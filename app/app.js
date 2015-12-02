import {GA} from './ga';
import {Utils} from './utils';

const proto = {

    start() {
        this.targetImage = this.view.getTargetImage();
        this.fitnessFunction = (i) => (1/(1+Utils.imageDifference(this.targetImage, i)));
        this.setPopulation(Utils.fillArray(App.POPULATION_SIZE,
          ()=> Utils.fillArray(this.targetImage.length, Utils.randInt.bind(null, 256))));

        this.render();
        this.run();
    },

    run() {
        this.step();
        requestAnimationFrame(this.run.bind(this));
    },

    step() {
        this.update();
        this.render();
    },

    update() {
        generations++;
        this.setPopulation(GA.nextGeneration(this.population));
    },

    render() {
        if (generations % 10 === 0) {
            console.log(generations + ' geracoes, melhor fitness: ' + this.best.fitness);
            this.view.render(this);
        }
    },

    setPopulation(population) {
        this.population = population;
        this.population.forEach(p => p.fitness = this.fitnessFunction(p));
        this.best = Utils.maxBy(p => p.fitness, this.population);
    }
};

let generations = 0;

const App = {
    create(view) {
        return Object.assign(Object.create(proto),
                             {view: view});
    },

    POPULATION_SIZE: 200
};


export {App};
