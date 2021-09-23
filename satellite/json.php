<?php
header('Content-Type: application/json');

// Get Settings //
include "__dbsettings.php";
$DB_SERVER = $DB_SERVERNAME . ":" . $DB_SERVERPORT;

// TODO: confirm all variables exist //

// Tables //
$T_MM = "Matchmaking";


function GenServerJSON( $result ) {
	$rows = mysql_num_rows( $result );
	
	$text = '"ServerCount":' . $rows;
	if ( $rows > 0 ) {
		$text .= ",\n";
		$text .= '"Server": [' . "\n";
		
		for( $idx = 0; $idx < $rows; $idx++ ) {
			$row = mysql_fetch_array($result);
			
			$text .= 
				'{ "Address":"' . $row["Address"] . '"' .
				', "Port":' . $row["Port"] . 
				', "Version":' . $row["Version"] . 
				', "Latitude":' . $row["Latitude"] . 
				', "Longitude":' . $row["Longitude"] . 
				', "Info":"' . $row["Info"] . '"' .
				' }';

			if ( $idx < $rows - 1 )
				$text .= ',';
			
			$text .= "\n";
		}
		mysql_data_seek( $result, 0 );
		
		$text .= ']';
	}
	
	return $text;
}


// Open Database Connection //
$DB_CONNECTION = mysql_connect($DB_SERVER,$DB_USERNAME,$DB_PASSWORD);
if ( !$DB_CONNECTION ) {
//	die( '{ "Action":"Error", "Message","Unable to connect to database :(" }' );
	die( '{ "Action":"Error", "Message","' . mysql_error() . '" }' );
}

// Select the Database //
mysql_select_db( $DB, $DB_CONNECTION );

$AnnAddress = $_SERVER["REMOTE_ADDR"];
$AnnPort = 1;
$AnnVersion = 2;
$AnnLatitude = 2.2;
$AnnLongitude = 3.3;
$AnnInfo = "??______";

$LimitString = "";//" LIMIT 100";

// Do Actions //
if ( $_POST["action"] == "update" ) {
	// TODO: Sanitize //
//	if ( isset( $_POST['Address'] ) )
//		$AnnAddress = $_POST['Address'];
	if ( isset( $_POST['Port'] ) )
		$AnnPort = $_POST['Port'];
	else
		die( '{ "Action":"Error", "Message","No Port :(" }' );
	if ( isset( $_POST['Version'] ) )
		$AnnVersion = $_POST['Version'];
	else
		die( '{ "Action":"Error", "Message","No Version :(" }' );
	if ( isset( $_POST['Latitude'] ) )
		$AnnLatitude = $_POST['Latitude'];
	if ( isset( $_POST['Longitude'] ) )
		$AnnLongitude = $_POST['Longitude'];
	if ( isset( $_POST['Info'] ) )
		$AnnInfo = $_POST['Info'];
		
	$PreHash = $AnnPort . "&" . $AnnAddress . "&" . $AnnVersion . "&" . "ChupacabraSatellites";
	$Hashed = MD5( $PreHash );
	
	if ( $Hashed != $_POST['Key'] ) {
		die( '{ "Action":"Error", "Message","Mommy" }' );
	}
	
	$sql = "SELECT * FROM " . $T_MM . " WHERE Address='" . $AnnAddress . "' AND Port=" . $AnnPort . $LimitString;
	$result = mysql_query( $sql, $DB_CONNECTION );

	echo "{\n";
	echo '"Action":"Update",' . "\n";
	
//	echo '"Me": "' . $Hashed . '",' . "\n";
//	echo '"You":"' . $_POST['Key'] . '",' . "\n";
	
	echo GenServerJSON( $result ) . ",\n";
		
	if ( mysql_num_rows( $result ) != 0 ) {
		// Do Update //
		$row = mysql_fetch_array($result);
		
		// NOTE: If data is unchanged, the timestamp will not update //
		//   TimeStamp=NULL is a feature, automatically sets to current time //
		$sql = "UPDATE " . $T_MM .
			" SET TimeStamp=NULL, Version=" . $AnnVersion . ", Latitude=" . $AnnLatitude . ", Longitude=" . $AnnLongitude . ", Info='" . $AnnInfo . "'" .
			" WHERE ServerID=" . $row["ServerID"];

//		echo $sql . "<br />";
		echo '"Message","Updated"' . "\n";
		$result = mysql_query( $sql, $DB_CONNECTION );
	}
	else {
		// Do Insert //
		$sql = "INSERT INTO " . $T_MM . " " .
				"(Address,Port,Version,Latitude,Longitude,Info) " .
				"VALUES ('" . $AnnAddress . "'," . $AnnPort . "," .
				$AnnVersion . ", " . $AnnLatitude . ", " . $AnnLongitude . ", '" . $AnnInfo ."')";
//		echo $sql . "<br />";
		echo '"Message","Inserted"' . "\n";
		mysql_query( $sql, $DB_CONNECTION );
	}
	
	echo "}\n";	
}
//else if ( $_GET["action"] == "list" ) {
else {
	$sql = "SELECT * FROM " . $T_MM . $LimitString;
	$result = mysql_query( $sql, $DB_CONNECTION );
	
	echo "{\n";
	echo '"Action":"List",' . "\n";
	echo GenServerJSON( $result ) . "\n";
	echo "}\n";
}

// Close Database Connection //
mysql_close( $DB_CONNECTION );

?>
