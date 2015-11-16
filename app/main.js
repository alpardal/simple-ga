import {App} from './app';

const poolContainer = document.getElementById('gene-pool'),
      targetContainer = document.getElementById('target'),
      app = App.create(targetContainer, poolContainer);
app.start();
