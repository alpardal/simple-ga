import {Canvas} from './canvas';
import {GA} from './ga';
import {Utils} from './utils';

const image_path = 'images/Yosemite_Falls_small.jpg';
const poolSize = 6;

const proto = {

    start() {
        this.img = new Image();
        this.img.onload = this.imageLoaded.bind(this);
        this.img.src = image_path;
        this.pool = [];
    },

    imageLoaded() {
        this.targetImageCanvas = Canvas.create(this.img.width, this.img.height);
        this.targetImageCanvas.setImage(this.img);
        this.targetImageCanvas.addTo(this.targetContainer);
        this.currentBestCanvas = Canvas.create(this.img.width, this.img.height);
        this.currentBestCanvas.addTo(this.targetContainer);
        this.ga = GA.create(this.targetImageCanvas);
        this.fitnessFunction = Utils.imageDifference.bind(null,
                                                          this.targetImageCanvas);

        const table = document.createElement('table');
        let row, col;

        for (let i = 0; i < poolSize; i++) {
            if (i % 2 === 0) {
                row = document.createElement('tr');
                table.appendChild(row);
            }

            this.pool[i] = Canvas.createRandom(this.img.width, this.img.height);

            col = document.createElement('td');
            this.pool[i].addTo(col);
            row.appendChild(col);
        }

        this.poolContainer.appendChild(table);

        this.run();
    },

    run() {
        this.step();
        // setTimeout(this.run.bind(this), 100);
    },

    step() {
        this.calculatePoolFitness();
        this.setBest();
    },

    calculatePoolFitness() {
        this.pool.forEach(genome => {
            genome.fitness = this.fitnessFunction(genome);
        });
    },

    setBest() {
        const best = Utils.minBy(g => g.fitness, this.pool);
        this.currentBestCanvas.setImageData(best.getImageData());
    }
};

const App = {
    create(targetContainer, poolContainer) {
        return Object.assign(Object.create(proto),
                            {targetContainer: targetContainer,
                             poolContainer: poolContainer});
    }
};


export {App};
