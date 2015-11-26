import {GA} from './ga';
import {Utils} from './utils';
import {Color} from './color';

const proto = {

    start() {
        this.targetImage = this.view.getTargetImage();
        this.fitnessFunction = Utils.imageDifference.bind(null, this.targetImage);
        this.ga = GA.create(this.fitnessFunction);
        this.setPopulation(Utils.fillArray(App.POPULATION_SIZE,
          ()=> Utils.fillArray(this.targetImage.length, Color.randomYuvColor)));

        this.render();
        window.step = this.step.bind(this);
        window.run = this.run.bind(this);
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
        this.setPopulation(this.ga.nextGeneration(this.population));
    },

    render() {
        if (generations % 10 === 0) {
            console.log('best is: ' + this.best.fitness);
        }
        this.view.render(this);
    },

    setPopulation(population) {
        this.population = population;
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
