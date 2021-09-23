// - -------------------------------------------------------------------------------------------------------------- - //
var ACTIONMODE_READY =			0;

var ACTIONMODE_PREDELAY = 		1;
var ACTIONMODE_ACTION = 		2;
var ACTIONMODE_POSTDELAY = 		3;
// - -------------------------------------------------------------------------------------------------------------- - //
var EFFECT_HIT =				1;
var EFFECT_CRITICAL =			2;
var EFFECT_HEAL = 				3;
var EFFECT_HEAL_STAMINA = 		4;
var EFFECT_COMBO_BREAK =		5;
var EFFECT_KNOCKBACK =			6;

var EFFECT_HIT_SELF = 			32;
var EFFECT_FAIL = 				33;
var EFFECT_HEAL_FOE = 			34;
var EFFECT_HEAL_STAMINA_FOE = 	35;
// - -------------------------------------------------------------------------------------------------------------- - //
// TODO: Lingering Effects such as regeneration. Place in an action queue that affects the entity every Frame,
//   without interrupting normal attacking. Can be used to give posion.
// - -------------------------------------------------------------------------------------------------------------- - //


// - -------------------------------------------------------------------------------------------------------------- - //
// Sample "Hit" contaniing all possible arguMents, for reference. //
// All arrays, so to support added effects (eg. 1-2 punch as single action, with cost of 1 stamina) //
var ACTION_HIT_TEMPLATE = {
	// TiMes (In Frames) //
	PreDelay: 0, // How long to wait before executing the action (0 = instantly) - Warmup //
	ActionLength: 0, // How long the action itself takes (0 = instantly) //
	PostDelay: 0, // How long to wait before executing next action (0 = instantly) - Cooldown //
	
	// Effect (What this Action Does) //
	Effect: [EFFECT_HIT],
	EffectChance: [100], // Percent (modifiers may reduce effect below 100%, but a 100% Means it will almost always work) //
	EffectStrength: [2], // Base Damage,  //
	CriticalChance: 5, // Percent chance of inflicting a Crit //
	CriticalEffect: [EFFECT_CRITICAL,EFFECT_HIT], // Critical Effect goes first, so flag is set //
	CriticalEffectChance: [200,200], // Percent (modifiers may reduce effects below 100%, so 200% is used) //
	CriticalEffectStrength: [4,0], // Critical Damage //
	FailChance: -100, // Percent chance of an undesired side effect. Negative 100% implies no chance of happening, after modifiers //
	FailEffect: [EFFECT_FAIL,EFFECT_HIT_SELF], // Fail Effect goes first, so flag is set //
	FailEffectChance: [200,200],
	FailEffectStrength: [4,0],

	// Details //
	StaminaCost: 1, // All actions cost Stamina, but if there's an added effect, you can specify costs of 0 here //
	HealthCost: 0, // Typically, an action has no Health cost //
	ConsuMe: false, // Whether the weapon/item consuMes a unit of itself after use. Typically no. //
	Interruptable: true // Attacks can typically be interrupted, but to be fair, I may want to make healing effects not //
};
// - -------------------------------------------------------------------------------------------------------------- - //
var ACTION_REGEN_STAMINA = {
	PreDelay: 16,
	ActionLength: 0,
	PostDelay: 0,
	
	Effect: [EFFECT_HEAL_STAMINA],
	EffectChance: [200],
	EffectStrength: [1],
	
	StaminaCost: 0,
	Interruptable: false
};
// - -------------------------------------------------------------------------------------------------------------- - //
var ACTION_REGEN_STAMINA_QUICK = {
	PreDelay: 8,
	ActionLength: 0,
	PostDelay: 0,
	
	Effect: [EFFECT_HEAL_STAMINA],
	EffectChance: [200],
	EffectStrength: [1],
	
	StaminaCost: 0,
	Interruptable: false
};
// - -------------------------------------------------------------------------------------------------------------- - //
var ACTION_HIT_PUNCH = {
	// Approximately 2 per second (as an unskilled fighter) //
	PreDelay: 6,
	ActionLength: 0,
	PostDelay: 12,
	
	// Effect (What the Action Does) //
	Effect: [EFFECT_HIT],
	EffectChance: [100], // Percent (modifiers may reduce effect below 100%, but a 100% Means it will almost always work) //
	EffectStrength: [2], // Base Damage,  //
	CriticalChance: 5, // Percent chance of inflicting a Crit //
	CriticalEffect: [EFFECT_CRITICAL,EFFECT_HIT],
	CriticalEffectChance: [200,200], // Percent (modifiers may reduce effects below 100%, so 200% is used) //
	CriticalEffectStrength: [4,0], // Critical Damage //

	// Details //
	StaminaCost: 1, // All actions cost Stamina, but if there's an added effect, you can specify costs of 0 here //	
};
// - -------------------------------------------------------------------------------------------------------------- - //
var ACTION_HIT_BITE = {
	// Approximately 2 per second (as an unskilled fighter) //
	PreDelay: 4,
	ActionLength: 0,
	PostDelay: 12,
	
	// Effect (What the Action Does) //
	Effect: [EFFECT_HIT],
	EffectChance: [100], // Percent (modifiers may reduce effect below 100%, but a 100% Means it will almost always work) //
	EffectStrength: [1], // Base Damage,  //
	CriticalChance: 5, // Percent chance of inflicting a Crit //
	CriticalEffect: [EFFECT_CRITICAL,EFFECT_HIT],
	CriticalEffectChance: [200,200], // Percent (modifiers may reduce effects below 100%, so 200% is used) //
	CriticalEffectStrength: [2,0], // Critical Damage //

	// Details //
	StaminaCost: 1, // All actions cost Stamina, but if there's an added effect, you can specify costs of 0 here //	
};
// - -------------------------------------------------------------------------------------------------------------- - //
var ACTION_HIT_CARNAGE = {
	// Approximately 2 per second (as an unskilled fighter) //
	PreDelay: 16,
	ActionLength: 0,
	PostDelay: 24,
	
	// Effect (What the Action Does) //
	Effect: [EFFECT_HIT],
	EffectChance: [100], // Percent (modifiers may reduce effect below 100%, but a 100% Means it will almost always work) //
	EffectStrength: [6], // Base Damage,  //
	CriticalChance: 5, // Percent chance of inflicting a Crit //
	CriticalEffect: [EFFECT_CRITICAL,EFFECT_HIT],
	CriticalEffectChance: [200,200], // Percent (modifiers may reduce effects below 100%, so 200% is used) //
	CriticalEffectStrength: [12,0], // Critical Damage //

	// Details //
	StaminaCost: 1, // All actions cost Stamina, but if there's an added effect, you can specify costs of 0 here //	
};
// - -------------------------------------------------------------------------------------------------------------- - //

