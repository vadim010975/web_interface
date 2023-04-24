<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
$FILE_DATA_TO_SEND = "data_to_send.csv";
$RECEIVED_DATA = "received_data.csv";

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

$dataFromFile = array();
$file = file_get_contents($FILE_DATA_TO_SEND); // получаем контент из файла
$dataFromFile["data_to_send"] = unserialize($file); // переводим из строки в массив
$file = file_get_contents($RECEIVED_DATA); // получаем контент из файла
$dataFromFile["received_data"] = unserialize($file); // переводим из строки в массив

$dataReceived = json_decode($_GET["data"], true); // декодируем пришедший запрос
// var_dump($dataToSend);

foreach (array_keys($dataReceived) as $firstKey) { // проходим по первым ключам полученного массива
	if (array_key_exists($firstKey, $dataFromFile)) { // есть ли ключ в массиве из файла
		foreach (array_keys($dataReceived[$firstKey]) as $secondKey) { // проходим по вторым ключам полученного массива
			if (array_key_exists($secondKey, $dataFromFile[$firstKey])) { // есть ли ключ в массиве из файла
				if (!empty($dataReceived[$firstKey][$secondKey] && $firstKey !== 'received_data')) {
					// если значение из полученного массива не пустое и первый ключ не 'received_data'
					$dataFromFile[$firstKey][$secondKey] = $dataReceived[$firstKey][$secondKey];
					// сохраняем значение из полученного массива в мвссив из файла
				} else { // если значение из полученного массива пустое или первый ключ 'received_data'
					$dataReceived[$firstKey][$secondKey] = $dataFromFile[$firstKey][$secondKey];
					// сохраняем значение из массива файла в полученный мвссив
				}
			}
		}
	}	
}

$f = fopen($FILE_DATA_TO_SEND, 'w');
$str_value = serialize($dataFromFile["data_to_send"]);
fwrite($f, $str_value);
fclose($f);

echo json_encode($dataReceived);
?>