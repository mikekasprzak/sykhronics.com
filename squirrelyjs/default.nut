// - ------------------------------------------------------------------------------------------ - //
// Specify a 'tile_w' and 'tile_h' to define the size of each tile/frame //
// Specify an 'anchor_x' and 'anchor_y' to describe where his bottom/base point is, if not center //
ArtFiles <- [
	{ "name":"Man", "value":"art/dude_anims.png", "tile_w":128, "tile_h":128, "anchor_y":128 },
	
	{ "name":"BG1", "value":"art/toombg_bg_01.png" },
	{ "name":"BG2", "value":"art/toombg_para_01.png" },
	{ "name":"BG3", "value":"art/toombg_para_02.png", "anchor_y":560-400 },
	{ "name":"BG4", "value":"art/toombg_para_03.png", "anchor_y":304-400 },

	{ "name":"Fog", "value":"art/toombg_fx_fog.png", "anchor_y":276-400 },

	{ "name":"Room", "value":"art/toombg_room.png", "anchor_y":560-400, "onclickcall":function(){return "Soccer Ball: " + this.name;} },
];

ArtFiles2 <- [
	{ name="Man", value="art/dude_anims.png", tile_w=128, tile_h=128, anchor_y=128 },
	
	{ name="BG1", value="art/toombg_bg_01.png" },
	{ name="BG2", value="art/toombg_para_01.png" },
	{ name="BG3", value="art/toombg_para_02.png", anchor_y=560-400 },
	{ name="BG4", value="art/toombg_para_03.png", anchor_y=304-400 },
];


print("hey you " + ArtFiles[6].name + " " + ArtFiles[6].onclickcall() + "\n" );

error( "Oh Cool! Error prints in Red" );

function Cobra() {
	local Text = this.name;
	if ( "anchor_y" in this ) {
		Text += " Anchor: " + this.anchor_y;
	}

	if ( "Scotter" in getroottable() ) {
		Text += Scotter();
	}

	return Text;
}

print( "> " + Cobra.call(ArtFiles[5]) + " by " + callee() + "\n" );

function Scotter() {
	return " ***NOPE***";
}

print( "> " + Cobra.call(ArtFiles2[1]) + " by " + callee() + "\n" );
print( "> " + Cobra.call(ArtFiles[5]) + " by " + callee() + "\n" );


// To use Metamethods of Tables, you need a delegate //
Character <- {
	_tostring = function() {
		return this.name + " " + state;
	},
	_typeof = function() {
		return "Character";
	},
	state=0,
}

Player <- { 
	name="Gentlemen",
	state=10
};

Player.setdelegate( Character );

print( Player.state + "\n" );
print( Player + "\n" );


print( typeof Player + "\n" );


function InfoFunc( hey, you = 5 ) {
	local Text = "";
	foreach( name, value in callee().getinfos() ) {
		Text += name + ": " + value + "\n";
		if ( typeof value == "array" ) {
			Text += "  [";
			for ( local idx = 0; idx < value.len()-1; idx++ ) {
				Text += value[idx] + ", ";
			}
			if ( value.len() > 0 )
				Text += value[value.len()-1];
			Text += "]\n";
		}
		else if ( typeof value == "table" ) {
			foreach( name2, value2 in value ) {
				Text += "  " + name + ": " + value + ",\n";
			}
		}
	}
	return Text;
}

print( InfoFunc(10) );


function MooMoo() {
	print( "** " + this + " " + getroottable() + "\n" );
}

MooMoo(); // Default Env is Root Table //
MooMoo.call( Player ); // Specific Env: Player //

Moo <- MooMoo.bindenv( Player );

Moo(); // A replica with a specifically bound Environment //
Moo.call( ArtFiles2 ); // Overloading that environment (fails) //
MooMoo(); // Again just to confirm Original was unmodified //





function Pork() {
	Scooter <- 10;      // Environment Table //
	//::Scooter <- 10;      // Root Table //
	//const Scooter = 10; // Const Table //
	//local Scooter = 10;   // Stack //
	
	function Hello() {
		print( this + " " + Scooter + "\n" );
		
		if ( "Scooter" in this )
			print( "is in this\n" );

		if ( "Scooter" in getroottable() )
			print( "is on Root\n" );
	
		if ( "Scooter" in getconsttable() )
			print( "is on Const\n" );
	
		if ( "Scooter" in getstackinfos(1).locals )
			print( " is on Stack\n" );

		if ( this == getroottable() ) {
			print("SAME WHAT!\n");
		}
		else {
			print( "WILD: " + this + " | " + getroottable() + "\n" );	
		}
	}
	
	Things <- [ {name="Scott"},{name="Frank"} ];
	function PrinterDX() {
		if ( "name" in this ) {
			print( "%% " + this.name + "\n" );
		}
		else {
			print( "Oops...\n" );
		}
	}
	
	function Act() {
		PrinterDX();
		PrinterDX.call( Things[0] );
		PrinterDX.call( Things[1] );
	}
	
	return this;
}

//Cobras <- {};

Sharks <- {};
Sharks = Pork.bindenv(Sharks)();

Sharks.Hello();

print( "Sharks:" + Sharks.len() + "\n" );
foreach( name, value in Sharks ) {
	print( "> " + name + "=" + value + "\n" );
}

//print( "Cobras:" + Cobras.len() + "\n" );
//foreach( name, value in Cobras ) {
//	print( "> " + name + "=" + value + "\n" );
//}

if ( "Scooter" in Sharks ) {
	print( "In Scooter\n" );
}

Sharks.Act();
