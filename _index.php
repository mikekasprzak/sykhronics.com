<?php
if ( strstr($_SERVER["HTTP_HOST"], "sykhronics.com") ) { 
	$dir = "~~sykhronics/syk/";
	$page = $_SERVER["QUERY_STRING"];
?>
<meta http-equiv="Refresh" content="0; url=http://www.sykhronics.com">
<?php
} 
else if ( strstr($_SERVER["HTTP_HOST"], "gameartz.com") ) { 
	$dir = "syk/";
	$page = $_SERVER["QUERY_STRING"];
	include 'syk/index.php';
} 
else if ( strstr($_SERVER["HTTP_HOST"], "mikekasprzak.com") ) { 
	include 'mk/index.html';
} 
else if ( strstr($_SERVER["HTTP_HOST"], "gamecompo.com") ) { 
	include ( '--gamecompo-/index.html' );
} 
else if ( strstr($_SERVER["HTTP_HOST"], "pixelshader.com") ) { 
	include 'shader/index.html';
} 
else if ( strstr($_SERVER["HTTP_HOST"], "doooom.com") ) { 
	include 'sx/index.html';
} 
else if ( strstr($_SERVER["HTTP_HOST"], "tehcode.com") ) { 
	include 'teh/index.html';
} 
else if ( strstr($_SERVER["HTTP_HOST"], "15bit.com") ) { 
	include '15/index.html';
}
else if ( strstr($_SERVER["HTTP_HOST"], "digitailz.com") ) { 
	include 'dt/index.html';
} 
else if ( strstr($_SERVER["HTTP_HOST"], "digi-tail.com") ) { 
	include 'dt/index.html';
}
else if ( strstr($_SERVER["HTTP_HOST"], "digitail.net") ) { 
	include 'dt/index.html';
}
else if ( strstr($_SERVER["HTTP_HOST"], "digitail.org") ) { 
	include 'dt/index.html';
}
else if ( strstr($_SERVER["HTTP_HOST"], "digitailent.com") ) { 
	include 'dte/index.html';
} 
else if ( strstr($_SERVER["HTTP_HOST"], "sykhronix.com") ) { 
	include ( 'syx/index_main.html' );
} 
else if ( strstr($_SERVER["HTTP_HOST"], "puffbomb.net") ) { 
	include ( 'syx/index_main.html' );
} 
else {
	include '404.html';
} ?>