var animSpeed = 1000 / 60;

window.requestAnimFrame = (function() {
	  return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
     function(/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, animSpeed );
              };
    })();

var image   = new Image();
image.src = "images/grid.gif";

function getCSSProperty( element, property )
{
	var x = document.getElementById( element );
	
	if ( x.currentStyle )
		var y = x.currentStyle[ property ];
	else if ( window.getComputedStyle )
		var y = document.defaultView.getComputedStyle( x, null ).getPropertyValue( property );
	
	return y;
}

function drawBoard()
{
	var canvas = document.getElementById( "board" );
	var context = canvas.getContext( "2d" );
	var width  = parseInt( canvas.getAttribute( "width" ) ),
		height = parseInt( canvas.getAttribute( "height" ) );
	context.fillStyle = "#888";
	context.fillRect(0,0, width, height );
//	context.drawImage( image, 0, 0, width, height );
}

var gameBoard; 
var menus;
var generator;
var boardSize = 9;
var oldColor, defaultColor;
var redrawCache = new Array(),
	updateList  = new Array(),
	changedList = new Array(),
	clearList   = new Array(),
	physicsList = new Array(),
	reloadCols = new Array();

var	menuImage = new Image();
	menuImage.src = "resources/menu.png";
var isMainMenu    = true,
	isStartGame   = false,
	isHowToPlay   = false,
	isQuitGame    = false,
	isGameRunning = false;

var triggerRedraw = false, 
	justSwapped   = false;

function generateBoard( distribution, size )
{
	generator = new Generator( distribution );
	
	var board = [];
	var ranLetters = generator.generate( size );
	var tileColors = [ [ "orange", "white", "blue" , "white", "orange", "white", "blue" , "white", "orange"  ], 
					   [ "white" , "red"  , "white", "green", "white" , "green", "white", "red"  , "white"   ],
                       [ "blue"  , "white", "red"  , "white", "blue"  , "white", "red"  , "white", "blue"    ],
                       [ "white" , "green", "white", "green", "white" , "green", "white", "green", "white"   ],
					   [ "orange", "white", "blue" , "white", "red"   , "white", "blue" , "white", "orange"  ],
                       [ "white" , "green", "white", "green", "white" , "green", "white", "green", "white"   ],
                       [ "blue"  , "white", "red"  , "white", "blue"  , "white", "red"  , "white", "blue"    ],
                       [ "white" , "red"  , "white", "green", "white" , "green", "white", "red"  , "white"   ],
					   [ "orange", "white", "blue" , "white", "orange", "white", "blue" ,  "white", "orange" ] ];					   
	
	for ( var i = 0; i < ranLetters.length; i++ )
	{
		var tileRow = new Array();
		for ( var j = 0; j < ranLetters[i].length; j++ )
			tileRow.push( { character : ranLetters[i][j], color : tileColors[i][j] } );
		board.push( tileRow );
	}
	
	return board;
}	
	
function init()
{
//	document.getElementById( "fileinput" ).addEventListener( "change", loadDict, false );
	document.getElementById( "board" ).addEventListener( "mousemove", mouseMoveEvent , false );
	document.getElementById( "board" ).addEventListener( "click", mouseClickEvent, false );
	
	menus = new Menu( "board", "" );
	
	var distribution = [ 0.4, 0.35, 0.25 ];
	
	ranBoard = generateBoard( distribution, boardSize );
	gameBoard = new Board( "board", 0, 0, ranBoard, 2 );
	gameBoard.loadDictionary( defaultDict );

	oldColor     = gameBoard.tiles[0][0].letter.color;
	defaultColor = gameBoard.tiles[0][0].letter.color;
	
	//	timeID = window.setInterval( "timeRemaining()", 1000 );
	document.getElementById( "showButton" ).onclick = animate;
	
	run();
}

function renderMenus() 
{
	if ( isMainMenu )
		menus.drawMainMenu();	
	
	if ( isHowToPlay )
		menus.drawHowToPlay();
	
	if ( isStartGame )
	{
		menus.startGame();
		isGameRunning = true;
		isStartGame = false;
	}
	
	if ( isQuitGame )
	{
		if ( confirm( "Are you sure you want to quit?" ) )
			window.close();
		isQuitGame = false;
	}
}