// - -------------------------------------------------------------------------------------------------------------- - //
var ACTION_HEAL_FOE = {
	PreDelay: 16,
	ActionLength: 0,
	PostDelay: 0,
	
	Effect: [EFFECT_HEAL_FOE,EFFECT_HIT_SELF],
	EffectChance: [200,200],
	EffectStrength: [32,32],
	
	StaminaCost: 0,
	Interruptable: false
};
// - -------------------------------------------------------------------------------------------------------------- - //

// - -------------------------------------------------------------------------------------------------------------- - //
var CLASS_HAND2HAND = {
	Action: [
		[ACTION_HIT_PUNCH], // Level 0 //
		[ACTION_HIT_PUNCH], // Level 1 //
		[ACTION_HIT_PUNCH]  // Level 2 //
		],
	DefaultCombo: [
		[ACTION_HIT_PUNCH,ACTION_REGEN_STAMINA],
		[ACTION_HIT_PUNCH,ACTION_HIT_PUNCH,ACTION_REGEN_STAMINA_QUICK,ACTION_REGEN_STAMINA],
		[ACTION_HIT_PUNCH,ACTION_HIT_PUNCH,ACTION_REGEN_STAMINA_QUICK,ACTION_REGEN_STAMINA_QUICK]
		],
	Sound: [
		'Slash',
		'Slash',
		'Slash'
		]
};
// - -------------------------------------------------------------------------------------------------------------- - //
var CLASS_BITE = {
	Action: [
		[ACTION_HIT_BITE], // Level 0 //
		[ACTION_HIT_BITE], // Level 1 //
		[ACTION_HIT_BITE]  // Level 2 //
		],
	DefaultCombo: [
		[ACTION_HIT_BITE,ACTION_REGEN_STAMINA],
		[ACTION_HIT_BITE,ACTION_HIT_BITE,ACTION_REGEN_STAMINA_QUICK,ACTION_REGEN_STAMINA],
		[ACTION_HIT_BITE,ACTION_HIT_BITE,ACTION_REGEN_STAMINA_QUICK,ACTION_REGEN_STAMINA_QUICK]
		],
	Sound: [
		'BatAttack',
		'BatAttack',
		'BatAttack'
		]	
};
// - -------------------------------------------------------------------------------------------------------------- - //
var CLASS_CARNAGE = {
	Action: [
		[ACTION_HIT_CARNAGE], // Level 0 //
		[ACTION_HIT_CARNAGE], // Level 1 //
		[ACTION_HIT_CARNAGE]  // Level 2 //
		],
	DefaultCombo: [
		[ACTION_HIT_CARNAGE,ACTION_REGEN_STAMINA],
		[ACTION_HIT_CARNAGE,ACTION_HIT_CARNAGE,ACTION_REGEN_STAMINA_QUICK,ACTION_REGEN_STAMINA],
		[ACTION_HIT_CARNAGE,ACTION_HIT_CARNAGE,ACTION_REGEN_STAMINA_QUICK,ACTION_REGEN_STAMINA_QUICK]
		],
	Sound: [
		'BeastAttack',
		'BeastAttack',
		'BeastAttack'
		]	
};
// - -------------------------------------------------------------------------------------------------------------- - //

