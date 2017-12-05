var NoKey = 0;
var KeyDown = 1;
var KeyRight = 2;
var KeyUp = 4;
var KeyLeft = 8;
var KeyD = 16
var KeyF = 32;
var KeyQ = 64;
var KeyW = 128;
var AllKey = KeyDown + KeyRight + KeyUp + KeyLeft + KeyD + KeyF + KeyQ + KeyW;   // Number.MAX_SAFE_INTEGER; (IE不支援QAQ)
// 當使用者縮放視窗時呼叫此函式來維持繪製區域
function resize(){
	GameCanvas = document.getElementById("GameCanvas");
    GameCanvas.width = window.innerWidth;
	GameCanvas.height = window.innerHeight;
    GC = GameCanvas;
    GCCT = GC.getContext("2d");
    centerX = GC.width/2;
	centerY = GC.height/2;
	
    switch(Control.getState()) {
        case "GameMenuScene" : {
            GameMenuScene.RecreateMenuItems();
            GameMenuScene.render();
            break;
        }
        case "GameScene" : {
			GameScene.AllBlack();
            GameScene.UpdateViewScope(Control.RoleList[0]);
            break;
		}
		case "OptionScene" : {
			if(OptionScene.GetState() == "OptionSelect") {
				OptionScene.RecreateMenuItems();
				OptionScene.render();
			}
			else if(OptionScene.GetState() == "MazeLengthSetting") {
				OptionScene.RecreateMenuItems();
				OptionScene.render();
				OptionScene.ClearMenuItem(0);
				OptionScene.OnMazeLengthSelect();
			}
			else if(OptionScene.GetState() == "MazeWidthSetting") {
				OptionScene.RecreateMenuItems();
				OptionScene.render();
				OptionScene.ClearMenuItem(1);
				OptionScene.OnMazeWidthSelect();
			}
			else if(OptionScene.GetState() == "MazeHeightSetting") {
				OptionScene.RecreateMenuItems();
				OptionScene.render();
				OptionScene.ClearMenuItem(2);
				OptionScene.OnMazeHeightSelect();
			}
			break;
		}
        default : {
            break;
        }
	};
}

// 選單項目生成
function MenuItem(name, positionX, positionY) {
	this.name = name;
	this.positionX = positionX;
	this.positionY = positionY;
}

// 隨機生成min到max之間(含)的整數
function RandomNum(min, max) {									
	return Math.floor( Math.random()*(max-min+1) ) + min;
}

// 判斷兩物件間是否互相接觸
function ReachDetermination(objectA, objectB) {								
	if(objectA.getZ() == objectB.getZ() && Math.abs( (objectA.getX() - objectB.getX()) ) <= 0.5 && Math.abs( (objectA.getY() - objectB.getY()) ) <= 0.5) {
		return true;
	}
	else {
		return false;
	}
}

// 暫不支援z軸
// function ThickWallMazeGenerator(dimensionX, dimensionY) {
// 	var maze = [];
// 	for(var x = 0; x <= dimensionX+1; ++x) {
// 		maze.push([]);
// 		for(var y = 0; y <= dimensionY+1; ++y) {	
// 			maze[x].push({passed : false, top : false, right : false, object : "unknown"});
// 		}
// 	}
// 	ThickWallMazeGeneratorGo(maze, RandomNum(1, dimensionX-2), RandomNum(1, dimensionY-2) );
// 	for(var x = 0; x <=dimensionX+1; ++x) {
// 		for(var y = 0; y <= dimensionY+1; ++y) {
// 			maze[x][y].object = maze[x][y].passed == true ? "road" : "wall";
// 		}
// 	}
// 	return maze;
// }

// 複製迷宮
function MazeCopier(maze) {
	var maze2 = [];
	for(var z = 0; z <= maze.length-1; ++z) {
		maze2.push(maze[z].map( function(arr) { return JSON.parse(JSON.stringify(arr)); } ));
	}
	for(var z = 0; z <=maze2.length-1; ++z) {
		for(var x = 0; x <=maze2[z].length-1; ++x) {
			for(var y = 0; y <= maze2[z][x].length-1; ++y) {
			maze2[z][x][y].passed = false;
			maze2[z][x][y].passtimes = 0;
			}
		}
	}
	return maze2;
}

