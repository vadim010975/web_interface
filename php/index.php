<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
$FILE_DATA_TO_SEND_TO_ARDUINO = "data_to_send.csv";
$FILE_DATA_RECEIVED_FROM_ARDUINO = "received_data.csv";

//$array = array(
//    "data_to_send" => array(
//		"switch_heat" => "on",
//		"switch_light" => "on",
//		"mode_heat_badroom" => "on",
//		"mode_heat_childrenroom" => "on",
//		"mode_heat_livingroom" => "on",
//		"mode_heat_hallway" => "on",
//		"set_temp_badroom" => 30,
//		"set_temp_childrenroom" => 30,
//		"set_temp_livingroom" => 30,
//		"set_temp_hallway" => 30,
//		"mode_light_zone1" => "on",
//		"mode_light_zone2" => "on"),
//    "received_data" => array(
//		"switch_heat" => "on",
//		"switch_light" => "on",
//		"mode_heat_badroom" => "on",
//		"mode_heat_childrenroom" => "on",
//		"mode_heat_livingroom" => "on",
//		"mode_heat_hallway" => "on",
//		"set_temp_badroom" => 30,
//		"set_temp_childrenroom" => 30,
//		"set_temp_livingroom" => 30,
//		"set_temp_hallway" => 30,
//		"mode_light_zone1" => "on",
//		"mode_light_zone2" => "on",
//		"temp_badroom" => 25,
//		"temp_childrenroom" => 25,
//		"temp_livingroom" => 25,
//		"temp_hallway" => 25,
//		"status_light_zone1" => "on",
//		"status_light_zone2" => "on"
//		)
//);

//
//$f = fopen($RECEIVED_DATA, 'w');
//$str_value = serialize($data["received_data"]);
//fwrite($f, $str_value);
//fclose($f);

$dataFromFiles = array();
$contentFromFile = file_get_contents($FILE_DATA_TO_SEND_TO_ARDUINO); // получаем контент из файла
$dataFromFiles["data_to_send"] = unserialize($contentFromFile); // переводим из строки в массив
$contentFromFile = file_get_contents($FILE_DATA_RECEIVED_FROM_ARDUINO); // получаем контент из файла
$dataFromFiles["received_data"] = unserialize($contentFromFile); // переводим из строки в массив

$dataFromWeb = json_decode($_GET["data"], true); // декодируем пришедший запрос
// var_dump($dataToSend);

foreach (array_keys($dataFromWeb) as $firstKey) { // проходим по первым ключам полученного массива
	if (array_key_exists($firstKey, $dataFromFiles)) { // есть ли ключ в массиве из файла
		foreach (array_keys($dataFromWeb[$firstKey]) as $secondKey) { // проходим по вторым ключам полученного массива
			if (array_key_exists($secondKey, $dataFromFiles[$firstKey])) { // есть ли ключ в массиве из файла
				if (!empty($dataFromWeb[$firstKey][$secondKey] && $firstKey !== 'received_data')) {
					// если значение из полученного массива не пустое и первый ключ не 'received_data'
					$dataFromFiles[$firstKey][$secondKey] = $dataFromWeb[$firstKey][$secondKey];
					// сохраняем значение из полученного массива в мвссив из файла
				} else { // если значение из полученного массива пустое или первый ключ 'received_data'
					$dataFromWeb[$firstKey][$secondKey] = $dataFromFiles[$firstKey][$secondKey];
					// сохраняем значение из массива файла в полученный мвссив
				}
			}
		}
	}	
}

$f = fopen($FILE_DATA_TO_SEND_TO_ARDUINO, 'w');
$str_value = serialize($dataFromFiles["data_to_send"]);
fwrite($f, $str_value);
fclose($f);

echo json_encode($dataFromWeb);