// - -------------------------------------------------------------------------------------------------------------- - //
var WEAPON_HANDS = {
	Radius: 2,
	Class: CLASS_HAND2HAND
};
// - -------------------------------------------------------------------------------------------------------------- - //
var WEAPON_KNIFE = {
	Radius: 3
};
// - -------------------------------------------------------------------------------------------------------------- - //
var WEAPON_SWORD = {
	Radius: 4
};
// - -------------------------------------------------------------------------------------------------------------- - //
var WEAPON_LONGSWORD = {
	Radius: 5
};
// - -------------------------------------------------------------------------------------------------------------- - //
var WEAPON_SPEAR = {
	Radius: 6
};
// - -------------------------------------------------------------------------------------------------------------- - //

// - -------------------------------------------------------------------------------------------------------------- - //
var WEAPON_WEAKBITE = {
	Radius: 1,
	Class: CLASS_BITE
};
// - -------------------------------------------------------------------------------------------------------------- - //
var WEAPON_CARNAGE = {
	Radius: 1,
	Class: CLASS_CARNAGE
};
// - -------------------------------------------------------------------------------------------------------------- - //

// - -------------------------------------------------------------------------------------------------------------- - //
var TRAP_HEAL = {
	Radius: 32,
	Class: {
		Action: [
			[ACTION_HEAL_FOE]
			],
		DefaultCombo: [
			[ACTION_HEAL_FOE]
			],
		Sound: [
			'Magic'
			]
		}
};
// - -------------------------------------------------------------------------------------------------------------- - //

// - -------------------------------------------------------------------------------------------------------------- - //
var ENTITY_PLAYER = {
	ArtFrames: [ 0 ],
	ArtDelay: 0,
	DeathFrames: [ (6*8)+4 ],
	DeathSound: 'Death',
	Radius: 5,
	Speed: 0.2,
	DefaultWeapon: WEAPON_HANDS,
	Stats: {
		MaxHealth: 10,
		MaxStamina: 6,
		Sense: 24
	},
	Init: ENTITY_PLAYER_Init,
	Step: ENTITY_PLAYER_Step,
	Draw: ENTITY_PLAYER_Draw
};
// - -------------------------------------------------------------------------------------------------------------- - //
var ENTITY_BAT = {
	ArtFrames: [ (7*8)+0, (7*8)+1 ],
	ArtDelay: 8,
	DeathFrames: [ (7*8)+4 ],
	DeathSound: 'BatDeath',
	AlertSound: 'BatAlert',
	Radius: 4,
	Speed: 0.2,
	DefaultWeapon: WEAPON_WEAKBITE,
	Stats: {
		MaxHealth: 4,
		MaxStamina: 4,
		Sense: 40
	},
	Init: ENTITY_ENEMY_Init,
	Step: ENTITY_ENEMY_Seek,
	Draw: ENTITY_ENEMY_Draw
};
// - -------------------------------------------------------------------------------------------------------------- - //
var ENTITY_BEAST = {
	ArtFrames: [ (7*8)+2, (7*8)+3 ],
	ArtDelay: 8,
	DeathFrames: [ (6*8)+4 ],
	DeathSound: 'BeastDeath',
	AlertSound: 'BeastAlert',
	Radius: 7,
	Speed: 0.1,
	DefaultWeapon: WEAPON_CARNAGE,
	Stats: {
		MaxHealth: 4,
		MaxStamina: 4,
		Sense: 40
	},
	Init: ENTITY_ENEMY_Init,
	Step: ENTITY_ENEMY_Seek,
	Draw: ENTITY_ENEMY_Draw
};
// - -------------------------------------------------------------------------------------------------------------- - //

// - -------------------------------------------------------------------------------------------------------------- - //
var ENTITY_ITEM_CROWN = {
	ArtFrames: [ (2*8)+0, (2*8)+1 ],
	ArtDelay: 8,
	DeathFrames: [ (7*8)+4 ],
	AlertSound: 'Detected',
	Radius: 4,
	Stats: {
		MaxHealth: 4,
		MaxStamina: 4,
		Sense: 10
	},
	Step: ENTITY_ENEMY_SenseOnly
};
// - -------------------------------------------------------------------------------------------------------------- - //
var ENTITY_ITEM_RING = {
	ArtFrames: [ (0*8)+3 ],
	ArtDelay: 8,
	DeathFrames: [ (7*8)+4 ],
	Radius: 4,
	Stats: {
		MaxHealth: 4,
		MaxStamina: 4,
		Sense: 10
	}
};
// - -------------------------------------------------------------------------------------------------------------- - //
var ENTITY_ITEM_CANDLE = {
	ArtFrames: [ (1*8)+0 ],
	ArtDelay: 8,
	DeathFrames: [ (7*8)+4 ],
	Radius: 4,
	Stats: {
		MaxHealth: 4,
		MaxStamina: 4,
		Sense: 10
	}
};
// - -------------------------------------------------------------------------------------------------------------- - //
var ENTITY_ITEM_KEY1 = {
	ArtFrames: [ (0*8)+4 ],
	ArtDelay: 8,
	DeathFrames: [ (7*8)+4 ],
	Radius: 4,
	Stats: {
		MaxHealth: 4,
		MaxStamina: 4,
		Sense: 10
	}
};
// - -------------------------------------------------------------------------------------------------------------- - //
var ENTITY_ITEM_KNIFE = {
	ArtFrames: [ (0*8)+1 ],
	ArtDelay: 8,
	DeathFrames: [ (7*8)+4 ],
	AlertSound: 'Detected',
	Radius: 3,
	Stats: {
		MaxHealth: 4,
		MaxStamina: 4,
		Sense: 1
	},
	Step: ENTITY_ENEMY_SenseOnly
};
// - -------------------------------------------------------------------------------------------------------------- - //
var ENTITY_ITEM_SWORD = {
	ArtFrames: [ (1*8)+1 ],
	ArtDelay: 8,
	DeathFrames: [ (7*8)+4 ],
	AlertSound: 'Detected',
	Radius: 4,
	Stats: {
		MaxHealth: 4,
		MaxStamina: 4,
		Sense: 10
	},
	Step: ENTITY_ENEMY_SenseOnly

};
// - -------------------------------------------------------------------------------------------------------------- - //
var ENTITY_ITEM_SHIELD = {
	ArtFrames: [ (0*8)+2 ],
	ArtDelay: 8,
	DeathFrames: [ (7*8)+4 ],
	Radius: 4,
	Stats: {
		MaxHealth: 4,
		MaxStamina: 4,
		Sense: 10
	}
};
// - -------------------------------------------------------------------------------------------------------------- - //
var ENTITY_ITEM_BIGSHIELD = {
	ArtFrames: [ (1*8)+2 ],
	ArtDelay: 8,
	DeathFrames: [ (7*8)+4 ],
	Radius: 3,
	Stats: {
		MaxHealth: 4,
		MaxStamina: 4,
		Sense: 10
	}
};
// - -------------------------------------------------------------------------------------------------------------- - //

