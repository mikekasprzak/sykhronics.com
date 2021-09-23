// - ------------------------------------------------------------------------------------------ - //
// Internet Explorer Sucks { //
if ( ! window.console ) console = { log: function(){} };
// } //
// - ------------------------------------------------------------------------------------------ - //
var IntervalHandle = 0;
var FrameRate = 1000/60;
// - ------------------------------------------------------------------------------------------ - //
var Art = {};
// - ------------------------------------------------------------------------------------------ - //
var BaseX = 0;
var BaseY = 0;

var Camera = new Vector2D(0,0);
var FCamera = new Vector2D(0,0);
// - ------------------------------------------------------------------------------------------ - //
var canvas;
var ctx;
var IsLoading = true;
// - ------------------------------------------------------------------------------------------ - //


// - ------------------------------------------------------------------------------------------ - //
var CP_Life = 30;
// - ------------------------------------------------------------------------------------------ - //
function cCParticle( x, y ) {
	this.Life = CP_Life;
	this.Pos = new Vector2D( x, y );
}
// - ------------------------------------------------------------------------------------------ - //
cCParticle.prototype.Step = function() {
	this.Life--;
	return this.Life > 0;
}
// - ------------------------------------------------------------------------------------------ - //
cCParticle.prototype.Draw = function( x, y ) {
	ctx.beginPath();
	ctx.arc( this.Pos.x+x, this.Pos.y+y, (CP_Life-this.Life) * 0.75, 0, Math.PI*2, false );
	ctx.closePath();
	ctx.lineWidth = this.Life * 0.25;
	ctx.globalAlpha = this.Life/CP_Life;
	ctx.strokeStyle = RGB(255,255,255);
	ctx.stroke();
}
// - ------------------------------------------------------------------------------------------ - //
var CP = [];
function AddCP( x, y ) {
	CP.push( new cCParticle(x,y) );
}
// - ------------------------------------------------------------------------------------------ - //
function InitCP() {
}
// - ------------------------------------------------------------------------------------------ - //
function StepCP() {
	for ( var idx = 0; idx < CP.length; idx++ ) {
		if ( !CP[idx].Step() ) {
			CP.splice(idx,1);
			idx--;
		}
	}
}
// - ------------------------------------------------------------------------------------------ - //
function DrawCP(x,y) {
	var OldWidth = ctx.lineWidth;
	var OldAlpha = ctx.globalAlpha;
	for ( var idx = 0; idx < CP.length; idx++ ) {
		CP[idx].Draw(x,y);
	}
	ctx.lineWidth = OldWidth;//1;
	ctx.globalAlpha = OldAlpha;//1;
}
// - ------------------------------------------------------------------------------------------ - //


