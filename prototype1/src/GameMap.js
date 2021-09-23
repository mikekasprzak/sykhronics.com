// - -------------------------------------------------------------------------------------------------------------- - //
var TS_EMPTY = 					0;
var TS_FILL = 					1;

var TS_TOP_SIDE = 				2;
var TS_BOTTOM_SIDE = 			3;
var TS_LEFT_SIDE = 				4;
var TS_RIGHT_SIDE = 			5;

var TS_TOP_LEFT_CORNER =		6;
var TS_TOP_RIGHT_CORNER =		7;
var TS_BOTTOM_LEFT_CORNER =		8;
var TS_BOTTOM_RIGHT_CORNER =	9;

var TS_TOP_LEFT_SIDE =			10;
var TS_TOP_RIGHT_SIDE =			11;
var TS_BOTTOM_LEFT_SIDE =		12;
var TS_BOTTOM_RIGHT_SIDE =		13;
// - -------------------------------------------------------------------------------------------------------------- - //
var TSBIT_TOP = 				0x1;
var TSBIT_BOTTOM = 				0x2;
var TSBIT_LEFT = 				0x4;
var TSBIT_RIGHT = 				0x8;

var TSBIT_TOP_LEFT = 			0x10;
var TSBIT_TOP_RIGHT = 			0x20;
var TSBIT_BOTTOM_LEFT = 		0x40;
var TSBIT_BOTTOM_RIGHT = 		0x80;
// - -------------------------------------------------------------------------------------------------------------- - //
var TileSet_Room = [
	6 + (3*8), // Empty //
	6 + (6*8), // Filled //
	6 + (5*8), 6 + (7*8),	// Top, Bottom //
	5 + (6*8), 7 + (6*8),	// Left, Right //	
	5 + (5*8), 7 + (5*8),	// Top Left Corner, Top Right Corner //
	5 + (7*8), 7 + (7*8),	// Bottom Left Corner, Bottom Right Corner //
	5 + (2*8), 7 + (2*8),	// Top Left Side, Top Right Side //
	5 + (4*8), 7 + (4*8),
	];
// - -------------------------------------------------------------------------------------------------------------- - //
var TileSetSolid;

var TSS_LEFT = 					0x1;
var TSS_RIGHT = 				0x2;
var TSS_TOP = 					0x4;
var TSS_BOTTOM = 				0x8;

var TSS_TOP_LEFT = 				0x10;
var TSS_TOP_RIGHT = 			0x20;
var TSS_BOTTOM_LEFT = 			0x40;
var TSS_BOTTOM_RIGHT = 			0x80;
// - -------------------------------------------------------------------------------------------------------------- - //

// - -------------------------------------------------------------------------------------------------------------- - //
// Constructor //
function cGameMap( _Art ) {
	this.width = 128;
	this.height = 128;
	
	this.Art = _Art;
	
	{
		TileSetSolid = new Array(256);
		for ( var idx = 0; idx < TileSetSolid.length; idx++ ) {
			TileSetSolid[idx] = TSS_LEFT | TSS_RIGHT | TSS_TOP | TSS_BOTTOM;
		}
	
		var Filter = TileSet_Room;
		TileSetSolid[ Filter[ TS_FILL ] ] = 0;
		TileSetSolid[ Filter[ TS_TOP_LEFT_SIDE ] ] = TSS_TOP_LEFT | TSS_TOP | TSS_LEFT;
		TileSetSolid[ Filter[ TS_TOP_RIGHT_SIDE ] ] = TSS_TOP_RIGHT | TSS_TOP | TSS_RIGHT;
		TileSetSolid[ Filter[ TS_BOTTOM_LEFT_SIDE ] ] = TSS_BOTTOM_LEFT | TSS_BOTTOM | TSS_LEFT;
		TileSetSolid[ Filter[ TS_BOTTOM_RIGHT_SIDE ] ] = TSS_BOTTOM_RIGHT | TSS_BOTTOM | TSS_RIGHT;
	}	

	// Fill the map //	
	this.Data = new Array( this.width * this.height );
	this.Clear( TileSet_Room );
	this.AddRect( TileSet_Room, 3, 3, 4, 3 );
	this.AddRect( TileSet_Room, 6, 6, 4, 4 );
	this.AddRect( TileSet_Room, 8, 10, 1, 6 );

	this.AddRect( TileSet_Room, 7, 2, 7, 1 );
	this.AddRect( TileSet_Room, 13, 3, 4, 2 );
	this.AddRect( TileSet_Room, 17, 3, 4, 1 );
	this.AddRect( TileSet_Room, 20, 2, 7, 7 );
	this.AddRect( TileSet_Room, 25, 8, 1, 8 );
	this.AddRect( TileSet_Room, 23, 14, 2, 6 );
	this.AddRect( TileSet_Room, 24, 18, 5, 1 );
	this.AddRect( TileSet_Room, 18, 16, 3, 3 );
	this.AddRect( TileSet_Room, 17, 21, 3, 3 );
	this.AddRect( TileSet_Room, 16, 24, 3, 3 );
	
	this.AddRect( TileSet_Room, 26, 6, 22, 1 );
	this.AddRect( TileSet_Room, 38, 4, 5, 5 );
	this.AddRect( TileSet_Room, 48, 3, 7, 7 );

	this.RoomFilter( TileSet_Room );
}
// - -------------------------------------------------------------------------------------------------------------- - //
cGameMap.prototype.Index = function( _x, _y ) {
	return _x + (_y * this.width);
}
// - -------------------------------------------------------------------------------------------------------------- - //
cGameMap.prototype.Get = function( _x, _y ) {
	return this.Data[ _x + (_y * this.width) ];
}
// - -------------------------------------------------------------------------------------------------------------- - //
cGameMap.prototype.Set = function( _x, _y, _value ) {
	this.Data[ _x + (_y * this.width) ] = _value;
}
// - -------------------------------------------------------------------------------------------------------------- - //

