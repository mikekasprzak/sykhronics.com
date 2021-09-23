// - ------------------------------------------------------------------------------------------ - //
var Room;
// - ------------------------------------------------------------------------------------------ - //
function cRoom() {
	this.Base = new Vector2D(0,78);
}
// - ------------------------------------------------------------------------------------------ - //

var DoFin = false;
var FinDelay = 512;

// - ------------------------------------------------------------------------------------------ - //
var ST = {
	NULL:0,
	IDLE:1,
	MOVING:2,
	SIT_PC_CHAIR:3,
	SIT_TABLE_CHAIR:4,
	SIT_COUCH:5,
	TURN:6,
	TURN_FREEZER:7,
	TURN_FRIDGE:8,
	TURN_CAB1:9,
	TURN_CAB2:10,
	TURN_CAB3:11,
	TURN_OVEN:12,
	TURN_DRAWER:13,
	STAND_FAN:14,
};
// - ------------------------------------------------------------------------------------------ - //
var StateMap = [
	{anim:"Idle"},	// Null //
	{anim:"Idle"},
	{anim:"Walk"},
	{anim:"PC_Sit"},
	{anim:"Table_Sit"},
	{anim:"Couch_Sit"},
	{anim:"Turn"},
	{anim:"Turn",onexitcall:function(){ItCloseState.call(FindById("Freezer"));}},
	{anim:"Turn",onexitcall:function(){ItCloseState.call(FindById("Fridge"));}},
	{anim:"Turn",onexitcall:function(){ItCloseState.call(FindById("Cab1"));}},
	{anim:"Turn",onexitcall:function(){ItCloseState.call(FindById("Cab2"));}},
	{anim:"Turn",onexitcall:function(){ItCloseState.call(FindById("Cab3"));}},
	{anim:"Turn",
		onexitcall:function(){ItCloseState.call(FindById("Oven"));},
		onusecall:function(item){ 
			if ( item == IT.MEAT ) { Player.RemoveItem(item); FindById("RawMeat2").active=true; } 
			if ( item == IT.FROZEN_HEAD ) { Player.RemoveItem(item); FindById("FrozenHead2").active=true; } 
		}
	},
	{anim:"Turn",onexitcall:function(){ItCloseState.call(FindById("Drawer"));}},
	{anim:"Turn",
		onusecall:function(item){ 
			if ( item == IT.HEAD ) { 
				Player.RemoveItem(item); 
				var HeadToss = FindById("HeadToss");
				HeadToss.active=true;
				HeadToss.state = 1;
				HeadToss.FrameStep = 0;
			} 
		}
	},
	
];
// - ------------------------------------------------------------------------------------------ - //
var Player;
// - ------------------------------------------------------------------------------------------ - //
function cPlayer() {
	this.Pos = new Vector2D(-326,0);
	this.TargetPos = this.Pos.clone();
	this.FacingLeft = true;

	this.State = ST.IDLE;
	this.CurrentFrameStep = 0;
	this.CurrentAnimation = "Idle";
	this.SetState( ST.SIT_COUCH );
	
	this.Focus = null;
	
	this.Inventory = [];
//	this.AddItem(IT.DISK);
}
// - ------------------------------------------------------------------------------------------ - //
cPlayer.prototype.SetState = function( NewState, FacingLeft ) {
	if ( this.State != NewState ) {
		if ( StateMap[this.State].hasOwnProperty('onexitcall') ) {
			StateMap[this.State].onexitcall();
		}
		
		this.State = NewState;
		this.SetAnimation( StateMap[this.State].anim );

		if ( StateMap[this.State].hasOwnProperty('onstartcall') ) {
			StateMap[this.State].onstartcall();
		}
	}
	
	if ( typeof FacingLeft != "undefined" ) {
		this.FacingLeft = FacingLeft;
	}
}
// - ------------------------------------------------------------------------------------------ - //
cPlayer.prototype.SetAnimation = function( NewAnim, FacingLeft ) {
	if ( ManAnim[this.CurrentAnimation].hasOwnProperty('onstopcall') ) {
		ManAnim[this.CurrentAnimation].onstopcall();
	}

	this.CurrentFrameStep = 0;
	this.CurrentAnimation = NewAnim;
	
	if ( typeof FacingLeft != "undefined" ) {
		this.FacingLeft = FacingLeft;
	}	

	if ( ManAnim[this.CurrentAnimation].hasOwnProperty('onstartcall') ) {
		ManAnim[this.CurrentAnimation].onstartcall();
	}
}
// - ------------------------------------------------------------------------------------------ - //
cPlayer.prototype.AddItem = function( id ) {
	// TODO: Play Sound Here //
	sndPlay("Pickup");
	this.Inventory.push( id );
}
// - ------------------------------------------------------------------------------------------ - //
cPlayer.prototype.FindItem = function( id ) {
	for ( var idx = 0; idx < this.Inventory.length; idx++ ) {
		if ( this.Inventory[idx] == id )
			return idx;
	}
	return null;
}
// - ------------------------------------------------------------------------------------------ - //
cPlayer.prototype.RemoveItem = function( id ) {
	// TODO: Play Sound Here //
	sndPlay("Use");

	var Index = this.FindItem( id );
	if ( Index != null ) {
		this.Inventory.splice(Index,1);
	}
}
// - ------------------------------------------------------------------------------------------ - //
cPlayer.prototype.GetCurrentFrame = function() {
	return Math.floor(this.CurrentFrameStep / 6);
}
// - ------------------------------------------------------------------------------------------ - //
cPlayer.prototype.Step = function() {
	this.CurrentFrameStep++;
	if ( this.GetCurrentFrame() >= ManAnim[this.CurrentAnimation].frame.length ) {
		// Start Looped Animation Here //
		this.CurrentFrameStep = 0;
		var PriorAnim = this.CurrentAnimation;
		if ( ManAnim[this.CurrentAnimation].hasOwnProperty('onloopcall') ) {
			ManAnim[this.CurrentAnimation].onloopcall();
		}
		// Make sure onloopcall didn't change the animation //
		if ( PriorAnim == this.CurrentAnimation ) {
			if ( ManAnim[this.CurrentAnimation].hasOwnProperty('onloop') ) {
				// Call Stop Function //
				if ( ManAnim[this.CurrentAnimation].hasOwnProperty('onstopcall') ) {
					ManAnim[this.CurrentAnimation].onstopcall();
				}
				// Change Animation //
				this.CurrentAnimation = ManAnim[this.CurrentAnimation].onloop[ Math.floor(Math.random() * ManAnim[this.CurrentAnimation].onloop.length) ];
			}
		}
	}

	var Diff = Sub(this.Pos,this.TargetPos);
	var Length = Diff.NormalizeRet();

	if ( Length > 2 ) {
		if ( ManAnim[this.CurrentAnimation].hasOwnProperty('onaction') ) {
			this.SetAnimation( ManAnim[this.CurrentAnimation].onaction[0] );
		}
	}
		
	if ( !ManAnim[this.CurrentAnimation].hasOwnProperty('priority') ) {
		if ( Length > 2 ) {
			var Scaled = MultScalar(Diff,2);
			this.Pos = Sub(this.Pos, Diff );
			this.SetState( ST.MOVING );
			this.FacingLeft = Diff.x > 0;
		}
		else {
			this.Pos = this.TargetPos.clone();
			if ( (this.State == ST.MOVING) ) {
				this.SetState( ST.IDLE );
			}
			if ( Player.Focus != null ) {
				if ( Player.Focus.hasOwnProperty('onactioncall') ) {
					Player.Focus.onactioncall();
				}
			}

			Player.Focus = null;
		}
	}
}
// - ------------------------------------------------------------------------------------------ - //
cPlayer.prototype.GetPos = function() {
	return new Vector2D( -FCamera.x+this.Pos.x+Room.Base.x, -FCamera.y+this.Pos.y+Room.Base.y );
}	
// - ------------------------------------------------------------------------------------------ - //
cPlayer.prototype.Draw = function() {
	var Index = 0;
	var CurrentFrame = this.GetCurrentFrame();
	Index = ManAnim[ this.CurrentAnimation ].frame[CurrentFrame];

	var Pos = this.GetPos();
	
	var YTweak = 0;
	if ( this.Pos.x >= 416 ) {
		YTweak = 10;
	}
	else if ( this.Pos.x >= 412 ) {
		YTweak = 8;
	}
	else if ( this.Pos.x >= 403 ) {
		YTweak = 6;
	}
	else if ( this.Pos.x >= 380 ) {
		YTweak = 4;
	}
	
	gfxDraw( Art.Man, Pos.x, Pos.y - YTweak, Index, this.FacingLeft );	
}
// - ------------------------------------------------------------------------------------------ - //