// 暫不支援z軸
// function ThickWallMazeGeneratorGo(maze, x, y) {
// 	maze[x][y].passed = true;
// 	var direction = RandomNum(1,4);
// 	for(var i = 0; i <= 3; ++i) {
// 		switch(direction) {
// 			case 1: {
// 				if(y == 2 || (y > 2 && (maze[x][y-3].passed == true || maze[x-1][y-3].passed == true || maze[x+1][y-3].passed == true))) {
// 					if(maze[x][y-1].passed == false && maze[x-1][y-1].passed == false && maze[x+1][y-1].passed == false
// 						&&maze[x][y-2].passed == false && maze[x-1][y-2].passed == false && maze[x+1][y-2].passed == false) {
// 							maze[x][y].top = true;
// 							ThickWallMazeGeneratorGo(maze, x, y-1);	
// 					}
// 				}
// 				else if(y != 1 && y != 2) {
// 					if(maze[x][y-1].passed == false && maze[x-1][y-1].passed == false && maze[x+1][y-1].passed == false
// 					&&maze[x][y-2].passed == false && maze[x-1][y-2].passed == false && maze[x+1][y-2].passed == false) {
// 						maze[x][y].top = true;
// 						maze[x][y-1].top = true;
// 						maze[x][y-1].passed = true;
// 						ThickWallMazeGeneratorGo(maze, x, y-2);	
// 					}
// 				}
// 				++direction;
// 				break;
// 			}

// 			case 2: { 
// 				if(x == maze.length - 3 || (x < maze.length-3 && (maze[x+3][y].passed == true || maze[x+3][y-1].passed == true || maze[x+3][y+1].passed == true) ) ) {
// 					if(maze[x+1][y].passed == false && maze[x+1][y-1].passed == false && maze[x+1][y+1].passed == false 
// 						&&maze[x+2][y].passed == false && maze[x+2][y-1].passed == false && maze[x+2][y+1].passed == false) {
// 							maze[x][y].right = true;
// 							ThickWallMazeGeneratorGo(maze, x+1, y); 
// 					}
// 				}
// 				else if(x != maze.length - 2 && x != maze.length - 3) {
// 					if(maze[x+1][y].passed == false && maze[x+1][y-1].passed == false && maze[x+1][y+1].passed == false 
// 					&&maze[x+2][y].passed == false && maze[x+2][y-1].passed == false && maze[x+2][y+1].passed == false) {
// 						maze[x][y].right = true;
// 						maze[x+1][y].right = true;
// 						maze[x+1][y].passed = true;
// 						ThickWallMazeGeneratorGo(maze, x+2, y); 
// 					}
// 				}
// 				++direction;
// 				break;
// 			}
			
// 			case 3: {
// 				if(y == maze[x].length - 3 || (y < maze[x].length-3 && ( maze[x][y+3].passed == true || maze[x-1][y+3].passed == true || maze[x+1][y+3].passed == true ) ) ) {
// 					if(maze[x][y+1].passed == false && maze[x-1][y+1].passed == false && maze[x+1][y+1].passed == false 
// 						&&maze[x][y+2].passed == false && maze[x-1][y+2].passed == false && maze[x+1][y+2].passed == false) {
// 							maze[x][y+1].top = true;
// 							ThickWallMazeGeneratorGo(maze, x, y+1); 
// 					}
// 				}
// 				else if(y != maze[x].length - 2 && y != maze[x].length - 3) {
// 					if(maze[x][y+1].passed == false && maze[x-1][y+1].passed == false && maze[x+1][y+1].passed == false 
// 					&&maze[x][y+2].passed == false && maze[x-1][y+2].passed == false && maze[x+1][y+2].passed == false) {
// 						maze[x][y+1].top = true;
// 						maze[x][y+2].top = true;
// 						maze[x][y+1].passed = true;
// 						ThickWallMazeGeneratorGo(maze, x, y+2); 
// 					}
// 				}
// 				++direction;
// 				break;
// 			}
			
// 			case 4: {
// 				if(x == 2 || (x > 2 && (maze[x-3][y].passed == true || maze[x-3][y-1].passed == true || maze[x-3][y+1].passed == true))) {
// 					if(maze[x-1][y].passed == false && maze[x-1][y-1].passed == false && maze[x-1][y+1].passed == false
// 						&&maze[x-2][y].passed == false && maze[x-2][y-1].passed == false && maze[x-2][y+1].passed == false) {
// 							maze[x-1][y].right = true;
// 							ThickWallMazeGeneratorGo(maze, x-1, y); 
// 					}
// 				}
// 				else if(x != 1 && x != 2) {
// 					if(maze[x-1][y].passed == false && maze[x-1][y-1].passed == false && maze[x-1][y+1].passed == false
// 					&&maze[x-2][y].passed == false && maze[x-2][y-1].passed == false && maze[x-2][y+1].passed == false) {
// 						maze[x-1][y].right = true;
// 						maze[x-2][y].right = true;
// 						maze[x-1][y].passed = true;
// 						ThickWallMazeGeneratorGo(maze, x-2, y); 
// 					}
// 				}
// 				++direction;
// 				break;
// 			}
			
