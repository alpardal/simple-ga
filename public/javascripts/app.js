(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _ga = require('./ga');

var _utils = require('./utils');

var _color = require('./color');

var proto = {

    start: function start() {
        var _this = this;

        this.targetImage = this.view.getTargetImage();
        this.fitnessFunction = function (i) {
            return 1 / (1 + _utils.Utils.imageDifference(_this.targetImage, i));
        };
        this.setPopulation(_utils.Utils.fillArray(App.POPULATION_SIZE, function () {
            return _utils.Utils.fillArray(_this.targetImage.length, _color.Color.randomYuvColor);
        }));

        this.render();
        this.run();
    },

    run: function run() {
        this.step();
        requestAnimationFrame(this.run.bind(this));
    },

    step: function step() {
        this.update();
        this.render();
    },

    update: function update() {
        generations++;
        this.setPopulation(_ga.GA.nextGeneration(this.population));
    },

    render: function render() {
        if (generations % 10 === 0) {
            console.log('after ' + generations + ' best is: ' + this.best.fitness);
            this.view.render(this);
        }
    },

    setPopulation: function setPopulation(population) {
        var _this2 = this;

        this.population = population;
        this.population.forEach(function (p) {
            return p.fitness = _this2.fitnessFunction(p);
        });
        this.best = _utils.Utils.maxBy(function (p) {
            return p.fitness;
        }, this.population);
    }
};

var generations = 0;

var App = {
    create: function create(view) {
        return Object.assign(Object.create(proto), { view: view });
    },

    POPULATION_SIZE: 50
};

exports.App = App;

},{"./color":3,"./ga":4,"./utils":6}],2:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _color = require('./color');

var proto = {

    init: function init() {
        this.domCanvas = document.createElement('canvas');
        this.domCanvas.width = this.width;
        this.domCanvas.height = this.height;
        this.ctx = this.domCanvas.getContext('2d');
    },

    setImage: function setImage(image) {
        this.ctx.drawImage(image, 0, 0);
    },

    addTo: function addTo(domContainer) {
        domContainer.appendChild(this.domCanvas);
    },

    getYuvImage: function getYuvImage() {
        var imageData = this.ctx.getImageData(0, 0, this.width, this.height).data,
            yuvData = [];

        for (var i = 0; i < imageData.length; i += 4) {
            var color = [imageData[i], imageData[i + 1], imageData[i + 2]];
            yuvData.push(_color.Color.rgbToYuv(color));
        }

        return yuvData;
    },

    setYuvImage: function setYuvImage(yuvImage) {
        var imageData = this.ctx.createImageData(this.width, this.height),
            data = imageData.data;

        for (var i = 0; i < yuvImage.length; i++) {
            var dataIndex = i * 4,
                color = _color.Color.yuvToRgb(yuvImage[i]);
            data[dataIndex] = color[0];
            data[dataIndex + 1] = color[1];
            data[dataIndex + 2] = color[2];
            data[dataIndex + 3] = 255; // alpha
        }

        this.ctx.putImageData(imageData, 0, 0);
    }
};

var Canvas = {
    create: function create(width, height) {
        var canvas = Object.create(proto);
        canvas.width = width;
        canvas.height = height;
        canvas.init();

        return canvas;
    }
};

exports.Canvas = Canvas;

},{"./color":3}],3:[function(require,module,exports){
"use strict";

exports.__esModule = true;
var Color = {

    distance: function distance(color1, color2) {
        return Math.sqrt(Math.pow(color1[0] - color2[0], 2) + Math.pow(color1[1] - color2[1], 2) + Math.pow(color1[2] - color2[2], 2));
    },

    rgbToYuv: function rgbToYuv(rgbColor) {
        var r = rgbColor[0],
            g = rgbColor[1],
            b = rgbColor[2],
            y = 0.299 * r + 0.587 * g + 0.114 * b,
            u = 0.492 * (b - y),
            v = 0.877 * (r - y);

        return [y, u, v];
    },

    yuvToRgb: function yuvToRgb(yuvColor) {
        var y = yuvColor[0],
            u = yuvColor[1],
            v = yuvColor[2],
            r = y + 1.14 * v,
            g = y - 0.395 * u - 0.581 * v,
            b = y + 2.033 * u;

        return [r, g, b];
    },

    randomYuvColor: function randomYuvColor() {
        return Color.rgbToYuv([Math.random() * 255 | 0, Math.random() * 255 | 0, Math.random() * 255 | 0]);
    },

    MAX_YUV_DISTANCE: 255
};

exports.Color = Color;

},{}],4:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('./utils');

