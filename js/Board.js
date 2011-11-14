//Class Board partaining to all information concerning the game Board

function Board( canvasName, top, left, letters, scale )
{
	if ( typeof canvasName !== "string" ) throw "Error : Canvas name must be a string ";
	this.canvas     = document.getElementById( canvasName );
//	this.canvas.addEventListener( "mousemove", mouseMoveEvent , false );
//	this.canvas.addEventListener( "click"    , mouseClickEvent, false );
	
//	this.width      = width; 
    this.width      = parseInt( this.canvas.getAttribute( "width" ) );
//	this.height     = height;
	this.height     = parseInt( this.canvas.getAttribute( "height" ) );
	
	this.top        = top;
	this.left       = left;
	
	this.pos        = { x : this.canvas.offsetLeft, 
	                    y : this.canvas.offsetTop
					  };
	this.scale      = scale;
	
	this.totalScore = 0;
	try 
	{
		this.tiles      = this.loadBoard( letters );
		this.dictionary = null;
	}
	catch ( error )
	{
		console.log( error );
	}
	
	this.gridWidth  = this.tiles[0].length;
	this.gridHeight = this.tiles.length;
	
//	this.draw();
}

Board.prototype.constructor = Board;
Board.LINE_WIDTH   = 2;
Board.BORDER_WIDTH = 1;

function convertToData( dict )
{
	console.log( "Started reading dict " ); 
	var start = new Date();
	
	if ( dict == null || dict == "" ) throw "Error : could not read the dictionary file ";
		
//	dict = dict.split( /\r\n|\r|\n/ )//.sort();
	dict = dict.sort();
	
	var dictionary = {};
	var prevChar = '', prevSecChar = '', prevThirdChar = '';
	var prevSecond, prevThird, prevWord;
			
	var dictSize = 0;
	for ( var i = 1; i < dict.length; i++ )
		{
			var res;
			var end = ( ( res = dict[i].indexOf( '/' ) ) !== -1 ) ? res : dict[i].length;
			var curDictWord   = dict[i].slice( 0, end );
			var firstChar  = curDictWord.charAt(0); 
				
			if ( /\d/.test( curDictWord ) === true ) continue;
			if ( curDictWord.length < 3 || curDictWord.length > this.gridWidth ) continue;
			if ( firstChar === firstChar.toUpperCase() ) continue;
			
			dictSize++;
			
			var secondChar = curDictWord.charAt(1),
				thirdChar  = curDictWord.charAt(2);
				
			var curWord = { "word" : curDictWord, next : [ null, null, null ] };
			if ( firstChar !== prevChar )
			{
				dictionary[ firstChar ] = curWord;
	 
				prevWord  = null;
				prevChar  = firstChar;
			}
			
			if ( secondChar != prevSecChar )
			{
				if ( prevSecond != null ) prevSecond.next[0] = curWord;
					
				prevSecond = curWord;
				prevThird = null;
				prevWord = null;
				prevSecChar = secondChar;
			}
			
			if ( thirdChar != prevThirdChar )
			{
				if ( prevThird != null ) prevThird.next[1] = curWord;
				
				prevThird = curWord;
				prevWord = null;
				prevThirdChar = thirdChar;
			}
			
			if ( prevWord != null ) prevWord.next[2] = curWord;
			prevWord = curWord;
		}
			
		console.log( "Loaded " + dictSize + " characters " );
		var end = new Date();
		console.log( "Elapsed time :", ( end.getTime() - start.getTime() ) / 1000 + " seconds " );
		
		gameBoard.dictionary = dictionary;
} 

function readFromFile( file )
{
	var reader = new FileReader();
	
	reader.onload = function() 
	{
		console.log( "Started reading dict " ); 
		var start = new Date();
		var fileContent = reader.result;
		if ( fileContent == null || fileContent == "" ) throw "Error : could not read the dictionary file ";
		
		convertToData( fileContent );
	};
	
	reader.onerror = function ( error )
	{
		console.log( error );
	};
	
	reader.readAsText( file );
}

