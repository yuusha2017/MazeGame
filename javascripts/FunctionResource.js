
// 當使用者縮放視窗時呼叫此函式來維持繪製區域
function resize(){
	GameCanvas = document.getElementById("GameCanvas");
    GameCanvas.width = window.innerWidth;
	GameCanvas.height = window.innerHeight;
    GC = GameCanvas;
	GCCT = GC.getContext("2d");
	GCCT.lineWidth = 2;
	GCCT.font = "40px verdana";
    centerX = GC.width/2;
	centerY = GC.height/2;
	
    switch(Control.getState()) {
        case "GameMenuScene" : {
            GameMenuScene.RecreateMenuItems();
            GameMenuScene.render();
            break;
		}
        case "GameScene" : {
			GameScene.SetFixedSL((window.innerHeight*window.devicePixelRatio)/2/5);
			GameScene.SetSL(4*(window.innerHeight*window.devicePixelRatio)/2/5/(Control.PlayerRoleOriginalScope));
			GameScene.AllBlack();
            GameScene.UpdateViewScope(Control.PlayerRole);
            break;
		}
		case "OptionScene" : {
			OptionScene.RecreateMenuItems();
			OptionScene.render();
			break;
		}
        default : {
            break;
        }
	};
}

// 選單項目生成
function MenuItem(ArgName, ArgX, ArgY) {
	this.name = ArgName;
	this.x = ArgX;
	this.y = ArgY;
}

// 隨機生成min到max之間(含)的整數
function RandomNum(min, max) {									
	return Math.floor( Math.random()*(max-min+1) ) + min;
}

// 判斷兩物件間是否互相接觸
function ReachDetermination(objectA, objectB) {								
	if(Math.abs(objectA.getZ() - objectB.getZ()) <= 0.1 && Math.abs( (objectA.getX() - objectB.getX()) ) <= 0.5 && Math.abs( (objectA.getY() - objectB.getY()) ) <= 0.5) {
		return true;
	}
	else {
		return false;
	}
}

// 複製迷宮
function MazeCopier(maze) {
	var maze2 = [];
	for(var z = 0; z < maze.length; ++z) {
		maze2.push(maze[z].map( function(arr) { return JSON.parse(JSON.stringify(arr)); } ));
	}
	for(var z = 0; z < maze2.length; ++z) {
		for(var x = 0; x < maze2[z].length; ++x) {
			for(var y = 0; y < maze2[z][x].length; ++y) {
				maze2[z][x][y].passed = false;
				maze2[z][x][y].passtimes = 0;
			}
		}
	}
	return maze2;
}

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
	// console.log(maze);
	return maze;
}