// 			case 5: {
// 				if(y == 2 || (y > 2 && (maze[x][y-3].passed == true || maze[x-1][y-3].passed == true || maze[x+1][y-3].passed == true))) {
// 					if(maze[x][y-1].passed == false && maze[x-1][y-1].passed == false && maze[x+1][y-1].passed == false
// 						&&maze[x][y-2].passed == false && maze[x-1][y-2].passed == false && maze[x+1][y-2].passed == false) {
// 							maze[x][y].top = true;
// 							ThickWallMazeGeneratorGo(maze, x, y-1);	
// 					}
// 				}
// 				else if(y != 1 && y != 2) {
// 					if(maze[x][y-1].passed == false && maze[x-1][y-1].passed == false && maze[x+1][y-1].passed == false
// 					&&maze[x][y-2].passed == false && maze[x-1][y-2].passed == false && maze[x+1][y-2].passed == false) {
// 						maze[x][y].top = true;
// 						maze[x][y-1].top = true;
// 						maze[x][y-1].passed = true;
// 						ThickWallMazeGeneratorGo(maze, x, y-2);	
// 					}
// 				}
// 				++direction;
// 				break;
// 			}
			
// 			case 6: {
// 				if(x == maze.length - 3 || (x < maze.length-3 && (maze[x+3][y].passed == true || maze[x+3][y-1].passed == true || maze[x+3][y+1].passed == true) ) ) {
// 					if(maze[x+1][y].passed == false && maze[x+1][y-1].passed == false && maze[x+1][y+1].passed == false 
// 						&&maze[x+2][y].passed == false && maze[x+2][y-1].passed == false && maze[x+2][y+1].passed == false) {
// 							maze[x][y].right = true;
// 							ThickWallMazeGeneratorGo(maze, x+1, y); 
// 					}
// 				}
// 				else if(x != maze.length - 2 && x != maze.length - 3) {
// 					if(maze[x+1][y].passed == false && maze[x+1][y-1].passed == false && maze[x+1][y+1].passed == false 
// 					&&maze[x+2][y].passed == false && maze[x+2][y-1].passed == false && maze[x+2][y+1].passed == false) {
// 						maze[x][y].right = true;
// 						maze[x+1][y].right = true;
// 						maze[x+1][y].passed = true;
// 						ThickWallMazeGeneratorGo(maze, x+2, y); 
// 					}
// 				}
// 				++direction;
// 				break;
// 			}
			
// 			case 7: {
// 				if(y == maze[x].length - 3 || (y < maze[x].length-3 && ( maze[x][y+3].passed == true || maze[x-1][y+3].passed == true || maze[x+1][y+3].passed == true ) ) ) {
// 					if(maze[x][y+1].passed == false && maze[x-1][y+1].passed == false && maze[x+1][y+1].passed == false 
// 						&&maze[x][y+2].passed == false && maze[x-1][y+2].passed == false && maze[x+1][y+2].passed == false) {
// 							maze[x][y+1].top = true;
// 							ThickWallMazeGeneratorGo(maze, x, y+1); 
// 					}
// 				}
// 				else if(y != maze[x].length - 2 && y != maze[x].length - 3) {
// 					if(maze[x][y+1].passed == false && maze[x-1][y+1].passed == false && maze[x+1][y+1].passed == false 
// 					&&maze[x][y+2].passed == false && maze[x-1][y+2].passed == false && maze[x+1][y+2].passed == false) {
// 						maze[x][y+1].top = true;
// 						maze[x][y+2].top = true;
// 						maze[x][y+1].passed = true;
// 						ThickWallMazeGeneratorGo(maze, x, y+2); 
// 					}
// 				}
// 				break;
// 			}
// 			default: {
// 				break;
// 			}
// 		}
// 	}
// }