function getScrollOffsets( win )  
{
	win = win || window;
	
	if ( win.pageXOffset != null ) return { x : win.pageXOffset, y : win.pageYOffset };
	
	var d = w.document;
	if ( document.compatMode == "CSS1Compat" )
		return { x : d.documentElement.scrollLeft, y : d.documentElement.scrollTop };
		
	return { x : d.body.scrollLeft, y : d.body.scrollTop };
}


var isOn = "";
var redraw = false;

function mouseMoveEvent( event )
{
	var offset = getScrollOffsets(),
		mouseX = event.clientX + offset.x,
		mouseY = event.clientY + offset.y;
	var subX = 0, subY = 0;
	
	var gameContainer = document.getElementById( "gameSpace" );
	
	subX = gameContainer.offsetLeft; 
	subY = gameContainer.offsetTop;
	
	subX += gameBoard.pos.x; subY += gameBoard.pos.y; 
	mouseX -= subX; mouseY -= subY;
	
//	if ( !(mouseX >= 0 && mouseX < gameBoard.width && mouseY >= 0 && mouseY < gameBoard.height) ) 
//	return false;
	this.style.cursor = "default";
	
	if ( isMainMenu )
	{
		var context = menus.canvas.getContext( "2d" );
		var width   = menus.startGameImage.width,
			height  = menus.startGameImage.height;
		
		if ( mouseX >= 105 && mouseX < 712 )
		{
			if ( mouseY >= 160 && mouseY < 160 + height )
			{
				this.style.cursor = "pointer";
				menus.startGameImage.src = "images/Menu/startS.png";
			}
			else
				menus.startGameImage.src = "images/Menu/start.png";
			
			if ( mouseY >= 288 && mouseY < 288 + height )
			{
				this.style.cursor = "pointer";
				menus.howToPlayImage.src = "images/Menu/howS.png";
			}
			else
				menus.howToPlayImage.src = "images/Menu/how.png";
				
			if ( mouseY >= 413 && mouseY < 413 + height )
			{
				this.style.cursor = "pointer";
				menus.quitGameImage.src = "images/Menu/quitS.png";
			}
			else
				menus.quitGameImage.src = "images/Menu/quit.png";
		}
		else
		{
			menus.startGameImage.src = "images/Menu/start.png";
			menus.howToPlayImage.src = "images/Menu/how.png";
			menus.quitGameImage.src = "images/Menu/quit.png";
		}
	/*	context.strokeStyle = Menu.SHADOW_COLOR;
		context.fillStyle = Menu.STROKE_COLOR;
		
		context.beginPath();
		context.arc( mouseX, mouseY, 1, 0, 2 * Math.PI, true );
		context.closePath();
		
		context.stroke();
		context.fill();
	*/	
		console.log( "x : " + mouseX + " y : " + mouseY );
	
	}
	
	if ( isHowToPlay )
	{
		if ( mouseX > 583 && mouseX < 790 )
		{
			if ( mouseY > 550 && mouseY < 590 )
			{
				this.style.cursor = "pointer";
				menus.returnImage.src = "images/Menu/returnS.png";
			}
			else
				menus.returnImage.src = "images/Menu/return.png";
		}
		else
			menus.returnImage.src = "images/Menu/return.png"
			
		console.log( "x : " + mouseX + " y : " + mouseY );
	}
	
	if ( isGameRunning )
	{
		var tileX  = Math.floor( mouseX / ( gameBoard.scale * ( Board.BORDER_WIDTH + Tile.WIDTH  + Board.LINE_WIDTH/2 ) ) ), 
			tileY  = Math.floor( mouseY / ( gameBoard.scale * ( Board.BORDER_WIDTH + Tile.HEIGHT + Board.LINE_WIDTH/2 ) ) );
	
		console.log( "x : " + mouseX + " y : " + mouseY );
		if ( firstClick )
		{
			if ( tileX >= 0 && tileX < gameBoard.gridWidth && tileY >= 0 && tileY < gameBoard.gridHeight )
			{
				var tilePos = tileY * gameBoard.gridWidth + tileX;
				if ( isOn !== tilePos )
				{
					var tile = gameBoard.tiles[tileY][tileX];

					changedList.push( tile );
					isOn = tilePos;
				}
			}
			else
			{
				if ( redrawCache.length > 0 )
				{
					var tile = redrawCache.shift(); 
					tile.letter.color = oldColor;
					tile.draw( gameBoard.canvas.getContext( "2d" ), gameBoard.scale );
				}
				isOn = "";
			}
		}
	}
	return true;
}

