import FullData from './FullData.js';

export default class Controller {
  constructor() {
    this.mainPage = {};
    this.forms = {
      homeForm: {},
      modeHeatForm: {},
      setTemperatureForm: {},
      modeLightForm: {},
    }
    this.visibleFormId = 'homeForm';
  }

  init() {
    // обработчик onclick на nav-list
    const navListEl = document.querySelector('.nav-list');
    navListEl.addEventListener('click', (event) => {
      // если на найденном элементе было событие и тег элемента BUTTON
      if (event.target && event.target.tagName === 'BUTTON') {
        this.showForm(event.target.id.slice(6) + 'Form');
      }
    });

    // запрос при загрузке документа 
    document.addEventListener("DOMContentLoaded", () => { // событие загрузки
      FullData.update();
      this.forms[this.visibleFormId].update();
      // setInterval(() => {
        // this.forms[this.visibleFormId].update();
      // }, 10000);
    });
  }

  showForm(form) {
    // вызываем метод hide на всех формах
    Object.values(this.forms).forEach(el => el.hide());
    // вызываем метод show на соответствующую кнопке форму
    form = form[0].toLowerCase() + form.substring(1, form.length);
    this.visibleFormId = this.forms[form].id; 
    this.forms[form].show();
    this.updateVisibleForm()
  }

  updateVisibleForm() {
    this.forms[this.visibleFormId].update();
  }
}