function ThinWallMazeGenerator(dimensionX, dimensionY, dimensionZ) {
	var maze = [];
	for(var z = 0; z < dimensionZ; ++z) {
		maze.push([]);
		for(var x = 0; x < dimensionX; ++x) {
			maze[z].push([]);
			for(var y = 0; y < dimensionY; ++y) {	
				maze[z][x].push({passed : false, top : false, right : false, object : "road"});
			}
		}
	}
	MazePassageGenerator(maze);
	for(var z = 0; z < dimensionZ; ++z) {
		ThinWallMazeGo(maze[z], RandomNum(0, dimensionX-1), RandomNum(0, dimensionY-1) );
	}
	console.log(maze);
	return maze;
}

// 開拓迷宮
function ThinWallMazeGo(maze, x, y) {
	maze[x][y].passed = true;
	var direction = RandomNum(1,4);
	for(var i = 0; i <= 3; ++i) {
		switch(direction) {
			case 1: {
				if(y == 0) {
					++direction;
					break;
				}
				if(maze[x][y-1].passed == false) {
					maze[x][y].top = true;
					ThinWallMazeGo(maze, x, y-1);	
				} 
				++direction;
				break;
			}
			
			case 2: { 
				if(x == maze.length - 1) {
					++direction;
					break;
				}
				if(maze[x+1][y].passed == false) {
					maze[x][y].right = true;
					ThinWallMazeGo(maze, x+1, y); 
				}
				++direction;
				break;
			}
			
			case 3: {
				if(y == maze[x].length - 1) {
					++direction;
					break;
				}
				if(maze[x][y+1].passed == false) {
					maze[x][y+1].top = true;
					ThinWallMazeGo(maze, x, y+1); 
				}
				++direction;
				break;
			}
			
			case 4: {
				if(x == 0) {
					++direction;
					break;
				}
				if(maze[x-1][y].passed == false) {
					maze[x-1][y].right = true;
					ThinWallMazeGo(maze, x-1, y); 
				}
				++direction;
				break;
			}
			
			case 5: {
				if(y == 0) {
					++direction;
					break;
				}
				if(maze[x][y-1].passed == false) {
					maze[x][y].top = true;
					ThinWallMazeGo(maze, x, y-1);
				} 
				++direction;
				break;
			}	
			
			case 6: {
				if(x == maze.length - 1) {
					++direction;
					break;
				}
				if(maze[x+1][y].passed == false) {
					maze[x][y].right = true;
					ThinWallMazeGo(maze, x+1, y); 
				}
				++direction;
				break;
			}
			
			case 7: {
				if(y == maze[x].length - 1) {
					++direction;
					break;
				}
				if(maze[x][y+1].passed == false) {
					maze[x][y+1].top = true;
					ThinWallMazeGo(maze, x, y+1); 
				}
				++direction;
				break;
			}

			default: {
				break;
			}
		}
	}
}

function ThinWallMazeToThickWallMazeConverter(ThinWallMaze) {
	var ThickWallMaze = [];
	for(var z = 0; z <= ThinWallMaze.length-1; ++z) {
		ThickWallMaze.push([]);
		ThickWallMaze[z].push([]);
		for(var y = 0; y <= 2*ThinWallMaze[z][0].length; ++y) {
			ThickWallMaze[z][0].push({passed : false, object : "wall"});
		}
		for(var x = 0; x <= ThinWallMaze[z].length-1; ++x) {
			ThickWallMaze[z].push([]);
			ThickWallMaze[z].push([]);
			for(var y = 0; y <= ThinWallMaze[z][x].length-1; ++y) {
				if(ThinWallMaze[z][x][y].top == false) {
					ThickWallMaze[z][2*x+1].push({passed : false, object : "wall"});
				}
				else {
					ThickWallMaze[z][2*x+1].push({passed : true, object : "road"});
				}
				if(ThinWallMaze[z][x][y].object == "PassageUp") {
					ThickWallMaze[z][2*x+1].push({passed : true, object : "PassageUp"});
				}
				else if(ThinWallMaze[z][x][y].object == "PassageDown") {
					ThickWallMaze[z][2*x+1].push({passed : true, object : "PassageDown"});
				}
				else {
					ThickWallMaze[z][2*x+1].push({passed : true, object : "road"});
				}
				ThickWallMaze[z][2*(x+1)].push({passed : false, object : "wall"});
				if(ThinWallMaze[z][x][y].right == false) {
					ThickWallMaze[z][2*(x+1)].push({passed : false, object : "wall"});
				}
				else {
					ThickWallMaze[z][2*(x+1)].push({passed : true, object : "road"});
				}
			}
		}
		for(var x = 1; x <= 2*ThinWallMaze[z].length; ++x) {
			ThickWallMaze[z][x].push({passed : false, object : "wall"});
		}
	}
	return ThickWallMaze;
}