function swapTiles( firstTileIndex, secondTileIndex )
{
	var firstTile  = gameBoard.tiles[ firstTileIndex.y  ][ firstTileIndex.x ],
		secondTile = gameBoard.tiles[ secondTileIndex.y ][ secondTileIndex.x ]; 
		
	var tempLetter = firstTile.letter;
	firstTile.letter = secondTile.letter;
	secondTile.letter = tempLetter;
}

function isValidPos( firstPosition, secondPosition )
{
	return ( secondPosition === firstPosition + 1 || secondPosition === firstPosition - gameBoard.gridWidth || 
	         secondPosition === firstPosition - 1 || secondPosition === firstPosition + gameBoard.gridWidth );
}

function getAdjacentTiles( tilePosition, board )
{
	var result = new Array();

	if ( tilePosition.x + 1 < board.gridWidth )	
	{	
		var tile = board.tiles[ tilePosition.y ][ tilePosition.x + 1 ];
		if ( tile.letter != null ) result.push( tile );
	}	
	if ( tilePosition.y - 1 >= 0 )
	{
		var tile = board.tiles[ tilePosition.y - 1 ][ tilePosition.x ]
		if ( tile.letter != null ) result.push( tile );
	}	
	if ( tilePosition.x - 1 >= 0 )
	{
		var tile = board.tiles[ tilePosition.y ][ tilePosition.x - 1 ];
		if ( tile.letter != null ) result.push( tile );
	}
	if ( tilePosition.y + 1 < board.gridHeight )
	{
		var tile = board.tiles[ tilePosition.y + 1][ tilePosition.x ]
		if ( tile.letter != null ) result.push( tile );
	}
	
	return result;
}

function changeTilesColor( tiles, color )
{
	for ( var i = 0; i < tiles.length; i++ )
		tiles[i].letter.color = color;
}

function addToArray( theArray, list ) 
{
	for ( var i = 0; i < list.length; i++ )
		theArray.unshift( list[i] );
}

function wordCheck( position, board )
{
	if ( board.dictionary == null ) throw "Error please load dictionary first ";
	var row = position.row, 
		col = position.col;
	
	var rowString = "", colString = "";
	
	for ( var i = 0; i < board.gridHeight; i++ )
	{
		rowString += ( board.tiles[row][i] != null ) ? board.tiles[row][i].toString() : "";
		colString += ( board.tiles[i][col] != null ) ? board.tiles[i][col].toString() : "";
	}
	
	var color = "rgba( 255, 175, 4, 80 )";
	var words = board.findAllWords( rowString.toLowerCase() );
	
	var wordMatches = words.matches;
	var combo = 0, totalScore = 0;
	var multiplier = 1;
	var isMatch = false;
	if ( !isEmpty( wordMatches ) )
	{
		combo += wordMatches.length;
		isMatch = true;
		for ( var i = 0; i < wordMatches.length; i++ )
		{
			var tileScore = 0;
			for ( var j = wordMatches[i].from; j <= wordMatches[i].to; j++ )
			{			
				var tile = board.tiles[row][j];
				
				if ( tile.color == "red" ) 
					multiplier = 2;
				if ( tile.color == "orange" )
					multiplier = 3;
					
				tile.letter.color = color;
				tileScore += tile.score();
				
				updateList.push( tile );
				changedList.push( tile );
				clearList.push( { aTile : tile, pos : { x : j, y : row } } );
				
				if ( reloadCols.indexOf( j ) == -1 )
					reloadCols.push( j );
	
			}
			totalScore += multiplier * tileScore;
			var wordList = document.getElementById( "list" );  
		//	wordText.appendChild( document.createTextNode( text ) );
			console.log( "Word : " + wordMatches[i].word + " score : " + multiplier * tileScore + " multiplier : " + multiplier );
		}
	}
	
	words = board.findAllWords( colString.toLowerCase() )
	
	wordMatches = words.matches;
	multiplier = 1;
	if ( !isEmpty( wordMatches ) )
	{
		combo += wordMatches.length;
		isMatch = true;
		for ( var i = 0; i < wordMatches.length; i++ )
		{
			var tileScore = 0;
			for ( var j = wordMatches[i].from; j <= wordMatches[i].to; j++ )
			{
				var tile = board.tiles[j][col];

				tile.letter.color = color;
				
				if ( tile.color == "red" )
					multiplier = 2;
				if ( tile.color == "orange" )
					multiplier = 3;
					
				tileScore += tile.score();
		
				updateList.push( tile );
				changedList.push( tile );				
				clearList.push( { aTile : tile, pos : { x : col, y : j } } );
			}
			totalScore += multiplier * tileScore;
			console.log( "Word : " + wordMatches[i].word + " score : " + multiplier * tileScore + " multiplier : " + multiplier );
		}
		
		if ( reloadCols.indexOf( col ) == -1 )
			reloadCols.push( col );
	}
	
	if ( isMatch ) 
	{
		console.log( "Total score : " + (combo * totalScore) + " combo : " + combo );
		
		gameBoard.totalScore += combo * totalScore;
		console.log( "Game score : " + gameBoard.totalScore );
	}
}
var firstClick = true;
var clickTilePos = "";

