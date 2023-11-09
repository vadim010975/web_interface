<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
$FILE_DATA_TO_SEND_TO_ARDUINO = "data_to_send.csv";
$FILE_DATA_RECEIVED_FROM_ARDUINO = "received_data.csv";

if ($_GET["request"] == 1) {
	$contentFromFile = file_get_contents($FILE_DATA_TO_SEND_TO_ARDUINO); // получаем контент из файла
	$respnse = unserialize($contentFromFile); // переводим из строки в массив
	foreach ($respnse as $key => $value) {
		echo "{$key}:{$value}&";
	}
	
}
?>