Board.prototype.loadDictionary = function( dict )
{
	if ( dict instanceof File ) 
	{
		if ( dict.fileName.slice( dictionaryFile.fileName.lastIndexOf( "." ) + 1 ) !== "dic" ) throw "Error : only dic files are allowed ";
		readFromFile( dict );
	}
	else
	{
		if ( this.dictionary == null )
			convertToData( dict );
	}	
	
//	this.checkBoard();
}

Board.prototype.getLowestLevelList = function ( str )
{
	var firstLetter = str.charAt(0);
	var wordList = this.dictionary[ firstLetter ];
	
	if ( wordList == null ) return null;
	
	var secondLetter = str.charAt(1);
	while ( wordList != null && secondLetter != wordList.word.charAt(1) )
		wordList = wordList.next[0];
	
	if ( wordList == null ) return null;
	
	var thirdLetter = str.charAt(2);
	while ( wordList != null && thirdLetter != wordList.word.charAt(2) )
		wordList = wordList.next[1];
	return wordList;
}

Board.prototype.findAllSubstrings = function( str ) 
{
	var foundWords = new Array();
	var wordList = this.getLowestLevelList( str );
	var isMatch = false;
	while (  wordList != null && !isMatch  )
	{	
		if ( wordList.word.indexOf( str ) == 0 ) 
			foundWords.push( wordList.word )
		if ( wordList.word === str )
			isMatch = true;
		wordList = wordList.next[2];
	}
	
	var result = { list : foundWords, match : isMatch };
	return result;
}

Board.prototype.isSubstring = function ( str )
{
	var wordList = this.getLowestLevelList( str );
	
	while ( wordList != null )
	{
		if ( wordList.word.indexOf( str ) == 0 )
			return true;
		wordList = wordList.next[2];
	}
	
	return false;
}

Board.prototype.isMatch = function ( str )
{
	var wordList = this.getLowestLevelList( str );
	
	while ( wordList != null )
	{
		if ( wordList.word === str )
			return true;
		wordList = wordList.next[2];
	}
}
Board.prototype.findAllWords = function ( str )
{
	var wordList = this.getLowestLevelList( str );
	var matchList = new Array();
	
	var startPos = 0, endPos = startPos + 2;
	var max = 0, index = 0,
		maxPos;
	var maxStr = "";
	while ( startPos < str.length - 2 )
	{
		var subStr = str.slice( startPos, endPos + 1 );
		var checkMatch = false;
		
		if ( this.isSubstring( subStr ) ) 
		{
			checkMatch = true;
			endPos++;
		}
		
		subStr = str.slice( startPos, ( endPos == startPos + 2 ) ? endPos + 1 : endPos );
		if ( checkMatch && this.isMatch( subStr ) )
		{
			if ( max < subStr.length ) 
			{
				maxPos = index;
				max = subStr.length;
				maxStr = subStr;
			}
			matchList.push( { from : startPos, to : endPos - 1, word : subStr } );
			index++;
		}
			
		if ( endPos >= this.gridWidth || !checkMatch  ) 
		{
			startPos++; 
			endPos = startPos + 2;
		}
	}
	
	return { matches : matchList, max : maxStr, pos : maxPos };
}

Board.prototype.checkBoard = function ()
{
	for ( var i = 0; i < this.gridWidth; i++ )
		wordCheck( { row : i, col : i }, this );
} 


