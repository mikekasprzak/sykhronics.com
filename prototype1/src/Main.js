// - -------------------------------------------------------------------------------------------------------------- - //
var IntervalHandle = 0;

var GlobalCurrentFrame = 0;
var GlobalDebugMode = false;
var GlobalCameraOffset = Vector2D(0,0);	// Hack //

var FrameRate = 1000/30;
var WorkTime = 0;
var FPSClock = 0;
var FPSClock_Timer = 0;
var FPSClock_Draws = 0;

var FirstRun = true;
var HasInitSounds = false;

var Canvas_Scale;
// - -------------------------------------------------------------------------------------------------------------- - //
var Game;
// - -------------------------------------------------------------------------------------------------------------- - //


// - -------------------------------------------------------------------------------------------------------------- - //
function Main_Loop() {
	if ( FirstRun ) {
		Game.Init();
		WorkTime = new Date().getTime();
		FirstRun = false;
	}
	
	if ( soundManager.ok() && (HasInitSounds == false) ) {
		Game.InitSounds();
		WorkTime = new Date().getTime();
		HasInitSounds = true;
	}
	
	// Frame Skipping //
	var CurrentTime = new Date().getTime();
	var TimeDiff = Math.floor(CurrentTime - WorkTime);
	
	// If too much time has passed, disregard clock //
	if ( TimeDiff > 1000 ) {
		Log( "* WARNING: Too much time passed (" + TimeDiff + "). Throwing away clock." );
		TimeDiff = 0;
		WorkTime = CurrentTime;
	}

	if ( TimeDiff > FrameRate ) {
		var FramesToDo = Math.floor( TimeDiff / FrameRate );
	
		for ( var idx = 0; idx < FramesToDo; idx++ ) {
			GlobalCurrentFrame++;
			Input_KeyUpdate();
			
			Game.Step();
		}
		
		Game.Draw();
		FPSClock_Draws++;
		
		WorkTime += FramesToDo * FrameRate;
		
		var WorkTimeDiff = WorkTime - (FPSClock_Timer + 1000);
		if ( WorkTimeDiff > 0 ) {
			FPSClock = FPSClock_Draws;
			FPSClock_Draws = 0;
			if ( WorkTimeDiff > 60 )
				FPSClock_Timer = WorkTime;
			else
				FPSClock_Timer += 1000;
		}
	}
}
// - -------------------------------------------------------------------------------------------------------------- - //