// - ------------------------------------------------------------------------------------------ - //
function gfxClear( color ) {
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, canvas.width, canvas.height);	
}
// - ------------------------------------------------------------------------------------------ - //
function gfxDraw( Img, x, y, Index, FlipX, FlipY ) {
	ctx.save();
	
	if ( typeof Index != "number" ) {
		var anchor_x;
		if ( Img.hasOwnProperty('anchor_x') )
			anchor_x = Img.anchor_x;
		else
			anchor_x = Img.width>>1;
	
		var anchor_y;
		if ( Img.hasOwnProperty('anchor_y') )
			anchor_y = Img.anchor_y;
		else
			anchor_y = Img.height>>1;

//	ctx.translate( FlipX ? Img.width : 0, FlipY ? Img.height : 0 );
//	ctx.scale( FlipX ? -1 : 1, FlipY ? -1 : 1 );

		ctx.translate( BaseX+x-anchor_x, BaseY+y-anchor_y );
		ctx.translate( FlipX ? Img.width : 0, FlipY ? Img.height : 0 );
		ctx.scale( FlipX ? -1 : 1, FlipY ? -1 : 1 );

		ctx.drawImage( Img, 0, 0 );
//		ctx.drawImage( Img, BaseX+x-anchor_x, BaseY+y-anchor_y );
	}
	else {
		var tile_w;
		if ( Img.hasOwnProperty('tile_w') )
			tile_w = Img.tile_w;
		else
			tile_w = Img.width;
	
		var tile_h;
		if ( Img.hasOwnProperty('tile_h') )
			tile_h = Img.tile_h;
		else
			tile_h = Img.height;

		var anchor_x;
		if ( Img.hasOwnProperty('anchor_x') )
			anchor_x = Img.anchor_x;
		else
			anchor_x = tile_w>>1;
	
		var anchor_y;
		if ( Img.hasOwnProperty('anchor_y') )
			anchor_y = Img.anchor_y;
		else
			anchor_y = tile_h>>1;
			
		var x_steps = Img.width / tile_w;
//		var y_steps = Img.height / tile_h;

		var x_step = Math.floor(Index % x_steps);
		var y_step = Math.floor(Index / x_steps);

		ctx.translate( BaseX+x-anchor_x, BaseY+y-anchor_y );
		ctx.translate( FlipX ? Img.tile_w : 0, FlipY ? Img.tile_h : 0 );
		ctx.scale( FlipX ? -1 : 1, FlipY ? -1 : 1 );

		ctx.drawImage( Img,
			x_step*tile_w,
			y_step*tile_h,
			tile_w,
			tile_h,
			0,
			0,
			tile_w,
			tile_h
			);
		
//		ctx.drawImage( Img,
//			x_step*tile_w,
//			y_step*tile_h,
//			tile_w,
//			tile_h,
//			BaseX+x-anchor_x,
//			BaseY+y-anchor_y,
//			tile_w,
//			tile_h
//			);
	}
	
	ctx.restore();
}
// - ------------------------------------------------------------------------------------------ - //
function gfxDrawLayer( layer ) {
	for ( var idx = 0; idx < layer.length; idx++ ) {
		if ( layer[idx].active && !layer[idx].hidden ) {
			var ScaleX = (typeof layer[idx].scalex != "undefined") ? layer[idx].scalex : 1.0;
			var ScaleY = (typeof layer[idx].scaley != "undefined") ? layer[idx].scaley : 1.0;
			
			var CurrentFrame = 0;
			if ( typeof layer[idx].frame != "undefined" ) {
				var Length = layer[idx].frame.length;
				if ( typeof layer[idx].FrameStep === "undefined" ) {
					layer[idx].FrameStep = 0;
				}
				else {
					layer[idx].FrameStep++;
				}
				var Index = Math.floor(layer[idx].FrameStep / 6);
				if ( Index >= Length ) {
					Index = 0;
					layer[idx].FrameStep = 0;
					if ( layer[idx].hasOwnProperty('onloopcall') ) {
						layer[idx].onloopcall();
					}
				}
				
				CurrentFrame = layer[idx].frame[Index];
			}
			else if ( typeof layer[idx].states != "undefined" ) {
				var Length = layer[idx].states[layer[idx].state].frame.length;
				if ( typeof layer[idx].FrameStep === "undefined" ) {
					layer[idx].FrameStep = 0;
				}
				else {
					layer[idx].FrameStep++;
				}
				var Index = Math.floor(layer[idx].FrameStep / 6);
				if ( Index >= Length ) {
					Index = 0;
					layer[idx].FrameStep = 0;
					if ( layer[idx].hasOwnProperty('onloopcall') ) {
						layer[idx].onloopcall();
					}
				}
				
				CurrentFrame = layer[idx].states[layer[idx].state].frame[Index];			
			}
			
			if ( CurrentFrame >= 0 ) {
				gfxDraw( 
					Art[layer[idx].img], 
					Math.floor(-FCamera.x * ScaleX) + layer[idx].x, 
					Math.floor(-FCamera.y * ScaleY) + layer[idx].y,
					CurrentFrame
					);
			}
		}
	}
}
// - ------------------------------------------------------------------------------------------ - //
function sndPlay( SoundName, Volume ) {
	if ( typeof Volume === "undefined" )
		Volume = 1;
	return createjs.Sound.play( SoundName, createjs.Sound.INTERRUPT_ANY, 0, 0, 0, Volume );
}
// - ------------------------------------------------------------------------------------------ - //
function sndLooped( SoundName, Volume ) {
	if ( typeof Volume === "undefined" )
		Volume = 1;
	return createjs.Sound.play( SoundName, createjs.Sound.INTERRUPT_ANY, 0, 0, -1, Volume );
}
// - ------------------------------------------------------------------------------------------ - //