// - ------------------------------------------------------------------------------------------ - //
var MouseFocus = null;
// - ------------------------------------------------------------------------------------------ - //

// - ------------------------------------------------------------------------------------------ - //
var Music;
// - ------------------------------------------------------------------------------------------ - //
function Init() {
	Music = sndLooped("Music",0);	
	
	Room = new cRoom();
	Player = new cPlayer();
}
// - ------------------------------------------------------------------------------------------ - //
function GainFocus() {
	Music.resume();
}
// - ------------------------------------------------------------------------------------------ - //
function LoseFocus() {
	Music.pause();
}
// - ------------------------------------------------------------------------------------------ - //

// - ------------------------------------------------------------------------------------------ - //
var MouseMoveCount = 0;
var MouseClickedCount = 0;
// - ------------------------------------------------------------------------------------------ - //
var FadeIn = true;
var FadeOut = false;
var Fader = 255;
// - ------------------------------------------------------------------------------------------ - //
function Step() {
	var BMouse = Mouse.Pos.clone();
	BMouse.x -= BaseX;
	BMouse.y -= BaseY;
	var BCMouse = BMouse.clone();
	BCMouse.x += FCamera.x;
	BCMouse.y += FCamera.y;

	// *** //

	if ( Fader )
		Fader--;

	// *** //
	
	// Mouse Cursor Part //
	var TargetX = ((Mouse.Pos.x-BaseX)/BaseX)*32.0;
	var TargetY = ((Mouse.Pos.y-BaseY)/BaseY)*32.0;

	// Player Position Part //
	var Limit = 1010; // 1010 wide, 54 pixels inward //
	TargetX += (Player.Pos.x / Limit) * 90.0; 
	
	Camera.x -= (Camera.x-TargetX)*0.1;
	Camera.y -= (Camera.y-TargetY)*0.1;
	
	FCamera.x = Math.floor(Camera.x);
	FCamera.y = Math.floor(Camera.y);
	
	if ( Mouse.Diff().Magnitude() != 0 ) {
		MouseMoveCount += 16;
		if ( MouseMoveCount > 128 )
			MouseMoveCount = 128;
	}
	else {
		if ( MouseMoveCount )
			MouseMoveCount--;
	}

	if ( MouseClickedCount )
		MouseClickedCount--;


	var BX = 640-100;
	var BY = 360-80;
	var BW = Art.Items.tile_w;
	var BH = Art.Items.tile_h;
	var HALF_BW = BW>>1;
	var HALF_BH = BH>>1;

	var UILength = Player.Inventory.length;
	var UIX = BX-(BW*(UILength))+HALF_BW;
	var UIY = BY-HALF_BW;
	var UIW = BW*(UILength);
	var UIH = BH;
		
	// Check what we're hovering over Things //
	MouseFocus = null;
	for ( var layer = 0; layer < ItemLayers.length; layer++ ) {
		for ( var idx = 0; idx < ItemLayers[layer].length; idx++ ) {
			var Item = ItemLayers[layer][idx];
			var ArtFile = Art[Item.img];
			
			if ( Item.hasOwnProperty( 'nice' ) && Item.active && !Item.hidden ) {
				var IX = Item.x-ArtFile.anchor_x-ArtFile.margin_left;
				var IY = Item.y-ArtFile.anchor_y-ArtFile.margin_top;
				var IW = ArtFile.tile_w+ArtFile.margin_left+ArtFile.margin_right;
				var IH = ArtFile.tile_h+ArtFile.margin_top+ArtFile.margin_bottom;
				
				if ( Test_Sphere_vs_AABB( BCMouse, 4, IX, IY, IW, IH ) ) {
					MouseFocus = Item;
				}
			}
		}
	}
		
	// Check if a button was pressed //
	if ( Mouse.GetNew() && !FadeOut ) {
		if ( Test_Sphere_vs_AABB( BMouse, 2, UIX, UIY, UIW, UIH ) ) {
			var Lit = null;
			
			if ( Test_Sphere_vs_AABB( BMouse, 2, UIX, UIY, UIW, UIH ) ) {
				Lit = Math.floor((BMouse.x-UIX)/BW);
				if ( Lit < 0 )
					Lit = null;
				if ( Lit >= UILength )
					Lit = null;
			}

			sndPlay("Cab_Open");
			//Player.RemoveItem( Player.Inventory[Lit] );
			
			if ( Lit != null ) {
				if ( StateMap[Player.State].hasOwnProperty('onusecall') )
					StateMap[Player.State].onusecall(Player.Inventory[Lit]);
			}
		}
		else {	
			sndPlay( "Click", 0.5 );
			
			if ( MouseFocus == null ) {
				Player.TargetPos.x = (Mouse.Pos.x+Camera.x-BaseX);
			}
			else {
				var Item = MouseFocus;
				var ArtFile = Art[Item.img];
	
				var IX = Item.x-ArtFile.anchor_x-ArtFile.margin_left;
				var IY = Item.y-ArtFile.anchor_y-ArtFile.margin_top;
				var IW = ArtFile.tile_w+ArtFile.margin_left+ArtFile.margin_right;
				var IH = ArtFile.tile_h+ArtFile.margin_top+ArtFile.margin_bottom;
	
				Player.TargetPos.x = IX+(IW>>1)+ArtFile.offset_x;
			}
	
			Player.Focus = MouseFocus;
			MouseClickedCount = 128;
			
			AddCP( Mouse.Pos.x+Camera.x, Mouse.Pos.y+Camera.y );
	
			var HalfLimit = (Limit>>1);
	
			// Constrain Player Pos //
			if ( Player.TargetPos.x < -(HalfLimit-54-16) )
				Player.TargetPos.x = -(HalfLimit-54-16);
			if ( Player.TargetPos.x > (HalfLimit-54) )
				Player.TargetPos.x = (HalfLimit-54);
		}
	}

		
	Player.Step();
	
	// *** //

	StepCP();
}
// - ------------------------------------------------------------------------------------------ - //

