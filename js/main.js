const url = '/php/index.php';
let visibleFormId;
let dataFromServ = {};
let data = {
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

const sendData = async (data) => {
  let dataToChange;
  try {
    // использование метода fetch() для отправки асинхронного запроса на сервер
    let response = await fetch(`${url}?data=${JSON.stringify(data)}`);
    if (response.ok) {
      // получаем ответ в формате JSON и сохраняем его в data
      dataToChange = await response.json();
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

const setColorButton = (dataObject, param) => {
  let volueReceived = dataObject['received_data'][param];
  let volueToSend;
  if ((dataObject['data_to_send']).hasOwnProperty(param)) {
    volueToSend = dataObject['data_to_send'][param];
  } else {
    return;
  }
  if (!isEmpty(volueToSend) && !isEmpty(volueReceived)) {
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

const setImgLamp = (dataObject, param) => {
  let volueReceived = dataObject['received_data'][param];// значение из файла полученных данных
  if (!isEmpty(volueReceived)) {
    let pathSvgLamp;
    if (volueReceived === 'on') {
      pathSvgLamp = 'svg/lamp_on.svg';
    } else {
      pathSvgLamp = 'svg/lamp_off.svg';
    }
    let elem = document.querySelector(`#${param}`); // находим елемент
    if (elem && elem.hasAttribute('src')) {
      elem.setAttribute('src', pathSvgLamp);
    }
  }
}

const setOptionInSelect = (dataObject, param) => {
  let volueReceived = dataObject['received_data'][param];// значение из файла полученных данных
  let volueToSend;
  if ((dataObject['data_to_send']).hasOwnProperty(param)) { // содержится ли ключ в объекте
    volueToSend = dataObject['data_to_send'][param];// значение из файла для отправки данных
  } else {
    return;
  }
  if (!isEmpty(volueToSend) && !isEmpty(volueReceived)) {
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

const setVolueInInput = (dataObject, param) => {
  let volueReceived = dataObject['received_data'][param];// значение из файла полученных данных
  let volueToSend;
  if ((dataObject['data_to_send']).hasOwnProperty(param)) { // содержится ли ключ в объекте
    volueToSend = dataObject['data_to_send'][param];// значение из файла для отправки данных
  } else {
    return;
  }
  if (!isEmpty(volueToSend) && !isEmpty(volueReceived)) {
    let colorText;
    if (volueReceived !== volueToSend) {
      colorText = 'rgba(255, 255, 0, 0.6)';
    } else {
      colorText = 'rgba(0, 206, 209, 0.9)';
    }
    let elem = document.querySelector(`#${param}`); // находим елемент
    if (elem) {
      elem.value = volueToSend.toString();
      elem.style.color = colorText;
      document.getElementsByName(`${elem.name}Range`)[0].value = volueToSend;
    }
  }
}

const changeParameters = () => {
  console.log('вызов функции');
  console.log(visibleFormId);
  document.querySelectorAll(`#${visibleFormId} [id]`).forEach(element => {
    console.log(element.value);
    console.log(dataFromServ['data_to_send'][element.id]);
    if (element.value != dataFromServ['data_to_send'][element.id]) {
      console.log('out');
      return;
    }
    console.log('ok');
  });
}

// обработчик onclick на nav-list
document.querySelector('.nav-list').addEventListener('click', (event) => {
  // если на найденном элементе было событие и тег элемента BUTTON
  if (event.target && event.target.tagName === 'BUTTON') {
    // устанавливаем на все .main-form display: none
    document.querySelectorAll('.main-form').forEach((el) => {
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
});

// запрос главной формы
document.querySelectorAll('#formMain button').forEach(element => {
  element.onclick = function () {
    let dataToSend = {
      'data_to_send': {},
      'received_data': {}
    }
    let elements = document.querySelectorAll('#formMain [id]');
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

document.querySelectorAll("input, select").forEach(element => {
  element.oninput = function () {
    changeParameters();
  }
});






