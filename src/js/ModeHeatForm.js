import Form from './Form.js';
import isEmpty from './isEmpty.js';
import FullData from './FullData.js';
import updateData from './updateData.js';

export default class ModeHeatForm extends Form {
  constructor(id) {
    super(id);
    // действия при событии ввода данных в поля input и select
    this.formElement.querySelectorAll(`input, select`).forEach(element => {
      // событие изиенения значения в элементах input, select
      element.oninput = () => {
        // значения в элементе input[type="range"] копируем в элемент input[type="number"]
        if (element.matches('input[type="range"]') && element.name.endsWith('Range')) {
          let elementTypeNumber = document.getElementsByName(element.name.slice(0, -5))[0];
          if (elementTypeNumber) {
            elementTypeNumber.value = Math.round(element.valueAsNumber);
          }
        }
        // значения в элементе input[type="number"] копируем в элемент input[type="range"]
        if (element.matches('input[type="number"]')) {
          let elementTypeRange = document.getElementsByName(`${element.name}Range`)[0];
          if (elementTypeRange) {
            elementTypeRange.value = element.valueAsNumber;
          }
        }
        // вызываем функцию добавления или исключения в форму кнопки отправки-загрузки данных
        this.showOrHideButton();
      }
    });
  }

  // метод добавления или исключения в форму кнопки отправки-загрузки данных
  showOrHideButton() {
    //const visibleForm = document.querySelector(`#${visibleFormId}`); // элемент видимая форма
    const insertElement = this.formElement.querySelector('.form-wrap-button-send'); // элемент кнопка отправки в видимой форме
    // запускаем сравнение данных видимой формы и соответствующих данных из dataFromServ
    // true если были изменения
    const checkParam = this.isChangeParameters();
    if (checkParam && !insertElement) {
      this.formElement.insertAdjacentHTML('beforeend', '<div class="form-wrap-button-send"><button type="button" class="form-button-send"><img src="./src/svg/reload.svg" alt="кнопка отправки" class="form-button-send-img"></button></div>');
      this.setEventFromButton();
    } else if (!checkParam && insertElement) {
      insertElement.remove();
    }
  }

  // метод проверки есть ли изменения между текущими значениями формы и значениями FullData.data['data_to_send']
  isChangeParameters() {
    let result = false;
    // элемнты с id из формы
    this.controlledElements.forEach(element => {
      // если значение элемента не равно сохраненному в FullData.data['data_to_send'], т.е. только что изменено
      if (element.value != FullData.data['data_to_send'][element.id]) {
        result = true;
      }
    });
    return result;
  }

  // метод установки события на кнопку - запрос НЕ домашней формы
  setEventFromButton() {
    const elementButton = this.formElement.querySelector('button');
    if (elementButton) {
      elementButton.onclick = () => {
        const requestData = {
          'data_to_send': {}
        }
        // все элементы формы имеющие id
        this.controlledElements.forEach(element => {
          // если значение элемента не равно сохраненному в FullData.data['data_to_send'], т.е. только что изменено
          if (element.value !== FullData.data['data_to_send'][element.id]) {
            if (element.matches('input[type="number"]')) {
              requestData['data_to_send'][element.id] = element.valueAsNumber;
            } else {
              requestData['data_to_send'][element.id] = element.value;
            }
            // requestData['received_data'][element.id] = '';
          }
        });
        updateData(requestData).then(value => {
          FullData.insert(value);
          this.setParameters(value);
          this.showOrHideButton();
        });
      }
    }
  }

  setParameters(dataToSet) {
    if (!isEmpty(dataToSet)) {
      for (let param in dataToSet['received_data']) { // проходим по ключам dataToSet['received_data']
        const elem = this.formElement.querySelector(`select[id=${param}]`); // находим елемент с id как ключ
        if (elem) {
          this.setOptionInSelect(dataToSet, param);
        }
      }
    }
  }

  // метод установки option в select
  setOptionInSelect(dataObject, param) {
    // присваиваем значения ключа param свойств 'received_data' и 'data_to_send' соответствующим переменным
    let volueReceived = dataObject['received_data'][param];// значение из файла полученных данных
    let volueToSend;
    if ((dataObject['data_to_send']).hasOwnProperty(param)) { // содержится ли ключ в объекте
      volueToSend = dataObject['data_to_send'][param];// значение из файла для отправки данных
    } else {
      return;
    }
    if (!isEmpty(volueToSend) && !isEmpty(volueReceived)) {
      // В зависимости от равенства переменных volueToSend и volueReceived устанавливаем цвет select
      // устанавливаем value для select равным volueToSend
      let colorText;
      if (volueReceived !== volueToSend) {
        colorText = 'rgba(255, 255, 0, 0.6)';
      } else {
        colorText = 'rgba(0, 206, 209, 0.9)';
      }
      const elem = this.formElement.querySelector(`#${param}`); // находим елемент
      if (elem) {
        elem.value = volueToSend;
        elem.style.color = colorText;
      }
    }
  }
}