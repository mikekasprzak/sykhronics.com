// - -------------------------------------------------------------------------------------------------------------- - //
var DebugElement = new cDebugElements;
var OverlayElement = new cDebugElements;
var Hack_FadeIn = 255;
// - -------------------------------------------------------------------------------------------------------------- - //

// - -------------------------------------------------------------------------------------------------------------- - //
function cGame() {
	Log( " - ----- Game Initialized ----- -" );

	this.Art = new cTileSheet( "Content/GameArt.png", 8, 8 );
	this.Map = new cGameMap( this.Art );
	
	this.Player = new cEntity( ENTITY_PLAYER, this.Art, 135, 240 );
	this.Enemy = new Array(11);
	
	this.Enemy[0] = new cEntity( ENTITY_BAT, this.Art, 60, 64 );
	this.Enemy[1] = new cEntity( ENTITY_BAT, this.Art, 70, 74 );
	this.Enemy[2] = new cEntity( ENTITY_BAT, this.Art, 80, 64 );
	this.Enemy[3] = new cEntity( ENTITY_BAT, this.Art, 150, 108 );

	this.Enemy[4] = new cEntity( ENTITY_ITEM_RING, this.Art, 330, 130 );
	this.Enemy[5] = new cEntity( ENTITY_ITEM_KNIFE, this.Art, 645, 102 );
	this.Enemy[6] = new cEntity( ENTITY_ITEM_CROWN, this.Art, 320, 276 );
	this.Enemy[7] = new cEntity( ENTITY_ITEM_SECRET, this.Art, 443, 294 );

	this.Enemy[8] = new cEntity( ENTITY_BEAST, this.Art, 835, 102 );

	this.Enemy[9] = new cEntity( ENTITY_BAT, this.Art, 416, 36 );
	this.Enemy[10] = new cEntity( ENTITY_BAT, this.Art, 426, 46 );


	this.CameraPos = this.Player.Pos.clone();
}
// - -------------------------------------------------------------------------------------------------------------- - //

// - -------------------------------------------------------------------------------------------------------------- - //
cGame.prototype.Init = function() {
}
// - -------------------------------------------------------------------------------------------------------------- - //
cGame.prototype.InitSounds = function() {
	Log("+ Loading Sounds...");
	
	sndInit();

	sndLoad( 'Slash', 'Slash' );
	sndLoad( 'Death', 'Death' );

	sndLoad( 'BatDeath', 'KillBat' );
	sndLoad( 'BatAttack', 'Strike' );
	sndLoad( 'BatAlert', 'WarningChirp' );

	sndLoad( 'BeastDeath', 'Explosion2' );
	sndLoad( 'BeastAttack', 'Awe' );
	sndLoad( 'BeastAlert', 'Ghast' );

	sndLoad( 'Detected', 'Blocked' );
	sndLoad( 'Magic', 'Magic' );

	sndLoadAndPlay( 'Intro', 'Devil' );
	
	Log("- Done Loading Sounds.", 'info');
}
// - -------------------------------------------------------------------------------------------------------------- - //
cGame.prototype.Exit = function() {
}
// - -------------------------------------------------------------------------------------------------------------- - //

