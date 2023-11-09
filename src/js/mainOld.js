const url = './src/php/index.php';
let visibleFormId = "homeForm"; // id формы видимой в данный момент
const dataFromServ = {}; // переменная для объекта, загруженного из сервера
const data = {
  'data_to_send': {
    'switch_heat': '',
    'switch_light': '',
    'mode_heat_badroom': '',
    'mode_heat_childrenroom': '',
    'mode_heat_livingroom': '',
    'mode_heat_hallway': '',
    'set_temp_badroom': 0,
    'set_temp_childrenroom': 0,
    'set_temp_livingroom': 0,
    'set_temp_hallway': 0,
    'mode_light_zone1': '',
    'mode_light_zone2': ''
  },
  'received_data': {
    'switch_heat': '',
    'switch_light': '',
    'mode_heat_badroom': '',
    'mode_heat_childrenroom': '',
    'mode_heat_livingroom': '',
    'mode_heat_hallway': '',
    'set_temp_badroom': 0,
    'set_temp_childrenroom': 0,
    'set_temp_livingroom': 0,
    'set_temp_hallway': 0,
    'mode_light_zone1': '',
    'mode_light_zone2': '',
    'temp_badroom': 0,
    'temp_childrenroom': 0,
    'temp_livingroom': 0,
    'temp_hallway': 0,
    'status_light_zone1': '',
    'status_light_zone2': ''
  }
};


// функция вставски объекта newData в объект baseData
const changeData = (newData, baseData) => {
  if (!isEmpty(newData) && typeof newData === 'object' && typeof baseData === 'object') {
    for (let firstKey in newData) {
      if (!baseData.hasOwnProperty(firstKey)) {
        baseData[firstKey] = {};
      }
      for (let secondKey in newData[firstKey]) {
        baseData[firstKey][secondKey] = newData[firstKey][secondKey];
      }
    }
  }
}

// функция отправки запроса. Аргумент GET запрос
const sendData = async (data) => {
  let dataToChange;
  try {
    // использование метода fetch() для отправки асинхронного запроса на сервер
    console.log('отправляем:');
    console.log(data);
    const response = await fetch(`${url}?data=${JSON.stringify(data)}`);
    if (response.ok) {
      // получаем ответ в формате JSON и сохраняем его в dataToChange
      dataToChange = await response.json();
      console.log('получаем: ');
      console.log(dataToChange);
    }
  }
  catch (error) {
    console.log(error);
  }
  if (!isEmpty(dataToChange)) {
    changeData(dataToChange, dataFromServ);
    for (let param in dataToChange['received_data']) { // проходим по ключам dataToChange['received_data']
      let elem = document.getElementById(param); // находим елемент с id как ключ
      if (elem) {
        switch (elem.tagName) {
          case 'DIV':
            if (elem.children.length === 0) {
              elem.textContent = dataToChange['received_data'][param];
            }
            break;
          case 'BUTTON':
            setColorButton(dataToChange, param);
            break;
          case 'IMG':
            setImgLamp(dataToChange, param);
            break;
          case 'SELECT':
            setOptionInSelect(dataToChange, param);
            break;
          case 'INPUT':
            setVolueInInput(dataToChange, param);
        }
      }
    }
  }
}

// функция проверки переменной на пустоту
const isEmpty = (data) => {
  if (typeof data === 'object' || Array.isArray(data)) {
    if ((Object.keys(data).length === 0) || (data.length === 0)) {
      return true;
    }
  } else {
    switch (data) {
      case typeof (data) === "undefined":
      case "":
      case 0:
      case "0":
      case null:
      case false:
        return true;
    }
  }
  return false;
}

// функция установки цвета кнопке
const setColorButton = (dataObject, param) => {
  // присваиваем значения ключа param свойств 'received_data' и 'data_to_send' соответствующим переменным
  let volueReceived = dataObject['received_data'][param];
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
    let elem = document.querySelector(`#${param} svg`); // находим елемент
    if (elem) {
      elem.style.fill = colorButton;
    }
  }
}

// функция установки svg для изображения лампы
const setImgLamp = (dataObject, param) => {
  let volueReceived = dataObject['received_data'][param];// значение из файла полученных данных
  if (!isEmpty(volueReceived)) {
    let pathSvgLamp;
    if (volueReceived === 'on') {
      pathSvgLamp = '../src/svg/lamp_on.svg';
    } else {
      pathSvgLamp = '../src/svg/lamp_off.svg';
    }
    let elem = document.querySelector(`#${param}`); // находим елемент
    if (elem && elem.hasAttribute('src')) {
      elem.setAttribute('src', pathSvgLamp);
    }
  }
}

// функция установки option в select
const setOptionInSelect = (dataObject, param) => {
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
    let elem = document.querySelector(`#${param}`); // находим елемент
    if (elem) {
      elem.value = volueToSend;
      elem.style.color = colorText;
    }
  }
}