function MazePassageGenerator(maze) {
	var x;
	var y;
	var type;
	var number;
	var position = [];
	var position2 = [];
	var check = true;
	for(var z = 1; z <= maze.length-1; ++z) {
		position = position2;
		position2 = [];
		number = RandomNum(10, 15);
		for(var i = 0; i < number; ++i) {
			do {
				x = RandomNum(0, maze[z].length-1);
				y = RandomNum(0, maze[z][x].length-1);
				check = true;
				for(var j = 0; j < position.length; ++j) {
					if( (Math.abs(x - position[j].positionX) + Math.abs(y - position[j].positionY) ) <= 1 ) {
						check = false;
						break;
					}
				}
				for(var j = 0; j < position2.length; ++j) {
					if( (Math.abs(x - position2[j].positionX) + Math.abs(y - position2[j].positionY) ) <= 1 ) {
						check = false;
						break;
					}
				}
			}while(check == false);
			position2.push({positionX : x, positionY : y});
			if( (x == 0 && y == 0) || (x == maze[z].length-1 && y == 0) || (x == 0 && y == maze[z][x].length-1) || (x == maze[z].length-1 && y == maze[z][x].length-1) ) {
				continue;
			}
			else if(x == 0 || x == maze[z].length-1) {
				type = (RandomNum(0,1) == 0) ? 0 : 2;
			}
			else if(y == 0 || y == maze[z][x].length-1) {
				type = (RandomNum(0,1) == 0) ? 1 : 3;
			}
			else {
				type = RandomNum(0,3);
			}
			switch(type) {
				case 0 : {
					maze[z][x][y] = {passed : true, top : true, right : false, object : "PassageDown"};
					maze[z-1][x][y] = {passed : true, top : false, right : false, object : "PassageUp"};
					maze[z-1][x][y+1] = {passed : false, top : true, right : false, object : "road"};
					break;
				}
				case 1 : {
					maze[z][x][y] = {passed : true, top : false, right : true, object : "PassageDown"};
					maze[z-1][x][y] = {passed : true, top : false, right : false, object : "PassageUp"};
					maze[z-1][x-1][y] = {passed : false, top : false, right :true, object : "road"};
					break;
				}
				case 2 : {
					maze[z][x][y] = {passed : true, top : false, right : false, object : "PassageDown"};
					maze[z][x][y+1] = {passed : false, top : true, right : false, object : "road"};
					maze[z-1][x][y] = {passed : true, top : true, right : false, object : "PassageUp"};
					break;
				}
				case 3 : {
					maze[z][x][y] = {passed : true, top : false, right : false, object : "PassageDown"};
					maze[z][x-1][y] = {passed : false, top : false, right : true, object : "road"};
					maze[z-1][x][y] = {passed : true, top : false, right : true, object : "PassageUp"};
					break;
				}
				default : {
					break;
				}
			}
		}
	}
}

// 建立玩家物件
function Player(name, role) {
	this.KeyboardState = NoKey;
	this.KeyboardSetting = {KeyLeft : role.MoveLeft.bind(role), KeyUp : role.MoveUp.bind(role), KeyRight : role.MoveRight.bind(role), KeyDown : role.MoveDown.bind(role),
		KeyD : role.Skill1.bind(role), KeyF : role.Skill2.bind(role)};			// 在此環境下呼叫role的函數將導致該function內的this綁定KeyboardSetting物件，須重新修正
	this.name = name;
	this.role = role;
	this.GetKeyboardState = function() {
		return this.KeyboardState;
	};
	this.GetKeyboardSetting = function() {
		return this.KeyboardSetting;
	};
	this.GetName = function() {
		return this.name;
	};
	this.GetRole = function() {
		return this.role;
	};
	this.SetKeyboardState = function(ArgKeyboardState) {
		this.KeyboardState = ArgKeyboardState;
	};
}

