import updateData from './updateData.js';
import FullData from './FullData.js';

export default class HomeForm {
  constructor(id) {
    this.id = id;
    this.formElement = document.getElementById(this.id);
    this.controlledElements = [...this.formElement.querySelectorAll('[id]')];
  }
  show() {
    this.formElement.classList.remove('hidden');
  }

  hide() {
    this.formElement.classList.add('hidden');
  }

  update() {
    let requestData = {
      'received_data': {}
    };
    this.controlledElements.forEach(el => {
      requestData['received_data'][el.id] = '';
    });
    updateData(requestData).then(value => {
      FullData.insert(value);
      this.setParameters(value);
    });
  }
}