var _color = require('./color');

var GA = {

    nextGeneration: function nextGeneration(population) {
        var _this = this;

        population.totalFitness = population.reduce(function (sum, p) {
            return sum + p.fitness;
        }, 0);
        population.probabilities = population.map(function (p) {
            return p.fitness / population.totalFitness;
        });

        return _utils.Utils.fillArray(population.length, function () {
            var p1 = _this.selectParent(population),
                p2 = p1;
            while (p2 === p1) {
                p2 = _this.selectParent(population);
            }

            return _this.breed(p1, p2);
        });
    },

    selectParent: function selectParent(population) {
        var parentIndex = _utils.Utils.indexByProbabilities(population.probabilities);

        return population[parentIndex];
    },

    breed: function breed(parent1, parent2) {
        var parents = Math.random() < 0.5 ? [parent1, parent2] : [parent2, parent1],
            crossoverPoint = _utils.Utils.randInt(parents.length - 1),
            child = [];

        for (var i = 0; i < parent1.length; i++) {
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
        genome[index] = _color.Color.randomYuvColor();
    }
}

exports.GA = GA;

},{"./color":3,"./utils":6}],5:[function(require,module,exports){
'use strict';

var _view = require('./view');

var _app = require('./app');

var populationContainer = document.getElementById('population'),
    targetContainer = document.getElementById('target'),
    view = _view.View.create(targetContainer, populationContainer);

view.load(function () {
      return _app.App.create(view).start();
});

},{"./app":1,"./view":7}],6:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _color = require('./color');

var Utils = {

    randInt: function randInt(max) {
        return Math.floor(Math.random * max);
    },

    sample: function sample(array) {
        var index = Math.random() * array.length | 0;
        return array[index];
    },

    fillArray: function fillArray(size, generator) {
        var array = [];

        for (var i = 0; i < size; i++) {
            array.push(generator(i));
        }

        return array;
    },

    maxBy: function maxBy(transform, items) {
        return items.map(function (i) {
            return { item: i, value: transform(i) };
        }).reduce(function (best, current) {
            return current.value > best.value ? current : best;
        }).item;
    },

    imageDifference: function imageDifference(image1, image2) {
        var score = 0;

        for (var i = 0; i < image1.length; i++) {
            score += _color.Color.distance(image1[i], image2[i]);
        }

        return score;
    },

    indexByProbabilities: function indexByProbabilities(probs) {
        var prob = Math.random();
        var accu = probs[0],
            i = 0;

        while (accu < prob) {
            accu += probs[++i];
        }

        return i;
    }
};

exports.Utils = Utils;

},{"./color":3}],7:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _canvas = require('./canvas');

var _app = require('./app');

var image_path = 'images/Yosemite_Falls_small.jpg';
var NUMBER_OF_CANVASES = 4;

var proto = {

    load: function load(callback) {
        this.img = new Image();
        this.img.onload = this.loaded.bind(this);
        this.finishedLoadingCallback = callback;
        this.img.src = image_path;
    },

    render: function render(app) {
        this.populationCanvases.forEach(function (c, i) {
            return c.setYuvImage(app.population[i]);
        });
        this.currentBestCanvas.setYuvImage(app.best);
    },

    loaded: function loaded() {
        this.targetImageCanvas = _canvas.Canvas.create(this.img.width, this.img.height);
        this.targetImageCanvas.setImage(this.img);
        this.targetImageCanvas.addTo(this.targetContainer);

        this.currentBestCanvas = _canvas.Canvas.create(this.img.width, this.img.height);
        this.currentBestCanvas.addTo(this.targetContainer);

        this.populationCanvases = [];

        var table = document.createElement('table');
        var row = undefined,
            col = undefined;

        for (var i = 0; i < NUMBER_OF_CANVASES; i++) {
            if (i % 2 === 0) {
                row = document.createElement('tr');
                table.appendChild(row);
            }

            this.populationCanvases[i] = _canvas.Canvas.create(this.img.width, this.img.height);

            col = document.createElement('td');
            this.populationCanvases[i].addTo(col);
            row.appendChild(col);
        }

        this.populationContainer.appendChild(table);

        this.finishedLoadingCallback();
    },

    getTargetImage: function getTargetImage() {
        return this.targetImageCanvas.getYuvImage();
    }
};

