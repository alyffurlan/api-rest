<?php
require_once('../config/database.php');
header("Content-Type: application/json");

$db = new Database();
$data = json_decode(file_get_contents("php://input"), true);

if($data["type"] == "GET") {
    echo json_encode($db);
}
// echo json_encode($data);
?>