// - -------------------------------------------------------------------------------------------------------------- - //
var Canvas, ctx;
// - -------------------------------------------------------------------------------------------------------------- - //

// - -------------------------------------------------------------------------------------------------------------- - //
function gelGraphicsInit() {
	Canvas = document.getElementById("cv");
	ctx = Canvas.getContext("2d");
	
	Log( "Original Canvas Size: " + Canvas.width + ", " + Canvas.height );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function gelGraphicsExit() {	
}
// - -------------------------------------------------------------------------------------------------------------- - //


// - -------------------------------------------------------------------------------------------------------------- - //
function gelCenterImage( img, x, y ) {
	ctx.drawImage( img, x-(img.width >> 1), y-(img.height >> 1) );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function gelCenterImage( img, x, y, scale_x, scale_y ) {
	ctx.drawImage( img, x-((img.width * scale_x) >> 1), y-((img.height * scale_y) >> 1), img.width * scale_x, img.height * scale_y );
}
// - -------------------------------------------------------------------------------------------------------------- - //

// - -------------------------------------------------------------------------------------------------------------- - //
function gelSetColor( r, g, b, a ) {
//	Log( typeof a );
	if ( typeof a === 'undefined' ) {
		ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
		ctx.strokeStyle = ctx.fillStyle;
	}
	else {
		ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + (a / 255) + ")";
		ctx.strokeStyle = ctx.fillStyle;
	}
}
// - -------------------------------------------------------------------------------------------------------------- - //

// - -------------------------------------------------------------------------------------------------------------- - //
function gelDrawRectFill( x, y, w, h ) {
	ctx.fillRect( x, y, w, h );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function gelDrawRect( x, y, w, h ) {
	ctx.strokeRect( x, y, w, h );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function gelClearRect( x, y, w, h ) {
	ctx.clearRect( x, y, w, h );
}
// - -------------------------------------------------------------------------------------------------------------- - //

// - -------------------------------------------------------------------------------------------------------------- - //
function gelDrawTriangleShape( x1, y1, x2, y2, x3, y3 ) {
	ctx.beginPath();
	ctx.moveTo( x1, y1 );

	ctx.lineTo( x2, y2 );
	ctx.lineTo( x3, y3 );
	ctx.lineTo( x1, y1 );

	ctx.closePath();
	ctx.stroke();
}
// - -------------------------------------------------------------------------------------------------------------- - //
function gelDrawTriangleShapeFill( x1, y1, x2, y2, x3, y3 ) {
	ctx.beginPath();
	ctx.moveTo( x1, y1 );

	ctx.lineTo( x2, y2 );
	ctx.lineTo( x3, y3 );
	ctx.lineTo( x1, y1 );

	ctx.closePath();
	ctx.fill();
}
// - -------------------------------------------------------------------------------------------------------------- - //
function gelDrawQuadShape( x1, y1, x2, y2, x3, y3, x4, y4 ) {
	ctx.beginPath();
	ctx.moveTo( x1, y1 );

	ctx.lineTo( x2, y2 );
	ctx.lineTo( x3, y3 );
	ctx.lineTo( x4, y4 );
	ctx.lineTo( x1, y1 );

	ctx.closePath();
	ctx.stroke();
}
// - -------------------------------------------------------------------------------------------------------------- - //
function gelDrawQuadShapeFill( x1, y1, x2, y2, x3, y3, x4, y4 ) {
	ctx.beginPath();
	ctx.moveTo( x1, y1 );

	ctx.lineTo( x2, y2 );
	ctx.lineTo( x3, y3 );
	ctx.lineTo( x4, y4 );
	ctx.lineTo( x1, y1 );

	ctx.closePath();
	ctx.fill();
}
// - -------------------------------------------------------------------------------------------------------------- - //

// - -------------------------------------------------------------------------------------------------------------- - //
function gelDrawWedgeBottomRight( x1, y1, w, h ) {
	var x2 = x1+w;
	var y2 = y1+h;
	gelDrawTriangleShape( x2,y1, x2,y2, x1,y2 );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function gelDrawWedgeBottomLeft( x1, y1, w, h ) {
	var x2 = x1+w;
	var y2 = y1+h;
	gelDrawTriangleShape( x1,y1, x2,y2, x1,y2 );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function gelDrawWedgeTopRight( x1, y1, w, h ) {
	var x2 = x1+w;
	var y2 = y1+h;
	gelDrawTriangleShape( x1,y1, x2,y1, x2,y2 );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function gelDrawWedgeTopLeft( x1, y1, w, h ) {
	var x2 = x1+w;
	var y2 = y1+h;
	gelDrawTriangleShape( x1,y1, x2,y1, x1,y2 );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function gelDrawWedgeBottomRightFill( x1, y1, w, h ) {
	var x2 = x1+w;
	var y2 = y1+h;
	gelDrawTriangleShapeFill( x2,y1, x2,y2, x1,y2 );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function gelDrawWedgeBottomLeftFill( x1, y1, w, h ) {
	var x2 = x1+w;
	var y2 = y1+h;
	gelDrawTriangleShapeFill( x1,y1, x2,y2, x1,y2 );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function gelDrawWedgeTopRightFill( x1, y1, w, h ) {
	var x2 = x1+w;
	var y2 = y1+h;
	gelDrawTriangleShapeFill( x1,y1, x2,y1, x2,y2 );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function gelDrawWedgeTopLeftFill( x1, y1, w, h ) {
	var x2 = x1+w;
	var y2 = y1+h;
	gelDrawTriangleShapeFill( x1,y1, x2,y1, x1,y2 );
}
// - -------------------------------------------------------------------------------------------------------------- - //

// - -------------------------------------------------------------------------------------------------------------- - //
function gelDrawCircleFill( x, y, Radius ) {
	ctx.beginPath();
	ctx.arc( x, y, Radius, 0, Math.PI*2, true); 
	ctx.closePath();
	ctx.fill();	
}
// - -------------------------------------------------------------------------------------------------------------- - //
function gelDrawCircle( x, y, Radius ) {
	ctx.beginPath();
	ctx.arc( x, y, Radius, 0, Math.PI*2, true); 
	ctx.closePath();
	ctx.stroke();
}
// - -------------------------------------------------------------------------------------------------------------- - //
function gelDrawSquareFill( x, y, Radius ) {
	ctx.fillRect( x-Radius, y-Radius, Radius+Radius, Radius+Radius );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function gelDrawSquare( x, y, Radius ) {
	ctx.strokeRect( x-Radius, y-Radius, Radius+Radius, Radius+Radius );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function gelDrawDiamondFill( x, y, Radius ) {
	ctx.beginPath();
	ctx.moveTo( x-Radius, y );

	ctx.lineTo( x, y-Radius );
	ctx.lineTo( x+Radius, y );
	ctx.lineTo( x, y+Radius );
	ctx.lineTo( x-Radius, y );
	
	ctx.closePath();
	ctx.fill();	
}
// - -------------------------------------------------------------------------------------------------------------- - //
function gelDrawDiamond( x, y, Radius ) {
	ctx.beginPath();
	ctx.moveTo( x-Radius, y );

	ctx.lineTo( x, y-Radius );
	ctx.lineTo( x+Radius, y );
	ctx.lineTo( x, y+Radius );
	ctx.lineTo( x-Radius, y );

	ctx.closePath();
	ctx.stroke();
}
// - -------------------------------------------------------------------------------------------------------------- - //
function gelDrawCross( x, y, Radius ) {
	ctx.beginPath();

	ctx.moveTo( x-Radius, y );
	ctx.lineTo( x+Radius, y );

	ctx.moveTo( x, y-Radius );
	ctx.lineTo( x, y+Radius );

	ctx.closePath();
	ctx.stroke();
}
// - -------------------------------------------------------------------------------------------------------------- - //
function gelDrawX( x, y, Radius ) {
	ctx.beginPath();

	ctx.moveTo( x-Radius, y-Radius );
	ctx.lineTo( x+Radius, y+Radius );

	ctx.moveTo( x+Radius, y-Radius );
	ctx.lineTo( x-Radius, y+Radius );

	ctx.closePath();
	ctx.stroke();
}
// - -------------------------------------------------------------------------------------------------------------- - //
