<?php


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Allow-Headers: Content-Type");
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

header("Access-Control-Allow-Origin: *");

$json = file_get_contents("php://input");
$data = json_decode($json, true);

$name = htmlspecialchars($data['name'] ?? '');
$email = htmlspecialchars($data['email'] ?? '');
$subject = htmlspecialchars($data['subject'] ?? '');
$requestType = htmlspecialchars($data['request-type'] ?? '');
$body = htmlspecialchars($data['body'] ?? '');

$recipient = "bastibuenz25@gmail.com";

$message = "
<b>Name:</b> $name <br>
<b>Email:</b> $email <br>
<b>Subject:</b> $subject <br>
<b>Typ:</b> $requestType <br><br>
$body
";

$headers = [
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=utf-8",
    "From: noreply@mywebsite.com",
     "Reply-To: $email"
];

mail($recipient, $subject, $message, implode("\r\n", $headers));

echo "OK";
