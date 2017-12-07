var GameMenuScene = {

    selection : 0,
    
	MenuItems : [new MenuItem("單機遊戲", centerX, GC.height/7 * 3),
			     new MenuItem("多人連線", centerX, GC.height/7 * 4),
			     new MenuItem("設定", centerX, GC.height/7 * 5),
                /*new MenuItem("離開遊戲", centerX, GC.height/7 * 6)*/],
	
	RecreateMenuItems : function() {
		this.MenuItems = [new MenuItem("單機遊戲", centerX, GC.height/7 * 3),
						  new MenuItem("多人連線", centerX, GC.height/7 * 4),
						  new MenuItem("設定", centerX, GC.height/7 * 5),
						  /*new MenuItem("離開遊戲", centerX, GC.height/7 * 6)*/];
	},

	GetSelection : function() {
		return this.selection;
	},

	render : function() {
		this.RenderBackground();
		this.RenderTitle();
		this.RenderMenu();
    },
    
	clear : function() {
		GCCT.fillStyle = "White";
		GCCT.fillRect(0, 0, GC.width, GC.height);
    },
    
	RenderTitle : function() {
		GCCT.strokeStyle = "Brown";
		GCCT.font = "80px verdana";
		GCCT.textAlign = "center";
		GCCT.textBaseline = "middle"; 
		GCCT.strokeText("未知迷攻", centerX, GC.height/7);
    },
    
	RenderMenu : function() {
		GCCT.font = "40px verdana";
		GCCT.strokeStyle = "Black";
		GCCT.textAlign = "center";
		GCCT.textBaseline = "middle"; 
		for(var i = 0; i < this.MenuItems.length; ++i) {
			GCCT.strokeText(this.MenuItems[i].name, this.MenuItems[i].positionX, this.MenuItems[i].positionY);
		}	
		this.OnSelect();
    },
	
	RenderBackground : function() {
		GCCT.fillStyle = "RGB(210,210,210)";
		GCCT.fillRect(0,0,GC.width,GC.height);
	},

	OnSelect : function() {
        GCCT.fillStyle = "AliceBlue";
		GCCT.fillRect(this.MenuItems[this.selection%4].positionX - 150, 
					  this.MenuItems[this.selection%4].positionY - 25, 300, 50);
		GCCT.strokeStyle = "Black";
		GCCT.strokeText(this.MenuItems[this.selection%4].name, 
						this.MenuItems[this.selection%4].positionX, 
                        this.MenuItems[this.selection%4].positionY);
	},
	UnSelect : function() {
		GCCT.fillStyle = "RGB(210,210,210)";
		GCCT.fillRect(this.MenuItems[this.selection%4].positionX - 160, 
					  this.MenuItems[this.selection%4].positionY - 35, 322, 70);
		GCCT.strokeText(this.MenuItems[this.selection%4].name, 
						this.MenuItems[this.selection%4].positionX, 
						this.MenuItems[this.selection%4].positionY);
	},
	Down : function() {
		this.UnSelect();
		if(this.selection == 2) {
			this.selection = 0;
		}
		else {
			++this.selection;
		}
		this.OnSelect();
	},
	Up : function() {
		this.UnSelect();
		if(this.selection == 0) {
			this.selection = 2;
		}
		else {
			--this.selection;
		}
		this.OnSelect();
	},
};

