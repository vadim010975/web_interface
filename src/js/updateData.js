const url = './src/php/index.php';

export default async function updateData(data) {
  let dataResponse;
  try {
    // использование метода fetch() для отправки асинхронного запроса на сервер
    console.log('отправляем:');
    console.log(data);
    const response = await fetch(`${url}?data=${JSON.stringify(data)}`);
    if (response.ok) {
      // получаем ответ в формате JSON и сохраняем его в dataToChange
      dataResponse = await response.json();
      console.log('получаем: ');
      console.log(dataResponse);
      return dataResponse;
    }
  }
  catch (error) {
    console.log(error);
  }
}