function mouseClickEvent( event ) 
{
//	var subs  = gameBoard.findAllSubstrings( "cabal" ),
//		longs = gameBoard.findAllWords( "thisissowickedicantbelieveitdafoiwkoworkswodk" ); 
	var offset = getScrollOffsets();
	var mouseX = event.clientX + offset.x,
	    mouseY = event.clientY + offset.y;
	var subX = 0, subY = 0;
	
	var gameContainer = document.getElementById( "gameSpace" );
	
	subX = gameContainer.offsetLeft; 
	subY = gameContainer.offsetTop;
	
/*	if ( gameBoard.canvas.parentNode != null )
	{
		subX = gameBoard.canvas.parentNode.offsetLeft; 
		subY = gameBoard.canvas.parentNode.offsetTop;
	}
*/
	subX += gameBoard.pos.x; subY += gameBoard.pos.y; 
	mouseX -= subX; mouseY -= subY;
	
	var height = menus.startGameImage.height;
	
	if ( isMainMenu )
	{
		if ( mouseX >= 105 && mouseX < 712 )
		{
			if ( mouseY >= 160 && mouseY < 160 + height )
			{
				isStartGame = true;
				isMainMenu  = false;
			}
			
			if ( mouseY >= 288 && mouseY < 288 + height )
			{
				isHowToPlay = true;
				isMainMenu  = false;
			}
				
			if ( mouseY >= 413 && mouseY < 413 + height )
			{
				isQuitGame = true;
			}
		}
	}
	
	if ( isHowToPlay )
	{
		if ( mouseX > 583 && mouseX < 790 )
			if ( mouseY > 550 && mouseY < 590 )
			{
				isMainMenu  = true;
				isHowToPlay = false;
			}
		
	}
	
	if ( isGameRunning )
	{
		var tileX  = Math.floor( mouseX / ( gameBoard.scale * ( Board.BORDER_WIDTH + Tile.WIDTH  + Board.LINE_WIDTH/2 ) ) ), 
			tileY  = Math.floor( mouseY / ( gameBoard.scale * ( Board.BORDER_WIDTH + Tile.HEIGHT + Board.LINE_WIDTH/2 ) ) );
		var color = "rgba( 99, 254, 99, 70 )";
		
		
		if ( tileX >= 0 && tileX < gameBoard.gridWidth && tileY >= 0 && tileY < gameBoard.gridHeight )
		{
			var pos = tileY * gameBoard.gridWidth + tileX;
			
			if ( firstClick )
			{
				if ( clickTilePos != null ) 
				{
					var oldTiles = getAdjacentTiles( { x : clickTilePos % gameBoard.gridWidth, y : Math.floor( clickTilePos / gameBoard.gridWidth ) }, gameBoard );
					changeTilesColor( oldTiles, oldColor );
					addToArray( updateList, oldTiles );
				}
				
				var tile = gameBoard.tiles[tileY][tileX]; 
				if ( tile.letter != null ) 
				{
				
					var tiles = getAdjacentTiles( { x : tileX, y : tileY }, gameBoard );
					
					changeTilesColor( tiles, color );
					addToArray( updateList, tiles );	
					addToArray( changedList, tiles );
					
					clickTilePos = pos;
					firstClick   = !firstClick;
				}
			}
			else
			{
				var clickTileX = clickTilePos % gameBoard.gridWidth, 
					clickTileY = Math.floor( clickTilePos / gameBoard.gridWidth );
				
				if ( isValidPos( pos, clickTilePos ) ) 
				{								
					try 
					{
						var tiles = getAdjacentTiles( { x : clickTileX, y : clickTileY }, gameBoard );
						changeTilesColor( tiles, oldColor );
						addToArray( updateList, tiles );
						
						firstClick   = !firstClick;
						var tile    = gameBoard.tiles[tileY][tileX],
							swapTile = gameBoard.tiles[clickTileY][clickTileX];
						if ( tile.letter != null && swapTile.letter != null )
						{
				
							swapTiles( { x : tileX, y : tileY }, { x : clickTileX, y : clickTileY } );
							updateList.push( gameBoard.tiles[ clickTileY ][ clickTileX ] );
							updateList.push( gameBoard.tiles[ tileY ][ tileX ] );
							
							wordCheck( { row : tileY, col : tileX }, gameBoard );
							
							
							justSwapped = true;
						}
					} catch ( error )
					{
						console.log( error );
					}				
				}
				else
				{
					var oldTiles = getAdjacentTiles( { x : clickTileX, y : clickTileY }, gameBoard );
					changeTilesColor( oldTiles, oldColor );
					addToArray( updateList, oldTiles );
					
					var tile = gameBoard.tiles[tileY][tileX]; 
					if ( tile.letter != null ) 
					{			
						var newTiles = getAdjacentTiles( { x : tileX, y : tileY }, gameBoard );
						changeTilesColor( newTiles, color );
						addToArray( updateList, newTiles );
						addToArray( changedList, newTiles );
					}
				}
				
				clickTilePos = pos;
				
			}
		}
	}
}