var OptionScene = {

	state : "OptionSelect",

	selection : 0,

	MazeLength : 25,

	MazeWidth : 25,

	MazeHeight : 5,

	MaxMazeLength : 50,

	MaxMazeWidth : 50,

	MaxMazeHeight : 50,

	MinMazeLength : 10,

	MinMazeWidth : 10,

	MinMazeHeight : 1,

	GetMazeLength : function() {
		return this.MazeLength;
	},

	GetMazeWidth : function() {
		return this.MazeWidth;
	},

	GetMazeHeight : function() {
		return this.MazeHeight;
	},
	
	MenuItems : [new MenuItem("迷宮長度 : " + this.MazeLength, centerX, GC.height*3/7),
	new MenuItem("迷宮寬度 : " + this.MazeWidth, centerX, GC.height*3.75/7),
	new MenuItem("迷宮高度 : " + (this.MazeHeight >= 10 ? "" : "0") + this.MazeHeight, centerX, GC.height*4.5/7),
	new MenuItem("返回", centerX, GC.height*6/7)],

	RecreateMenuItems : function() {
	this.MenuItems = [new MenuItem("迷宮長度 : " + this.MazeLength, centerX, GC.height*3/7),
			 new MenuItem("迷宮寬度 : " + this.MazeWidth, centerX, GC.height*3.75/7),
			 new MenuItem("迷宮高度 : " + (this.MazeHeight >= 10 ? "" : "0") + this.MazeHeight, centerX, GC.height*4.5/7),
			 new MenuItem("返回", centerX, GC.height*6/7)];
	},

	SetState : function(state) {
		this.state = state;
	},

	GetState : function() {
		return this.state;
	},

	GetSelection : function() {
		return this.selection;
	},

	clear : function() {
		GCCT.fillStyle = "White";
		GCCT.fillRect(0, 0, GC.width, GC.height);
	},
	
	render : function() {
		this.RenderBackground();
		this.RenderTitle();
		this.RenderOption();
	},

	RenderTitle : function() {
		GCCT.strokeStyle = "Blue";
		GCCT.font = "60px verdana";
		GCCT.textAlign = "center";
		GCCT.textBaseline = "middle"; 
		GCCT.strokeText("Option", centerX, GC.height/7);
	},

	RenderOption : function() {
		GCCT.strokeStyle = "Black";
		GCCT.font = "40px verdana";
		GCCT.textAlign = "center";
		GCCT.textBaseline = "middle"; 
		for(var i = 0; i < this.MenuItems.length; ++i) {
			GCCT.strokeText(this.MenuItems[i].name, this.MenuItems[i].positionX, this.MenuItems[i].positionY);
		}
		this.OnSelect();
	},

	RenderMenu : function() {
		GCCT.strokeStyle = "Black";
		GCCT.font = "40px verdana";
		GCCT.textAlign = "center";
		GCCT.textBaseline = "middle"; 
		GCCT.strokeText("Back", centerX, GC.height*6/7);
	},

	RenderMenuItem : function(i) {
		GCCT.strokeStyle = "Black";
		GCCT.font = "40px verdana";
		GCCT.textAlign = "center";
		GCCT.textBaseline = "middle"; 
		GCCT.strokeText(this.MenuItems[i].name, this.MenuItems[i].positionX, this.MenuItems[i].positionY);
	},

	RenderBackground : function() {
		GCCT.fillStyle = "RGB(210,210,210)";
		GCCT.fillRect(0,0,GC.width,GC.height);
	},

	ClearMenuItem : function(i) {
		GCCT.fillStyle = "White";
		GCCT.fillRect(this.MenuItems[i].positionX - 310, 
								 this.MenuItems[i].positionY - 35, 620, 70);
	},

	OnSelect : function() {
        GCCT.fillStyle = "AliceBlue";
		GCCT.fillRect(this.MenuItems[this.selection%4].positionX - 300, 
					  			 this.MenuItems[this.selection%4].positionY - 25, 600, 50);
		GCCT.strokeText(this.MenuItems[this.selection%4].name, 
						this.MenuItems[this.selection%4].positionX, 
                        this.MenuItems[this.selection%4].positionY);
	},

	UnSelect : function() {
		GCCT.fillStyle = "RGB(210,210,210)";
		GCCT.fillRect(this.MenuItems[this.selection%4].positionX - 310, 
					  			 this.MenuItems[this.selection%4].positionY - 35, 620, 70);
		GCCT.strokeText(this.MenuItems[this.selection%4].name, 
						this.MenuItems[this.selection%4].positionX, 
						this.MenuItems[this.selection%4].positionY);
	},

	OnMazeLengthSelect : function() {
		this.ClearMenuItem(0);
		GCCT.fillStyle = "RGB(210,210,210)";
		GCCT.fillRect(this.MenuItems[this.selection%4].positionX - 310, 
					  			 this.MenuItems[this.selection%4].positionY - 40, 620, 80);
		GCCT.fillStyle = "AliceBlue";
		GCCT.fillRect(this.MenuItems[0].positionX + 63, 
								   this.MenuItems[0].positionY - 25, 81, 50);
		this.RenderMenuItem(0);
	},

	OnMazeWidthSelect : function() {
		this.ClearMenuItem(1);
		GCCT.fillStyle = "RGB(210,210,210)";
		GCCT.fillRect(this.MenuItems[this.selection%4].positionX - 310, 
					  			 this.MenuItems[this.selection%4].positionY - 40, 620, 80);
		GCCT.fillStyle = "AliceBlue";
		GCCT.fillRect(this.MenuItems[1].positionX + 63, 
								   this.MenuItems[1].positionY - 25, 80, 50);
		this.RenderMenuItem(1);
	},

	OnMazeHeightSelect : function() {
		this.ClearMenuItem(2);
		GCCT.fillStyle = "RGB(210,210,210)";
		GCCT.fillRect(this.MenuItems[this.selection%4].positionX - 310, 
					  			 this.MenuItems[this.selection%4].positionY - 40, 620, 80);
		GCCT.fillStyle = "AliceBlue";
		GCCT.fillRect(this.MenuItems[2].positionX + 63, 
								   this.MenuItems[2].positionY - 25, 81, 50);
		this.RenderMenuItem(2);
	},

	Left : function() {
		if(this.state == "MazeLengthSetting") {
			this.MazeLength -= 10;
			if(this.MazeLength < this.MinMazeLength) {
				this.MazeLength = this.MinMazeLength;
			}
			this.MenuItems[0].name = "迷宮長度 : " + this.MazeLength;
			this.ClearMenuItem(0);
			this.OnMazeLengthSelect();
		}
		else if(this.state == "MazeWidthSetting" ) {
			this.MazeWidth -= 10;
			if(this.MazeWidth < this.MinMazeWidth) {
				this.MazeWidth = this.MinMazeWidth;
			}
			this.MenuItems[1].name = "迷宮寬度 : " + this.MazeWidth;
			this.ClearMenuItem(1);
			this.OnMazeWidthSelect();
		}
		else if(this.state == "MazeHeightSetting") {
			this.MazeHeight -= 10;
			if(this.MazeHeight < this.MinMazeHeight) {
				this.MazeHeight = this.MinMazeHeight;
			}
			this.MenuItems[2].name = "迷宮高度 : " + (this.MazeHeight >= 10 ? "" : "0") + this.MazeHeight;
			this.ClearMenuItem(2);
			this.OnMazeHeightSelect();
		}
	},

	Up : function() {
		if(this.state == "OptionSelect") {
			this.UnSelect();
			if(this.selection == 0) {
				this.selection = 3;
			}
			else {
				--this.selection;
			}
			this.OnSelect();
		}
		else if(this.state == "MazeLengthSetting") {
			++this.MazeLength;
			if(this.MazeLength > this.MaxMazeLength) {
				this.MazeLength = this.MaxMazeLength;
			}
			this.MenuItems[0].name = "迷宮長度 : " + this.MazeLength;
			this.ClearMenuItem(0);
			this.OnMazeLengthSelect();
		}
		else if(this.state == "MazeWidthSetting" ) {
			++this.MazeWidth;
			if(this.MazeWidth > this.MaxMazeWidth) {
				this.MazeWidth = this.MaxMazeWidth;
			}
			this.MenuItems[1].name = "迷宮寬度 : " + this.MazeWidth;
			this.ClearMenuItem(1);
			this.OnMazeWidthSelect();
		}
		else if(this.state == "MazeHeightSetting") {
			++this.MazeHeight;
			if(this.MazeHeight > this.MaxMazeHeight) {
				this.MazeHeight = this.MaxMazeHeight;
			}
			this.MenuItems[2].name = "迷宮高度 : " + (this.MazeHeight >= 10 ? "" : "0") + this.MazeHeight;
			this.ClearMenuItem(2);
			this.OnMazeHeightSelect();
		}
	},

	Right : function() {
		if(this.state == "MazeLengthSetting") {
			this.MazeLength += 10;
			if(this.MazeLength > this.MaxMazeLength) {
				this.MazeLength = this.MaxMazeLength;
			}
			this.MenuItems[0].name = "迷宮長度 : " + this.MazeLength;
			this.ClearMenuItem(0);
			this.OnMazeLengthSelect();
		}
		else if(this.state == "MazeWidthSetting" ) {
			this.MazeWidth += 10;
			if(this.MazeWidth > this.MaxMazeWidth) {
				this.MazeWidth = this.MaxMazeWidth;
			}
			this.MenuItems[1].name = "迷宮寬度 : " + this.MazeWidth;
			this.ClearMenuItem(1);
			this.OnMazeWidthSelect();
		}
		else if(this.state == "MazeHeightSetting") {
			this.MazeHeight += 10;
			if(this.MazeHeight > this.MaxMazeHeight) {
				this.MazeHeight = this.MaxMazeHeight;
			}
			this.MenuItems[2].name = "迷宮高度 : " + (this.MazeHeight >= 10 ? "" : "0") + this.MazeHeight;
			this.ClearMenuItem(2);
			this.OnMazeHeightSelect();
		}
	},

	Down : function() {
		if(this.state == "OptionSelect") {
			this.UnSelect();
			if(this.selection == 3) {
				this.selection = 0;
			}
			else {
				++this.selection;
			}
			this.OnSelect();
		}
		else if(this.state == "MazeLengthSetting") {
			--this.MazeLength;
			if(this.MazeLength < this.MinMazeLength) {
				this.MazeLength = this.MinMazeLength;
			}
			this.MenuItems[0].name = "迷宮長度 : " + this.MazeLength;
			this.ClearMenuItem(0);
			this.OnMazeLengthSelect();
		}
		else if(this.state == "MazeWidthSetting" ) {
			--this.MazeWidth;
			if(this.MazeWidth < this.MinMazeWidth) {
				this.MazeWidth = this.MinMazeWidth;
			}
			this.MenuItems[1].name = "迷宮寬度 : " + this.MazeWidth;
			this.ClearMenuItem(1);
			this.OnMazeWidthSelect();
		}
		else if(this.state == "MazeHeightSetting") {
			--this.MazeHeight;
			if(this.MazeHeight < this.MinMazeHeight) {
				this.MazeHeight = this.MinMazeHeight;
			}
			this.MenuItems[2].name = "迷宮高度 : " + (this.MazeHeight >= 10 ? "" : "0") + this.MazeHeight;
			this.ClearMenuItem(2);
			this.OnMazeHeightSelect();
		}
	},

	Enter : function() {
		this.clear();
		return this.selection;
	},

	MazeLengthSetting : function() {
		this.UnSelect();
	},

	MazeWidthSetting : function() {
		this.UnSelect();
	},

	MazeHeightSetting : function() {
		this.UnSelect();
	},

	CancelSetting : function() {
		this.OnSelect();
	}
};

