import {View} from './view';
import {App} from './app';

const populationContainer = document.getElementById('population'),
      targetContainer = document.getElementById('target'),
      view = View.create(targetContainer, populationContainer);

view.load(()=> App.create(view).start())
