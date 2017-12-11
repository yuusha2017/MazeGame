var GameMenuScene = {
	selection : 0,
	MenuItems : [new MenuItem("開始探險", centerX, GC.height/7 * 3),
			     new MenuItem("多人連線", centerX, GC.height/7 * 4),
				 new MenuItem("探險準備", centerX, GC.height/7 * 5),
				 new MenuItem("設定", 	centerX, GC.height/7 * 6)],	
	RecreateMenuItems : function() {
		this.MenuItems = [new MenuItem("開始探險", centerX, GC.height/7 * 3),
						  new MenuItem("多人連線", centerX, GC.height/7 * 4),
						  new MenuItem("探險準備", centerX, GC.height/7 * 5),
						  new MenuItem("設定", 	 centerX, GC.height/7 * 6)];
	},
	GetSelection : function() {
		return this.selection;
	},
	render : function() {
		// 畫背景
		GCCT.fillStyle = MyGray;
		GCCT.fillRect(0,0,GC.width,GC.height);

		// 畫標題
		GCCT.strokeStyle = "Brown";
		GCCT.font = "80px verdana";
		GCCT.textAlign = "center";
		GCCT.textBaseline = "middle"; 
		GCCT.strokeText("未知迷攻", centerX, GC.height/7);

		// 畫選單
		GCCT.strokeStyle = "Black";
		GCCT.font = "40px verdana";
		for(i = 0; i < this.MenuItems.length; ++i) {
			GCCT.strokeText(this.MenuItems[i].name, this.MenuItems[i].x, this.MenuItems[i].y);
		}	
		this.OnSelect();
    },
	clear : function() {
		GCCT.fillStyle = "White";
		GCCT.fillRect(0, 0, GC.width, GC.height);
    },
	OnSelect : function() {
		var width = 2*GCCT.measureText("開始探險").width;
		var height = 1.2*GCCT.measureText("開").width;
		var text = this.MenuItems[this.selection].name;
		var centerX = this.MenuItems[this.selection].x;
		var centerY = this.MenuItems[this.selection].y;
        GCCT.fillStyle = "AliceBlue";
		GCCT.fillRect(centerX - width/2, centerY - height/2, width, 1.1*height);	// 高度有點不對稱，所以乘上1.1
		GCCT.strokeText(text, centerX, centerY);
	},
	UnSelect : function() {
		var width = 2*GCCT.measureText("開始探險").width+1;
		var height = 1.2*GCCT.measureText("開").width+1;
		var text = this.MenuItems[this.selection].name;
		var centerX = this.MenuItems[this.selection].x;
		var centerY = this.MenuItems[this.selection].y;
		GCCT.fillStyle = MyGray;
		GCCT.fillRect(centerX - width/2, centerY - height/2, width, 1.1*height);	// 高度有點不對稱，所以乘上1.1
		GCCT.strokeText(text, centerX, centerY);
	},
	Down : function() {
		this.UnSelect();
		this.selection = (this.selection == this.MenuItems.length-1) ? 0 : (this.selection + 1);
		this.OnSelect();
	},
	Up : function() {
		this.UnSelect();
		this.selection = (this.selection == 0) ? (this.MenuItems.length-1) : (this.selection - 1);
		this.OnSelect();
	}
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
				 new MenuItem("迷宮高度 : " + ((this.MazeHeight >= 10) ? "" : "0") + this.MazeHeight, centerX, GC.height*4.5/7),
				 new MenuItem("返回", centerX, GC.height*6/7)],
	RecreateMenuItems : function() {
		this.MenuItems = [new MenuItem("迷宮長度 : " + this.MazeLength, centerX, GC.height*3/7),
			 			  new MenuItem("迷宮寬度 : " + this.MazeWidth, centerX, GC.height*3.75/7),
						  new MenuItem("迷宮高度 : " + ((this.MazeHeight >= 10) ? "" : "0") + this.MazeHeight, centerX, GC.height*4.5/7),
						  new MenuItem("返回", centerX, GC.height*6/7)];
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
		// 畫背景
		GCCT.fillStyle = MyGray;
		GCCT.fillRect(0,0,GC.width,GC.height);

		// 畫標題
		GCCT.strokeStyle = "Blue";
		GCCT.font = "60px verdana";
		GCCT.textAlign = "center";
		GCCT.textBaseline = "middle"; 
		GCCT.strokeText("Option", centerX, GC.height/7);

		// 畫選單
		GCCT.strokeStyle = "Black";
		GCCT.font = "40px verdana";
		for(i = 0; i < this.MenuItems.length; ++i) {
			GCCT.strokeText(this.MenuItems[i].name, this.MenuItems[i].x, this.MenuItems[i].y);
		}
		if(this.state == "OptionSelect") {
			this.OnSelect();
		}
		else {
			this.OnMazeValueSelect();
		}
	},
	OnSelect : function() {
		this.state = "OptionSelect";
		var width = 2*GCCT.measureText("迷宮長度 : 25").width;
		var height = 1.2*GCCT.measureText("迷").width;
		var text = this.MenuItems[this.selection].name;
		var centerX = this.MenuItems[this.selection].x;
		var centerY = this.MenuItems[this.selection].y;
        GCCT.fillStyle = "AliceBlue";
		GCCT.fillRect(centerX - width/2, centerY - height/2, width, 1.1*height); 	// 高度有點不對稱，所以乘上1.1
		GCCT.strokeText(text, centerX, centerY);
	},
	UnSelect : function() {
		var width = 2*GCCT.measureText("迷宮長度 : 25").width+1;
		var height = 1.2*GCCT.measureText("迷").width+1;
		var text = this.MenuItems[this.selection].name;
		var centerX = this.MenuItems[this.selection].x;
		var centerY = this.MenuItems[this.selection].y;
		GCCT.fillStyle = MyGray;
		GCCT.fillRect(centerX - width/2, centerY - height/2, width, 1.1*height); 	// 高度有點不對稱，所以乘上1.1
		GCCT.strokeText(text, centerX, centerY);
	},
	OnMazeValueSelect : function() {
		this.state = "MazeValueSetting";
		var width = 1.5*GCCT.measureText("25").width;
		var offsetX = GCCT.measureText("度 : 2").width-8;
		var height = 1.2*GCCT.measureText("迷").width;
		var text = this.MenuItems[this.selection].name;
		var centerX = this.MenuItems[this.selection].x;
		var centerY = this.MenuItems[this.selection].y;
		GCCT.fillStyle = "AliceBlue";
		GCCT.fillRect(centerX + offsetX - width/2, centerY - height/2, width, 1.1*height);
		GCCT.strokeText(text, centerX, centerY);
	},
	Left : function() {
		if(this.state != "MazeValueSetting") {
			return;
		}
		if(this.selection == 0) {
			this.MazeLength = (this.MazeLength - 10 < this.MinMazeLength) ? this.MinMazeLength : (this.MazeLength - 10);
			this.MenuItems[0].name = "迷宮長度 : " + this.MazeLength;
		}
		else if(this.selection == 1) {
			this.MazeWidth = (this.MazeWidth - 10 < this.MinMazeWidth) ? this.MinMazeWidth : (this.MazeWidth - 10);
			this.MenuItems[1].name = "迷宮寬度 : " + this.MazeWidth;
		}
		else if(this.selection == 2) {
			this.MazeHeight = (this.MazeHeight - 10 < this.MinMazeHeight) ? this.MinMazeHeight : (this.MazeHeight - 10);
			this.MenuItems[2].name = "迷宮高度 : " + (this.MazeHeight >= 10 ? "" : "0") + this.MazeHeight;
		}
		this.UnSelect();
		this.OnMazeValueSelect();
	},
	Up : function() {
		if(this.state == "OptionSelect") {
			this.UnSelect();
			this.selection = (this.selection == 0) ? (this.MenuItems.length - 1) : (this.selection - 1);
			this.OnSelect();
			return;
		}
		else if(this.selection == 0) {
			this.MazeLength = ((this.MazeLength + 1) > this.MaxMazeLength) ? this.MaxMazeLength : (this.MazeLength + 1);
			this.MenuItems[0].name = "迷宮長度 : " + this.MazeLength;
		}
		else if(this.selection == 1) {
			this.MazeWidth = ((this.MazeWidth + 1) > this.MaxMazeWidth) ? this.MaxMazeWidth : (this.MazeWidth + 1);
			this.MenuItems[1].name = "迷宮寬度 : " + this.MazeWidth;
		}
		else if(this.selection == 2) {
			this.MazeHeight = ((this.MazeHeight + 1) > this.MaxMazeHeight) ? this.MaxMazeHeight : (this.MazeHeight + 1);
			this.MenuItems[2].name = "迷宮高度 : " + (this.MazeHeight >= 10 ? "" : "0") + this.MazeHeight;
		}
		this.UnSelect();
		this.OnMazeValueSelect();
	},
	Right : function() {
		if(this.state != "MazeValueSetting") {
			return;
		}
		if(this.selection == 0) {
			this.MazeLength = (this.MazeLength + 10 > this.MaxMazeLength) ? this.MaxMazeLength : (this.MazeLength + 10);
			this.MenuItems[0].name = "迷宮長度 : " + this.MazeLength;
		}
		else if(this.selection == 1) {
			this.MazeWidth = (this.MazeWidth + 10 > this.MaxMazeWidth) ? this.MaxMazeWidth : (this.MazeWidth + 10);
			this.MenuItems[1].name = "迷宮寬度 : " + this.MazeWidth;
		}
		else if(this.selection == 2) {
			this.MazeHeight = (this.MazeHeight + 10 > this.MaxMazeHeight) ? this.MaxMazeHeight : (this.MazeHeight + 10);
			this.MenuItems[2].name = "迷宮高度 : " + (this.MazeHeight >= 10 ? "" : "0") + this.MazeHeight;
		}
		this.UnSelect();
		this.OnMazeValueSelect();
	},
	Down : function() {
		if(this.state == "OptionSelect") {
			this.UnSelect();
			this.selection = (this.selection == this.MenuItems.length-1) ? 0 : (this.selection + 1);
			this.OnSelect();
			return;
		}
		else if(this.selection == 0) {
			this.MazeLength = ((this.MazeLength - 1) < this.MinMazeLength) ? this.MinMazeLength : (this.MazeLength - 1);
			this.MenuItems[0].name = "迷宮長度 : " + this.MazeLength;
		}
		else if(this.selection == 1) {
			this.MazeWidth = ((this.MazeWidth - 1) < this.MinMazeWidth) ? this.MinMazeWidth : (this.MazeWidth - 1);
			this.MenuItems[1].name = "迷宮寬度 : " + this.MazeWidth;
		}
		else if(this.selection == 2) {
			this.MazeHeight = ((this.MazeHeight - 1) < this.MinMazeHeight) ? this.MinMazeHeight : (this.MazeHeight - 1);
			this.MenuItems[2].name = "迷宮高度 : " + (this.MazeHeight >= 10 ? "" : "0") + this.MazeHeight;
		}
		this.UnSelect();
		this.OnMazeValueSelect();
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
	ViewScope : "unknown",
	ChangeItemAnimationRequest : false,
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
		for(x = -Math.ceil(RoleViewScope); x <= Math.round(RoleViewScope)+1; ++x) {
			for(y = -Math.ceil(RoleViewScope); y <= Math.round(RoleViewScope)+1; ++y) {
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
		// 地圖上物件繪製
		for(i = 0; i <= WaitDrawObjects.objects.length-1; ++i) {
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
		for(x = -Math.ceil(RoleViewScope); x <= Math.round(RoleViewScope)+1; ++x) {
			for(y = -Math.ceil(RoleViewScope); y <= Math.round(RoleViewScope)+1; ++y) {
				if(RoleFloorY + y >= 0 && RoleFloorY + y <= this.maze[RoleIntZ][RoleFloorX].length - 1 && RoleFloorX + x >= 0 && RoleFloorX + x <= this.maze[RoleIntZ].length - 1 && this.maze[RoleIntZ][RoleFloorX + x][RoleFloorY + y].object != "wall" && this.maze[RoleIntZ][RoleFloorX + x][RoleFloorY + y + 1].object == "wall") {
					GCCT.drawImage(MazeFloorWall,this.CenterGridLeftTopX + (x-offsetX)*this.SL, this.CenterGridLeftTopY + (y-offsetY)*this.SL,  this.SLPlus, this.SLPlus);
				}
			}
		}
		GCCT.restore();

		//視野漸層效果繪製
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
			GCCT.save();
			GCCT.strokeStyle = "White";
			GCCT.lineWidth = 4;
			GCCT.arc(innerWidth - 3*this.FixedSL/2,innerHeight - this.FixedSL/2, this.FixedSL/2, 0, 2*Math.PI*role.GetSkill1CD()/role.GetMaxSkill1CD());
			GCCT.stroke();
			GCCT.restore();
		}
		GCCT.drawImage(role.GetSkill1Image(), innerWidth - 2*this.FixedSL, innerHeight - this.FixedSL, this.FixedSL, this.FixedSL);
		
		// Skill2技能格繪製
		GCCT.beginPath();
		if(role.GetSkill2CD() != 0) {
			GCCT.save();
			GCCT.strokeStyle = "White";
			GCCT.lineWidth = 4;
			GCCT.arc(innerWidth - this.FixedSL/2, innerHeight - this.FixedSL/2, this.FixedSL/2, 0, 2*Math.PI*role.GetSkill2CD()/role.GetMaxSkill2CD());
			GCCT.stroke();
			GCCT.restore();
		}
		GCCT.drawImage(role.GetSkill2Image(), innerWidth - this.FixedSL, innerHeight - this.FixedSL, this.FixedSL, this.FixedSL);

		// 玩家擁有物品繪製
		for(i = -2; i <= 5; ++i) {
			if(role.GetItem(i+2) != "NoItem") {
				GCCT.drawImage(role.GetItem(i+2).GetImage(), this.CenterGridLeftTopX + this.SL*(RoleViewScope+0.5)*Math.cos(2*Math.PI/8*(i)),this.CenterGridLeftTopY + this.SL*(RoleViewScope+0.5)*Math.sin(2*Math.PI/8*(i)),this.FixedSL,this.FixedSL);
			}
		}

		// 物品環繪製
		GCCT.save();
		for(i = -2; i <= 5; ++i) {
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