var GameScene = { 	
	maze : ThinWallMazeToThickWallMazeConverter(ThinWallMazeGenerator(10,10,5)),
	SL : 120, 																								// SideLength
	SLPlus : 121,
	HalfSL : 60,
	FixedSL : 120,
	HalfFixedSL : 60,
	SkillGrid1X : innerWidth - 3*this.HalfFixSL,
	SkillGrid2X : innerWidth - this.HalfFixSL,
	SkillGridY : innerHeight - this.HalfFixSL,
	SkillCDLoopRadius : 1.2*this.HalfFixSL,
	CenterGridLeftTopX : centerX - this.HalfSL,
	CenterGridLeftTopY : centerY - this.HalfSL,

	// times : 0,
	ViewScope : "unknown",
	ChangeItemAnimationRequest : false,
	// GoUpAnimationRequest : false,
	// GoDownAnimationRequest : false,
	// AnimationTimes : 60,
	ItemChangeDirection :　"unknown",
	SetSL : function(ArgSL) {
		this.SL = ArgSL;
		this.SLPlus = this.SL + 1;
		this.HalfSL = this.SL/2;
		this.CenterGridLeftTopX = centerX - this.HalfSL;
		this.CenterGridLeftTopY = centerY - this.HalfSL;
	},
	SetFixedSL : function(ArgSL) {
		this.FixedSL = ArgSL;
		this.HalfFixedSL = this.FixedSL/2;
		this.SkillGrid1X = innerWidth - 3*this.HalfFixedSL;
		this.SkillGrid2X = innerWidth - this.HalfFixedSL;
		this.SkillGridY = innerHeight - this.HalfFixedSL;
		this.SkillCDLoopRadius = 1.2*this.HalfFixedSL;
	},
	UpdateMaze : function(length, width, height) {
		this.maze = ThinWallMazeToThickWallMazeConverter(ThinWallMazeGenerator(length, width, height));
	},
	GetMaze : function() {
		return this.maze;
	},

	// 暫不支援z軸
	// render : function() {
	// 	GCCT.strokeStyle = "RGB(180,180,180)";
	// 	for(var x = 0; x < this.maze.length; ++x) {
	// 		for(var y = 0; y < this.maze[x].length; ++y) {
	// 			GCCT.beginPath();
	// 			if(this.maze[x][y].top == false) {
	// 				GCCT.moveTo(x*GC.width/this.maze.length,y*GC.width/this.maze[x].length);
	// 				GCCT.lineTo(x*GC.width/this.maze.length + GC.width/this.maze.length,y*GC.width/this.maze[x].length);
	// 			}
	// 			if(this.maze[x][y].right == false) {
	// 				GCCT.moveTo(x*GC.width/this.maze.length + GC.width/this.maze.length,y*GC.width/this.maze[x].length);
	// 				GCCT.lineTo(x*GC.width/this.maze.length + GC.width/this.maze.length,y*GC.width/this.maze[x].length + GC.width/this.maze[x].length);
	// 			}
	// 			if(this.maze[x][y].down == false) {
	// 				GCCT.moveTo(x*GC.width/this.maze.length + GC.width/this.maze.length,y*GC.width/this.maze[x].length + GC.width/this.maze[x].length);
	// 				GCCT.lineTo(x*GC.width/this.maze.length,y*GC.width/this.maze[x].length + GC.width/this.maze[x].length);
	// 			}
	// 			if(this.maze[x][y].left == false) {
	// 				GCCT.moveTo(x*GC.width/this.maze.length,y*GC.width/this.maze[x].length + GC.width/this.maze[x].length);
	// 				GCCT.lineTo(x*GC.width/this.maze.length,y*GC.width/this.maze[x].length);
	// 			}
	// 			GCCT.stroke();
	// 		}
	// 	}			
	// },
	AllBlack : function() {
		GCCT.fillStyle = "Black";
		GCCT.fillRect(0,0,GC.width,GC.height);
	},

	UpdateViewScope : function(role) {
		var RoleFloorX = Math.floor(role.getX());
		var RoleFloorY = Math.floor(role.getY());
		var RoleIntZ = Math.round(role.getZ());
		var offsetX = role.getX() - RoleFloorX;
		var offsetY = role.getY() - RoleFloorY;
		var offsetZ = role.getZ() - Math.floor(role.getZ());
		var RoleViewScope = role.GetViewScope();

		// 地圖重繪
		GCCT.fillStyle = "White";
		GCCT.fillRect(centerX - this.SL*RoleViewScope, centerY - this.SL*RoleViewScope, this.SL*RoleViewScope*2, this.SL*RoleViewScope*2);

		// Skill1技能格重繪
		GCCT.beginPath();
		GCCT.strokeStyle = "Black";
		GCCT.fillStyle = "Black";
		GCCT.arc(this.SkillGrid1X, this.SkillGridY, this.SkillCDLoopRadius, 0, DoublePI);
		GCCT.stroke();
		GCCT.fill();

		// Skill2技能格重繪
		GCCT.beginPath();
		GCCT.strokeStyle = "Black";
		GCCT.fillStyle = "Black";
		GCCT.arc(this.SkillGrid2X, this.SkillGridY, this.SkillCDLoopRadius, 0, DoublePI);
		GCCT.stroke();
		GCCT.fill();

		// 地圖繪製
		// GCCT.strokeStyle = "Black";
		// GCCT.lineWidth = 1;
		// GCCT.lineCap = "round";
		// GCCT.beginPath();
		for(var x = -Math.ceil(RoleViewScope); x <= Math.round(RoleViewScope)+1; ++x) {
			for(var y = -Math.ceil(RoleViewScope); y <= Math.round(RoleViewScope)+1; ++y) {
				if(RoleFloorY + y == -1 && RoleFloorX + x >= 0 && RoleFloorX + x <= this.maze[RoleIntZ].length - 1) {
					GCCT.drawImage(OutOfMazeWall, this.CenterGridLeftTopX + (x-offsetX)*this.SL, this.CenterGridLeftTopY + (y-offsetY)*this.SL,  this.SLPlus, this.SLPlus);
				}
				else if(RoleFloorY + y == this.maze[RoleIntZ][RoleFloorX].length-1 && RoleFloorX + x >= 0 && RoleFloorX + x <= this.maze[RoleIntZ].length - 1) {
					GCCT.drawImage(WallOutOfMaze, this.CenterGridLeftTopX + (x-offsetX)*this.SL, this.CenterGridLeftTopY + (y-offsetY)*this.SL,  this.SLPlus, this.SLPlus);
				}
				else if(RoleFloorY + y < -1 || RoleFloorY + y > this.maze[RoleIntZ][RoleFloorX].length-1 || RoleFloorX + x < 0 || RoleFloorX + x > this.maze[RoleIntZ].length - 1) {
					GCCT.drawImage(OutOfMaze, this.CenterGridLeftTopX + (x-offsetX)*this.SL, this.CenterGridLeftTopY + (y-offsetY)*this.SL,  this.SLPlus, this.SLPlus);			// +1用來填補firefox與ie抗鋸齒所造成的gap
				}
				else if(this.maze[RoleIntZ][RoleFloorX + x][RoleFloorY + y].object == "wall") {
					if(RoleFloorY + y + 1 > this.maze[RoleIntZ][RoleFloorX + x].length - 1 || this.maze[RoleIntZ][RoleFloorX + x][RoleFloorY + y + 1].object == "wall") {
						GCCT.drawImage(MazeWall, this.CenterGridLeftTopX + (x-offsetX)*this.SL, this.CenterGridLeftTopY + (y-offsetY)*this.SL,  this.SLPlus, this.SLPlus);
					}
					else {
						GCCT.drawImage(MazeFrontWall, this.CenterGridLeftTopX + (x-offsetX)*this.SL, this.CenterGridLeftTopY + (y-offsetY)*this.SL,  this.SLPlus, this.SLPlus);
					}
				}
				else if(this.maze[RoleIntZ][RoleFloorX + x][RoleFloorY + y].object == "PassageDown") {
					if(this.maze[RoleIntZ][RoleFloorX + x][RoleFloorY + y - 1].object != "wall") {
						GCCT.drawImage(MazeWallDownPassageDown, this.CenterGridLeftTopX + (x-offsetX)*this.SL, this.CenterGridLeftTopY + (y-offsetY)*this.SL,  this.SLPlus, this.SLPlus);
					}
					else if(this.maze[RoleIntZ][RoleFloorX + x + 1][RoleFloorY + y].object != "wall") {
						GCCT.drawImage(MazeWallLeftPassageDown, this.CenterGridLeftTopX + (x-offsetX)*this.SL, this.CenterGridLeftTopY + (y-offsetY)*this.SL,  this.SLPlus, this.SLPlus);
					}
					else if(this.maze[RoleIntZ][RoleFloorX + x][RoleFloorY + y + 1].object != "wall") {
						GCCT.drawImage(MazeWallUpPassageDown, this.CenterGridLeftTopX + (x-offsetX)*this.SL, this.CenterGridLeftTopY + (y-offsetY)*this.SL,  this.SLPlus, this.SLPlus);
					}
					else if(this.maze[RoleIntZ][RoleFloorX + x - 1][RoleFloorY + y].object != "wall") {
						GCCT.drawImage(MazeWallRightPassageDown, this.CenterGridLeftTopX + (x-offsetX)*this.SL, this.CenterGridLeftTopY + (y-offsetY)*this.SL,  this.SLPlus, this.SLPlus);							
					}
				}
				else if(this.maze[RoleIntZ][RoleFloorX + x][RoleFloorY + y].object == "PassageUp" ) {
					if(this.maze[RoleIntZ][RoleFloorX + x][RoleFloorY + y - 1].object != "wall") {
						GCCT.drawImage(MazeWallDownPassageUp, this.CenterGridLeftTopX + (x-offsetX)*this.SL, this.CenterGridLeftTopY + (y-offsetY)*this.SL,  this.SLPlus, this.SLPlus);
					}
					else if(this.maze[RoleIntZ][RoleFloorX + x + 1][RoleFloorY + y].object != "wall") {
						GCCT.drawImage(MazeWallLeftPassageUp, this.CenterGridLeftTopX + (x-offsetX)*this.SL, this.CenterGridLeftTopY + (y-offsetY)*this.SL,  this.SLPlus, this.SLPlus);
					}
					else if(this.maze[RoleIntZ][RoleFloorX + x][RoleFloorY + y + 1].object != "wall") {
						GCCT.drawImage(MazeWallUpPassageUp, this.CenterGridLeftTopX + (x-offsetX)*this.SL, this.CenterGridLeftTopY  - 2*this.SL/3 + (y-offsetY)*this.SL,  this.SLPlus, 5*this.SL/3+1);
					}
					else if(this.maze[RoleIntZ][RoleFloorX + x - 1][RoleFloorY + y].object != "wall") {
						GCCT.drawImage(MazeWallRightPassageUp, this.CenterGridLeftTopX + (x-offsetX)*this.SL, this.CenterGridLeftTopY + (y-offsetY)*this.SL,  this.SLPlus, this.SLPlus);							
					}
				}
				else {
					if(this.maze[RoleIntZ][RoleFloorX + x][RoleFloorY + y - 1].object == "wall") {
						GCCT.drawImage(MazeWallFloor, this.CenterGridLeftTopX + (x-offsetX)*this.SL, this.CenterGridLeftTopY + (y-offsetY)*this.SL,  this.SLPlus, this.SLPlus);
					}
					else {
						GCCT.drawImage(MazeFloor, this.CenterGridLeftTopX + (x-offsetX)*this.SL, this.CenterGridLeftTopY + (y-offsetY)*this.SL,  this.SLPlus, this.SLPlus);
					}
				}
			}
		}
		// GCCT.stroke();
		// 地圖上物件繪製
		for(var i = 0; i <= WaitDrawObjects.objects.length-1; ++i) {
			GCCT.save();
			WaitDrawObjects.objects[i].update();
			WaitDrawObjects.objects[i].DrawingSetting();
			if(Math.round(WaitDrawObjects.objects[i].getZ()) == RoleIntZ && Math.abs(WaitDrawObjects.objects[i].getX() - role.getX()) <= RoleViewScope && Math.abs(WaitDrawObjects.objects[i].getY() - role.getY()) <= RoleViewScope && WaitDrawObjects.objects[i].GetState() == "visible") {
				GCCT.drawImage(WaitDrawObjects.objects[i].GetImage(), this.CenterGridLeftTopX + this.SL*(WaitDrawObjects.objects[i].getX() - role.getX()), this.CenterGridLeftTopY + this.SL*(WaitDrawObjects.objects[i].getY() - role.getY()), this.SL, this.SL);
			}
			GCCT.restore();
		}
		WaitDrawObjects.check();

		// 無論是否隱形自己至少看的到自己
		if(role.GetState() == "invisible") {
			GCCT.save();
			GCCT.globalAlpha = 0.1;
			GCCT.drawImage(role.GetImage(), this.CenterGridLeftTopX, this.CenterGridLeftTopY, this.SL, this.SL);
			GCCT.restore();
		}

		// 蓋過地圖上物件的牆繪製
		GCCT.save();
		for(var x = -Math.ceil(RoleViewScope); x <= Math.round(RoleViewScope)+1; ++x) {
			for(var y = -Math.ceil(RoleViewScope); y <= Math.round(RoleViewScope)+1; ++y) {
				if(RoleFloorY + y >= 0 && RoleFloorY + y <= this.maze[RoleIntZ][RoleFloorX].length - 1 && RoleFloorX + x >= 0 && RoleFloorX + x <= this.maze[RoleIntZ].length - 1 && this.maze[RoleIntZ][RoleFloorX + x][RoleFloorY + y].object != "wall" && this.maze[RoleIntZ][RoleFloorX + x][RoleFloorY + y + 1].object == "wall") {
					GCCT.drawImage(MazeFloorWall,this.CenterGridLeftTopX + (x-offsetX)*this.SL, this.CenterGridLeftTopY + (y-offsetY)*this.SL,  this.SLPlus, this.SLPlus);
				}
			}
		}
		GCCT.restore();

		//視野漸層效果繪製
		// console.log(RoleViewScope);
		var grd = GCCT.createRadialGradient(centerX, centerY, this.HalfSL, centerX, centerY, this.SL*RoleViewScope);
		grd.addColorStop(0, "RGBA(0,0,0,0)");
		grd.addColorStop(1, "RGBA(0,0,0,1)");
		GCCT.fillStyle = grd;
		GCCT.beginPath();
		GCCT.arc(centerX, centerY, this.SL*(RoleViewScope), 0, 2*Math.PI);
		GCCT.stroke();
		GCCT.fill();
		GCCT.fillStyle = "Black";
		GCCT.rect(centerX+this.SL*(RoleViewScope+2)+1.5*this.FixedSL,centerY-this.SL*(RoleViewScope+2)-1.5*this.FixedSL,-2*(this.SL*(RoleViewScope+2)+1.5*this.FixedSL),2*(this.SL*(RoleViewScope+2) + 1.5*this.FixedSL));
		GCCT.fill();

		// 上樓動畫繪製
		if(this.GoUpAnimationRequest == true) {
			if(this.ViewScope == "unknown") {
				this.ViewScope = RoleViewScope;
			}
			GCCT.save();
			GCCT.beginPath();
			if(offsetZ <= 0.5) {
				role.SetViewScope(this.ViewScope + 4*offsetZ);
				RoleViewScope = role.GetViewScope();
				GameScene.SetSL(4*(window.innerHeight*window.devicePixelRatio)/2/5/(RoleViewScope));
				GCCT.globalAlpha = 2*offsetZ;
			}
			else {
				role.SetViewScope(this.ViewScope - (this.ViewScope-1)*(2-2*offsetZ));
				RoleViewScope = role.GetViewScope();
				GameScene.SetSL(4*(window.innerHeight*window.devicePixelRatio)/2/5/(RoleViewScope));
				GCCT.globalAlpha = 2-2*offsetZ;
			}
			GCCT.strokeStyle = "White";
			grd.addColorStop(0, "RGBA(255,255,255,1)");
			grd.addColorStop(1, "RGBA(255,255,255,0.5)");
			GCCT.fillStyle = grd;
			GCCT.arc(centerX, centerY, this.SL*(RoleViewScope), 0, 2*Math.PI);
			GCCT.fill();
			GCCT.restore();
		}

		// 下樓動畫繪製
		if(this.GoDownAnimationRequest == true) {
			if(this.ViewScope == "unknown") {
				this.ViewScope = RoleViewScope;
			}
			GCCT.save();
			GCCT.beginPath();
			if(offsetZ >= 0.5) {
				role.SetViewScope(this.ViewScope - (this.ViewScope-1)*(2-2*offsetZ));
				RoleViewScope = role.GetViewScope();
				GameScene.SetSL(4*(window.innerHeight*window.devicePixelRatio)/2/5/(RoleViewScope));
				GCCT.globalAlpha = 2-2*offsetZ;
			}
			else {
				role.SetViewScope(this.ViewScope + 4*offsetZ);
				RoleViewScope = role.GetViewScope();
				GameScene.SetSL(4*(window.innerHeight*window.devicePixelRatio)/2/5/(RoleViewScope));
				GCCT.globalAlpha = 2*offsetZ;
			}
			GCCT.strokeStyle = "White";
			grd.addColorStop(0, "RGBA(255,255,255,1)");
			grd.addColorStop(1, "RGBA(255,255,255,0.5)");
			GCCT.fillStyle = grd;
			GCCT.arc(centerX, centerY, this.SL*(RoleViewScope), 0, 2*Math.PI);
			GCCT.fill();
			GCCT.restore();
		}

		// Skill1技能格繪製
		GCCT.beginPath();
		if(role.GetSkill1CD() != 0) {
			GCCT.strokeStyle = "White";
			GCCT.lineWidth = 4;
			GCCT.arc(innerWidth - 3*this.FixedSL/2,innerHeight - this.FixedSL/2, this.FixedSL/2, 0, 2*Math.PI*role.GetSkill1CD()/role.GetMaxSkill1CD());
			GCCT.stroke();
		}
		GCCT.drawImage(role.GetSkill1Image(), innerWidth - 2*this.FixedSL, innerHeight - this.FixedSL, this.FixedSL, this.FixedSL);
		
		// Skill2技能格繪製
		GCCT.beginPath();
		if(role.GetSkill2CD() != 0) {
			GCCT.strokeStyle = "White";
			GCCT.lineWidth = 4;
			GCCT.arc(innerWidth - this.FixedSL/2, innerHeight - this.FixedSL/2, this.FixedSL/2, 0, 2*Math.PI*role.GetSkill2CD()/role.GetMaxSkill2CD());
			GCCT.stroke();
		}
		GCCT.drawImage(role.GetSkill2Image(), innerWidth - this.FixedSL, innerHeight - this.FixedSL, this.FixedSL, this.FixedSL);

		// 玩家擁有物品繪製
		for(var i = -2; i <= 5; ++i) {
			if(role.GetItem(i+2) != "NoItem") {
				GCCT.drawImage(role.GetItem(i+2).GetImage(), this.CenterGridLeftTopX + this.SL*(RoleViewScope+0.5)*Math.cos(2*Math.PI/8*(i)),this.CenterGridLeftTopY + this.SL*(RoleViewScope+0.5)*Math.sin(2*Math.PI/8*(i)),this.FixedSL,this.FixedSL);
			}
		}

		// 物品環繪製
		GCCT.save();
		for(var i = -2; i <= 5; ++i) {
			if(i == -2) {
				GCCT.globalAlpha = 1;
			}
			else {
				GCCT.globalAlpha = 0.2;
			}
			GCCT.drawImage(ItemBorder, centerX - this.FixedSL/2 + (this.SL*(RoleViewScope) + this.FixedSL/3)*Math.cos(2*Math.PI/8*i + AngleOffset/360*2*Math.PI),centerY - this.FixedSL/2 + (this.SL*(RoleViewScope) + this.FixedSL/3 )*Math.sin(2*Math.PI/8*i + AngleOffset/360*2*Math.PI),this.FixedSL,this.FixedSL);
		}
		GCCT.restore();

		// 物品環選轉效果繪製
		if(this.ChangeItemAnimationRequest == true) {
			if(this.ItemChangeDirection == "clockwise") {
				AngleOffset += 5;
			}
			else {
				AngleOffset -= 5;
			}
			if(AngleOffset % 45 == 0) {
				this.ChangeItemAnimationRequest = false;
				if(AngleOffset % 360 == 0) {
					AngleOffset = 0;
				}
			}
		}
	},
};