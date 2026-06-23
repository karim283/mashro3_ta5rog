<?php
$servername = "localhost";
$username = "root";
$password = "beso";
$dbname = "carcarex";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully to MySQL database '$dbname' using PHP!<br>";

// Test a simple query
$sql = "SHOW TABLES";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo "<h3>Tables in database:</h3><ul>";
    while($row = $result->fetch_array()) {
        echo "<li>" . $row[0] . "</li>";
    }
    echo "</ul>";
} else {
    echo "0 results (No tables found or empty database)";
}
$conn->close();
?>