// - ------------------------------------------------------------------------------------------ - //
function Draw() {
	var BMouse = Mouse.Pos.clone();
	BMouse.x -= BaseX;
	BMouse.y -= BaseY;
	var BCMouse = BMouse.clone();
	BCMouse.x += FCamera.x;
	BCMouse.y += FCamera.y;

	// *** //

	BX = BaseX-FCamera.x;
	BY = BaseY-FCamera.y;

	// *** //

//	gfxClear( RGB(0,0,0) );
	
	gfxDrawLayer( BGLayer );
	gfxDrawLayer( RoomBGLayer );
	Player.Draw();
	gfxDrawLayer( RoomFGLayer );
	gfxDrawLayer( FGLayer );
	
	if ( MouseFocus != null ) {
		//console.log(MouseFocus);
		var Item = MouseFocus;
		var ArtFile = Art[Item.img];

		var IX = Item.x-ArtFile.anchor_x-ArtFile.margin_left;
		var IY = Item.y-ArtFile.anchor_y-ArtFile.margin_top;
		var IW = ArtFile.tile_w+ArtFile.margin_left+ArtFile.margin_right;
		var IH = ArtFile.tile_h+ArtFile.margin_top+ArtFile.margin_bottom;

		var OldAlpha = ctx.globalAlpha;
		ctx.globalAlpha = MouseMoveCount > 64 ? 1 : MouseMoveCount / 64;

		ctx.fillStyle = RGB(0,255,255);
		ctx.font = '20px Pixel';
		var Text = Item.nice;//Item.img;
		var TD = ctx.measureText(Text);
		ctx.fillText(Text, 
			BX+IX+(IW>>1) - (TD.width>>1),
			BY+IY - 15
			);

		ctx.globalAlpha = OldAlpha;
	}

	if ( Player.Focus != null ) {
		var Item = Player.Focus;
		var ArtFile = Art[Item.img];

		var IX = Item.x-ArtFile.anchor_x-ArtFile.margin_left;
		var IY = Item.y-ArtFile.anchor_y-ArtFile.margin_top;
		var IW = ArtFile.tile_w+ArtFile.margin_left+ArtFile.margin_right;
		var IH = ArtFile.tile_h+ArtFile.margin_top+ArtFile.margin_bottom;

		var OldAlpha = ctx.globalAlpha;
		ctx.globalAlpha = MouseClickedCount > 64 ? 1 : MouseClickedCount / 64;

		ctx.fillStyle = RGB(255,255,0);
		ctx.font = '20px Pixel';
		var Text = Item.nice;//Item.img;
		var TD = ctx.measureText(Text);
		ctx.fillText(Text, 
			BX+IX+(IW>>1) - (TD.width>>1),
			BY+IY - 15
			);

		ctx.globalAlpha = OldAlpha;
	}

	if ( ShowDebug ) {
		var OldAlpha = ctx.globalAlpha;
		ctx.globalAlpha = 0.8;

		if ( Mouse.Visible ) {
			ctx.fillStyle = RGB(255,255,255);
			ctx.fillRect( BaseX+BMouse.x-5,BaseY+BMouse.y-5,10,10 );
			ctx.fillStyle = RGB(255,0,255);
			ctx.fillRect( BaseX+BCMouse.x-5,BaseY+BCMouse.y-5,10,10 );
		}

		for ( var layer = 0; layer < ItemLayers.length; layer++ ) {
			for ( var idx = 0; idx < ItemLayers[layer].length; idx++ ) {
				var Item = ItemLayers[layer][idx];
				var ArtFile = Art[Item.img];
				
				var IX = Item.x-ArtFile.anchor_x-ArtFile.margin_left;
				var IY = Item.y-ArtFile.anchor_y-ArtFile.margin_top;
				var IW = ArtFile.tile_w+ArtFile.margin_left+ArtFile.margin_right;
				var IH = ArtFile.tile_h+ArtFile.margin_top+ArtFile.margin_bottom;
				
				// Position //
				ctx.strokeStyle = RGB(255,255,0);
				ctx.strokeRect( 
					BX+Item.x-2,
					BY+Item.y-2,
					4,4 );
				// Rectangle //
				ctx.strokeStyle = RGB(128,0,0);
				ctx.strokeRect( 
					BX+IX,
					BY+IY,
					IW,
					IH );
				// New Center //
				ctx.strokeStyle = RGB(255,255,255);
				ctx.strokeRect( 
					BX+IX+(IW>>1),
					BY+IY+(IH>>1),
					4,
					4 );
			}
		}
		ctx.globalAlpha = OldAlpha;
				
		{
			ctx.fillStyle = RGB(255,255,255);
			ctx.font = '20px Pixel';
			var Text = "Pos: " + Player.Pos.x + "," + Player.Pos.y;
			TD = ctx.measureText(Text);
			ctx.fillText(Text, BaseX-520, BaseY+280);
			
			Text = Player.CurrentAnimation + "(" + Player.CurrentFrameStep + ")";
			TD = ctx.measureText(Text);
			ctx.fillText(Text, BaseX-520, BaseY+280+20);
			Text = Player.State;
			TD = ctx.measureText(Text);
			ctx.fillText(Text, BaseX-520, BaseY+280+40);
			Text = Mouse.Pos.toString()+" "+BMouse.toString()+" "+BCMouse.toString();
			TD = ctx.measureText(Text);
			ctx.fillText(Text, BaseX-520, BaseY+280+60);
		}		
	}
	
//	var PlayerPos = Player.GetPos();
//	
//	ctx.fillStyle = RGB(255,255,255);
//	ctx.font = '20px Pixel';
//	var Text = 'The meat space is';
//	var TD = ctx.measureText(Text);
//	ctx.fillText(Text, BaseX+PlayerPos.x-(TD.width>>1), BaseY+PlayerPos.y-100-20);
//
//	Text = "haunted Drek. Stay.";
//	TD = ctx.measureText(Text);
//	if ( (Stepper >> 5)&1 ) {
//		Text = Text + "_";
//	}
//	ctx.fillText(Text, BaseX+PlayerPos.x-(TD.width>>1), BaseY+PlayerPos.y-100);

	// *** //

	{
		var BX = 640-100;
		var BY = 360-80;
		var BW = Art.Items.tile_w;
		var BH = Art.Items.tile_h;
		var HALF_BW = BW>>1;
		var HALF_BH = BH>>1;

		var UILength = Player.Inventory.length;
		var UIX = BX-(BW*(UILength))+HALF_BW;
		var UIY = BY-HALF_BW;
		var UIW = BW*(UILength);
		var UIH = BH;
		
		var Lit = null;
		
		if ( Test_Sphere_vs_AABB( BMouse, 2, UIX, UIY, UIW, UIH ) ) {
			Lit = Math.floor((BMouse.x-UIX)/BW);
			if ( Lit < 0 )
				Lit = null;
			if ( Lit >= UILength )
				Lit = null;
		}

		gfxDraw( Art.Inventory, BX+HALF_BW, BY, 2 );
		for ( var idx = 0; idx < UILength; idx++ ) {
			gfxDraw( Art.Inventory, UIX+HALF_BW+(idx*BW), BY, 1 );
			gfxDraw( (Lit == idx) ? Art.ItemsLit : Art.Items, UIX+HALF_BW+(idx*BW), BY-(HALF_BW-HALF_BH), Player.Inventory[idx] );
		}
		gfxDraw( Art.Inventory, BX-((UILength-1)*BW)-HALF_BW, BY, 0 );
	}

	// *** //

	DrawCP(-FCamera.x,-FCamera.y);

	// *** //

	if ( FadeIn ) {
		var Fade = Fader/255;
		var InvFade = (255-Fader)/255;
		if ( Fade > 0 ) {
			ctx.globalAlpha = Fade;
			Music.setVolume(InvFade);
			gfxClear( RGB(0,0,0) );
			ctx.globalAlpha = 1.0;
		}
		else {
			FadeIn = false;
		}
	}

	if ( FadeOut ) {
		var Fade = Fader/255;
		var InvFade = (255-Fader)/255;
		if ( Fade >= 0 ) {
			ctx.globalAlpha = InvFade;
			Music.setVolume(Fade);
			gfxClear( RGB(0,0,0) );
			ctx.globalAlpha = 1.0;
			if ( Fader == 128 )
				sndPlay("Fart1");

			if ( Fader == 1 ) {
				sndPlay("Flush");
				DoFin = true;
			}
		}
	}
	
	if ( DoFin ) {
		if ( FinDelay ) {
			FinDelay--;
		}
		else {
			ctx.fillStyle = RGB(255,255,255);
			ctx.font = '20px Pixel';
			var Text = 'Fin';
			var TD = ctx.measureText(Text);
			ctx.fillText(Text, BaseX-(TD.width>>1), BaseY);
		}
	}
}
// - ------------------------------------------------------------------------------------------ - //
