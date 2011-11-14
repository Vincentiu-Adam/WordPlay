//Letter class that will contain all information concerning a Scrabble letter 

function Letter( character, color, image )
{
	this.character = character;
	this.val = this.mapValue( character );
	
	this.color = ( ( typeof color ) === 'string' ) ? color : "rgb( 255, 255, 255 )";
	this.image = ( ( image != null ) ) ? image : null;
}

Letter.prototype.constructor = Letter;
Letter.WIDTH  = 28;
Letter.HEIGHT = 28;
Letter.LINE_WIDTH = 2;
Letter.MARGIN = 1;

Letter.prototype.setImage = function( image )
{
	this.image = image;
}

Letter.prototype.mapValue = function ( character )
{
	var result; 
	
	switch ( character )
	{
		case 'D' : case 'G' :
			result = 2;
			break;
		case 'B' : case 'C' : case 'M' : case 'P' :
			result = 3;
			break;
		case 'F' : case 'H' : case 'V' : case 'W' : case 'Y' :
			result = 4;
			break;
		case 'K' : 
			result = 5;
			break;
		case 'J' : case 'X' : 
			result = 8;
			break;
		case 'Q' : case 'Z' :
			result = 10;
			break;
		default :
			result = 1;
	}
	
	return result;
}

Letter.prototype.draw = function( context, offset, scale )
{
	if ( context == null ) return false;
	var x = ( "x" in offset ) ? offset.x : offset[0],
	    y = ( "y" in offset ) ? offset.y : offset[1];
	var width  = scale * Letter.WIDTH, 
	    height = scale * Letter.HEIGHT,
		margin = scale * Letter.MARGIN;
		
	if ( this.image != null )
	{
		this.image.src = "resources/" + this.character.toUpperCase() + ".jpg";
		context.drawImage( this.image, x + margin, y + margin, width, height );	
		return true;
	}
	
	context.fillStyle = this.color;
	context.fillRect( x + margin, y + margin, width, height );
	
	context.strokeStyle = "rgb( 0, 0, 0 )";
	context.lineWidth = 1;
	context.textAlign = "center";
	
	var fontSize = scale * 14;
	context.font = "normal 100 " + fontSize + "px/normal News Gothic, serif";
	context.strokeText( this.character, ( x + margin + width/2 ), ( y + margin + height/2 + fontSize/3 ) );
	
	fontSize = scale * 7;
	context.font = "italic 100 " + fontSize + "px/normal Arial, sans-serif";
	context.strokeText( this.val.toString(), x + ( width - (scale * 2 + fontSize/3) ), y + ( height - (scale * 2 + fontSize/3) ) );
	
	return true;
}