// - -------------------------------------------------------------------------------------------------------------- - //
cGameMap.prototype.Draw = function( _x, _y, _w, _h ) {
	if ( this.Art.Data.complete ) {
		var OffsetX = _x;
		var OffsetY = _y;

		var StartCellX = Math.floor( (-_x) / this.Art.CellW );
		var StartCellY = Math.floor( (-_y) / this.Art.CellH );
		var EndCellX = Math.ceil( (-_x + _w) / this.Art.CellW );
		var EndCellY = Math.ceil( (-_y + _h) / this.Art.CellH );

		// Clamp to 0 //
		if ( StartCellX < 0 ) {
			StartCellX = 0;
		}
		else {
			OffsetX += StartCellX * this.Art.CellW;
		}
		if ( StartCellY < 0 ) {
			StartCellY = 0;
		}
		else {
			OffsetY += StartCellY * this.Art.CellH;
		}

		// Clamp to Width/Height //
		if ( EndCellX > this.width ) {
			EndCellX = this.width;
		}
		if ( EndCellY > this.height ) {
			EndCellY = this.height;
		}

		var CellDiffX = EndCellX - StartCellX;
		var CellDiffY = EndCellY - StartCellY;
			
		this.DrawRegion( OffsetX, OffsetY, StartCellX, StartCellY, CellDiffX, CellDiffY );
	}
}
// - -------------------------------------------------------------------------------------------------------------- - //
// Draw a region of the map - Where on screen, 
cGameMap.prototype.DrawRegion = function( _ScreenX, _ScreenY, _CellStartX, _CellStartY, _WidthInCells, _HeightInCells ) {
	if ( this.Art.Data.complete ) {
		for ( var y = 0; y < _HeightInCells; y++ ) {
			for ( var x = 0; x < _WidthInCells; x++ ) {
				this.Art.Draw( 
					this.Get( x + _CellStartX, y + _CellStartY ), 
					_ScreenX + (x * this.Art.CellW), 
					_ScreenY + (y * this.Art.CellH) 
					);
			}
		}
		
		// Debug Overlay //		
		if ( GlobalDebugMode ) {
			gelSetColor( 255, 0, 0, 128 );
			for ( var y = 0; y < _HeightInCells; y++ ) {
				for ( var x = 0; x < _WidthInCells; x++ ) {
					var Cell = this.Get( x + _CellStartX, y + _CellStartY );
					
					var x1 = _ScreenX + (x * this.Art.CellW);
					var y1 = _ScreenY + (y * this.Art.CellH);
					var x2 = x1 + this.Art.CellW;
					var y2 = y1 + this.Art.CellH;
					var w = this.Art.CellW;
					var h = this.Art.CellH;
					
					switch( TileSetSolid[ Cell ] ) {
						case 0:
							// Do Nothing //
							break;
						case (TSS_LEFT | TSS_RIGHT | TSS_TOP | TSS_BOTTOM):
//							DebugElement.Add( DBGE_RectFill );
//							DebugElement.SetColor( 255, 0, 0, 128 );
//							DebugElement.SetArgs( [x1, y1, w, h] );
//
//							DebugElement.Add( DBGE_Rect );
//							DebugElement.SetColor( 255, 0, 0, 128 );
//							DebugElement.SetArgs( [x1, y1, w, h] );

							gelDrawRectFill( x1,y1, w,h );
							gelDrawRect( x1,y1, w,h );
							break;
							
						case (TSS_BOTTOM_RIGHT | TSS_BOTTOM | TSS_RIGHT):
//							DebugElement.Add( DBGE_WedgeBottomRightFill );
//							DebugElement.SetColor( 255, 0, 0, 128 );
//							DebugElement.SetArgs( [x1, y1, w, h] );

							gelDrawWedgeBottomRightFill( x1,y1, w,h );
							break;
						case (TSS_BOTTOM_LEFT | TSS_BOTTOM | TSS_LEFT):
//							DebugElement.Add( DBGE_WedgeBottomLeftFill );
//							DebugElement.SetColor( 255, 0, 0, 128 );
//							DebugElement.SetArgs( [x1, y1, w, h] );

							gelDrawWedgeBottomLeftFill( x1,y1, w,h );
							break;
						case (TSS_TOP_RIGHT | TSS_TOP | TSS_RIGHT):
//							DebugElement.Add( DBGE_WedgeTopRightFill );
//							DebugElement.SetColor( 255, 0, 0, 128 );
//							DebugElement.SetArgs( [x1, y1, w, h] );

							gelDrawWedgeTopRightFill( x1,y1, w,h );
							break;
						case (TSS_TOP_LEFT | TSS_TOP | TSS_LEFT):
//							DebugElement.Add( DBGE_WedgeTopLeftFill );
//							DebugElement.SetColor( 255, 0, 0, 128 );
//							DebugElement.SetArgs( [x1, y1, w, h] );

							gelDrawWedgeTopLeftFill( x1,y1, w,h );
							break;
							
						default:
							// Unknown Edge //
//							DebugElement.Add( DBGE_Rect );
//							DebugElement.SetColor( 255, 255, 0, 128 );
//							DebugElement.SetArgs( [x1, y1, w, h] );

							gelSetColor( 255, 255, 0, 255 );
							gelDrawRect( x1, y1, w, h );
							gelSetColor( 255, 0, 0, 128 );
							break;
					}
				}
			}			
		}
	}
}
// - -------------------------------------------------------------------------------------------------------------- - //
cGameMap.prototype.SolveSphere = function( _v, _Radius ) {
	// NOTE: I am going to assume no character is bigger than 1 cell //
	var Pos = _v.clone(); // Vector2D //
	
	Pos.x -= (this.Art.CellW>>1);
	Pos.y -= (this.Art.CellH>>1);
	Pos.x /= this.Art.CellW;
	Pos.y /= this.Art.CellH;

	var Tx = [ 
		Math.floor(Pos.x),
		Math.ceil(Pos.x),
		Math.floor(Pos.x),
		Math.ceil(Pos.x)
		];

	var Ty = [ 
		Math.floor(Pos.y),
		Math.floor(Pos.y),
		Math.ceil(Pos.y),
		Math.ceil(Pos.y)
		];	

	var T = [ 
		this.Index( Tx[0], Ty[0] ),
		this.Index( Tx[1], Ty[1] ),
		this.Index( Tx[2], Ty[2] ),
		this.Index( Tx[3], Ty[3] )
		];
	
	for ( var idx = 0; idx < T.length; idx ++ ) {
		if ( GlobalDebugMode ) {
			// Searched Cell //
			DebugElement.Add( DBGE_Rect );
			DebugElement.SetColor( 255, 255, 0, 32 );
			DebugElement.SetArgs( [GlobalCameraOffset.x + Tx[idx] * this.Art.CellW, GlobalCameraOffset.y + Ty[idx] * this.Art.CellH, this.Art.CellW, this.Art.CellH ] );
		}
		
		switch ( TileSetSolid[ this.Data[ T[idx] ] ] ) {
			case 0:
				// Do Nothing //
				break;
			case (TSS_LEFT | TSS_RIGHT | TSS_TOP | TSS_BOTTOM):
				if ( GlobalDebugMode ) {
					if ( Test_Sphere_vs_AABB( _v, _Radius, Tx[idx] * this.Art.CellW, Ty[idx] * this.Art.CellH, this.Art.CellW, this.Art.CellH ) ) {
						DebugElement.Add( DBGE_Rect );
						DebugElement.SetColor( 0, 255, 0 );
						DebugElement.SetArgs( [GlobalCameraOffset.x + Tx[idx] * this.Art.CellW, GlobalCameraOffset.y + Ty[idx] * this.Art.CellH, this.Art.CellW, this.Art.CellH] );
					}
				}
				Solve_Sphere_vs_AABB( _v, _Radius, Tx[idx] * this.Art.CellW, Ty[idx] * this.Art.CellH, this.Art.CellW, this.Art.CellH );
				break;				
			case (TSS_BOTTOM_RIGHT | TSS_BOTTOM | TSS_RIGHT):
				if ( GlobalDebugMode ) {
					if ( Test_Sphere_vs_WedgeBottomRight( _v, _Radius, Tx[idx] * this.Art.CellW, Ty[idx] * this.Art.CellH, this.Art.CellW, this.Art.CellH ) ) {
						DebugElement.Add( DBGE_WedgeBottomRight );
						DebugElement.SetColor( 0, 255, 0 );
						DebugElement.SetArgs( [GlobalCameraOffset.x + Tx[idx] * this.Art.CellW, GlobalCameraOffset.y + Ty[idx] * this.Art.CellH, this.Art.CellW, this.Art.CellH] );
					}
				}
				Solve_Sphere_vs_WedgeBottomRight( _v, _Radius, Tx[idx] * this.Art.CellW, Ty[idx] * this.Art.CellH, this.Art.CellW, this.Art.CellH );
				break;
			case (TSS_BOTTOM_LEFT | TSS_BOTTOM | TSS_LEFT):
				if ( GlobalDebugMode ) {
					if ( Test_Sphere_vs_WedgeBottomLeft( _v, _Radius, Tx[idx] * this.Art.CellW, Ty[idx] * this.Art.CellH, this.Art.CellW, this.Art.CellH ) ) {
						DebugElement.Add( DBGE_WedgeBottomLeft );
						DebugElement.SetColor( 0, 255, 0 );
						DebugElement.SetArgs( [GlobalCameraOffset.x + Tx[idx] * this.Art.CellW, GlobalCameraOffset.y + Ty[idx] * this.Art.CellH, this.Art.CellW, this.Art.CellH] );
					}
				}
				Solve_Sphere_vs_WedgeBottomLeft( _v, _Radius, Tx[idx] * this.Art.CellW, Ty[idx] * this.Art.CellH, this.Art.CellW, this.Art.CellH );
				break;
			case (TSS_TOP_RIGHT | TSS_TOP | TSS_RIGHT):
				if ( GlobalDebugMode ) {
					if ( Test_Sphere_vs_WedgeTopRight( _v, _Radius, Tx[idx] * this.Art.CellW, Ty[idx] * this.Art.CellH, this.Art.CellW, this.Art.CellH ) ) {
						DebugElement.Add( DBGE_WedgeTopRight );
						DebugElement.SetColor( 0, 255, 0 );
						DebugElement.SetArgs( [GlobalCameraOffset.x + Tx[idx] * this.Art.CellW, GlobalCameraOffset.y + Ty[idx] * this.Art.CellH, this.Art.CellW, this.Art.CellH] );
					}
				}
				Solve_Sphere_vs_WedgeTopRight( _v, _Radius, Tx[idx] * this.Art.CellW, Ty[idx] * this.Art.CellH, this.Art.CellW, this.Art.CellH );
				break;
			case (TSS_TOP_LEFT | TSS_TOP | TSS_LEFT):
				if ( GlobalDebugMode ) {
					if ( Test_Sphere_vs_WedgeTopLeft( _v, _Radius, Tx[idx] * this.Art.CellW, Ty[idx] * this.Art.CellH, this.Art.CellW, this.Art.CellH ) ) {
						DebugElement.Add( DBGE_WedgeTopLeft );
						DebugElement.SetColor( 0, 255, 0 );
						DebugElement.SetArgs( [GlobalCameraOffset.x + Tx[idx] * this.Art.CellW, GlobalCameraOffset.y + Ty[idx] * this.Art.CellH, this.Art.CellW, this.Art.CellH] );
					}
				}
				Solve_Sphere_vs_WedgeTopLeft( _v, _Radius, Tx[idx] * this.Art.CellW, Ty[idx] * this.Art.CellH, this.Art.CellW, this.Art.CellH );
				break;
		};
	}
	
	return Pos;
}
// - -------------------------------------------------------------------------------------------------------------- - //


