import ModeHeatForm from './ModeHeatForm.js';
import isEmpty from './isEmpty.js';

export default class SetTemperatureForm extends ModeHeatForm {
  constructor(id) {
    super(id);
  }

  setParameters(dataToSet) {
    if (!isEmpty(dataToSet)) {
      for (let param in dataToSet['received_data']) { // проходим по ключам dataToSet['received_data']
        const elem = this.formElement.querySelector(`input[id=${param}]`); // находим елемент с id как ключ
        if (elem) {
          this.setVolueInInput(dataToSet, param);
        }
      }
    }
  }

  // функция установки значения для input
  setVolueInInput(dataObject, param) {
    // присваиваем значения ключа param свойств 'received_data' и 'data_to_send' соответствующим переменным
    let volueReceived = dataObject['received_data'][param];// значение из файла полученных данных
    let volueToSend;
    if ((dataObject['data_to_send']).hasOwnProperty(param)) { // содержится ли ключ в объекте
      volueToSend = dataObject['data_to_send'][param];// значение из файла для отправки данных
    } else {
      return;
    }
    if (!isEmpty(volueToSend) && !isEmpty(volueReceived)) {
      // В зависимости от равенства переменных volueToSend и volueReceived устанавливаем цвет input
      // устанавливаем value для input равным volueToSend
      // устанавливаем value для input type=Range равным volueToSend
      let colorText;
      if (volueReceived !== volueToSend) {
        colorText = 'rgba(255, 255, 0, 0.6)';
      } else {
        colorText = 'rgba(0, 206, 209, 0.9)';
      }
      let elem = this.formElement.querySelector(`#${param}`); // находим елемент
      if (elem) {
        elem.value = volueToSend;
        elem.style.color = colorText;
        this.formElement.querySelector(`[name=${elem.name}Range]`).value = volueToSend;
      }
    }
  }
}