// - ------------------------------------------------------------------------------------------ - //
function FindById( id ) {
	for ( var layer = 0; layer < ItemLayers.length; layer++ ) {
		for ( var idx = 0; idx < ItemLayers[layer].length; idx++ ) {
			if ( ItemLayers[layer][idx].hasOwnProperty('id') ) {
				if ( ItemLayers[layer][idx].id == id )
					return ItemLayers[layer][idx]; 
			}
		}
	}
}
// - ------------------------------------------------------------------------------------------ - //

// - ------------------------------------------------------------------------------------------ - //
function OnComplete() {
	IsLoading = false;
	
	// Initialize some defaults in Layers //
	for ( var layer = 0; layer < AllLayers.length; layer++ ) {
		for ( var idx = 0; idx < AllLayers[layer].length; idx++ ) {
			if ( !AllLayers[layer][idx].hasOwnProperty('state') ) {
				AllLayers[layer][idx].state = 0;
			}
			// Active means it's enabled //
			if ( !AllLayers[layer][idx].hasOwnProperty('active') ) {
				AllLayers[layer][idx].active = true;
			}
			// Hidden means it's an object obstructed by another object //
			if ( !AllLayers[layer][idx].hasOwnProperty('hidden') ) {
				AllLayers[layer][idx].hidden = false;
			}
		}
	}
	
	// Copy Properties //
	for ( var idx = 0; idx < ArtFiles.length; idx++ ) {
		if ( ArtFiles[idx].hasOwnProperty('tile_w') )
			Art[ArtFiles[idx].name].tile_w = ArtFiles[idx].tile_w;
		else
			Art[ArtFiles[idx].name].tile_w = Art[ArtFiles[idx].name].width;
		if ( ArtFiles[idx].hasOwnProperty('tile_h') )
			Art[ArtFiles[idx].name].tile_h = ArtFiles[idx].tile_h;
		else
			Art[ArtFiles[idx].name].tile_h = Art[ArtFiles[idx].name].height;

		if ( ArtFiles[idx].hasOwnProperty('anchor_x') )
			Art[ArtFiles[idx].name].anchor_x = ArtFiles[idx].anchor_x;
		else
			Art[ArtFiles[idx].name].anchor_x = Art[ArtFiles[idx].name].tile_w>>1;
		if ( ArtFiles[idx].hasOwnProperty('anchor_y') )
			Art[ArtFiles[idx].name].anchor_y = ArtFiles[idx].anchor_y;
		else
			Art[ArtFiles[idx].name].anchor_y = Art[ArtFiles[idx].name].tile_h>>1;

		if ( ArtFiles[idx].hasOwnProperty('margin_left') )
			Art[ArtFiles[idx].name].margin_left = ArtFiles[idx].margin_left;
		else
			Art[ArtFiles[idx].name].margin_left = 0;
		if ( ArtFiles[idx].hasOwnProperty('margin_right') )
			Art[ArtFiles[idx].name].margin_right = ArtFiles[idx].margin_right;
		else
			Art[ArtFiles[idx].name].margin_right = 0;
		if ( ArtFiles[idx].hasOwnProperty('margin_top') )
			Art[ArtFiles[idx].name].margin_top = ArtFiles[idx].margin_top;
		else
			Art[ArtFiles[idx].name].margin_top = 0;
		if ( ArtFiles[idx].hasOwnProperty('margin_bottom') )
			Art[ArtFiles[idx].name].margin_bottom = ArtFiles[idx].margin_bottom;
		else
			Art[ArtFiles[idx].name].margin_bottom = 0;

		if ( ArtFiles[idx].hasOwnProperty('offset_x') )
			Art[ArtFiles[idx].name].offset_x = ArtFiles[idx].offset_x;
		else
			Art[ArtFiles[idx].name].offset_x = 0;
		if ( ArtFiles[idx].hasOwnProperty('offset_y') )
			Art[ArtFiles[idx].name].offset_y = ArtFiles[idx].offset_y;
		else
			Art[ArtFiles[idx].name].offset_y = 0;
	}	
	
	console.log("begin game");
	Init();
	IntervalHandle = setInterval( Run, FrameRate );
}
// - ------------------------------------------------------------------------------------------ - //
function Run() {
	Input_MouseUpdate();
	Step();
	Draw();	
}
// - ------------------------------------------------------------------------------------------ - //