// 開拓迷宮
function ThinWallMazeGo(maze, x, y) {
	maze[x][y].passed = true;
	var direction = RandomNum(1,4);
	for(var i = 0; i <= 3; ++i) {						// 因遞迴關係，變數不可用全域i
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
	for(var z = 0; z < ThinWallMaze.length; ++z) {
		ThickWallMaze.push([]);
		ThickWallMaze[z].push([]);
		for(var y = 0; y <= 2*ThinWallMaze[z][0].length; ++y) {
			ThickWallMaze[z][0].push({passed : false, object : "wall"});
		}
		for(var x = 0; x < ThinWallMaze[z].length; ++x) {
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
	for(var z = 1; z < maze.length; ++z) {
		position = position2;
		position2 = [];
		number = RandomNum(Math.round(maze[z].length*maze[z][0].length/100), Math.round(maze[z].length*maze[z][0].length/50));
		// number = 0;
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

function MazeToImg(maze) {
	var MazeImg = [];
	for(var z = 0; z < maze.length; ++z) {
		MazeImg.push([])
		for(var x = 0; x < maze[z].length; ++x) {
			MazeImg[z].push([]);
			for(var y = 0; y < maze[z][x].length; ++y) {
				if(y == maze[z][x].length-1 && x >= 0 && x < maze[z].length) {
					MazeImg[z][x].push(WallOutOfMaze);
				}
				else if(maze[z][x][y].object == "wall") {
					if(y + 1 == maze[z][x].length || maze[z][x][y+1].object == "wall") {
						MazeImg[z][x].push(MazeWall);
					}
					else {
						MazeImg[z][x].push(MazeFrontWall);
					}
				}
				else if(maze[z][x][y].object == "PassageDown") {
					if(maze[z][x][y-1].object != "wall") {
						MazeImg[z][x].push(MazeWallDownPassageDown);
					}
					else if(maze[z][x+1][y].object != "wall") {
						MazeImg[z][x].push(MazeWallLeftPassageDown);
					}
					else if(maze[z][x][y+1].object != "wall") {
						MazeImg[z][x].push(MazeWallUpPassageDown);
					}
					else if(maze[z][x-1][y].object != "wall") {
						MazeImg[z][x].push(MazeWallRightPassageDown);							
					}
				}
				else if(maze[z][x][y].object == "PassageUp" ) {
					if(maze[z][x][y-1].object != "wall") {
						MazeImg[z][x].push(MazeWallDownPassageUp);
					}
					else if(maze[z][x+1][y].object != "wall") {
						MazeImg[z][x].push(MazeWallLeftPassageUp);
					}
					else if(maze[z][x][y+1].object != "wall") {
						MazeImg[z][x].push(MazeWallUpPassageUp);
					}
					else if(maze[z][x-1][y].object != "wall") {
						MazeImg[z][x].push(MazeWallRightPassageUp);							
					}
				}
				else {
					if(maze[z][x][y-1].object == "wall") {
						MazeImg[z][x].push(MazeWallFloor);
					}
					else {
						MazeImg[z][x].push(MazeFloor);
					}
				}
			}
		}
	}
	return MazeImg;
}

// 建立玩家物件
function Player(name, role) {
	this.KeyboardState = NoKey;
	this.name = name;
	this.role = role;
	this.GetKeyboardState = function() {
		return this.KeyboardState;
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

function GetAIAvailableInfo(AIRole, Roles, AIMaze) {

	// 儲存、簡化常用變數
	var X = AIRole.getX();
	var Y = AIRole.getY();
	var Z = AIRole.getZ();
	var IntX = Math.round(X);	
	var IntY = Math.round(Y);
	var IntZ = Math.round(Z);
	var offsetX = X - IntX;
	var offsetY = Y - IntY;
	var ViewScope = AIRole.GetViewScope();
	var ViewableGrid = ViewScope - 0.5;		// 角色在格子正中間的可視半徑內的其它格子數
	var Info = {ChangeOfX : X - AIRole.GetPreX(), ChangeOfY : Y - AIRole.GetPreY(), 
				ChangeOfZ : Z - AIRole.GetPreZ(), Maze : [], OtherPlayers : [],
				MazeInfoCenterX : Math.round(ViewableGrid - offsetX),
				MazeInfoCenterY : Math.round(ViewableGrid - offsetY)};

	// 填充角色可視迷宮資訊
	for(var x = -Math.round(ViewableGrid - offsetX); x <= Math.round(ViewableGrid + offsetX); ++x) {
		Info.Maze.push([]);
		for(var y = -Math.round(ViewableGrid - offsetY); y <= Math.round(ViewableGrid + offsetX); ++y) {
			if(IsOutOfMaze(AIMaze[IntZ], IntX + x, IntY + y && Math.abs(Z - IntZ) < 0.1)) {
				Info.Maze[x + Math.round(ViewableGrid - offsetX)].push("Border");
			}
			else if(distance2d(x,y,offsetX,offsetY) <= ViewScope && Math.abs(Z - IntZ) < 0.1) {
				Info.Maze[x + Math.round(ViewableGrid - offsetX)].push(AIMaze[IntZ][IntX + x][IntY + y]);
			}
			else {
				Info.Maze[x + Math.round(ViewableGrid - offsetX)].push("unknown");
			}
		}
	}

	// 填充其它可視玩家資訊
	for(var PlayerNum = 0; PlayerNum < Roles.length; ++PlayerNum) {
		if(AIRole != Roles[PlayerNum]){
			if(AIRole.getZ() == Roles[PlayerNum].getZ() && distance2d(X, Y, Roles[PlayerNum].getX(), Roles[PlayerNum].getY()) <= ViewScope && Roles[PlayerNum].GetState() != "invisible") {
				Info.OtherPlayers.push({Name : Roles[PlayerNum].GetOperator().GetName(), 
											   RelativeX : Roles[PlayerNum].getX() - X, 
											   RelativeY : Roles[PlayerNum].getY() - Y});
			}
			else {
				Info.OtherPlayers.push({Name : Roles[PlayerNum].GetOperator().GetName(),
											   RelativeX : "unknown",
											   RelativeY : "unknown"});
			}
		}
	}

	// AIRole.SetPreX(X);
	// AIRole.SetPreY(Y);
	// AIRole.SetPreZ(Z);
	return Info;
}

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
	treasure.src = "images\\treasure.png";
	exit.src = "images\\exit.png";
	ItemBorder.src = "images\\ItemBorder.png";
	flash.src = "images\\flash.png";
	sheep.src = "images\\sheep.png";
	wolf.src = "images\\wolf.png";
	goldcoin.src = "images\\GoldCoin.png";
	silvercoin.src = "images\\SilverCoin.png";
	bronzecoin.src = "images\\BronzeCoin.png";
}

// // 出口與寶藏與角色的位置初始化
// function ObjectPositionInit(maze, RoleList) {
// 	for(var RoleNum = 0; RoleNum < RoleList.length; ++RoleNum) {
// 		PositionGenerator(maze, )
// 		while(maze[RoleList[RoleNum].getZ()][RoleList[RoleNum].getX()][RoleList[RoleNum].getY()].object != "road") {
// 			RoleList[RoleNum].SetPosition(RandomNum(1, maze[0].length-2), RandomNum(1, maze[0][0].length-2), RandomNum(0, maze.length-1));
// 		}
// 		RoleList[RoleNum].SetPrePosition(RoleList[RoleNum].getX(), RoleList[RoleNum].getY(), RoleList[RoleNum].getZ());
// 	}
// 	WaitDrawObjects[0].SetPosition(RoleList[0].getX(), RoleList[0].getY(), RoleList[0].getZ());
// 	do{
// 		WaitDrawObjects[1].SetPosition(RandomNum(1, maze[0].length-2), RandomNum(1, maze[0][0].length-2), RandomNum(0, maze.length-1));
// 	}while(maze[WaitDrawObjects[1].getZ()][WaitDrawObjects[1].getX()][WaitDrawObjects[1].getY()].object != "road") 
// }

// 給定一位置與一迷宮平面, 判斷該位置是否在迷宮之外
function IsOutOfMaze(maze, x, y) {
	if(x < 0 || y < 0 || x > maze.length - 1 || y > maze[x].length - 1) {
		return true;
	}
	else {
		return false;
	}
}

// 回傳距離(二維)
function distance2d(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

// 回傳距離(三維)
function distance3d(x1, y1, z1, x2, y2, z2) {
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2));
}

// 回傳一位置，該位置必須在ObjectList內所有物件位置的半徑之外，並且在道路上
function PositionGenerator(maze, ObjectList, radius) {
	var i = -1;
	var times = 0;
	while(i != ObjectList.length) {
		if(++times > 1000) {
			return false;
		}
		var position = {x : RandomNum(1, maze[0].length-2), y : RandomNum(1, maze[0][0].length-2), z : RandomNum(0, maze.length-1)};
		while(maze[position.z][position.x][position.y].object != "road") {
			position = {x : RandomNum(1, maze[0].length-2), y : RandomNum(1, maze[0][0].length-2), z : RandomNum(0, maze.length-1)};
		}
		for(i = 0; i < ObjectList.length; ++i) {
			if(distance3d(position.x, position.y, position.z, ObjectList[i].getX(), ObjectList[i].getY(), ObjectList[i].getZ()) <= radius) {
				break;
			}
		}
	}
	return position;
}

// 檢查物件清單，需要時刪除元素
function check(objects) {
	for(var i = 0; i < objects.length; ++i) {
		if(objects[i].GetState() == "vanish") {
			objects.splice(i, 1);
		}
	}
}