var View = {
    create: function create(targetContainer, populationContainer) {
        var view = Object.assign(Object.create(proto), { targetContainer: targetContainer,
            populationContainer: populationContainer });
        return view;
    }
};

exports.View = View;

},{"./app":1,"./canvas":2}]},{},[1,2,3,4,5,6,7])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9hbmRyZS9jb2RlL2dhL2FwcC9hcHAuanMiLCIvaG9tZS9hbmRyZS9jb2RlL2dhL2FwcC9jYW52YXMuanMiLCIvaG9tZS9hbmRyZS9jb2RlL2dhL2FwcC9jb2xvci5qcyIsIi9ob21lL2FuZHJlL2NvZGUvZ2EvYXBwL2dhLmpzIiwiL2hvbWUvYW5kcmUvY29kZS9nYS9hcHAvbWFpbi5qcyIsIi9ob21lL2FuZHJlL2NvZGUvZ2EvYXBwL3V0aWxzLmpzIiwiL2hvbWUvYW5kcmUvY29kZS9nYS9hcHAvdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7a0JDQWlCLE1BQU07O3FCQUNILFNBQVM7O3FCQUNULFNBQVM7O0FBRTdCLElBQU0sS0FBSyxHQUFHOztBQUVWLFNBQUssRUFBQSxpQkFBRzs7O0FBQ0osWUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQzlDLFlBQUksQ0FBQyxlQUFlLEdBQUcsVUFBQyxDQUFDO21CQUFNLENBQUMsSUFBRSxDQUFDLEdBQUMsYUFBTSxlQUFlLENBQUMsTUFBSyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUEsQUFBQztTQUFDLENBQUM7QUFDakYsWUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFNLFNBQVMsQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUNwRDttQkFBSyxhQUFNLFNBQVMsQ0FBQyxNQUFLLFdBQVcsQ0FBQyxNQUFNLEVBQUUsYUFBTSxjQUFjLENBQUM7U0FBQSxDQUFDLENBQUMsQ0FBQzs7QUFFeEUsWUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2QsWUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0tBQ2Q7O0FBRUQsT0FBRyxFQUFBLGVBQUc7QUFDRixZQUFJLENBQUMs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SUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQ2QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFNUQsZUFBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbkMsZ0JBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdEMsZUFBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN4Qjs7QUFFRCxZQUFJLENBQUMsbUJBQW1CLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUU1QyxZQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztLQUNsQzs7QUFFRCxrQkFBYyxFQUFBLDBCQUFHO0FBQ2IsZUFBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsV0FBVyxFQUFFLENBQUM7S0FDL0M7Q0FDSixDQUFDOztBQUVGLElBQU0sSUFBSSxHQUFHO0FBQ1QsVUFBTSxFQUFBLGdCQUFDLGVBQWUsRUFBRSxtQkFBbUIsRUFBRTtBQUN6QyxZQUFNLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQzFCLEVBQUMsZUFBZSxFQUFFLGVBQWU7QUFDaEMsK0JBQW1CLEVBQUUsbUJBQW1CLEVBQUMsQ0FBQyxDQUFDO0FBQ2pFLGVBQU8sSUFBSSxDQUFDO0tBQ2Y7Q0FDSixDQUFDOztRQUdNLElBQUksR0FBSixJQUFJIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7R0F9IGZyb20gJy4vZ2EnO1xuaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQge0NvbG9yfSBmcm9tICcuL2NvbG9yJztcblxuY29uc3QgcHJvdG8gPSB7XG5cbiAgICBzdGFydCgpIHtcbiAgICAgICAgdGhpcy50YXJnZXRJbWFnZSA9IHRoaXMudmlldy5nZXRUYXJnZXRJbWFnZSgpO1xuICAgICAgICB0aGlzLmZpdG5lc3NGdW5jdGlvbiA9IChpKSA9PiAoMS8oMStVdGlscy5pbWFnZURpZmZlcmVuY2UodGhpcy50YXJnZXRJbWFnZSwgaSkpKTtcbiAgICAgICAgdGhpcy5zZXRQb3B1bGF0aW9uKFV0aWxzLmZpbGxBcnJheShBcHAuUE9QVUxBVElPTl9TSVpFLFxuICAgICAgICAgICgpPT4gVXRpbHMuZmlsbEFycmF5KHRoaXMudGFyZ2V0SW1hZ2UubGVuZ3RoLCBDb2xvci5yYW5kb21ZdXZDb2xvcikpKTtcblxuICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgICAgICB0aGlzLnJ1bigpO1xuICAgIH0sXG5cbiAgICBydW4oKSB7XG4gICAgICAgIHRoaXMuc3RlcCgpO1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5ydW4uYmluZCh0aGlzKSk7XG4gICAgfSxcblxuICAgIHN0ZXAoKSB7XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfSxcblxuICAgIHVwZGF0ZSgpIHtcbiAgICAgICAgZ2VuZXJhdGlvbnMrKztcbiAgICAgICAgdGhpcy5zZXRQb3B1bGF0aW9uKEdBLm5leHRHZW5lcmF0aW9uKHRoaXMucG9wdWxhdGlvbikpO1xuICAgIH0sXG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGlmIChnZW5lcmF0aW9ucyAlIDEwID09PSAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnYWZ0ZXIgJyArIGdlbmVyYXRpb25zICsgJyBiZXN0IGlzOiAnICsgdGhpcy5iZXN0LmZpdG5lc3MpO1xuICAgICAgICAgICAgdGhpcy52aWV3LnJlbmRlcih0aGlzKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzZXRQb3B1bGF0aW9uKHBvcHVsYXRpb24pIHtcbiAgICAgICAgdGhpcy5wb3B1bGF0aW9uID0gcG9wdWxhdGlvbjtcbiAgICAgICAgdGhpcy5wb3B1bGF0aW9uLmZvckVhY2gocCA9PiBwLmZpdG5lc3MgPSB0aGlzLmZpdG5lc3NGdW5jdGlvbihwKSk7XG4gICAgICAgIHRoaXMuYmVzdCA9IFV0aWxzLm1heEJ5KHAgPT4gcC5maXRuZXNzLCB0aGlzLnBvcHVsYXRpb24pO1xuICAgIH1cbn07XG5cbmxldCBnZW5lcmF0aW9ucyA9IDA7XG5cbmNvbnN0IEFwcCA9IHtcbiAgICBjcmVhdGUodmlldykge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKHByb3RvKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3ZpZXc6IHZpZXd9KTtcbiAgICB9LFxuXG4gICAgUE9QVUxBVElPTl9TSVpFOiA1MFxufTtcblxuXG5leHBvcnQge0FwcH07XG4iLCJpbXBvcnQge0NvbG9yfSBmcm9tICcuL2NvbG9yJztcblxuY29uc3QgcHJvdG8gPSB7XG5cbiAgICBpbml0KCkge1xuICAgICAgICB0aGlzLmRvbUNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICB0aGlzLmRvbUNhbnZhcy53aWR0aCA9IHRoaXMud2lkdGg7XG4gICAgICAgIHRoaXMuZG9tQ2FudmFzLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuICAgICAgICB0aGlzLmN0eCA9IHRoaXMuZG9tQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgfSxcblxuICAgIHNldEltYWdlKGltYWdlKSB7XG4gICAgICAgIHRoaXMuY3R4LmRyYXdJbWFnZShpbWFnZSwgMCwgMCk7XG4gICAgfSxcblxuICAgIGFkZFRvKGRvbUNvbnRhaW5lcikge1xuICAgICAgICBkb21Db250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5kb21DYW52YXMpO1xuICAgIH0sXG5cbiAgICBnZXRZdXZJbWFnZSgpIHtcbiAgICAgICAgY29uc3QgaW1hZ2VEYXRhID0gdGhpcy5jdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KS5kYXRhLFxuICAgICAgICAgICAgICB5dXZEYXRhID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbWFnZURhdGEubGVuZ3RoOyBpICs9IDQpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gW2ltYWdlRGF0YVtpXSwgaW1hZ2VEYXRhW2krMV0sIGltYWdlRGF0YVtpKzJdXTtcbiAgICAgICAgICAgIHl1dkRhdGEucHVzaChDb2xvci5yZ2JUb1l1dihjb2xvcikpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHl1dkRhdGE7XG4gICAgfSxcblxuICAgIHNldFl1dkltYWdlKHl1dkltYWdlKSB7XG4gICAgICAgIGNvbnN0IGltYWdlRGF0YSA9IHRoaXMuY3R4LmNyZWF0ZUltYWdlRGF0YSh0aGlzLndpZHRoLCB0aGlzLmhlaWdodCksXG4gICAgICAgICAgICAgIGRhdGEgPSBpbWFnZURhdGEuZGF0YTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHl1dkltYWdlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhSW5kZXggPSBpKjQsXG4gICAgICAgICAgICAgICAgICBjb2xvciA9IENvbG9yLnl1dlRvUmdiKHl1dkltYWdlW2ldKTtcbiAgICAgICAgICAgIGRhdGFbZGF0YUluZGV4XSA9IGNvbG9yWzBdO1xuICAgICAgICAgICAgZGF0YVtkYXRhSW5kZXgrMV0gPSBjb2xvclsxXTtcbiAgICAgICAgICAgIGRhdGFbZGF0YUluZGV4KzJdID0gY29sb3JbMl07XG4gICAgICAgICAgICBkYXRhW2RhdGFJbmRleCszXSA9IDI1NTsgLy8gYWxwaGFcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY3R4LnB1dEltYWdlRGF0YShpbWFnZURhdGEsIDAsIDApO1xuICAgIH1cbn07XG5cbmNvbnN0IENhbnZhcyA9IHtcbiAgICBjcmVhdGUod2lkdGgsIGhlaWdodCkge1xuICAgICAgICBjb25zdCBjYW52YXMgPSBPYmplY3QuY3JlYXRlKHByb3RvKTtcbiAgICAgICAgY2FudmFzLndpZHRoID0gd2lkdGg7XG4gICAgICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgIGNhbnZhcy5pbml0KCk7XG5cbiAgICAgICAgcmV0dXJuIGNhbnZhcztcbiAgICB9XG59XG5cblxuZXhwb3J0IHtDYW52YXN9O1xuIiwiY29uc3QgQ29sb3IgPSB7XG5cbiAgICBkaXN0YW5jZShjb2xvcjEsIGNvbG9yMikge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KGNvbG9yMVswXSAtIGNvbG9yMlswXSwgMikgK1xuICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGgucG93KGNvbG9yMVsxXSAtIGNvbG9yMlsxXSwgMikgK1xuICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGgucG93KGNvbG9yMVsyXSAtIGNvbG9yMlsyXSwgMikpO1xuICAgIH0sXG5cbiAgICByZ2JUb1l1dihyZ2JDb2xvcikge1xuICAgICAgICBjb25zdCByID0gcmdiQ29sb3JbMF0sXG4gICAgICAgICAgICAgIGcgPSByZ2JDb2xvclsxXSxcbiAgICAgICAgICAgICAgYiA9IHJnYkNvbG9yWzJdLFxuICAgICAgICAgICAgICB5ID0gMC4yOTkgKiByICsgMC41ODcgKiBnICsgMC4xMTQgKiBiLFxuICAgICAgICAgICAgICB1ID0gMC40OTIgKiAoYiAtIHkpLFxuICAgICAgICAgICAgICB2ID0gMC44NzcgKiAociAtIHkpO1xuXG4gICAgICAgIHJldHVybiBbeSwgdSwgdl07XG4gICAgfSxcblxuICAgIHl1dlRvUmdiKHl1dkNvbG9yKSB7XG4gICAgICAgIGNvbnN0IHkgPSB5dXZDb2xvclswXSxcbiAgICAgICAgICAgICAgdSA9IHl1dkNvbG9yWzFdLFxuICAgICAgICAgICAgICB2ID0geXV2Q29sb3JbMl0sXG4gICAgICAgICAgICAgIHIgPSB5ICsgMS4xNCAqIHYsXG4gICAgICAgICAgICAgIGcgPSB5IC0gMC4zOTUgKiB1IC0gMC41ODEgKiB2LFxuICAgICAgICAgICAgICBiID0geSArIDIuMDMzICogdTtcblxuICAgICAgICByZXR1cm4gW3IsIGcsIGJdO1xuICAgIH0sXG5cbiAgICByYW5kb21ZdXZDb2xvcigpIHtcbiAgICAgICAgcmV0dXJuIENvbG9yLnJnYlRvWXV2KFtcbiAgICAgICAgICAgIE1hdGgucmFuZG9tKCkgKiAyNTUgfCAwLFxuICAgICAgICAgICAgTWF0aC5yYW5kb20oKSAqIDI1NSB8IDAsXG4gICAgICAgICAgICBNYXRoLnJhbmRvbSgpICogMjU1IHwgMFxuICAgICAgICBdKTtcbiAgICB9LFxuXG4gICAgTUFYX1lVVl9ESVNUQU5DRTogMjU1XG59O1xuXG5cbmV4cG9ydCB7Q29sb3J9O1xuIiwiaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQge0NvbG9yfSBmcm9tICcuL2NvbG9yJztcblxuY29uc3QgR0EgPSB7XG5cbiAgICBuZXh0R2VuZXJhdGlvbihwb3B1bGF0aW9uKSB7XG4gICAgICAgIHBvcHVsYXRpb24udG90YWxGaXRuZXNzID0gcG9wdWxhdGlvbi5yZWR1Y2UoKHN1bSwgcCkgPT4gc3VtICsgcC5maXRuZXNzLCAwKTtcbiAgICAgICAgcG9wdWxhdGlvbi5wcm9iYWJpbGl0aWVzID0gcG9wdWxhdGlvbi5tYXAocCA9PiBwLmZpdG5lc3MvcG9wdWxhdGlvbi50b3RhbEZpdG5lc3MpO1xuXG4gICAgICAgIHJldHVybiBVdGlscy5maWxsQXJyYXkocG9wdWxhdGlvbi5sZW5ndGgsICgpPT4ge1xuICAgICAgICAgICAgbGV0IHAxID0gdGhpcy5zZWxlY3RQYXJlbnQocG9wdWxhdGlvbiksXG4gICAgICAgICAgICAgICAgcDIgPSBwMTtcbiAgICAgICAgICAgIHdoaWxlIChwMiA9PT0gcDEpIHsgcDIgPSB0aGlzLnNlbGVjdFBhcmVudChwb3B1bGF0aW9uKTsgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5icmVlZChwMSwgcDIpO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgc2VsZWN0UGFyZW50KHBvcHVsYXRpb24pIHtcbiAgICAgICAgbGV0IHBhcmVudEluZGV4ID0gVXRpbHMuaW5kZXhCeVByb2JhYmlsaXRpZXMocG9wdWxhdGlvbi5wcm9iYWJpbGl0aWVzKTtcblxuICAgICAgICByZXR1cm4gcG9wdWxhdGlvbltwYXJlbnRJbmRleF07XG4gICAgfSxcblxuICAgIGJyZWVkKHBhcmVudDEsIHBhcmVudDIpIHtcbiAgICAgICAgbGV0IHBhcmVudHMgPSAoTWF0aC5yYW5kb20oKSA8IDAuNSkgPyBbcGFyZW50MSwgcGFyZW50Ml0gOiBbcGFyZW50MiwgcGFyZW50MV0sXG4gICAgICAgICAgICBjcm9zc292ZXJQb2ludCA9IFV0aWxzLnJhbmRJbnQocGFyZW50cy5sZW5ndGgtMSksXG4gICAgICAgICAgICBjaGlsZCA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFyZW50MS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGkgPD0gY3Jvc3NvdmVyUG9pbnQpIHtcbiAgICAgICAgICAgICAgICBjaGlsZC5wdXNoKHBhcmVudHNbMF1baV0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjaGlsZC5wdXNoKHBhcmVudHNbMV1baV0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgIG11dGF0ZShjaGlsZCwgaSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY2hpbGQ7XG4gICAgfSxcblxuICAgIE1VVEFUSU9OX1BST0I6IDAuMDVcbn07XG5cbmZ1bmN0aW9uIG11dGF0ZShnZW5vbWUsIGluZGV4KSB7XG4gICAgaWYgKE1hdGgucmFuZG9tKCkgPCBHQS5NVVRBVElPTl9QUk9CKSB7XG4gICAgICAgIGdlbm9tZVtpbmRleF0gPSBDb2xvci5yYW5kb21ZdXZDb2xvcigpO1xuICAgIH1cbn1cblxuXG5leHBvcnQge0dBfTtcbiIsImltcG9ydCB7Vmlld30gZnJvbSAnLi92aWV3JztcbmltcG9ydCB7QXBwfSBmcm9tICcuL2FwcCc7XG5cbmNvbnN0IHBvcHVsYXRpb25Db250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG9wdWxhdGlvbicpLFxuICAgICAgdGFyZ2V0Q29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhcmdldCcpLFxuICAgICAgdmlldyA9IFZpZXcuY3JlYXRlKHRhcmdldENvbnRhaW5lciwgcG9wdWxhdGlvbkNvbnRhaW5lcik7XG5cbnZpZXcubG9hZCgoKT0+IEFwcC5jcmVhdGUodmlldykuc3RhcnQoKSlcbiIsImltcG9ydCB7Q29sb3J9IGZyb20gJy4vY29sb3InO1xuXG5jb25zdCBVdGlscyA9IHtcblxuICAgIHJhbmRJbnQobWF4KSB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tICogbWF4KTtcbiAgICB9LFxuXG4gICAgc2FtcGxlKGFycmF5KSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gTWF0aC5yYW5kb20oKSAqIGFycmF5Lmxlbmd0aCB8IDA7XG4gICAgICAgIHJldHVybiBhcnJheVtpbmRleF07XG4gICAgfSxcblxuICAgIGZpbGxBcnJheShzaXplLCBnZW5lcmF0b3IpIHtcbiAgICAgICAgY29uc3QgYXJyYXkgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgICAgICAgYXJyYXkucHVzaChnZW5lcmF0b3IoaSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFycmF5O1xuICAgIH0sXG5cbiAgICBtYXhCeSh0cmFuc2Zvcm0sIGl0ZW1zKSB7XG4gICAgICAgIHJldHVybiBpdGVtcy5tYXAoaSA9PiAoXG4gICAgICAgICAgICB7aXRlbTogaSwgdmFsdWU6IHRyYW5zZm9ybShpKX1cbiAgICAgICAgKSkucmVkdWNlKChiZXN0LCBjdXJyZW50KSA9PiAoXG4gICAgICAgICAgICAoY3VycmVudC52YWx1ZSA+IGJlc3QudmFsdWUpID8gY3VycmVudCA6IGJlc3RcbiAgICAgICAgKSkuaXRlbTtcbiAgICB9LFxuXG4gICAgaW1hZ2VEaWZmZXJlbmNlKGltYWdlMSwgaW1hZ2UyKSB7XG4gICAgICAgIGxldCBzY29yZSA9IDA7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbWFnZTEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHNjb3JlICs9IENvbG9yLmRpc3RhbmNlKGltYWdlMVtpXSwgaW1hZ2UyW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzY29yZTtcbiAgICB9LFxuXG4gICAgaW5kZXhCeVByb2JhYmlsaXRpZXMocHJvYnMpIHtcbiAgICAgICAgY29uc3QgcHJvYiA9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgIGxldCBhY2N1ID0gcHJvYnNbMF0sXG4gICAgICAgICAgICBpID0gMDtcblxuICAgICAgICB3aGlsZSAoYWNjdSA8IHByb2IpIHtcbiAgICAgICAgICAgIGFjY3UgKz0gcHJvYnNbKytpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpO1xuICAgIH1cbn07XG5cblxuZXhwb3J0IHtVdGlsc307XG4iLCJpbXBvcnQge0NhbnZhc30gZnJvbSAnLi9jYW52YXMnO1xuaW1wb3J0IHtBcHB9IGZyb20gJy4vYXBwJztcblxuY29uc3QgaW1hZ2VfcGF0aCA9ICdpbWFnZXMvWW9zZW1pdGVfRmFsbHNfc21hbGwuanBnJztcbmNvbnN0IE5VTUJFUl9PRl9DQU5WQVNFUyA9IDQ7XG5cbmNvbnN0IHByb3RvID0ge1xuXG4gICAgbG9hZChjYWxsYmFjaykge1xuICAgICAgICB0aGlzLmltZyA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB0aGlzLmltZy5vbmxvYWQgPSB0aGlzLmxvYWRlZC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmZpbmlzaGVkTG9hZGluZ0NhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIHRoaXMuaW1nLnNyYyA9IGltYWdlX3BhdGg7XG4gICAgfSxcblxuICAgIHJlbmRlcihhcHApIHtcbiAgICAgICAgdGhpcy5wb3B1bGF0aW9uQ2FudmFzZXMuZm9yRWFjaCgoYywgaSkgPT4gYy5zZXRZdXZJbWFnZShhcHAucG9wdWxhdGlvbltpXSkpO1xuICAgICAgICB0aGlzLmN1cnJlbnRCZXN0Q2FudmFzLnNldFl1dkltYWdlKGFwcC5iZXN0KTtcbiAgICB9LFxuXG4gICAgbG9hZGVkKCkge1xuICAgICAgICB0aGlzLnRhcmdldEltYWdlQ2FudmFzID0gQ2FudmFzLmNyZWF0ZSh0aGlzLmltZy53aWR0aCwgdGhpcy5pbWcuaGVpZ2h0KTtcbiAgICAgICAgdGhpcy50YXJnZXRJbWFnZUNhbnZhcy5zZXRJbWFnZSh0aGlzLmltZyk7XG4gICAgICAgIHRoaXMudGFyZ2V0SW1hZ2VDYW52YXMuYWRkVG8odGhpcy50YXJnZXRDb250YWluZXIpO1xuXG4gICAgICAgIHRoaXMuY3VycmVudEJlc3RDYW52YXMgPSBDYW52YXMuY3JlYXRlKHRoaXMuaW1nLndpZHRoLCB0aGlzLmltZy5oZWlnaHQpO1xuICAgICAgICB0aGlzLmN1cnJlbnRCZXN0Q2FudmFzLmFkZFRvKHRoaXMudGFyZ2V0Q29udGFpbmVyKTtcblxuICAgICAgICB0aGlzLnBvcHVsYXRpb25DYW52YXNlcyA9IFtdO1xuXG4gICAgICAgIGNvbnN0IHRhYmxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGFibGUnKTtcbiAgICAgICAgbGV0IHJvdywgY29sO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTlVNQkVSX09GX0NBTlZBU0VTOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChpICUgMiA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7XG4gICAgICAgICAgICAgICAgdGFibGUuYXBwZW5kQ2hpbGQocm93KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5wb3B1bGF0aW9uQ2FudmFzZXNbaV0gPSBDYW52YXMuY3JlYXRlKHRoaXMuaW1nLndpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW1nLmhlaWdodCk7XG5cbiAgICAgICAgICAgIGNvbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgICAgICAgICB0aGlzLnBvcHVsYXRpb25DYW52YXNlc1tpXS5hZGRUbyhjb2wpO1xuICAgICAgICAgICAgcm93LmFwcGVuZENoaWxkKGNvbCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnBvcHVsYXRpb25Db250YWluZXIuYXBwZW5kQ2hpbGQodGFibGUpO1xuXG4gICAgICAgIHRoaXMuZmluaXNoZWRMb2FkaW5nQ2FsbGJhY2soKTtcbiAgICB9LFxuXG4gICAgZ2V0VGFyZ2V0SW1hZ2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRhcmdldEltYWdlQ2FudmFzLmdldFl1dkltYWdlKCk7XG4gICAgfVxufTtcblxuY29uc3QgVmlldyA9IHtcbiAgICBjcmVhdGUodGFyZ2V0Q29udGFpbmVyLCBwb3B1bGF0aW9uQ29udGFpbmVyKSB7XG4gICAgICAgIGNvbnN0IHZpZXcgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUocHJvdG8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dGFyZ2V0Q29udGFpbmVyOiB0YXJnZXRDb250YWluZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3B1bGF0aW9uQ29udGFpbmVyOiBwb3B1bGF0aW9uQ29udGFpbmVyfSk7XG4gICAgICAgIHJldHVybiB2aWV3O1xuICAgIH1cbn07XG5cblxuZXhwb3J0IHtWaWV3fTtcbiJdfQ==
