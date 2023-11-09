<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
$FILE_DATA_TO_SEND_TO_ARDUINO = "data_to_send.csv";
$FILE_DATA_RECEIVED_FROM_ARDUINO = "received_data.csv";

$dataFromFiles = array();
$secondKeysArray = array();
$contentFromFile = file_get_contents($FILE_DATA_TO_SEND_TO_ARDUINO); // получаем контент из файла
$dataFromFiles["data_to_send"] = unserialize($contentFromFile); // переводим из строки в массив
$contentFromFile = file_get_contents($FILE_DATA_RECEIVED_FROM_ARDUINO); // получаем контент из файла
$dataFromFiles["received_data"] = unserialize($contentFromFile); // переводим из строки в массив

$dataFromWeb = json_decode($_GET["data"], true); // декодируем пришедший запрос

if (array_key_exists("data_to_send", $dataFromWeb)) { // если есть ключ "data_to_send", значит изменение файла
  foreach (array_keys($dataFromWeb["data_to_send"]) as $secondKey) { // проход по всем ключам в "data_to_send"
    $dataFromFiles["data_to_send"][$secondKey] = $dataFromWeb["data_to_send"][$secondKey]; // сохраняем значения в $dataFromFiles
  }
  $secondKeysArray = $dataFromWeb["data_to_send"]; // сохраняем значения из ["data_to_send"] в вспомагательном $secondKeysArray
  $f = fopen($FILE_DATA_TO_SEND_TO_ARDUINO, 'w');
  $str_value = serialize($dataFromFiles["data_to_send"]);
  fwrite($f, $str_value);
  fclose($f);
} else {
  $secondKeysArray = $dataFromWeb["received_data"]; // сохраняем значения из ["received_data"] в вспомагательном $secondKeysArray
}

$contentFromFile = file_get_contents($FILE_DATA_TO_SEND_TO_ARDUINO); // получаем контент из файла
$dataFromFiles["data_to_send"] = unserialize($contentFromFile); // переводим из строки в массив

// записываем в ["data_to_send"] и ["received_data"] $dataFromWeb из $dataFromFiles значения ключей из $secondKeysArray
foreach (array_keys($secondKeysArray) as $secondKey) { 
  if (!empty($dataFromFiles["data_to_send"][$secondKey])) {
    $dataFromWeb["data_to_send"][$secondKey] = $dataFromFiles["data_to_send"][$secondKey];
  }
  $dataFromWeb["received_data"][$secondKey] = $dataFromFiles["received_data"][$secondKey];
}

echo json_encode($dataFromWeb);
?>