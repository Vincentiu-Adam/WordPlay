//Menu class for drawing different menus

function Menu( canvasName )
{
	this.canvas = document.getElementById( canvasName );
	
	this.width  = parseInt( getCSSProperty( canvasName, "width" ) );
	this.height = parseInt( getCSSProperty( canvasName, "height" ) );
	
	this.startGameImage  = new Image();
	this.startGameImage.src = "images/Menu/start.png";
	
	this.howToPlayImage = new Image();
	this.howToPlayImage.src = "images/Menu/how.png";
	
	this.quitGameImage = new Image();
	this.quitGameImage.src = "images/Menu/quit.png";
	
	this.returnImage = new Image();
	this.returnImage.src = "images/Menu/return.png";
	
	this.retryImage = new Image();
	this.retryImage.src = "images/Menu/retry.png";
	
	this.gameOverImage = new Image();
	this.gameOverImage.src = "images/Menu/gameOver.png";
}

Menu.prototype.constructor = Menu;

Menu.SHADOW_COLOR = "#FFF";
Menu.TEXT_COLOR   = "#00F";
Menu.STROKE_COLOR = "#F00";
 
Menu.prototype.drawText = function( text, posX, posY, shadowOffset )
{
	var context = this.canvas.getContext( "2d" );
	
	context.font = "normal 100 36px/normal Arial, sans-serif";
    context.lineWidth = 1;
	
	context.fillStyle = Menu.SHADOW_COLOR;
	context.fillText( text, posX + shadowOffset.x, posY + shadowOffset.y );
	
	context.fillStyle = Menu.TEXT_COLOR;
	context.fillText( text, posX, posY );
	
	context.strokeStyle = Menu.STROKE_COLOR;
	context.strokeText( text, posX, posY );
}

Menu.prototype.drawMainMenu = function()
{
	var context = this.canvas.getContext( "2d" );
	
	var startText    = "Start Game",
		tutorialText = "How to play",
		quitText     = "Quit game";
		
	var positionTop  = 150,
		positionLeft = 70,
		shadowOffset = { x : 2, y : 2 },
		gap          = 120;
	
	var shadowColor     = "#FFF",
		textColor       = "#00F",
		strokeColor     = "#F00",
		backgroundColor = "#000";		
		
	context.fillStyle = backgroundColor;
	context.fillRect( 0,0, this.width, this.height );
	
	var backImage = new Image();
	backImage.src = "images/Menu/back.png";
	
	context.drawImage( backImage, 0, 0, this.width, this.height );
	
//	context.font = "normal 100 36px/normal Arial, sans-serif";
//  context.lineWidth = 1;
	
	context.drawImage( this.startGameImage, positionLeft, positionTop, this.startGameImage.width, this.startGameImage.height );
//	this.drawText( startText, positionLeft, positionTop, shadowOffset );
		
	positionTop += gap;
	
	context.drawImage( this.howToPlayImage, positionLeft, positionTop, this.howToPlayImage.width, this.howToPlayImage.height );
//	this.drawText( tutorialText, positionLeft, positionTop, shadowOffset );
	
	positionTop += gap;
	
	context.drawImage( this.quitGameImage, positionLeft, positionTop, this.quitGameImage.width, this.quitGameImage.height );
//	this.drawText( quitText, positionLeft, positionTop, shadowOffset );
}

Menu.prototype.drawHowToPlay = function()
{
	var context = this.canvas.getContext( "2d" );
	
	var backgroundColor = "#000";
	
	context.fillStyle = backgroundColor;
	context.fillRect( 0,0, this.width, this.height );
	
	var backImage = new Image();
	backImage.src = "images/Menu/howToPlayE.png";
	
	context.drawImage( backImage, 0, 0, 580, 580 );
	
	context.drawImage( this.returnImage, 420, 530, 150, 40 ); 
}

Menu.prototype.startGame = function()
{
	document.getElementById( "header" ).style.display = "block";
	document.getElementById( "scoreOutput" ).style.display = "block";
	
	document.getElementById( "border" ).style.backgroundImage = "url(images/background/border.png)";
	
	var context = this.canvas.getContext( "2d" );
	context.clearRect( 0, 0, this.width, this.height );
	
	this.canvas.style.position = "relative";
	this.canvas.style.top      = "20px";
	this.canvas.style.left     = "17px";
	this.canvas.style.width    = "576px";
	this.canvas.style.height   = "576px";
	
	this.width = 576; this.height = 576;
	
	gameBoard.pos = { x : this.canvas.offsetLeft, y : this.canvas.offsetTop };
	
	gameBoard.draw();
	gameBoard.checkBoard();
	startTime();
//	checkID = window.setInterval( "gameBoard.checkBoard()", 2000 ); 
}

Menu.prototype.drawEndGame = function()
{
	var context = this.canvas.getContext( "2d" );
	
	this.canvas.addEventListener( "mousemove", mouseMoveEvent, false );
	context.fillStyle = "rgba( 128,128,128, 0.4)";
	context.fillRect( 0, 0, this.width, this.height );
	
	context.drawImage( this.gameOverImage, 150, 150, 305, 78 );
	context.drawImage( this.retryImage, 180, 248, this.retryImage.width, this.retryImage.height );
}

Menu.prototype.drawQuitGame = function()
{
	var context = this.canvas.getContext( "2d" );
	
	context.drawImage( this.retryImage, 180, 248, this.retryImage.width, this.retryImage.height );
}