function loadDict( event )
{
	try 
	{
		gameBoard.loadDictionary( event.target.files[0] );
	}
	catch ( error )
	{	
		console.log( error );
	}		
} 
 
function isEmpty( anArray )
{
	return anArray.length == 0;
}

var timeOut = 0.5 * 1000,
    redrawTime = 1 * 1000;

var timer     = timeOut,
	drawTimer = redrawTime;

function doRedraw()
{
	while ( !isEmpty( changedList ) )
	{
		tile = changedList.pop();
	//	tile.letter.color = oldColor;
	//	tile.clearLetter( gameBoard.canvas.getContext( "2d" ), gameBoard.scale );
	//	tile.draw( gameBoard.canvas.getContext( "2d" ), gameBoard.scale );
	}
}

function clear()
{
	while ( !isEmpty( clearList ) )
//	if ( !isEmpty( clearList ) )
	{
		var clearObject = clearList.shift();
		var tile        = clearObject.aTile, 
			upNeighbour = null;
		var pos  = clearObject.pos;
		
		if ( pos.y - 1 >= 0 )
			upNeighbour = gameBoard.tiles[pos.y - 1][pos.x];
				
		if ( upNeighbour != null && upNeighbour.letter != null )
			physicsList.push( { aTile : upNeighbour, pos : { x : pos.x, y : pos.y - 1 } } );
		
		tile.clearLetter( gameBoard.canvas.getContext( "2d" ), gameBoard.scale );
		gameBoard.tiles[pos.y][pos.x].letter = null;
	}
}

function updateScore()
{
	if ( gameBoard != null ) 
		document.getElementById( "score" ).innerHTML = " " + gameBoard.totalScore + " ";
}

function removeElement( element, pos, anArray ) 
{
	if ( pos != 0 ) 
	{
		anArray[pos] = anArray[0];
		anArray[0] =  element;
	}
	
	anArray.shift();
}