// - -------------------------------------------------------------------------------------------------------------- - //
cGameMap.prototype.Clear = function( Filter ) {
	for ( var y = 0; y < this.height; y++ ) {
		for ( var x = 0; x < this.width; x++ ) {
			this.Set( x, y, Filter[TS_EMPTY] );
		}
	}
}
// - -------------------------------------------------------------------------------------------------------------- - //
cGameMap.prototype.AddRect = function( Filter, _x, _y, _w, _h ) {
	for ( var y = 0; y < _h; y++ ) {
		for ( var x = 0; x < _w; x++ ) {
			this.Set( _x+x, _y+y, Filter[TS_FILL] );
		}
	}
}
// - -------------------------------------------------------------------------------------------------------------- - //
cGameMap.prototype.RoomFilter = function( Filter ) {
	for ( var y = 0; y < this.height; y++ ) {
		for ( var x = 0; x < this.width; x++ ) {
			// If the blank tile, we want to run the filter //
			if ( this.Get(x,y) == Filter[TS_EMPTY] ) {
				var Sides = 0;
				var Corners = 0;
				
				// Side Check Filter //
				if ( x > 0 ) {
					if ( this.Get(x-1,y) == Filter[TS_FILL] ) {
						Sides |= TSBIT_RIGHT;
					}
				}
				if ( x < this.width-1 ) {
					if ( this.Get(x+1,y) == Filter[TS_FILL] ) {
						Sides |= TSBIT_LEFT;
					}
				}
				if ( y > 0 ) {
					if ( this.Get(x,y-1) == Filter[TS_FILL] ) {
						Sides |= TSBIT_BOTTOM;
					}
				}
				if ( y < this.height-1 ) {
					if ( this.Get(x,y+1) == Filter[TS_FILL] ) {
						Sides |= TSBIT_TOP;
					}
				}
				
				// Apply Tile //
				if ( Sides > 0 ) {
					if ( Sides == TSBIT_LEFT ) {
						this.Set(x,y, Filter[TS_LEFT_SIDE]);
					}
					else if ( Sides == TSBIT_RIGHT ) {
						this.Set(x,y, Filter[TS_RIGHT_SIDE]);
					}
					else if ( Sides == TSBIT_TOP ) {
						this.Set(x,y, Filter[TS_TOP_SIDE]);
					}
					else if ( Sides == TSBIT_BOTTOM ) {
						this.Set(x,y, Filter[TS_BOTTOM_SIDE]);
					}

					else if ( Sides == (TSBIT_TOP | TSBIT_LEFT) ) {
						this.Set(x,y, Filter[TS_TOP_LEFT_SIDE]);
					}
					else if ( Sides == (TSBIT_TOP | TSBIT_RIGHT) ) {
						this.Set(x,y, Filter[TS_TOP_RIGHT_SIDE]);
					}
					else if ( Sides == (TSBIT_BOTTOM | TSBIT_LEFT) ) {
						this.Set(x,y, Filter[TS_BOTTOM_LEFT_SIDE]);
					}
					else if ( Sides == (TSBIT_BOTTOM | TSBIT_RIGHT) ) {
						this.Set(x,y, Filter[TS_BOTTOM_RIGHT_SIDE]);
					}
				}
				else {
					// Corner Check Filter //
					if ( (x > 0) && (y < this.height-1) ) {
						if ( this.Get(x-1,y+1) == Filter[TS_FILL] ) {
							//Corners |= TSBIT_TOP_RIGHT;
							this.Set(x,y, Filter[TS_TOP_RIGHT_CORNER]);
						}
					}
					if ( (x < this.width-1) && (y < this.height-1) ) {
						if ( this.Get(x+1,y+1) == Filter[TS_FILL] ) {
							//Corners |= TSBIT_TOP_LEFT;
							this.Set(x,y, Filter[TS_TOP_LEFT_CORNER]);
						}
					}
					if ( (x > 0) && (y > 0) ) {
						if ( this.Get(x-1,y-1) == Filter[TS_FILL] ) {
							//Corners |= TSBIT_BOTTOM_RIGHT;
							this.Set(x,y, Filter[TS_BOTTOM_RIGHT_CORNER]);
						}
					}
					if ( (x < this.width-1) && (y > 0) ) {
						if ( this.Get(x+1,y-1) == Filter[TS_FILL] ) {
							//Corners |= TSBIT_BOTTOM_LEFT;
							this.Set(x,y, Filter[TS_BOTTOM_LEFT_CORNER]);
						}
					}					
				}
			}
		}
	}
}
// - -------------------------------------------------------------------------------------------------------------- - //