// - -------------------------------------------------------------------------------------------------------------- - //
cGame.prototype.Step = function() {
	DebugElement.Step(); // Step at the top of the frame, so to release elements that expire //
	OverlayElement.Step();

	// Move Camera //
	this.CameraPos = Add( this.CameraPos, MultScalar( Sub(this.Player.Pos, this.CameraPos), 0.04 ) );
	var Offset = new Vector2D( 
		(Canvas.width>>1)  - Math.floor(this.CameraPos.x), 
		(Canvas.height>>1) - Math.floor(this.CameraPos.y) 
		);
	GlobalCameraOffset = Offset.clone();

	// Move Objects //
	this.Player.Step();
	for ( var idx = 0; idx < this.Enemy.length; idx++ ) {
		this.Enemy[idx].Step();
	}
	
	// Solve Collisions Vs Other Objects //
	for ( var idx = 0; idx < this.Enemy.length; idx++ ) {
		// Player vs Enemy //
		if ( this.Enemy[idx].Health > 0 ) {
			if ( Test_Sphere_vs_Sphere( this.Player.Pos, this.Player.Instance.Radius, this.Enemy[idx].Pos, this.Enemy[idx].Instance.Radius) ) {
				Solve_Sphere_vs_Sphere( 
					this.Player.Pos, this.Player.Instance.Radius, 
					this.Enemy[idx].Pos, this.Enemy[idx].Instance.Radius
					);
				
				if ( GlobalDebugMode ) {
					DebugElement.Add( DBGE_Circle );
					DebugElement.SetColor( 0, 255, 0 );
					DebugElement.SetArgs( [Offset.x + this.Enemy[idx].Pos.x, Offset.y + this.Enemy[idx].Pos.y, 18] );
				}
			}
		}

		// Enemy vs Enemy //
		for ( var idx2 = idx+1; idx2 < this.Enemy.length; idx2++ ) {
			if ( (this.Enemy[idx].Health > 0) && (this.Enemy[idx2].Health > 0) ) {
				if ( Test_Sphere_vs_Sphere( this.Enemy[idx].Pos, this.Enemy[idx].Instance.Radius, this.Enemy[idx2].Pos, this.Enemy[idx2].Instance.Radius) ) {
					Solve_Sphere_vs_Sphere( 
						this.Enemy[idx].Pos, this.Enemy[idx].Instance.Radius, 
						this.Enemy[idx2].Pos, this.Enemy[idx2].Instance.Radius
						);
				}
			}
		}
	}

	// Solve Collisions Vs Map //	
	this.Map.SolveSphere( this.Player.Pos, this.Player.Instance.Radius );
	for ( var idx = 0; idx < this.Enemy.length; idx++ ) {
		this.Map.SolveSphere( this.Enemy[idx].Pos, this.Enemy[idx].Instance.Radius );
	}
	
	// Fade In Effect (Wait for the Intro sound to finish loading, or not if there is no sound) //
	if ( !sndAvailable() || sndHasLoaded('Intro') )
		Hack_FadeIn-=3;
}
// - -------------------------------------------------------------------------------------------------------------- - //

// - -------------------------------------------------------------------------------------------------------------- - //
cGame.prototype.Draw = function() {
	// Clear to background Color //
//	gelDrawRectClear( 0, 0, Canvas.width, Canvas.height );
	// Clear to Color //
	gelSetColor( 0, 0, 0 );
	gelDrawRectFill( 0, 0, Canvas.width, Canvas.height );

	// ***** //
			
	if ( this.Map.Art.Data.complete ) {
		// Precalculate Offset //	
		var Offset = new Vector2D( 
			(Canvas.width>>1)  - Math.floor(this.CameraPos.x), 
			(Canvas.height>>1) - Math.floor(this.CameraPos.y) 
			);

		// Draw Map //
		this.Map.Draw( Offset.x, Offset.y, Canvas.width, Canvas.height );
		
		// Draw Entities //
		this.Player.Draw( Offset.x, Offset.y );
		for ( var idx = 0; idx < this.Enemy.length; idx++ ) {
			this.Enemy[idx].Draw( Offset.x, Offset.y );
		}	
	}
					
	DebugElement.Draw();
	OverlayElement.Draw();

	// Towlr //
	if ( GlobalDebugMode ) {
		gelSetColor( 255, 255, 255 );
		gelDrawCross( Canvas.width >> 1, Canvas.height >> 1, 5 );
	}
	
	// Fade In Hack Effect (actual stepping occurs in draw) //
	if ( Hack_FadeIn > 0 ) {
		gelSetColor( 0, 0, 0, Hack_FadeIn );
		gelDrawRectFill( 0, 0, Canvas.width, Canvas.height );
	}
	
	this.Player.DrawHealthStaminaUI( 3, 3 );

	// Mouse Cursor //
	if ( this.Map.Art.Data.complete ) {		
		if ( Input_Mouse.Visible ) {
			this.Art.DrawCentered( 7, Math.floor(Input_Mouse.x), Math.floor(Input_Mouse.y) );
		}
	}

	// ***** //
	
	this.DrawFPS();
}
// - -------------------------------------------------------------------------------------------------------------- - //

// - -------------------------------------------------------------------------------------------------------------- - //
cGame.prototype.ShowPaused = function() {
	ctx.fillStyle = "rgb(255,0,0)";
	ctx.font = "32pt Arial";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText( "*PAUSED*", Canvas.width / 2, Canvas.height / 2 );
}
// - -------------------------------------------------------------------------------------------------------------- - //
cGame.prototype.DrawFPS = function() {
	if ( isMobile() )
		ctx.fillStyle = "rgb(255,0,255)";
	else
		ctx.fillStyle = "rgb(255,255,0)";
	ctx.font = "12pt Arial";
	ctx.textAlign = "right";
	ctx.textBaseline = "top";
	ctx.fillText( FPSClock, Canvas.width - 1, 1 );
}
// - -------------------------------------------------------------------------------------------------------------- - //

