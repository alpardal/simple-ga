import {Canvas} from './canvas';
import {App} from './app';

const image_path = 'images/Yosemite_Falls_small.jpg';

const proto = {

    load(callback) {
        this.img = new Image();
        this.img.onload = this.loaded.bind(this);
        this.finishedLoadingCallback = callback;
        this.img.src = image_path;
    },

    render(app) {
        app.population.forEach((p, i) => this.populationCanvases[i].setYuvImage(p));
        this.currentBestCanvas.setYuvImage(app.best);
    },

    loaded() {
        this.targetImageCanvas = Canvas.create(this.img.width, this.img.height);
        this.targetImageCanvas.setImage(this.img);
        this.targetImageCanvas.addTo(this.targetContainer);

        this.currentBestCanvas = Canvas.create(this.img.width, this.img.height);
        this.currentBestCanvas.addTo(this.targetContainer);

        this.populationCanvases = [];

        const table = document.createElement('table');
        let row, col;

        for (let i = 0; i < App.POPULATION_SIZE; i++) {
            if (i % 2 === 0) {
                row = document.createElement('tr');
                table.appendChild(row);
            }

            this.populationCanvases[i] = Canvas.create(this.img.width,
                                                       this.img.height);

            col = document.createElement('td');
            this.populationCanvases[i].addTo(col);
            row.appendChild(col);
        }

        this.populationContainer.appendChild(table);

        this.finishedLoadingCallback();
    },

    getTargetImage() {
        return this.targetImageCanvas.getYuvImage();
    }
};

const View = {
    create(targetContainer, populationContainer) {
        const view = Object.assign(Object.create(proto),
                             {targetContainer: targetContainer,
                              populationContainer: populationContainer});
        return view;
    }
};


export {View};