// - -------------------------------------------------------------------------------------------------------------- - //
function cMouse() {
	this.Pos = new Vector2D(0,0);
	this.Old = this.Pos.clone();
	this.Visible = false;
	this.OldBits = 0;
	this.CurrentBits = 0;
}
// - -------------------------------------------------------------------------------------------------------------- - //
cMouse.prototype.GetNew = function() {
	return (this.CurrentBits ^ this.OldBits) & this.CurrentBits;
}
cMouse.prototype.GetOld = function() {
	return (this.CurrentBits ^ this.OldBits) & this.OldBits;
}
cMouse.prototype.GetChange = function() {
	return (this.CurrentBits ^ this.OldBits);
}
cMouse.prototype.Get = function() {
	return this.CurrentBits;
}
cMouse.prototype.Diff = function() {
	return Sub(this.Old,this.Pos);
}
// - -------------------------------------------------------------------------------------------------------------- - //
var Mouse = new cMouse();
// - -------------------------------------------------------------------------------------------------------------- - //
var Input_Mouse;
var Input_MouseBits;

var MOUSE_LMB = 		0x1;
var MOUSE_RMB = 		0x2;
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_MouseInit() {
	Input_Mouse = new Vector2D(0,0);
	Input_Mouse.Visible = false;
	Input_MouseBits = 0;
	
	canvas.onmousemove = Input_MouseMove;
	canvas.onmouseup = Input_MouseUp;
	canvas.onmousedown = Input_MouseDown;
	
	canvas.onmouseover = Input_MouseOver;
	canvas.onmouseout = Input_MouseOut;
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_MouseExit() { 
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_MouseMove( e ) {
	Input_Mouse.x = (e.clientX - canvas.offsetLeft)// / Canvas_Scale;
	Input_Mouse.y = (e.clientY - canvas.offsetTop)// / Canvas_Scale;
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_MouseOver( e ) {
	Input_Mouse.Visible = true;
	
	console.log( "Mouse Over" );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_MouseOut( e ) {
	Input_Mouse.Visible = false;

	console.log( "Mouse Out" );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_MouseUp( e ) {
	Input_MouseBits &= ~MOUSE_LMB;

	console.log( "Click Up " + Input_Mouse );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_MouseDown( e ) {
	Input_Mouse.x = (e.clientX - canvas.offsetLeft);// / Canvas_Scale;
	Input_Mouse.y = (e.clientY - canvas.offsetTop);// / Canvas_Scale;
	
	Input_MouseBits |= MOUSE_LMB;

	console.log( "Click Down " + Input_Mouse );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_MouseUpdate() {
	Mouse.Old.x = Mouse.Pos.x;
	Mouse.Old.y = Mouse.Pos.y;
	Mouse.Pos.x = Input_Mouse.x;
	Mouse.Pos.y = Input_Mouse.y;
	Mouse.Visible = Input_Mouse.Visible;
	Mouse.OldBits = Mouse.CurrentBits;
	Mouse.CurrentBits = Input_MouseBits;
}
// - -------------------------------------------------------------------------------------------------------------- - //

// - ------------------------------------------------------------------------------------------ - //
function Main_LoseFocus() {
	if ( !IsLoading ) {
		// Stop the Clock //
		clearInterval( IntervalHandle );
		IntervalHandle = 0;
		
		if ( typeof LoseFocus != "undefined" ) {
			LoseFocus();
		}
	}
}
// - ------------------------------------------------------------------------------------------ - //
function Main_GainFocus() {
	if ( !IsLoading ) {
		if ( typeof GainFocus != "undefined" ) {
			GainFocus();
		}
	
		// Restart the Clock //
		if ( IntervalHandle == 0 ) {
			IntervalHandle = setInterval( Run, FrameRate );
		}
	}
}
// - ------------------------------------------------------------------------------------------ - //

// - ------------------------------------------------------------------------------------------ - //
var ShowDebug = false;
// - ------------------------------------------------------------------------------------------ - //
function Input_KeyUpEvent( e ) {
	switch (e.keyCode) {
		case 49: /* 1 */
			ShowDebug = !ShowDebug;
			break;
//		case 38:  /* Up arrow was pressed */
//			Input_KeyBits &= ~KEY_UP;
//			break;
//		case 40:  /* Down arrow was pressed */
//			Input_KeyBits &= ~KEY_DOWN;
//			break;
//		case 37:  /* Left arrow was pressed */
//			Input_KeyBits &= ~KEY_LEFT;
//			break;
//		case 39:  /* Right arrow was pressed */
//			Input_KeyBits &= ~KEY_RIGHT;
//			break;
//		case 13: // Enter //
//		case 17: // CTRL //
//		case 32: // Space Bar //
//			Input_KeyBits &= ~KEY_ACTION;
//			break;
//		case 27: // ESC //
//			Input_KeyBits &= ~KEY_MENU;
//			break;
	};
}
// - ------------------------------------------------------------------------------------------ - //

// - ------------------------------------------------------------------------------------------ - //
var ThingsLoaded = 0;
// - ------------------------------------------------------------------------------------------ - //
function ShowProgress() {
	gfxClear( RGB(0,0,0) );

	ctx.fillStyle = RGB(255,255,255);
	for ( var idx = 0; idx < ThingsLoaded; idx++ ) {
		var x = (20*idx)-(20*ThingsLoaded>>1);
		var y = 0;
		
		ctx.fillRect(BaseX+x,BaseY+y,18,18);
	}
}
// - ------------------------------------------------------------------------------------------ - //
function handleFileLoad(event) {
	var item = event.item; // A reference to the item that was passed in
	var type = item.type;
	
	if (type == createjs.LoadQueue.IMAGE) {
		console.log(event);
		Art[event.item.id] = event.result;
	}
	
	ThingsLoaded++;
	ShowProgress();
}
// - ------------------------------------------------------------------------------------------ - //
function OnLoad() {
	console.log("Lets Begin");
	IsLoading = true;
	
	canvas = document.getElementById("TheCanvas"),
	ctx = canvas.getContext("2d");
	
	BaseX = canvas.width>>1;
	BaseY = canvas.height>>1;

	createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin, createjs.FlashPlugin]);

	window.onblur = Main_LoseFocus;
	window.onfocus = Main_GainFocus;

//	window.addEventListener( 'keydown', Input_KeyDownEvent, true );
	window.addEventListener( 'keyup', Input_KeyUpEvent, true );
//	window.addEventListener( 'keypress', Input_KeyPressEvent, true );

	Input_MouseInit();
	
	var queue = new createjs.LoadQueue(true); // true 
	queue.installPlugin(createjs.Sound);
	queue.addEventListener("complete",OnComplete);
	queue.addEventListener("fileload",createjs.proxy(handleFileLoad,(this)));
	
	for ( var idx = 0; idx < ArtFiles.length; idx++ ) {
		queue.loadFile({id:ArtFiles[idx].name, src:ArtFiles[idx].value});
	}
	for ( var idx = 0; idx < AudioFiles.length; idx++ ) {
		queue.loadFile({id:AudioFiles[idx].name, src:AudioFiles[idx].value});
	}
	
	queue.load();
}
// - ------------------------------------------------------------------------------------------ - //
