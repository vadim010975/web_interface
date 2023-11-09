import Form from './Form.js';
import isEmpty from './isEmpty.js';
import FullData from './FullData.js';
import updateData from './updateData.js';

export default class HomeForm extends Form {
  constructor(id) {
    super(id);
    // запрос домашней формы
    this.formElement.querySelectorAll('#homeForm button').forEach(element => {
      // если была нажата любая кнопка
      element.onclick = () => {
        const requestData = {
          'data_to_send': {}
        }
        // второй ключ определяем по id нажатой кнопки
        if (FullData.data['data_to_send'][element.id] === 'on') {
          requestData['data_to_send'][element.id] = 'off';
        } else if (FullData.data['data_to_send'][element.id] === 'off') {
          requestData['data_to_send'][element.id] = 'on';
        }
        updateData(requestData).then(value => {
          FullData.insert(value);
          this.setParameters(value);
        });
      }
    });
  }

  setParameters(dataToSet) {
    if (!isEmpty(dataToSet)) {
      for (let param in dataToSet['received_data']) { // проходим по ключам dataToSet['received_data']
        const elem = this.formElement.querySelector(`#${param}`); // находим елемент с id как ключ
        if (elem) {
          switch (elem.tagName) {
            case 'DIV':
              if (elem.children.length === 0) {
                elem.textContent = dataToSet['received_data'][param];
              }
              break;
            case 'BUTTON':
              this.setColorButton(dataToSet, param);
              break;
            case 'IMG':
              this.setImgLamp(dataToSet, param);
          }
        }
      }
    }
  }

  // метод установки цвета кнопке
  setColorButton(dataObject, param) {
    // присваиваем значения ключа param свойств 'received_data' и 'data_to_send' соответствующим переменным
    const volueReceived = dataObject['received_data'][param];
    let volueToSend;
    if ((dataObject['data_to_send']).hasOwnProperty(param)) {
      volueToSend = dataObject['data_to_send'][param];
    } else {
      return;
    }
    if (!isEmpty(volueToSend) && !isEmpty(volueReceived)) {
      // в зависимости от значений переменных volueReceived и volueToSend устанавливаем цвет кнопки
      let colorButton;
      if (volueReceived === 'on' && volueToSend === 'on') {
        colorButton = 'rgba(0, 255, 127, 0.7)'; // зеленый
      } else if ((volueReceived === 'off' && volueToSend === 'on') || (volueReceived === 'on' && volueToSend === 'off')) {
        colorButton = 'rgba(255, 255, 0, 0.6)'; // желтый
      } else {
        colorButton = 'rgba(250, 128, 114, 0.9)'; // красный
      }
      const elem = this.formElement.querySelector(`#${param} svg`); // находим елемент
      if (elem) {
        elem.style.fill = colorButton;
      }
    }
  }

  // метод установки svg для изображения лампы
  setImgLamp(dataObject, param) {
    let volueReceived = dataObject['received_data'][param];// значение из файла полученных данных
    if (!isEmpty(volueReceived)) {
      let pathSvgLamp;
      if (volueReceived === 'on') {
        pathSvgLamp = '../src/svg/lamp_on.svg';
      } else {
        pathSvgLamp = '../src/svg/lamp_off.svg';
      }
      const elem = this.formElement.querySelector(`#${param}`);
      if (elem && elem.hasAttribute('src')) {
        elem.setAttribute('src', pathSvgLamp);
      }
    }
  }
}
