<?php
if (extension_loaded('mysqli')) {
    echo "mysqli extension is loaded.<br>";
} else {
    echo "mysqli extension is NOT loaded.<br>";
}

if (extension_loaded('pdo_mysql')) {
    echo "pdo_mysql extension is loaded.<br>";
} else {
    echo "pdo_mysql extension is NOT loaded.<br>";
}
?>