// - -------------------------------------------------------------------------------------------------------------- - //
var ENTITY_ITEM_SECRET = {
	ArtFrames: [ (6*8)+0 ],
	ArtDelay: 8,
	DeathFrames: [ (7*8)+4 ],
	AlertSound: 'BatAlert',
	DeathSound: 'Magic',
	DefaultWeapon: TRAP_HEAL,
	Radius: 3,
	Speed: 0,
	Stats: {
		MaxHealth: 4,
		MaxStamina: 4,
		Sense: 4
	},
	Init: ENTITY_ENEMY_Init,
	Step: ENTITY_ENEMY_Seek,
	Draw: ENTITY_ENEMY_Draw
};
// - -------------------------------------------------------------------------------------------------------------- - //


// - -------------------------------------------------------------------------------------------------------------- - //
function cEntity( _InstanceOf, _Art, _x, _y ) {
	this.Pos = new Vector2D( _x, _y );
	this.Old = new Vector2D( _x, _y );
	
	this.TargetPos = new Vector2D( _x, _y );
	this.Target = null;
	this.DistanceTraveled = 0;
	this.DistanceTraveledFrames = 0;
	
	this.Art = _Art; // Just a reference //
	
	this.Instance = _InstanceOf;
	
	this.Weapon = this.Instance.DefaultWeapon;
	this.Health = this.Instance.Stats.MaxHealth;
	this.Stamina = this.Instance.Stats.MaxStamina;
	
	this.Level = 0;
	
	this.ActionClock = 0;
	this.ActionMode = ACTIONMODE_READY;
	this.CurrentCombo = 0; // Zero if no target //
	this.CurrentAction = 0; // Index in to the current Combo //
	
	// Run Custom Code //
	if ( this.Instance.Init ) {
		this.Instance.Init( this );
	}
}
// - -------------------------------------------------------------------------------------------------------------- - //
cEntity.prototype.Kill = function() {
	this.Health = 0;
	
	this.Tracking = null;
	this.TrackingInRange = false;
	this.Target = null;
	this.DistanceTraveled = 0;
	this.DistanceTraveledFrames = 0;
}
// - -------------------------------------------------------------------------------------------------------------- - //
cEntity.prototype.IsAlive = function() {
	return (this.Health > 0);
}
// - -------------------------------------------------------------------------------------------------------------- - //
cEntity.prototype.AddHealth = function( Value ) {
	this.Health += Value;
	
	if ( this.Health > this.Instance.Stats.MaxHealth ) {
		this.Health = this.Instance.Stats.MaxHealth;
	}
	
	if ( this.Health <= 0 ) {
		Log( "Dead" );
		this.Kill();
	}
}
// - -------------------------------------------------------------------------------------------------------------- - //
cEntity.prototype.IsFatiged = function() {
	return this.Stamina <= 0;
}
// - -------------------------------------------------------------------------------------------------------------- - //
cEntity.prototype.AddStamina = function( Value ) {
	this.Stamina += Value;
	
	if ( this.Stamina >= this.Instance.Stats.MaxStamina ) {
		this.Stamina = this.Instance.Stats.MaxStamina;
	}
	
	if ( this.Stamina < 0 ) {
		// Too much stamina reduces health //
		this.AddHealth( this.Stamina );
		this.Stamina = 0;
	}
}
// - -------------------------------------------------------------------------------------------------------------- - //
cEntity.prototype.Step = function() {
	// Run Custom Code //
	if ( this.IsAlive() ) {
		if ( this.Instance.Step ) {
			this.Instance.Step( this );
		}
	}
	
	if ( this.Weapon ) {
		if ( this.CurrentCombo ) {
			DoCombo( this, this.CurrentCombo, this.Tracking );
		}
	}
	
	// Verlet Physics Step //
	var Velocity = this.Pos.clone();
	Velocity.Sub( this.Old );
	if ( this.Target ) {
		this.DistanceTraveled += Velocity.Manhattan();
		this.DistanceTraveledFrames++;
	}
	Velocity.MultScalar( 0.8 ); // Drag (Friction-like) //
	Velocity.Add( this.Pos );
	this.Old = this.Pos;
	this.Pos = Velocity;
}
// - -------------------------------------------------------------------------------------------------------------- - //
cEntity.prototype.Draw = function( _OffsetX, _OffsetY ) {
	// Run Custom Code //
	if ( this.Instance.Draw ) {
		this.Instance.Draw( this, _OffsetX, _OffsetY );
	}

	// Draw Object //
	var Frame = 0;
	if ( !this.IsAlive() ) {
		Frame = this.Instance.DeathFrames[ 0 ];
	}
	else if ( this.Instance.ArtDelay > 0 ) {
		Frame = this.Instance.ArtFrames[ Math.floor((GlobalCurrentFrame+(this.Pos.Manhattan()&7)) / this.Instance.ArtDelay) % this.Instance.ArtFrames.length ];
	}
	this.Art.DrawCentered( Frame, _OffsetX + this.Pos.x, _OffsetY + this.Pos.y );
	
	// Draw Debug Info //
	if ( GlobalDebugMode ) {
		// Draw Collision Radius //
		DebugElement.Add( DBGE_Circle );
		DebugElement.SetColor( 255, 0, 0, 128 );
		DebugElement.SetArgs( [_OffsetX + this.Pos.x, _OffsetY + this.Pos.y, this.Instance.Radius] );
		
		// Draw Weapon Reach Radius //
		if ( this.Weapon ) {
			DebugElement.Add( DBGE_Circle );
			DebugElement.SetColor( 255, 255, 0, 128 );
			DebugElement.SetArgs( [_OffsetX + this.Pos.x, _OffsetY + this.Pos.y, this.Instance.Radius + this.Weapon.Radius] );
		}
		
		// Draw Senses Radius //
		DebugElement.Add( DBGE_Circle );
		if ( this.Tracking )
			DebugElement.SetColor( 128, 255, 255, 128 );
		else
			DebugElement.SetColor( 255, 255, 255, 64 );
		DebugElement.SetArgs( [_OffsetX + this.Pos.x, _OffsetY + this.Pos.y, this.Instance.Radius + this.Instance.Stats.Sense] );
	}
}
// - -------------------------------------------------------------------------------------------------------------- - //