Board.prototype.loadBoard = function( letters )
{
	if ( !(letters instanceof Array) ) throw "Error : board must contain an Array of letters";
	if ( ( letters.length * letters[0].length ) != 81 ) throw "Error : board of size 9 x 9, not " + ( letters.length * letters.length[0] );

	var result = [];
//	var posX = scale * Board.BORDER_WIDTH, posY = scale * Board.BORDER_WIDTH;
	
	for ( var i = 0; i < letters.length; i++ )
	{
		var line = new Array();
		for ( var j = 0; j < letters[i].length; j++ )
		{
			
			if ( letters[i][j].character.length > 1 ) throw "Error : board must have only one character per tile";
			if ( /\d/.test( letters[i][j].character ) === true ) throw "Error : letters must not contain numbers";
			if ( ( typeof letters[i][j].color ) !== "string" ) throw "Error : colors must be strings";
			
			var posX = i % this.gridWidth, posY = Math.floor( i / this.gridHeight );
			var character = letters[i][j].character.toUpperCase();
			var color     = letters[i][j].color;
			
		//	posX = ( i % 8 ) ? posX + scale * Tile.WIDTH : Board.BORDER_WIDTH;
		//	posY = ( (i / 8) == 0 ) ? posY + scale * Tile.HEIGHT : posY - Board.LINE_WIDTH;
			
			var tile = new Tile( this.scale * Board.BORDER_WIDTH + j * this.scale * Tile.WIDTH  + this.scale * Board.LINE_WIDTH * j /*+ ((scale * Board.LINE_WIDTH)/2) * posX*/, 
								 this.scale * Board.BORDER_WIDTH + i * this.scale * Tile.HEIGHT + this.scale * Board.LINE_WIDTH * i /*+ ((scale * Board.LINE_WIDTH)/2) * posY*/, 
								 character, 1, color, null );
		//	var tile = new Tile( posX, posY, character, 1, color, null );
			line.push( tile ); 
			
		//	posX += Board.LINE_WIDTH; posY += Board.LINE_WIDTH;
		}
		result.push( line );
	}
	
	return result;
}

Board.prototype.drawGrid = function( gridWidth, offset )
{
	var context = this.canvas.getContext( "2d" );
	var x = ( "x" in offset ) ? offset.x : offset[0],
	    y = ( "y" in offset ) ? offset.y : offset[1];
	var lineWidth   = this.scale * Board.LINE_WIDTH,
	    borderWidth = this.scale * Board.BORDER_WIDTH;
		
	context.strokeStyle = "rgb( 0, 0, 0 )";
	context.lineWidth = borderWidth;
	
	context.moveTo( this.left + borderWidth/2, this.top );
	context.lineTo( this.left + borderWidth/2, this.height );
	
	context.moveTo( this.left, this.left + borderWidth/2 );
	context.lineTo( this.width, this.left + borderWidth/2 );
	
	context.moveTo( this.width - borderWidth/2, this.top );
	context.lineTo( this.width - borderWidth/2, this.height );
	
	context.moveTo( this.left, this.height - borderWidth/2 );
	context.lineTo( this.width, this.height - borderWidth/2 );
	
	context.stroke();
	
	context.lineWidth = lineWidth;
	var posX = this.left + borderWidth;
	for ( var i = 1; i < this.gridWidth; i++ )
	{
		//var step = ( i === 1 ) ? 1 : 2,
		posX += x;// + lineWidth/2;
		
		context.moveTo( posX + lineWidth/2, 0 );
		context.lineTo( posX + lineWidth/2, this.height );
		
		posX += lineWidth;
	}
	
	var posY = this.top + borderWidth;
	for ( var i = 1; i < this.gridHeight; i++ )
	{
		posY += y;// + lineWidth/2;
		
		context.moveTo( this.left, posY + lineWidth/2 );
		context.lineTo( this.width, posY + lineWidth/2 );
		
		posY += lineWidth;
	}
	
	context.stroke();
}

Board.prototype.draw = function() 
{
	this.drawGrid( this.width, { x: this.scale * Tile.WIDTH, y: this.scale * Tile.HEIGHT } );
	
	var context = this.canvas.getContext( "2d" );
	for ( var i = 0; i < this.tiles.length; i++ )
		for ( var j = 0; j < this.tiles[i].length; j++ )
			this.tiles[i][j].draw( context, this.scale );
}
