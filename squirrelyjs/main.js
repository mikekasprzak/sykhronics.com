
function Out( Text ) {
	document.getElementById("out").innerHTML += Text + "<br/>";
}
function Err( Text ) {
	document.getElementById("out").innerHTML += "<span class='error'>" + Text + "</span><br/>";
}
function Info( Text ) {
	document.getElementById("out").innerHTML += "<span class='info'>" + Text + "</span><br/>";
}

function ClearOut() {
	document.getElementById("out").innerHTML = "";
}

// Emscripten Wrappers //
function _Out( Text ) {
	Out( Pointer_stringify(Text) );
}
function _Err( Text ) {
	Err( Pointer_stringify(Text) );
}
function _Info( Text ) {
	Info( Pointer_stringify(Text) );
}

function LoadDocument() {
	try {
		var NutFile = "default.nut";
		var Request = new XMLHttpRequest();
		Request.open( "GET", NutFile );
		Request.onreadystatechange = function() {
			if ( (Request.readyState == 4) && (Request.status == 200) ) {
				document.getElementById("in").value = Request.responseText;
				Info( "Loaded " + NutFile );
			}
		}
		Request.send();
	}
	catch (e) {
	}
}

function UpdateScroll() {
	var objDiv = document.getElementById("out");
	objDiv.scrollTop = objDiv.scrollHeight;
}	

function OnLoad() {
	Out( "Push <strong>Compile+Run</strong> to begin." );
	_VMCreate();
	LoadDocument();
}

function VMCompile() {
	Info( "Compiling Script..." );
	var ret = _VMCompile( allocate(intArrayFromString(document.getElementById("in").value), 'i8', ALLOC_STACK) );
	
	if ( ret ) 
		Info( "Success." );
	else
		Info( "Failed to Compile Script." );
		
	return ret;
}

function VMCompileRun() {
	if ( VMCompile() ) {
		_VMRun();
	}
}

function VMRun() {
	_VMRun();
}

function VMDump() {
	_VMDump();
}

