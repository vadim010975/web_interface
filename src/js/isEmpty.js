// функция проверки переменной на пустоту
export default function isEmpty(data) {
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