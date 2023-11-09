import updateData from './updateData.js';
import isEmpty from './isEmpty.js';


export default class FullData {
  static emptyData = {
    // data_to_send: {
    //   'switch_heat': '',
    //   'switch_light': '',
    //   'mode_heat_badroom': '',
    //   'mode_heat_childrenroom': '',
    //   'mode_heat_livingroom': '',
    //   'mode_heat_hallway': '',
    //   'set_temp_badroom': 0,
    //   'set_temp_childrenroom': 0,
    //   'set_temp_livingroom': 0,
    //   'set_temp_hallway': 0,
    //   'mode_light_zone1': '',
    //   'mode_light_zone2': ''
    // },
    received_data: {
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
  }

  static data = {};

  static update() {
    const newDate = updateData(FullData.emptyData);
    FullData.data = newDate;
  }

  static insert(newData) {
    // функция вставски объекта newData в объект fullData
    if (!isEmpty(newData) && typeof newData === 'object') {
      for (let firstKey in newData) {
        if (!FullData.data.hasOwnProperty(firstKey)) {
          FullData.data[firstKey] = {};
        }
        for (let secondKey in newData[firstKey]) {
          FullData.data[firstKey][secondKey] = newData[firstKey][secondKey];
        }
      }
    }
  }
}