//Tile class contains information associated to a tile

function Tile( posX, posY, tileLetter, mult, color, image )
{
	this.letter = new Letter( tileLetter, "rgb( 199, 166, 115 )" ); 
	this.mult   = this.mapColor();
	
	this.color  = ( ( typeof color ) === "string" ) ? color : "rgb( 255, 255, 255 )";
	this.image  = ( ( image != null ) ) ? image : null;
	
	this.pos = { x : posX, y : posY }; 
}

Tile.prototype.constructor = Tile;
Tile.WIDTH  = 30;
Tile.HEIGHT = 30;

Tile.prototype.mapColor = function() 
{
	var mult;
	switch ( this.color )
	{
		case "blue"  : mult = 2; break;
		case "green" : mult = 3; break;
		default      : mult = 1;
	}
	
	return mult;
}

Tile.prototype.score = function()
{
	return this.mult * this.letter.val; 
}

Tile.prototype.toString = function()
{
	return this.letter.character;
}

Tile.prototype.draw = function( context, scale )
{
	if ( context == null ) return false;
	
	if ( this.image != null )
	{
		context.drawImage( this.image, this.pos.x, this.pos.y, scale * Tile.WIDTH, scale * Tile.HEIGHT );
		return true;
	}
	
	context.fillStyle = this.color;
	context.fillRect( this.pos.x, this.pos.y, scale * Tile.WIDTH, scale * Tile.HEIGHT );
	this.letter.draw( context, this.pos, scale );
	
	return true;
}

Tile.prototype.clearLetter = function( context, scale )
{
	if ( context == null ) throw "Error : Context is not available" ;
	
	var x = this.pos.x + scale * Letter.MARGIN,
		y = this.pos.y + scale * Letter.MARGIN;
		
	context.clearRect( x, y, scale * Letter.WIDTH, scale * Letter.HEIGHT );
}
