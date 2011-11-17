
var isHidden = true;
var tweenIncrease,
	hideID, timeID, trophyID, checkID;
var buttonPress = 0,
	tweenValue = 0,
	trophyTimeout = 3,
	trophyTimer   = trophyTimeout;
var seconds = 20;

function displayTrophy()
{
	document.getElementById( "achievement" ).style.display = "block";
	
	if ( trophyTimer == 0 )
	{
		document.getElementById( "achievement" ).style.display = "none";
		window.clearInterval( trophyID );
		trophyTimer = trophyTimeout;
	}
			
	trophyTimer--;
}

function animate()
{
	buttonPress++;
	document.getElementById( "showButton" ).onclick = null //( "click", animate, false );
	
	if ( buttonPress === 20 )
	{
		buttonPress = 0;
		trophyID = window.setInterval( "displayTrophy()", 1000 ); 
	}
	
	tweenIncrease = 1 / seconds;
	hideID = window.setInterval( "hide( 'leaderboard', tweenIncrease )", 1000 / 60 );				
}
	
function startTime()
{
	timeID = window.setInterval( "timeRemaining()", 1000 );
}

function hide( name, tweenIncrease )
{
	
	if ( !isHidden )
	{
		if ( tweenValue < 1 )
		{
			document.getElementById( "gameSpace" ).style.left = Math.min( 300, 250 + tweenValue * 50 ) + "px";
			document.getElementById( name ).style.opacity = Math.max( 0, 1 - tweenValue );
			tweenValue += tweenIncrease;
		}
		else
		{
			document.getElementById( name ).style.display = "none";
			document.getElementById( "gameSpace" ).style.left = "300px";
			document.getElementById( name ).style.opacity = 0;
			
			isHidden = !isHidden;	
			tweenValue = 0;
			window.clearInterval( hideID );
			
			document.getElementById( "showButton" ).onclick = animate;
		}
	}
	else
	{
		document.getElementById( name ).style.display = "block";
		if ( tweenValue < 1 )
		{
			document.getElementById( "gameSpace" ).style.left = Math.max( 250, 300 - tweenValue * 50 ) + "px";
			document.getElementById( name ).style.opacity = Math.min( 1, tweenValue );
			tweenValue += tweenIncrease;
		}
		else
		{
			document.getElementById( "gameSpace" ).style.left = "250px";
			document.getElementById( name ).style.opacity = 1;
			
			isHidden = !isHidden;
			tweenValue = 0;
			window.clearInterval( hideID );
			
			document.getElementById( "showButton" ).onclick = animate;
		}					
	}
}

var t = 59;
function timeRemaining()
{
	document.getElementById( "timer" ).innerHTML = " " + t + " ";
		
	if ( t == 0 )
	{
		window.clearInterval( timeID );
	//window.clearInterval( checkID );
		isGameRunning = false;
		isEndGame = true;
	//	alert( "Game OVER!" );	
		menus.drawEndGame();
		t = 59;
	//	gameBoard.canvas.removeEventListener( "mouseMove", mouseMoveEvent, false );
	//	gameBoard.canvas.removeEventListener( "click", mouseClickEvent, false );
	}
		
	t--;
}	