<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
$FILE_DATA_TO_SEND_TO_ARDUINO = "data_to_send.csv";
$FILE_DATA_RECEIVED_FROM_ARDUINO = "received_data.csv";

// зпись данных из файла на отправку в файл полученных данных
$dataFromFileToSend = array();
$dataFromFileToSend = unserialize(file_get_contents($FILE_DATA_TO_SEND_TO_ARDUINO)); // данные из файла для отправки
$dataFromFileToReceived = array();
$dataFromFileToReceived = unserialize(file_get_contents($FILE_DATA_RECEIVED_FROM_ARDUINO)); // данные из файла для получения
foreach (array_keys($dataFromFileToSend) as $key) { // проходим по ключам данных из файла на отправку
if (array_key_exists($key, $dataFromFileToReceived)) {
 		$dataFromFileToReceived[$key] = $dataFromFileToSend[$key];
 	}
}
$f = fopen($FILE_DATA_RECEIVED_FROM_ARDUINO, 'w');
fwrite($f, serialize($dataFromFileToReceived));
fclose($f);