function applyPhysics()
{
//	for ( var i = 0; i < physicsList.length; i++ )
	
	if ( !isEmpty( physicsList ) )
	{
		var physicsObject = physicsList.shift(); 
		var pos  = physicsObject.pos;
		if ( gameBoard.tiles[pos.y][pos.x].letter == null ) return 0;
		//	removeElement( physicsObject, i, physicsList );
		else
		{
			var tile = physicsObject.aTile;
			
			if ( pos.y + 1 == gameBoard.gridHeight ) return 0;
		//		removeElement( physicsObject, i, physicsList );
			else
			{
				if ( gameBoard.tiles[pos.y+1][pos.x].letter != null ) return 0;
			//		removeElement( physicsObject, i, physicsList );
				else
				{
				//	if ( tile != null ) 
					{
						var downNeighbour = gameBoard.tiles[pos.y + 1][pos.x]; 
						
						tile.clearLetter( gameBoard.canvas.getContext( "2d" ), gameBoard.scale );
						downNeighbour.letter = tile.letter;
					//	tile.pos.y += gameBoard.scale * ( Tile.HEIGHT + Board.LINE_WIDTH );
					
						downNeighbour.draw( gameBoard.canvas.getContext( "2d" ), gameBoard.scale );
						
					//	gameBoard.tiles[pos.y+1][pos.x] = tile;
						gameBoard.tiles[pos.y][pos.x].letter = null;
						reloadCols.push( pos.x );
					//	clearList.push( { aTile : tile, pos : { x : pos.x, y : pos.y } } );
					//	updateList.push( downNeighbour );

						if ( pos.y - 1 >= 0 )
							physicsList.push( { aTile : gameBoard.tiles[pos.y - 1][pos.x], pos : { x : pos.x, y : pos.y - 1 } } );
						physicsList.push( { aTile : gameBoard.tiles[pos.y + 1][pos.x], pos : { x : pos.x, y : pos.y + 1 } } );
					}
				}
			}
		}
	}
}

function reloadBoard( columns )
{
//	for ( var i = 0; i < columns.length; i++ )
	if ( !isEmpty( columns ) )
	{
		var col = columns.shift();
		var character = generator.generateCharacter();
		var scale = gameBoard.scale;
	//	var tile = new Tile( scale * ( Board.BORDER_WIDTH + col * ( Tile.WIDTH + Board.LINE_WIDTH ) ), 
		//                     scale * ( Board.BORDER_WIDTH -  ( Tile.HEIGHT + Board.LINE_WIDTH ) ), character, 1, "white", null );
		var letter = new Letter( character.toUpperCase(), "rgb( 199, 166, 115 )" );
		var tile = gameBoard.tiles[0][col]; 
		
		if ( tile.letter == null ) 
		{	
			tile.letter = letter;
			tile.draw( gameBoard.canvas.getContext( "2d" ), gameBoard.scale );
		//gameBoard.tiles[0][columns] = tile;
	//	updateList.push( tile );
			physicsList.push( { aTile : tile, pos : { x : col, y : 0 } } );
		}
	}
}

var pause = 2000;
function render()
{
	while ( !isEmpty( updateList ) )
	{
		var tile = updateList.shift();
		tile.draw( gameBoard.canvas.getContext( "2d" ), gameBoard.scale );
		timer = 0.5 * 1000;
	}
	
	timer -= animSpeed;
	if ( timer < 0 )
	{
	//	doRedraw();
	//	pause = 500;
		clear();
	//	timer = 500;
	
	
	pause -= animSpeed;
//	if ( pause < 0 )
	{
//	pause = 500;
		reloadBoard( reloadCols )
	
	}
	}
	updateScore();
}

function run()
{
	if ( isGameRunning )
	{
		while ( redrawCache.length > 1 )
		{
			var tile = redrawCache.shift(); 
			tile.letter.color = oldColor;
			tile.draw( gameBoard.canvas.getContext( "2d" ), gameBoard.scale );
		}
		applyPhysics();
		render();
	}	
	else
		renderMenus();
	
	requestAnimFrame( run );
}