// - -------------------------------------------------------------------------------------------------------------- - //
cEntity.prototype.DrawHealthStaminaUI = function( _OffsetX, _OffsetY ) {
	var UIPos = new Vector2D( _OffsetX, _OffsetY );
	var UIHeight = 6;

	// Border //
	gelSetColor( 255,255,255,192 );
	gelDrawRect( UIPos.x, UIPos.y, this.Instance.Stats.MaxHealth + this.Instance.Stats.MaxStamina + 4, UIHeight + 4 );

	UIPos.x += 2;
	UIPos.y += 2;

	// Health //
	gelSetColor( 64,255,64,192 );
	gelDrawRectFill( UIPos.x, UIPos.y, this.Health, UIHeight );	
	if ( this.Health > 2 ) {
		gelSetColor( 192,255,192,192 );
		gelDrawRect( UIPos.x+1, UIPos.y+4, this.Health-2, 1 );
	}

	UIPos.x += this.Health;
	
	// Max Health //
	gelSetColor( 192,16,16,192 );
	gelDrawRectFill( UIPos.x, UIPos.y, this.Instance.Stats.MaxHealth - this.Health, UIHeight );

	UIPos.x += this.Instance.Stats.MaxHealth - this.Health;
	
	// Max Stamina //
	gelSetColor( 32,32,32,192 );
	gelDrawRectFill( UIPos.x, UIPos.y, this.Instance.Stats.MaxStamina - this.Stamina, UIHeight );

	UIPos.x += this.Instance.Stats.MaxStamina - this.Stamina;
	
	// Stamina //
	gelSetColor( 255,255,64 );
	gelDrawRectFill( UIPos.x, UIPos.y, this.Stamina, UIHeight );
	if ( this.Stamina > 2 ) {
		gelSetColor( 255,255,192,192 );
		gelDrawRect( UIPos.x+1, UIPos.y+4, this.Stamina-2, 1 );
	}

	UIPos.x += this.Stamina;

}
// - -------------------------------------------------------------------------------------------------------------- - //

