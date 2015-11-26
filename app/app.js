import {GA} from './ga';
import {Utils} from './utils';
import {Color} from './color';

const proto = {

    start() {
        this.targetImage = this.view.getTargetImage();
        this.fitnessFunction = Utils.imageDifference.bind(null, this.targetImage);
        this.setPopulation(Utils.fillArray(App.POPULATION_SIZE,
          ()=> Utils.fillArray(this.targetImage.length, Color.randomYuvColor)));

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
            console.log('best is: ' + this.best.fitness);
        }
        this.view.render(this);
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

    POPULATION_SIZE: 8
};


export {App};