// - -------------------------------------------------------------------------------------------------------------- - //
function Main_ShowPaused() {
	Game.ShowPaused();
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Main_GainFocus() {
	Log( "* Gain Focus" );

	// Resume Music //
	if ( soundManager.getSoundById('BGMusic') )
		soundManager.getSoundById('BGMusic').resume();
	
	// Clear Keys (just in case) //
	Input_KeyPanic();
	
	// Reset Clock //
	WorkTime = new Date().getTime();
	
	// Restart Clock //
	if ( IntervalHandle == 0 ) {
		IntervalHandle = setInterval( Main_Loop, FrameRate );
	}
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Main_LoseFocus() {
	Log( "* Lost Focus" );

	// Stop Clock //
	clearInterval( IntervalHandle );
	IntervalHandle = 0;
	
	// Pause Music //
	if ( soundManager.getSoundById('BGMusic') )
		soundManager.getSoundById('BGMusic').pause();
	
	Main_ShowPaused();
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Main_Resize( ) {
	var Sheet = document.styleSheets[0];
	
	// FF/Chrome: cssRules[]. IE: Rules[]. //
	var Rules = Sheet.cssRules ? Sheet.cssRules : Sheet.rules;
	var CanvasRule;
	
	// Search for the rule //
	for ( var idx = 0; idx < Rules.length; idx++ ) {
		if ( Rules[idx].selectorText.toLowerCase() == "canvas" ) {
			// Rule found //
			CanvasRule = Rules[idx];
			break;
		}
	}
	
	// If a rule for canvas was found, edit it //
	if ( CanvasRule ) {
		var Canvas_AspectRatio = Canvas.width / Canvas.height;
				
		var Window_ScaleWidth = window.innerWidth;
		var Window_ScaleHeight = window.innerHeight - (6);	// size of the SoundManager2 Element //
		
		var Window_AspectRatio = Window_ScaleWidth / Window_ScaleHeight;
		
		// Scaling //
		if ( Canvas_AspectRatio < Window_AspectRatio ) {
			Canvas_Scale = Window_ScaleHeight / Canvas.height;
		}
		else {
			Canvas_Scale = Window_ScaleWidth / Canvas.width;
		}

		// Rigid Scaling (do "Floor Only" for pixel precise) //	
		if ( isMobileSafari() ) {
//			Canvas_Scale *= 2;	// Double before we Floor it, so to get values like 2.5, etc //
			Canvas_Scale = Math.floor( Canvas_Scale );
//			Canvas_Scale /= 2;	// Reduce after Floor, so to get values like 2.5, etc //
		}
		else {
			Canvas_Scale = Math.floor( Canvas_Scale );
		}
				
		var TargetWidth = Canvas_Scale * Canvas.height * Canvas_AspectRatio;
		var TargetHeight = Canvas_Scale * Canvas.height;

		// Write to the style element //		
		CanvasRule.style.width = TargetWidth + "px";
		CanvasRule.style.height = TargetHeight + "px";
		CanvasRule.style.left = Math.floor((window.innerWidth - TargetWidth) / 2) + "px";
		CanvasRule.style.top = Math.floor((window.innerHeight - TargetHeight) / 2) + "px";
	}
}
// - -------------------------------------------------------------------------------------------------------------- - //

// - -------------------------------------------------------------------------------------------------------------- - //
// Input_Stick and the functions neet to be global, since they are used as listeners (and "this" wont propogate) //
var Input_Stick;
var Input_KeyBits;

var KEY_UP = 		0x1;
var KEY_DOWN = 		0x2;
var KEY_LEFT = 		0x4;
var KEY_RIGHT = 	0x8;
var KEY_ACTION = 	0x10;
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_KeyInit() {
	Input_Stick = new Vector2D( 0, 0 );
	Input_KeyBits = 0;

	window.addEventListener( 'keydown', Input_KeyDownEvent, true );
	window.addEventListener( 'keyup', Input_KeyUpEvent, true );
	window.addEventListener( 'keypress', Input_KeyPressEvent, true );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_KeyExit() {
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_KeyPanic() {
	Log( "* Input_KeyPanic (clear)" );
	Input_Stick.x = 0;
	Input_Stick.y = 0;	
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_KeyUpdate() {
	if ( Input_KeyBits & KEY_UP ) {
		Input_Stick.y = -1;
	}
	else if ( Input_KeyBits & KEY_DOWN ) {
		Input_Stick.y = +1;
	}
	else {
		Input_Stick.y = 0;
	}

	if ( Input_KeyBits & KEY_LEFT ) {
		Input_Stick.x = -1;
	}
	else if ( Input_KeyBits & KEY_RIGHT ) {
		Input_Stick.x = +1;
	}
	else {
		Input_Stick.x = 0;
	}	
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_KeyDownEvent( e ) {
	switch (e.keyCode) {
		case 38:  /* Up arrow was pressed */
			Input_KeyBits |= KEY_UP;
			break;
		case 40:  /* Down arrow was pressed */
			Input_KeyBits |= KEY_DOWN;
			break;
		case 37:  /* Left arrow was pressed */
			Input_KeyBits |= KEY_LEFT;
			break;
		case 39:  /* Right arrow was pressed */
			Input_KeyBits |= KEY_RIGHT;
			break;
		
		case 49: // 1 //
			GlobalDebugMode = !GlobalDebugMode;
			return false;
			break;
		case 48: // 0 //
			Log( "PlayerPos: " + Game.Player.Pos );
			return false;
			break;

		case 13: // Enter //
		case 17: // CTRL //
		case 32: // Space Bar //
			Input_KeyBits |= KEY_ACTION;		
			return false;
			break;
	};
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_KeyUpEvent( e ) {
	switch (e.keyCode) {
		case 38:  /* Up arrow was pressed */
			Input_KeyBits &= ~KEY_UP;
			break;
		case 40:  /* Down arrow was pressed */
			Input_KeyBits &= ~KEY_DOWN;
			break;
		case 37:  /* Left arrow was pressed */
			Input_KeyBits &= ~KEY_LEFT;
			break;
		case 39:  /* Right arrow was pressed */
			Input_KeyBits &= ~KEY_RIGHT;
			break;
		case 13: // Enter //
		case 17: // CTRL //
		case 32: // Space Bar //
			Input_KeyBits &= ~KEY_ACTION;
			break;
	};
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_KeyPressEvent( e ) {
	// Certain Keycodes don't work here/only work here in FF //
	switch (e.keyCode) {
		case 8: // Backspace //
		case 113: // F2 //
			GlobalDebugMode = !GlobalDebugMode;
			break;
	};
}
// - -------------------------------------------------------------------------------------------------------------- - //

// - -------------------------------------------------------------------------------------------------------------- - //
var Input_Mouse;
var Input_MouseBits;

var MOUSE_LMB = 		0x1;
var MOUSE_RMB = 		0x2;
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_MouseInit() {
	Input_Mouse = new Vector2D(0,0);
	Input_Mouse.Visible = false;
	
	Canvas.onmousemove = Input_MouseMove;
	Canvas.onmouseup = Input_MouseUp;
	Canvas.onmousedown = Input_MouseDown;
	
	Canvas.onmouseover = Input_MouseOver;
	Canvas.onmouseout = Input_MouseOut;
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_MouseExit() { 
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_MouseMove( e ) {
	Input_Mouse.x = (e.clientX - Canvas.offsetLeft) / Canvas_Scale;
	Input_Mouse.y = (e.clientY - Canvas.offsetTop) / Canvas_Scale;
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_MouseOver( e ) {
	Input_Mouse.Visible = true;
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_MouseOut( e ) {
	Input_Mouse.Visible = false;
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_MouseUp( e ) {
	Input_MouseBits &= ~MOUSE_LMB;

	Log( "Click Up " + Input_Mouse );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_MouseDown( e ) {
	Input_Mouse.x = (e.clientX - Canvas.offsetLeft) / Canvas_Scale;
	Input_Mouse.y = (e.clientY - Canvas.offsetTop) / Canvas_Scale;
	
	Input_MouseBits |= MOUSE_LMB;

	Log( "Click Down " + Input_Mouse );
}
// - -------------------------------------------------------------------------------------------------------------- - //

// - -------------------------------------------------------------------------------------------------------------- - //
function Input_TouchInit() {
	Input_Mouse = new Vector2D(0,0);
	Input_Mouse.Visible = true;//false;
	
	Canvas.ontouchmove = Input_TouchMove;
	Canvas.ontouchstart = Input_TouchStart;
	Canvas.ontouchend = Input_TouchEnd;

//	window.addEventListener("touchmove", Input_TouchMove, false);
//	window.addEventListener("touchstart", Input_TouchStart, false);
//	window.addEventListener("touchend", Input_TouchEnd, false);
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_TouchExit() { 
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_TouchMove( e ) {
	e.preventDefault();
	
	Input_Mouse.x = (e.touches.item(0).clientX - Canvas.offsetLeft) / Canvas_Scale;
	Input_Mouse.y = (e.touches.item(0).clientY - Canvas.offsetTop) / Canvas_Scale;
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_TouchStart( e ) {
	e.preventDefault();

	Input_Mouse.x = (e.touches.item(0).clientX - Canvas.offsetLeft) / Canvas_Scale;
	Input_Mouse.y = (e.touches.item(0).clientY - Canvas.offsetTop) / Canvas_Scale;
	
	Input_MouseBits |= MOUSE_LMB;
	
	Log( Input_Mouse );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_TouchEnd( e ) {
	e.preventDefault();

	// Touches Object is Empty on End //
//	Input_Mouse.x = (e.touches.item(0).clientX - Canvas.offsetLeft) / Canvas_Scale;
//	Input_Mouse.y = (e.touches.item(0).clientY - Canvas.offsetTop) / Canvas_Scale;
	
	Input_MouseBits &= ~MOUSE_LMB;
}
// - -------------------------------------------------------------------------------------------------------------- - //


// - -------------------------------------------------------------------------------------------------------------- - //
function load() {
	// If no console (Internet Explorer w/o F12 debugging open), make one //
	if ( typeof console === "undefined" || typeof console.log === "undefined" ) {
		console = {};
		console.log = function() { };
	}
	
	/* ***** */
	
	Log( " - ----- GelHTML Initialized ----- -" );
	gelGraphicsInit();

	// Touch or Mouse //
	if ( isMobile() )
		Input_TouchInit();
	else
		Input_MouseInit();
	Input_KeyInit();
	
	Game = new cGame();

	window.onblur = Main_LoseFocus;
	window.onfocus = Main_GainFocus;
	window.onresize = Main_Resize;	
	
	Main_Resize();
	window.scrollTo(0,1);

	WorkTime = new Date().getTime();
		
	// Lock to 30fps //
	IntervalHandle = setInterval( Main_Loop, FrameRate );
}
// - -------------------------------------------------------------------------------------------------------------- - //
