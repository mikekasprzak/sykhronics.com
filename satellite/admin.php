<html>
<title>Working...</title>
<body>

<?php

ini_set('display_errors', 1);

function ShowServers( $result ) {
	$t = time();
	while( $row = mysql_fetch_array($result) ) {
		$TimeStamp = strtotime( $row["TimeStamp"] );
		
		echo $row["ServerID"];
		echo " -- " . $row["Address"] . ":" . $row["Port"] . " -- Version: " . $row["Version"];
		echo " -- GPS: " . $row["Latitude"] . ", " . $row["Longitude"] . " -- " . $row["Info"];
//		echo " -- " . date( 'Y-m-d H:i:s', $TimeStamp ) . " (" . $TimeStamp . " == " . ($t - $TimeStamp) . ")";
		echo " -- " . $TimeStamp . " (" . ($t - $TimeStamp) . ")";
		echo "<br />";
	}
	mysql_data_seek( $result, 0 );
	
	echo "<br />Rows returned: " . mysql_num_rows( $result ) . "<br />";
}

// Get Settings //
include "__dbsettings.php";
$DB_SERVER = $DB_SERVERNAME . ":" . $DB_SERVERPORT;

// TODO: confirm all variables exist //

// Tables //
$T_MM = "Matchmaking";

// Open Database Connection //
$DB_CONNECTION = mysql_connect($DB_SERVER,$DB_USERNAME,$DB_PASSWORD);
if ( !$DB_CONNECTION ) {
	die( "Unable to connect to database :(" );
}

// Select the Database //
mysql_select_db( $DB, $DB_CONNECTION );

$AnnAddress = $_SERVER["REMOTE_ADDR"];
$AnnPort = 10240;

// Do Actions //
if ( $_GET["action"] == "create_tables" ) {
	// IPv4 Address: 15 chars
	// IPv6 Address: 39 chars
	
	// Info is a special dataset providing some user info //
	// 0-1 -- Server Code (D_ - Dedicated, U_ - User)
	//        _1 - Official Game Mode Numbers
	//        _D - DeathMatch shorthand
	//        _C - Custom shorthand
	//        _T - Team shorthand
	// 2-3 -- Country Code (CA - Canada)
	// 4-5 -- Device Code (wX - Windows XP 32bit, W8 - Windows 8 64bit, wR - Windows RT 32bit)
	//        w_ - Windows 32bit, W_ - Windows 64bit
	//           _2 - Windows 2000, _X - XP, _V - Vista, _8 - Windows 8, _R - Windows RT (ARM), _S - Windows Server
	//        m_ - Mac OSX 32bit, M_ - Mac OSX 64bit
	//           _7 - OSX Major Version, Alphabet are 10+
	//        l_ - Linux 32bit, L_ - Linux 64bit
	//        u_ - Unix 32bit, U_ - Unix 64bit (interchangable with Linux)
	//           _U - Ubuntu, _D - Debian -- ("cat /etc/issue" ... "/etc/debian_version" is too vague)
	//		     _R - Redhat, _F - Fedora, _C - CentOS -- (cat /etc/redhat-release)
	//           _B - FreeBSD (I know, it's not Linux), _b - Other BSD -- ??
	//           Lower case letters on Linux imply non Intel Architecture (ARM, MIPS)
	//        a_ - Android 32bit, A_ - Android 64bit
	//		     _9 - Use Major Android API Versions, Alphabet are 10+
	//           Upper case means ARM, lower case means Intel (or MIPS)
	//           This is okay because the only Intel Android versions I care about is API 10+ (2.3.3+)
	//        i_ - iOS Handset, I_ iOS Tablet
	//           _6 - OS Version
	//        p_ - PlayStation 32bit, P_ - PlayStation 64bit
	//           _V - PlayStation Vita, _3 - PlayStation 3
	//        r_ - RIM 32bit Device, R_ - RIM 64bit Device
	//           _B - BlackBerry, _P - PlayBook
	//        h_ - Windows Phone 32bit, H_ - Windows Phone 64bit
	//           _8 - Windows Phone 8
	//        x_ - Xbox 32bit, X_ - Xbox 64bit
	//           _3 - Xbox 360
	//        n_ - Nintendo Handheld, N_ - Nintendo Console
	//           _3 - 3DS, _W - Wii, _U - Wii U
	//        s_ - Special 32bit, _S - Special 64bit -- Unspecific devices w/o a category of their own
	//           _1 - Ouya?
	// 6-7 -- ??
	
	// NOTE: No extra data on matchmaking server, just the basics. //
	// GPS Coordinates are for optimizing the server order locally, to know who to ping. //
	$sql =	"CREATE TABLE " . $T_MM . " " .
			"( 
			ServerID int NOT NULL AUTO_INCREMENT,
			PRIMARY KEY(ServerID),
			TimeStamp timestamp,
			Address varchar(40),
			Port int NOT NULL,
			Version int NOT NULL,
			Longitude float(24) NOT NULL,
			Latitude float(24) NOT NULL,
			Info varchar(8)
			)";
	echo $sql . "<br />";
	mysql_query( $sql, $DB_CONNECTION );
	echo "Created";
}
else if ( $_GET["action"] == "delete_tables" ) {
	$sql = "DROP TABLE " . $T_MM;
	echo $sql . "<br />";
	mysql_query( $sql, $DB_CONNECTION );
	echo "Deleted";
}
else {
	$t = time();
	echo "<h1>Servers -- " . date( 'Y-m-d H:i:s', $t ) . " (" . $t . ")</h1>";	
	
	// http://www.richardlord.net/blog/dates-in-php-and-mysql
	
	$sql = "SELECT * FROM " . $T_MM . " LIMIT 100";
	$result = mysql_query( $sql, $DB_CONNECTION );

	ShowServers( $result );
}

// Close Database Connection //
mysql_close( $DB_CONNECTION );

?>

<hr />

<form action="<?php echo $_SERVER['PHP_SELF'] ?>" method="get">
<input type="hidden" name="action" value="" />
<input type="Submit" value="Refresh" />
</form> 

<?php
if ($_GET["admin"] == "true") {
?>

<form action="" method="get">
<input type="hidden" name="action" value="create_tables" />
<input type="Submit" value="Create Tables" />
</form> 

<form action="" method="get">
<input type="hidden" name="action" value="delete_tables" />
<input type="Submit" value="Delete Tables" />
</form> 

<?php
};
?>

</body>
</html>