// функция установки значения для input
const setVolueInInput = (dataObject, param) => {
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
    let elem = document.querySelector(`#${param}`); // находим елемент
    if (elem) {
      elem.value = volueToSend;
      elem.style.color = colorText;
      document.getElementsByName(`${elem.name}Range`)[0].value = volueToSend;
    }
  }
}

// функция установки события на кнопку - запрос НЕ домашней формы
const setEventFromButton = () => {
  let elementButton = document.querySelector(`#${visibleFormId} button`);
  if (elementButton) {
    elementButton.onclick = function () {
      let dataToSend = {
        'data_to_send': {},
        'received_data': {}
      }
      // находим все элементы видимой формы имеющие id
      let elements = document.querySelectorAll(`#${visibleFormId} [id]`);
      elements.forEach(element => {
        // если значение элемента не равно сохраненному в dataFromServ['data_to_send'], т.е. только что изменено
        if (element.value !== dataFromServ['data_to_send'][element.id]) {
          if (element.matches('input[type="number"]')) {
            dataToSend['data_to_send'][element.id] = element.valueAsNumber;
          } else {
            dataToSend['data_to_send'][element.id] = element.value;
          }
          dataToSend['received_data'][element.id] = '';
        }
      });
      sendData(dataToSend).then(() => showOrHideButton());
    }
  }
}

// функция проверки есть ли изменения между текущими значениями формы и значениями dataFromServ['data_to_send']
function isChangeParameters() {
  let result = false;
  // выбираем все элемнты с id из видимой формы
  document.querySelectorAll(`#${visibleFormId} [id]`).forEach(element => {
    // если значение элемента не равно сохраненному в dataFromServ['data_to_send'], т.е. только что изменено
    if (element.value != dataFromServ['data_to_send'][element.id]) {
      result = true;
    }
  });
  return result;
}

// функция добавления или исключения в форму кнопки отправки-загрузки данных
const showOrHideButton = () => {
  const visibleForm = document.querySelector(`#${visibleFormId}`); // элемент видимая форма
  const insertElement = document.querySelector(`#${visibleFormId} .form-wrap-button-send`); // элемент кнопка отправки в видимой форме
  // запускаем сравнение данных видимой формы и соответствующих данных из dataFromServ
  // true если были изменения
  const checkParam = isChangeParameters();
  if (checkParam && !insertElement) {
    visibleForm.insertAdjacentHTML('beforeend', '<div class="form-wrap-button-send"><button type="button" class="form-button-send"><img src="./src/svg/reload.svg" alt="кнопка отправки" class="form-button-send-img"></button></div>');
    setEventFromButton();
  } else if (!checkParam && insertElement) {
    insertElement.remove();
  }
}

// функция возвращает объект с обнуленными значениями видимой формы
function updatingVisibleFormData() {
  console.log(visibleFormId);
  // выбираем все элементы внутри формы имеющие атрибут id
  let elements = document.querySelectorAll(`#${visibleFormId} [id]`);
  let dataToSend = {
    'data_to_send': {},
    'received_data': {}
  };
  elements.forEach(element => {
    dataToSend['data_to_send'][element.id] = '';
    dataToSend['received_data'][element.id] = '';
  });
  return dataToSend;
}


// обработчик onclick на nav-list
document.querySelector('.nav-list').addEventListener('click', (event) => {
  // если на найденном элементе было событие и тег элемента BUTTON
  if (event.target && event.target.tagName === 'BUTTON') {
    // устанавливаем на все .form display: none
    document.querySelectorAll('.form').forEach((el) => {
      el.classList.add('hidden');
    });
    // устанавливаем на соответствующую кнопке форму display.
    visibleFormId = 'form' + event.target.id.slice(6);
    document.getElementById(visibleFormId).classList.remove('hidden');
  }
});

// запрос при загрузке документа
document.addEventListener("DOMContentLoaded", () => { // событие загрузки
  sendData(data);
  setInterval(() => {
    sendData(updatingVisibleFormData());
  }, 10000);
});

// запрос главной формы
document.querySelectorAll('#homeForm button').forEach(element => {
  // если была нажата любая кнопка
  element.onclick = function () {
    let dataToSend = {
      'data_to_send': {},
      'received_data': {}
    }
    // находим все элементы формы homeForm имеющие id
    let elements = document.querySelectorAll('#homeForm [id]');
    // добавляем в объект свойства равные id элементов с пустыми значениями
    for (let i = 0; i < elements.length; i++) {
      dataToSend['data_to_send'][elements[i].id] = '';
      dataToSend['received_data'][elements[i].id] = '';
    }
    // второй ключ определяем по id нажатой кнопки
    if (dataFromServ['data_to_send'][this.id] === 'on') {
      dataToSend['data_to_send'][this.id] = 'off';
    } else if (dataFromServ['data_to_send'][this.id] === 'off') {
      dataToSend['data_to_send'][this.id] = 'on';
    }
    sendData(dataToSend);
  }
});


// действия при вводе данных в поля input и select
document.querySelectorAll(`input, select`).forEach(element => {
  // если происходит изиенение значения в элементах input, select
  element.oninput = function () {
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
    showOrHideButton();
  }
});