// - -------------------------------------------------------------------------------------------------------------- - //
// Custom Step Code (Entity passed as arguMent instead of this) //
// - -------------------------------------------------------------------------------------------------------------- - //
function ENTITY_PLAYER_Init( Me ) {
	Me.Tracking = null;
	Me.TrackingInRange = false;
}
// - -------------------------------------------------------------------------------------------------------------- - //
function ENTITY_PLAYER_Step( Me ) {
	// Cancel Targeting if you haven't moved for a while //
	if ( Me.DistanceTraveledFrames >= 5 ) {
		if ( (Me.DistanceTraveled / Me.DistanceTraveledFrames) < Me.Instance.Speed ) {
			Me.Target = null;
			Me.DistanceTraveledFrames = 0;
		}
		else {
			Me.DistanceTraveled /= Me.DistanceTraveledFrames;
			Me.DistanceTraveledFrames = 1;
		}
	}
	
	// Input (Keys) //
	var Stick = Input_Stick.clone();
	Stick.MultScalar( Me.Instance.Speed );
	Me.Pos = Add( Me.Pos, Stick );
	if ( Input_Stick.Manhattan() ) {
		Me.Target = null;
	}
	
	// Input (Mouse) //
	if ( Input_MouseBits & MOUSE_LMB ) {
		Me.TargetPos = GlobalCameraOffset.Negative();
		Me.TargetPos.Add( Input_Mouse );
		
		Me.DistanceTraveled = 0;
		Me.DistanceTraveledFrames = 0;
		
		Me.Target = true;
	}
	if ( Me.Target ) {
		var DistanceTo = Me.TargetPos.clone();
		DistanceTo.Sub( Me.Pos );
		
		var RequiredDistance = 2;
		var Mag = DistanceTo.MagnitudeSquared();
		if ( Mag < (RequiredDistance * RequiredDistance) ) {
			Me.Target = null;
		}
		else {
			DistanceTo.Normalize();
			DistanceTo.MultScalar( Me.Instance.Speed );
			Me.Pos = Add( Me.Pos, DistanceTo );			
		}
	}
	
	// Update Tracking //
	if ( Me.Tracking ) {
		if ( Me.Tracking.IsAlive() ) {
			var DistanceTo = Me.Tracking.Pos.clone();
			DistanceTo.Sub( Me.Pos );
		
			var Inside = Me.Instance.Radius + Me.Tracking.Instance.Stats.Sense;
			var Mag = DistanceTo.MagnitudeSquared();
			
			if ( Mag >= (Inside * Inside) ) {
				Log( "Enemy outside my sense range... ignoring" );
				// Stop Tracking //
				Me.Tracking = null;
			}
			else {			
				Inside = Me.Instance.Radius + Me.Weapon.Radius + Me.Tracking.Instance.Radius;
				Me.TrackingInRange = Mag < (Inside * Inside);
			}
		}
		else {
			Me.TrackingInRange = false;
			Me.Tracking = null;
		}
	}
	else {
		Me.TrackingInRange = false;
	}
			
	// Attacking //
	if ( Me.Tracking ) {
		if ( Me.TrackingInRange ) {
			if ( Me.ActionMode == ACTIONMODE_READY ) { 
				Log( "Player Attacking..." );
				SetCombo( Me, Me.Weapon.Class.DefaultCombo[Me.Level] ) ;
			}
		}
	}
}
// - -------------------------------------------------------------------------------------------------------------- - //
function ENTITY_PLAYER_Draw( Me, _OffsetX, _OffsetY ) {
	// Draw Tracking Diamond //
	if ( Me.Tracking ) {
		if ( Me.TrackingInRange )
			gelSetColor( 0, 255, 0 );
		else
			gelSetColor( 255, 255, 0 );

		gelDrawDiamond( Math.floor(_OffsetX + Me.Tracking.Pos.x), Math.floor(_OffsetY + Me.Tracking.Pos.y), Me.Tracking.Instance.Radius + 2 );
	}
	
	// Draw Mouse Cursor Click Target //
	if ( Me.Target ) {
		gelSetColor( 255,255,255 );
		gelDrawX( Math.floor( _OffsetX + Me.TargetPos.x ), Math.floor( _OffsetY + Me.TargetPos.y), 3 );
	}
}
// - -------------------------------------------------------------------------------------------------------------- - //
function ENTITY_ENEMY_Draw( Me, _OffsetX, _OffsetY ) {
	if ( GlobalDebugMode ) {
		// Draw Tracking Diamond //
		if ( Me.Tracking ) {
			if ( Me.TrackingInRange )
				gelSetColor( 0, 255, 0 );
			else
				gelSetColor( 255, 255, 0 );
	
			gelDrawDiamond( Math.floor(_OffsetX + Me.Tracking.Pos.x), Math.floor(_OffsetY + Me.Tracking.Pos.y), Me.Tracking.Instance.Radius + 2 );
		}
		
		// Draw Mouse Cursor Click Target //
		if ( Me.Target ) {
			gelSetColor( 255,255,255 );
			gelDrawX( Math.floor( _OffsetX + Me.TargetPos.x ), Math.floor( _OffsetY + Me.TargetPos.y), 3 );
		}
	}
}
// - -------------------------------------------------------------------------------------------------------------- - //