// AI維修中
// function GetAIAvailableInformation(AIRole, Roles, AIMaze) {
// 	var Information = {ChangeOfPositionX : AIRole.getX() - AIRole.GetPreX(), ChangeOfPositionY : AIRole.getY() - AIRole.GetPreY(), Maze : [], OtherPlayers : []};
// 	for(var x = -Math.floor(AIRole.GetViewScope())+1; x <= Math.floor(AIRole.GetViewScope())-1; ++x) {
// 		Information.Maze.push([]);
// 		for(var y = -Math.floor(AIRole.GetViewScope())+1; y <= Math.floor(AIRole.GetViewScope())-1; ++y) {
// 			if(Math.round(AIRole.getX()) + x < 0 || Math.round(AIRole.getY()) + y  < 0 || Math.round(AIRole.getX()) + x > AIMaze[0].length - 1 || Math.round(AIRole.getY()) + y > AIMaze[0][Math.round(AIRole.getX()) + x].length - 1) {
// 				Information.Maze[x + Math.floor(AIRole.GetViewScope()) - 1].push("Border");
// 			}
// 			else {
// 				Information.Maze[x + Math.floor(AIRole.GetViewScope()) - 1].push(AIMaze[Math.round(AIRole.getZ())][Math.round(AIRole.getX()) + x][Math.round(AIRole.getY()) + y]);
// 			}
// 		}
// 	}
// 	for(var PlayerNumber = 0; PlayerNumber <= Roles.length-1; ++PlayerNumber) {
// 		if(AIRole != Roles[PlayerNumber] ){
// 			if(Math.floor(AIRole.GetViewScope())-1 > Math.sqrt(Math.pow(AIRole.getX() - Roles[PlayerNumber].getX(), 2) + Math.pow(AIRole.getY() - Roles[PlayerNumber].getY(), 2)) ) {
// 				Information.OtherPlayers.push({Name : Roles[PlayerNumber].GetOperator().GetName(), 
// 																	RelativePositionX : Roles[PlayerNumber].getX() - AIRole.getX(), 
// 																	RelativePositionY : Roles[PlayerNumber].getY() - AIRole.getY()});
// 			}
// 			else {
// 				Information.OtherPlayers.push({Name : Roles[PlayerNumber].GetOperator().GetName(),
// 																	RelativePositionX : "unknown",
// 																	RelativePositionY : "unknown"});
// 			}
// 		}
// 	}
// 	AIRole.SetPreX(AIRole.getX());
// 	AIRole.SetPreY(AIRole.getY());
// 	return Information;
// }

/*
function MoveLeftUp(Role) {
	if(GameScene.GetMaze()[Math.floor(Role.getX()-offset)+1][Math.round(Role.getY())].object == "road"
	&& Math.abs(Math.round(Role.getY()) - Role.getY()) <= BorderTolerance) {
		Role.MoveLeft(1/Math.sqrt(2));
		if(GameScene.GetMaze()[Math.floor(Role.getX()-offset)+1][Math.round(Role.getY())].object == "wall") {
			Role.setX(Math.ceil(Role.getX()-offset));
		}
	}
	else {
		Role.setX(Math.round(Role.getX()));
	}
	if(GameScene.GetMaze()[Math.round(Role.getX())][Math.ceil(Role.getY())-1].object == "road"
	&& Math.abs(Math.round(Role.getX()) - Role.getX()) <= BorderTolerance) {
		Role.MoveUp(1/Math.sqrt(2));
		if(GameScene.GetMaze()[Math.round(Role.getX())][Math.ceil(Role.getY())-1].object== "wall") {
			Role.setY( Math.ceil( Role.getY()));
		}
	}
	else {
		Role.setY(Math.round(Role.getY()));
	}
}

function MoveRightUp(Role) {
	if(GameScene.GetMaze()[Math.floor(Role.getX())+1][Math.round(Role.getY())].object == "road"
	&& Math.abs(Math.round(Role.getY()) - Role.getY()) <= BorderTolerance) {
		Role.MoveRight(1/Math.sqrt(2));
		if(GameScene.GetMaze()[Math.floor(Role.getX())+1][Math.round(Role.getY())].object == "wall") {
			Role.setX(Math.floor(Role.getX()));
		}
	}
	else {
		Role.setX(Math.round(Role.getX()));
	}
	if(GameScene.GetMaze()[Math.round(Role.getX())][Math.ceil(Role.getY())-1].object == "road"
	&& Math.abs(Math.round(Role.getX()) - Role.getX()) <= BorderTolerance) {
		Role.MoveUp(1/Math.sqrt(2));
		if(GameScene.GetMaze()[Math.round(Role.getX())][Math.ceil(Role.getY())-1].object == "wall") {
			Role.setY( Math.ceil( Role.getY()));
		}
	}
	else {
		Role.setY(Math.round(Role.getY()));
	}
}

function MoveRightDown(Role) {
	if(GameScene.GetMaze()[Math.floor(Role.getX())+1][Math.round(Role.getY())].object == "road"
	&& Math.abs(Math.round(Role.getY()) - Role.getY()) <= BorderTolerance) {
		Role.MoveRight(1/Math.sqrt(2));
		if(GameScene.GetMaze()[Math.floor(Role.getX())+1][Math.round(Role.getY())].object == "wall") {
			Role.setX(Math.floor(Role.getX()));
		}
	}
	else {
		Role.setX(Math.round(Role.getX()));
	}
	if(GameScene.GetMaze()[Math.round(Role.getX())][Math.ceil(Role.getY()+offset)-1].object == "road"
	&& Math.abs(Math.round(Role.getX()) - Role.getX()) <= BorderTolerance) {
		Role.MoveDown(1/Math.sqrt(2));
		if(GameScene.GetMaze()[Math.round(Role.getX())][Math.ceil(Role.getY()+offset)-1].object == "wall") {
			Role.setY(Math.floor(Role.getY()+offset) );
		}
	}
	else {
		Role.setY(Math.round(Role.getY()));
	}
}

function MoveLeftDown(Role) {
	if(GameScene.GetMaze()[Math.floor(Role.getX()-offset)+1][Math.round(Role.getY())].object == "road"
	&& Math.abs(Math.round(Role.getY()) - Role.getY()) <= BorderTolerance) {
		Role.MoveLeft(1/Math.sqrt(2));
		if(GameScene.GetMaze()[Math.floor(Role.getX()-offset)+1][Math.round(Role.getY())].object == "wall") {
			Role.setX(Math.ceil(Role.getX()-offset));
		}
	}
	else {
		Role.setX(Math.round(Role.getX()));
	}
	if(GameScene.GetMaze()[Math.round(Role.getX())][Math.ceil(Role.getY()+offset)-1].object == "road"
	&& Math.abs(Math.round(Role.getX()) - Role.getX()) <= BorderTolerance) {
		Role.MoveDown(1/Math.sqrt(2));
		if(GameScene.GetMaze()[Math.round(Role.getX())][Math.ceil(Role.getY()+offset)-1].object== "wall") {
			Role.setY(Math.floor(Role.getY()+offset) );
		}
	}
	else {
		Role.setY(Math.round(Role.getY()));
	}
}
*/

