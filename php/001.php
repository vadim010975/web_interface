<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
$contentFromFiles_DATA_TO_SEND_TO_ARDUINO = "data_to_send.csv";
$RECEIVED_DATA = "received_data.csv";

$arrayConstant = array(
    "data_to_send" => array(
		"switch_heat" => "on",
		"switch_light" => "on",
		"mode_heat_badroom" => "on",
		"mode_heat_childrenroom" => "off",
		"mode_heat_livingroom" => "on",
		"mode_heat_hallway" => "on",
		"set_temp_badroom" => 30,
		"set_temp_childrenroom" => 30,
		"set_temp_livingroom" => 30,
		"set_temp_hallway" => 20,
		"mode_light_zone1" => "on",
		"mode_light_zone2" => "on"),
    "received_data" => array(
		"switch_heat" => "off",
		"switch_light" => "on",
		"mode_heat_badroom" => "on",
		"mode_heat_childrenroom" => "on",
		"mode_heat_livingroom" => "on",
		"mode_heat_hallway" => "on",
		"set_temp_badroom" => 30,
		"set_temp_childrenroom" => 27,
		"set_temp_livingroom" => 30,
		"set_temp_hallway" => 30,
		"mode_light_zone1" => "on",
		"mode_light_zone2" => "off",
		"temp_badroom" => 25,
		"temp_childrenroom" => 25,
		"temp_livingroom" => 25,
		"temp_hallway" => 25,
		"status_light_zone1" => "on",
		"status_light_zone2" => "off"
		)
);

$f = fopen($contentFromFiles_DATA_TO_SEND_TO_ARDUINO, 'w');
$str_value = serialize($arrayConstant["data_to_send"]);
fwrite($f, $str_value);
fclose($f);
$f = fopen($RECEIVED_DATA, 'w');
$str_value = serialize($arrayConstant["received_data"]);
fwrite($f, $str_value);
fclose($f);
?>