// - -------------------------------------------------------------------------------------------------------------- - //
function ENTITY_ENEMY_Init( Me ) {
	Me.Tracking = null;
	Me.TrackingInRange = false;
}
// - -------------------------------------------------------------------------------------------------------------- - //
function ENTITY_ENEMY_Seek( Me ) {
	// AI - Check if My Target (always the Player) enters my vision (Senses) //
	var DistanceTo = Game.Player.Pos.clone();
	DistanceTo.Sub( Me.Pos );
	
	var Inside = Game.Player.Instance.Radius + Me.Instance.Radius + Me.Instance.Stats.Sense;
	var Mag = DistanceTo.MagnitudeSquared();
	if ( Mag < (Inside * Inside) ) {
		// If you weren't tracking before //
		if ( !Me.Tracking ) {
			if ( Game.Player.IsAlive() ) {
				if ( Me.Instance.AlertSound ) {
					sndPlay( Me.Instance.AlertSound );
				}
			}
		}
		
		// Object is now tracking (doesn't mean you are in range though) //
		Me.Tracking = Game.Player;
		Me.TrackingInRange = false;
		
		var CloseEnough = Game.Player.Instance.Radius + Me.Instance.Radius + Me.Weapon.Radius;
		if ( Mag > (CloseEnough * CloseEnough) ) {
			DistanceTo.Normalize();
			DistanceTo.MultScalar( Me.Instance.Speed );
			Me.Pos = Add( Me.Pos, DistanceTo );
		}
		else {
			if ( Me.Tracking.IsAlive() ) {
				// Yes we are in range //
				Me.TrackingInRange = true;
			}
		}
		
		// NOTE: An enemy will only ever activate the players tracking sense, once he has seen the player! //
		
		// If Enemy enters the player senses range, make the player track him //
		CloseEnough = Game.Player.Instance.Radius + Me.Instance.Radius + Game.Player.Instance.Stats.Sense;
		if ( Mag < (CloseEnough * CloseEnough) ) {
			if ( Game.Player.IsAlive() ) {
				// Hack: Make Player target the first enemy that enters his range //
				if ( Game.Player.Tracking == null ) {
					Game.Player.Tracking = Me;
				}
				else if ( !Game.Player.Tracking.IsAlive() ) {
					// Hack: Make Player change targets if old target is dead //
					Game.Player.Tracking = Me;
				}
			}
		}

		CloseEnough = Game.Player.Instance.Radius + Me.Instance.Radius + Game.Player.Weapon.Radius;
		if ( Mag < (CloseEnough * CloseEnough) ) {
			if ( Game.Player.IsAlive() ) {
				if ( Game.Player.TrackingInRange == false ) {
					// Hack: Make Player change targets if other is too far away //
					Game.Player.TrackingInRange = true;
					Game.Player.Tracking = Me;
				}
			}
		}
	}
	else {
		// Double check that Tracking is still not within weapon radius (traps may have > Weapon Radius than Sense) //
		var CloseEnough = Game.Player.Instance.Radius + Me.Instance.Radius + Me.Weapon.Radius;
		if ( Mag > (CloseEnough * CloseEnough) ) {
			Me.Tracking = null;
		}
	}
	
	// Attacking //
	if ( Me.Tracking ) {
		if ( Me.TrackingInRange ) {
			if ( Me.ActionMode == ACTIONMODE_READY ) { 
				Log( "Enemy Attacking..." );
				SetCombo( Me, Me.Weapon.Class.DefaultCombo[Me.Level] ) ;
			}
		}
	}
}
// - -------------------------------------------------------------------------------------------------------------- - //

// - -------------------------------------------------------------------------------------------------------------- - //
function ENTITY_ENEMY_SenseOnly( Me ) {
	// AI - Only Sense, that's all //
	var DistanceTo = Game.Player.Pos.clone();
	DistanceTo.Sub( Me.Pos );
	
	var Inside = Game.Player.Instance.Radius + Me.Instance.Radius + Me.Instance.Stats.Sense;
	var Mag = DistanceTo.MagnitudeSquared();
	if ( Mag < (Inside * Inside) ) {
		if ( !Me.Tracking ) {
			Me.Tracking = Game.Player;
			if ( Me.Tracking.IsAlive() ) {
				if ( Me.Instance.AlertSound ) {
					sndPlay( Me.Instance.AlertSound );
				}
			}
		}
	
		// Object is now tracking (doesn't mean you are in range though) //
		Me.Tracking = Game.Player;
		Me.TrackingInRange = false;	
	}
	else {
		Me.Tracking = null;
	}
}
// - -------------------------------------------------------------------------------------------------------------- - //