// 這裡寫得不好
function PositionCorrection(maze, Role) {
	if(Role.getX() < 0) {
		Role.setX(1);
	}
	if(Role.getY() < 0) {
		Role.setY(1);
	}
	if(Role.getX()  > maze.length-1) {
		Role.setX(maze.length-2);
	}
	if(Role.getY() > maze[Math.round(Role.getX())].length-1) {
		Role.setY(maze[Math.round(Role.getX())].length-2);
	}
	if(maze[Math.floor(Role.getX())][Math.round(Role.getY())].object == "wall") {
		Role.setX(Math.ceil(Role.getX()));
	}
	if(maze[Math.ceil(Role.getX())][Math.round(Role.getY())].object == "wall") {
		Role.setX(Math.floor(Role.getX()));
	}
	if(maze[Math.round(Role.getX())][Math.floor(Role.getY())].object == "wall") {
		Role.setY(Math.ceil(Role.getY()));
	}
	if(maze[Math.round(Role.getX())][Math.ceil(Role.getY())].object == "wall") {
		Role.setY(Math.floor(Role.getY()));
	}
	if(Math.round(Role.getX()) == Role.getX() && Math.round(Role.getY()) == Role.getY() && maze[Role.getX()][Role.getY()].object == "wall") {
		Role.setX((Role.GetPreX() + Role.getX())/2);
		Role.setY((Role.GetPreY() + Role.getY())/2);
		PositionCorrection(maze, Role);
	}
	if(maze[Math.floor(Role.getX())][Math.ceil(Role.getY())].object == "wall") {
		if(Math.abs(Math.round(Role.getX()) - Role.getX()) > BorderTolerance) {
			Role.setY(Math.floor(Role.getY()));
		}
		else {
			Role.setX(Math.ceil(Role.getX()));
		}
		if(Math.abs(Math.round(Role.getY()) - Role.getY()) > BorderTolerance) {
			Role.setX(Math.ceil(Role.getX()));
		}
		else {
			Role.setY(Math.floor(Role.getY()));
		}
	}
	else if(maze[Math.floor(Role.getX())][Math.floor(Role.getY())].object == "wall") {
		if(Math.abs(Math.round(Role.getX()) - Role.getX()) > BorderTolerance) {
			Role.setY(Math.ceil(Role.getY()));
		}
		else {
			Role.setX(Math.ceil(Role.getX()));
		}
		if(Math.abs(Math.round(Role.getY()) - Role.getY()) > BorderTolerance) {
			Role.setX(Math.ceil(Role.getX()));
		}
		else {
			Role.setY(Math.ceil(Role.getY()));
		}
	}
	else if(maze[Math.ceil(Role.getX())][Math.floor(Role.getY())].object == "wall") {
		if(Math.abs(Math.round(Role.getX()) - Role.getX()) > BorderTolerance) {
			Role.setY(Math.ceil(Role.getY()));
		}
		else {
			Role.setX(Math.floor(Role.getX()));
		}
		if(Math.abs(Math.round(Role.getY()) - Role.getY()) > BorderTolerance) {
			Role.setX(Math.floor(Role.getX()));
		}
		else {
			Role.setY(Math.ceil(Role.getY()));
		}
	}
	else if(maze[Math.ceil(Role.getX())][Math.ceil(Role.getY())].object == "wall") {
		if(Math.abs(Math.round(Role.getX()) - Role.getX()) > BorderTolerance) {
			Role.setY(Math.floor(Role.getY()));
		}
		else {
			Role.setX(Math.floor(Role.getX()));
		}
		if(Math.abs(Math.round(Role.getY()) - Role.getY()) > BorderTolerance) {
			Role.setX(Math.floor(Role.getX()));
		}
		else {
			Role.setY(Math.floor(Role.getY()));
		}
	}
}

