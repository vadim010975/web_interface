import Controller from './src/js/Controller.js';
import HomeForm from './src/js/HomeForm.js';
import ModeHeatForm from './src/js/ModeHeatForm.js';
import SetTemperatureForm from './src/js/SetTemperatureForm.js';
import ModeLightForm from './src/js/ModeLightForm.js';

const controller = new Controller();
export default controller;
controller.forms.homeForm = new HomeForm('homeForm');
controller.forms.modeHeatForm = new ModeHeatForm('modeHeatForm');
controller.forms.setTemperatureForm = new SetTemperatureForm('setTemperatureForm');
controller.forms.modeLightForm = new ModeLightForm('modeLightForm');
controller.init();