// - -------------------------------------------------------------------------------------------------------------- - //
function SetCombo( Me, Combo ) {
	Me.ActionClock = 0;
	Me.ActionMode = ACTIONMODE_PREDELAY;
	Me.CurrentCombo = Combo;
	Me.CurrentAction = 0;
}
// - -------------------------------------------------------------------------------------------------------------- - //
function DoCombo( Me, Combo, Target ) {
	// If ready for action, then no action has been queued //
	if ( Me.ActionMode == ACTIONMODE_READY )
		return;
		
	var Repeat;
	do {
		Repeat = false; // Allow repeating, in the case of sophisticated instant combos //
		
		// First Step, Wait //
		if ( Me.ActionMode == ACTIONMODE_PREDELAY ) {
			if ( Me.ActionClock >= Combo[Me.CurrentAction].PreDelay ) {
				Me.ActionClock = 0; // Clear Clock //
				Me.ActionMode = ACTIONMODE_ACTION;
			}
		}
		// Next Step, Act //
		if ( Me.ActionMode == ACTIONMODE_ACTION ) {
			if ( Me.ActionClock >= Combo[Me.CurrentAction].ActionLength ) {
				DoAction( Me, Combo[Me.CurrentAction], Target );			
				Me.ActionClock = 0; // Clear Clock //
				Me.ActionMode = ACTIONMODE_POSTDELAY;
			}
		}
		// Last Step, Wait Again //
		if ( Me.ActionMode == ACTIONMODE_POSTDELAY ) {
			if ( Me.ActionClock >= Combo[Me.CurrentAction].PostDelay ) {
				Me.CurrentAction++; // Next Action //
				if ( Me.CurrentAction >= Combo.length ) {
					Log( "Done Combo" );
					// No more actions in this combo //
					Me.ActionClock = 0;	// Clear Clock //	
					Me.ActionMode = ACTIONMODE_READY;
					Me.CurrentCombo = null; // Clear the Combo (Finished) //
					return; // Bail early, so not to increment the clock //
				}
				else {
					// Next Action //
					Me.ActionClock = 0;
					Me.ActionMode = ACTIONMODE_PREDELAY;
					Repeat = true; // Repeat, just in case the follow up action is instant //
				}
			}
		}
	}
	while ( Repeat );
	
	Me.ActionClock += 1; // TODO: Scale by Modifier //
}
// - -------------------------------------------------------------------------------------------------------------- - //
function DoAction( Me, Action, Target ) {
	var IsCritical = false;
	var IsFail = false;
	
	for ( var idx = 0; idx < Action.Effect.length; idx++ ) {
		switch( Action.Effect[idx] ) {
			case EFFECT_HIT:
				if ( Target ) {
					var Damage = Action.EffectStrength[idx];
					Log( Damage + " Damage" );
					Target.AddHealth( -Damage );
					
					OverlayElement.Add( DBGE_DiamondFill );
					OverlayElement.SetColor( 255, 0, 0 );
					OverlayElement.SetLifeTime( 3 );
					OverlayElement.SetArgs( [GlobalCameraOffset.x + Target.Pos.x, GlobalCameraOffset.y + Target.Pos.y, 3] );
					OverlayElement.Add( DBGE_Diamond );
					OverlayElement.SetColor( 255, 0, 0 );
					OverlayElement.SetLifeTime( 5 );
					OverlayElement.SetArgs( [GlobalCameraOffset.x + Target.Pos.x, GlobalCameraOffset.y + Target.Pos.y, 3] );

					
					if ( !Target.IsAlive() ) {
						sndPlay( Target.Instance.DeathSound );
						if ( Me.Tracking === Target ) {
							Me.Tracking = null;
							Me.TrackingInRange = false;
						}
					}
					else {
						sndPlay( Me.Weapon.Class.Sound[Me.Level] );
					}
				}
				else {
					Log( "Target outside range. Hit Foe Failed." );
				}
				break;
			case EFFECT_CRITICAL:
				IsCritical = true;
				break;
			case EFFECT_HEAL:
				var Heal = Action.EffectStrength[idx];
				Log( Heal + " Health Healed" );
				Me.AddHealth( Heal );
				break;
			case EFFECT_HEAL_STAMINA:
				var Heal = Action.EffectStrength[idx];
				Log( Heal + " Stamina Healed" );
				Me.AddStamina( Heal );
				break;
			case EFFECT_HEAL_FOE:
				if ( Target ) {
					var Heal = Action.EffectStrength[idx];
					Log( Heal + " Health Healed" );
					Target.AddHealth( Heal );
				}
				else {
					Log( "Target outside range. Heal Foe Failed." );
				}
				break;
			case EFFECT_HEAL_STAMINA_FOE:
				if ( Target ) {
					var Heal = Action.EffectStrength[idx];
					Log( Heal + " Stamina Healed" );
					Target.AddStamina( Heal );
				}
				else {
					Log( "Target outside range. Heal Stamina Foe Failed." )
				}
				break;
			case EFFECT_COMBO_BREAK:
				break;
			case EFFECT_KNOCKBACK:
				break;
			case EFFECT_HIT_SELF:
				var Damage = Action.EffectStrength[idx];
				Log( Damage + " Damage To Self!" );
				Me.AddHealth( -Damage );

				if ( !Me.IsAlive() ) {
					sndPlay( Me.Instance.DeathSound );
					if ( Target )
						if ( Target.Tracking === Me )
							Target.Tracking = null;
					Me.Tracking = null;
				}
				else {
					sndPlay( Me.Weapon.Class.Sound[Me.Level] );
				}
				break;
			case EFFECT_FAIL:
				IsFail = true;
				break;
		};
	}
	
	// Take Stamina Cost //
	if ( Action.StaminaCost ) {
		Me.AddStamina( -Action.StaminaCost );
	}
	
	// Take Health Cost (Rare) //
	if ( Action.HealthCost ) {
		Me.AddHealth( -Action.HealthCost );
	}
}
// - -------------------------------------------------------------------------------------------------------------- - //