function LoadImage() {
	MazeWall.src = "images\\MazeWall.png";
	MazeFrontWall.src = "images\\MazeFrontWall.png";
	MazeFloor.src = "images\\MazeFloor1.png";
	MazeFloorWall.src = "images\\MazeFloorWall.png";
	MazeWallFloor.src = "images\\MazeWallFloor.png";
	OutOfMaze.src = "images\\OutOfMaze.png";
	WallOutOfMaze.src = "images\\WallOutOfMaze.png";
	OutOfMazeWall.src = "images\\OutOfMazeWall.png";
	MazeWallUpPassageDown.src = "images\\MazeWallUpPassageDown.png";
	MazeWallRightPassageDown.src = "images\\MazeWallRightPassageDown.png";
	MazeWallDownPassageDown.src = "images\\MazeWallDownPassageDown.png";
	MazeWallLeftPassageDown.src = "images\\MazeWallLeftPassageDown.png";
	MazeWallUpPassageUp.src = "images\\MazeWallUpPassageUp.png";
	MazeWallRightPassageUp.src = "images\\MazeWallRightPassageUp.png";
	MazeWallDownPassageUp.src = "images\\MazeWallDownPassageUp.png";
	MazeWallLeftPassageUp.src = "images\\MazeWallLeftPassageUp.png";
	test.src = "images\\test.png";
	test2.src = "images\\test2.png";
	treasure.src = "images\\treasure.png";
	exit.src = "images\\exit.png";
	ItemBorder.src = "images\\ItemBorder.png";
	// Item_SpeedShoes.src = "images\\SpeedShoes.png";
	flash.src = "images\\flash.png";
	sheep.src = "images\\sheep.png";
	wolf.src = "images\\wolf.png";
}

function ObjectPositionInitialization(maze, RoleList) {
	for(var RoleNumber = 0; RoleNumber <= RoleList.length-1; ++RoleNumber) {
		while(maze[RoleList[RoleNumber].getZ()][RoleList[RoleNumber].getX()][RoleList[RoleNumber].getY()].object != "road") {
			RoleList[RoleNumber].SetPosition(RandomNum(1, maze[0].length-2), RandomNum(1, maze[0][0].length-2), RandomNum(0, maze.length-1));
		}
		RoleList[RoleNumber].SetPrePosition(RoleList[RoleNumber].getX(), RoleList[RoleNumber].getY(), RoleList[RoleNumber].getZ());
	}
	WaitDrawObjects.objects[0].SetPosition(RoleList[0].getX(), RoleList[0].getY(), RoleList[0].getZ());
	do{
		WaitDrawObjects.objects[1].SetPosition(RandomNum(1, maze[0].length-2), RandomNum(1, maze[0][0].length-2), RandomNum(0, maze.length-1));
	}while(maze[WaitDrawObjects.objects[1].getZ()][WaitDrawObjects.objects[1].getX()][WaitDrawObjects.objects[1].getY()].object != "road") 
}