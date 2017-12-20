// 遊戲主選單場景繪製物件
var GameMenuScene = {
	selection : 0,	// 選擇
	alpha : 0, // 透明度
	count : 0, // 計數
	LastTimeStamp : 0, // 計時距

	// 選單物件
	MenuItems : [new MenuItem("開始探險", centerX, GC.height/7 * 3),
			     new MenuItem("多人連線", centerX, GC.height/7 * 4),
				 new MenuItem("探險準備", centerX, GC.height/7 * 5),
				 new MenuItem("設定", 	centerX, GC.height/7 * 6)],	

	// 重建選單物件(更新位置)
	RecreateMenuItems : function() {
		this.MenuItems = [new MenuItem("開始探險", centerX, GC.height/7 * 3),
						  new MenuItem("多人連線", centerX, GC.height/7 * 4),
						  new MenuItem("探險準備", centerX, GC.height/7 * 5),
						  new MenuItem("設定", 	 centerX, GC.height/7 * 6)];
	},

	// 取得選擇
	GetSelection : function() {
		return this.selection;
	},

	// 繪製場景
	render : function() {
		// 畫背景
		GCCT.fillStyle = "RGB(210,210,210)";
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
		for(var i = 0; i < this.MenuItems.length; ++i) {
			GCCT.strokeText(this.MenuItems[i].name, this.MenuItems[i].x, this.MenuItems[i].y);
		}	
		this.OnSelect();
	},
	
	// 整個Canvas洗白
	clear : function() {
		GCCT.fillStyle = "White";
		GCCT.fillRect(0, 0, GC.width, GC.height);
	},
	
	// 凸顯選擇的項目
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

	// 不凸顯選擇的項目
	UnSelect : function() {
		var width = 2*GCCT.measureText("開始探險").width+1;
		var height = 1.2*GCCT.measureText("開").width+1;
		var text = this.MenuItems[this.selection].name;
		var centerX = this.MenuItems[this.selection].x;
		var centerY = this.MenuItems[this.selection].y;
		GCCT.fillStyle = "RGB(210,210,210)";
		GCCT.fillRect(centerX - width/2, centerY - height/2, width, 1.1*height);	// 高度有點不對稱，所以乘上1.1
		GCCT.strokeText(text, centerX, centerY);
	},

	// 上鍵處理函式
	Up : function() {
		this.UnSelect();
		this.selection = (this.selection == 0) ? (this.MenuItems.length-1) : (this.selection - 1);
		this.OnSelect();
	},

	// 下鍵處理函式
	Down : function() {
		this.UnSelect();
		this.selection = (this.selection == this.MenuItems.length-1) ? 0 : (this.selection + 1);
		this.OnSelect();
	},

	// 轉場
	transition : function(timestamp) {
        GameMenuScene.render();
        GCCT.fillStyle = "RGBA(0,0,0,"+this.alpha+")";
        GCCT.fillRect(0,0,innerWidth,innerHeight);
        if(++this.count > 2) { 
            var progress = (timestamp - this.LastTimeStamp)/1000;
            this.alpha = (this.alpha + progress < 1) ? (this.alpha + progress) : 1; 
        }
        this.LastTimeStamp = timestamp;
        if(this.alpha == 1) {
			Control.state = "GameScene";
			this.count = 0;
			this.alpha = 0;
			requestAnimationFrame(GameScene.transition.bind(GameScene));
        }
        else {
            requestAnimationFrame(this.transition.bind(this));
        }
    }
};

// 遊戲設定場景繪製物件
var OptionScene = {
	state : "OptionSelect",			// 狀態
	selection : 0,					// 選擇

	// 迷宮的長寬高
	MazeLength : 7,
	MazeWidth : 7,
	MazeHeight : 1,

	// 迷宮可設定的最大長寬高
	MaxMazeLength : 50,
	MaxMazeWidth : 50,
	MaxMazeHeight : 50,

	// 迷宮可設定的最小長寬高
	MinMazeLength : 10,
	MinMazeWidth : 10,
	MinMazeHeight : 1,

	// 取得迷宮的長
	GetMazeLength : function() {
		return this.MazeLength;
	},

	// 取得迷宮的寬
	GetMazeWidth : function() {
		return this.MazeWidth;
	},

	// 取得迷宮的高
	GetMazeHeight : function() {
		return this.MazeHeight;
	},

	// 選單物件
	MenuItems : [new MenuItem("迷宮長度 : " + this.MazeLength, centerX, GC.height*3/7),
				 new MenuItem("迷宮寬度 : " + this.MazeWidth, centerX, GC.height*3.75/7),
				 new MenuItem("迷宮高度 : " + ((this.MazeHeight >= 10) ? "" : "0") + this.MazeHeight, centerX, GC.height*4.5/7),
				 new MenuItem("返回", centerX, GC.height*6/7)],

	// 重建選單物件(更新數值與位置)
	RecreateMenuItems : function() {
		this.MenuItems = [new MenuItem("迷宮長度 : " + this.MazeLength, centerX, GC.height*3/7),
			 			  new MenuItem("迷宮寬度 : " + this.MazeWidth, centerX, GC.height*3.75/7),
						  new MenuItem("迷宮高度 : " + ((this.MazeHeight >= 10) ? "" : "0") + this.MazeHeight, centerX, GC.height*4.5/7),
						  new MenuItem("返回", centerX, GC.height*6/7)];
	},

	// 取得狀態
	GetState : function() {
		return this.state;
	},

	// 取得選擇
	GetSelection : function() {
		return this.selection;
	},

	// 整個Canvas洗白
	clear : function() {
		GCCT.fillStyle = "White";
		GCCT.fillRect(0, 0, GC.width, GC.height);
	},

	// 繪製場景
	render : function() {

		// 畫背景
		GCCT.fillStyle = "RGB(210,210,210)";
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
		for(var i = 0; i < this.MenuItems.length; ++i) {
			GCCT.strokeText(this.MenuItems[i].name, this.MenuItems[i].x, this.MenuItems[i].y);
		}
		if(this.state == "OptionSelect") {
			this.OnSelect();
		}
		else {
			this.OnMazeValueSelect();
		}
	},

	// 凸顯選擇的項目
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

	// 不凸顯選擇的項目
	UnSelect : function() {
		var width = 2*GCCT.measureText("迷宮長度 : 25").width+1;
		var height = 1.2*GCCT.measureText("迷").width+1;
		var text = this.MenuItems[this.selection].name;
		var centerX = this.MenuItems[this.selection].x;
		var centerY = this.MenuItems[this.selection].y;
		GCCT.fillStyle = "RGB(210,210,210)";
		GCCT.fillRect(centerX - width/2, centerY - height/2, width, 1.1*height); 	// 高度有點不對稱，所以乘上1.1
		GCCT.strokeText(text, centerX, centerY);
	},

	// 凸顯選擇的值
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

	// 左鍵處理函式
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

	// 上鍵處理函式
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

	// 右鍵處理函式
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

	// 下鍵處理函式
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

// 遊戲場景繪製物件
var GameScene = { 	
	maze : [],	// 遊戲迷宮
	MazeImg : [],
	SL : 120, 						// SideLength, 遊戲一格的邊長, 隨viewscope改變
	SLPlus : this.SL+1,				// SideLength+1		
	HalfSL : this.SL/2,				// SideLength/2
	FixedSL : 120,					// 不隨viewscope改變的固定邊長
	HalfFixedSL : 60,				// 固定邊長/2
	SkillGrid1X : innerWidth - 3*this.HalfFixSL,	// 技能格1的x座標
	SkillGrid2X : innerWidth - this.HalfFixSL,		// 技能格2的x座標
	SkillGridY : innerHeight - this.HalfFixSL,		// 技能格的y座標
	SkillCDLoopRadius : 1.2*this.HalfFixSL,			// 技能CD環的半徑
	ChangeItemAnimationRequest : false,				// 動畫開關
	ItemChangeDirection :　"unknown",			   // 物件選擇旋轉方向
	alpha : 1, // 透明度
	count : 0, // 計數
	LastTimeStamp : 0, // 計時距

	GetSL : function() {
		return this.SL;
	},

	// 重設SL
	SetSL : function(ArgSL) {
		this.SL = ArgSL;
		this.SLPlus = this.SL + 1;
		this.HalfSL = this.SL/2;
	},

	// 重設固定邊長
	SetFixedSL : function(ArgSL) {
		this.FixedSL = ArgSL;
		this.HalfFixedSL = this.FixedSL/2;
		this.SkillGrid1X = innerWidth - 3*this.HalfFixedSL;
		this.SkillGrid2X = innerWidth - this.HalfFixedSL;
		this.SkillGridY = innerHeight - this.HalfFixedSL;
		this.SkillCDLoopRadius = 1.2*this.HalfFixedSL;
	},

	// 更新迷宮
	UpdateMaze : function(length, width, height) {
		this.maze = ThinWallMazeToThickWallMazeConverter(ThinWallMazeGenerator(length, width, height));
		this.MazeImg = MazeToImg(this.maze);
	},

	// 取得迷宮
	GetMaze : function() {
		return this.maze;
	},

	// 整個Canvas洗黒
	AllBlack : function() {
		GCCT.fillStyle = "Black";
		GCCT.fillRect(0,0,GC.width,GC.height);
	},

	// 開始轉場
	transition : function(timestamp) {
        GameScene.UpdateViewScope(Control.PlayerRole);
        GCCT.fillStyle = "RGBA(0,0,0,"+this.alpha+")";
        GCCT.fillRect(0,0,innerWidth,innerHeight);
        if(++this.count > 2) { 
            var progress = (timestamp - this.LastTimeStamp)/1000;
            this.alpha = (this.alpha - progress > 0) ? (this.alpha - progress) : 0; 
        }
        this.LastTimeStamp = timestamp;
        if(this.alpha == 0) {
			this.count = 0;
			this.alpha = 1;
			Control.StartGame();
        }
        else {
            requestAnimationFrame(this.transition.bind(this));
        }
	},

	// 繪製角色的可視畫面
	UpdateViewScope : function(role) {
		GCCT.save();
		var RoleFloorX = Math.floor(role.getX());
		var RoleFloorY = Math.floor(role.getY());
		var RoleIntZ = Math.round(role.getZ());
		var offsetX = role.getX() - RoleFloorX;
		var offsetY = role.getY() - RoleFloorY;
		var offsetZ = role.getZ() - Math.floor(role.getZ());
		var RoleViewScope = role.GetViewScope();

		// 地圖重繪
		GCCT.translate(centerX, centerY);
		GCCT.fillStyle = "White";
		GCCT.fillRect(-this.SL*RoleViewScope, -this.SL*RoleViewScope, this.SL*RoleViewScope*2, this.SL*RoleViewScope*2);

		// Skill1技能格重繪
		GCCT.translate(-centerX, -centerY);
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
		GCCT.translate(centerX, centerY);
		for(var x = -Math.ceil(RoleViewScope); x <= Math.round(RoleViewScope)+1; ++x) {
			for(var y = -Math.ceil(RoleViewScope); y <= Math.round(RoleViewScope)+1; ++y) {
				GCCT.translate((x-offsetX)*this.SL, (y-offsetY)*this.SL);
				if(RoleFloorY + y == -1 && RoleFloorX + x >= 0 && RoleFloorX + x <= this.maze[RoleIntZ].length - 1) {
					GCCT.drawImage(OutOfMazeWall, -this.HalfSL, -this.HalfSL, this.SLPlus, this.SLPlus);
				}
				else if(RoleFloorY + y < -1 || RoleFloorY + y > this.maze[RoleIntZ][RoleFloorX].length-1 || RoleFloorX + x < 0 || RoleFloorX + x > this.maze[RoleIntZ].length - 1) {
					GCCT.drawImage(OutOfMaze, -this.HalfSL, -this.HalfSL, this.SLPlus, this.SLPlus);			// +1用來填補firefox與ie抗鋸齒所造成的gap
				}
				else {
					if(this.MazeImg[RoleIntZ][RoleFloorX + x][RoleFloorY + y] == MazeWallUpPassageUp) {
						GCCT.drawImage(this.MazeImg[RoleIntZ][RoleFloorX + x][RoleFloorY + y], -this.HalfSL, -this.HalfSL - 2*this.SL/3, this.SLPlus, 5*this.SL/3+1);
					}
					else {
						GCCT.drawImage(this.MazeImg[RoleIntZ][RoleFloorX + x][RoleFloorY + y], -this.HalfSL, -this.HalfSL, this.SLPlus, this.SLPlus);
					}
				}
				GCCT.translate(-((x-offsetX)*this.SL), -((y-offsetY)*this.SL));
			}
		}

		// 地圖上物件繪製
		for(var i = WaitDrawObjects.length-1; i >= 0; --i) {
			if(WaitDrawObjects[i].getZ() == Math.round(role.getZ()) && Math.abs(WaitDrawObjects[i].getX() - role.getX()) <= RoleViewScope && Math.abs(WaitDrawObjects[i].getY() - role.getY()) <= RoleViewScope && WaitDrawObjects[i].GetState() != "invisible") {
				if(role.GetIdentity() != "TreasureHunter" &&　WaitDrawObjects[i] == Control.treasure) {
					continue;
				}
				GCCT.save();
				WaitDrawObjects[i].DrawingSetting();
				GCCT.translate(this.SL*(WaitDrawObjects[i].getX() - role.getX()), this.SL*(WaitDrawObjects[i].getY() - role.getY()));
				GCCT.drawImage(WaitDrawObjects[i].GetImage(), -this.HalfSL, -this.HalfSL, this.SL, this.SL);
				GCCT.restore();
			}
		}

		// 無論是否隱形自己至少看的到自己
		if(role.GetVisibility() < 0.1) {
			GCCT.globalAlpha = 0.1 - role.GetVisibility();
			GCCT.drawImage(role.GetImage(), -this.HalfSL, -this.HalfSL, this.SL, this.SL);
			GCCT.globalAlpha = 1;
		}

		// 蓋過地圖上物件的牆繪製
		for(var x = -Math.ceil(RoleViewScope); x <= Math.round(RoleViewScope)+1; ++x) {
			for(var y = -Math.ceil(RoleViewScope); y <= Math.round(RoleViewScope)+1; ++y) {
				if(RoleFloorY + y >= 0 && RoleFloorY + y <= this.maze[RoleIntZ][RoleFloorX].length - 1 && RoleFloorX + x >= 0 && RoleFloorX + x <= this.maze[RoleIntZ].length - 1 && this.maze[RoleIntZ][RoleFloorX + x][RoleFloorY + y].object != "wall" && this.maze[RoleIntZ][RoleFloorX + x][RoleFloorY + y + 1].object == "wall") {
					GCCT.translate((x-offsetX)*this.SL, (y-offsetY)*this.SL);
					GCCT.drawImage(MazeFloorWall, -this.HalfSL, -this.HalfSL, this.SLPlus, this.SLPlus);
					GCCT.translate(-((x-offsetX)*this.SL), -((y-offsetY)*this.SL));
				}
			}
		}

		//視野漸層效果繪製，Nonzero-rule
		var grd = GCCT.createRadialGradient(0, 0, 0, 0, 0, this.SL*RoleViewScope);
		grd.addColorStop(0, "RGBA(0,0,0,0)");
		grd.addColorStop(1, "RGBA(0,0,0,1)");
		GCCT.fillStyle = grd;
		GCCT.beginPath();
		GCCT.arc(0, 0, this.SL*(RoleViewScope)+1, 0, 2*Math.PI); // Chrome的bug(或喜愛?)，rect(或多邊形?)內有半徑為零的arc將無法正常fill，因此+1
		GCCT.stroke();
		GCCT.fill();
		GCCT.fillStyle = "Black";
		GCCT.rect(GC.width/2, -GC.height/2, -GC.width, GC.height);
		GCCT.fill();

		// 上樓動畫繪製
		if(role.GetState() == "GoUp") {
			GCCT.save();
			GCCT.beginPath();
			GameScene.SetSL(4*(window.innerHeight*window.devicePixelRatio)/2/5/(RoleViewScope));
			GCCT.globalAlpha = (offsetZ <= 0.5) ? (2*offsetZ) : (2-2*offsetZ);
			GCCT.strokeStyle = "White";
			grd.addColorStop(0, "RGBA(255,255,255,1)");
			grd.addColorStop(1, "RGBA(255,255,255,0.5)");
			GCCT.fillStyle = grd;
			GCCT.arc(0, 0, this.SL*(RoleViewScope), 0, 2*Math.PI);
			GCCT.fill();
			GCCT.restore();
		}

		// 下樓動畫繪製
		if(role.GetState() == "GoDown") {
			GCCT.save();
			GCCT.beginPath();
			GameScene.SetSL(4*(window.innerHeight*window.devicePixelRatio)/2/5/(RoleViewScope));
			GCCT.globalAlpha = (offsetZ >= 0.5) ? (2-2*offsetZ) : (2*offsetZ);
			GCCT.strokeStyle = "White";
			grd.addColorStop(0, "RGBA(255,255,255,1)");
			grd.addColorStop(1, "RGBA(255,255,255,0.5)");
			GCCT.fillStyle = grd;
			GCCT.arc(0, 0, this.SL*(RoleViewScope), 0, 2*Math.PI);
			GCCT.fill();
			GCCT.restore();
		}

		if(role.GetState() != "vanish") {
			// 物品環繪製
			for(var i = -2; i <= 5; ++i) {
				if(i == -2) {
					GCCT.globalAlpha = 1;
				}
				else {
					GCCT.globalAlpha = 0.2;
				}
				GCCT.drawImage(ItemBorder, -this.FixedSL/2 + (this.SL*(RoleViewScope) + this.FixedSL/3)*Math.cos(2*Math.PI/8*i + AngleOffset/360*2*Math.PI), -this.FixedSL/2 + (this.SL*(RoleViewScope) + this.FixedSL/3 )*Math.sin(2*Math.PI/8*i + AngleOffset/360*2*Math.PI), this.FixedSL, this.FixedSL);
			}

			// 玩家擁有物品繪製
			for(var i = -2; i <= 5; ++i) {
				if(role.GetItem(i+2) != "NoItem") {
					if(i+2 == AngleOffset/45) {
						GCCT.globalAlpha = 1;
					}
					else {
						GCCT.globalAlpha = 0.2;
					}
					GCCT.drawImage(role.GetItem(i+2).GetImage(), -this.HalfSL + this.SL*(RoleViewScope+0.5)*Math.cos(2*Math.PI/8*(i)), -this.HalfSL + this.SL*(RoleViewScope+0.5)*Math.sin(2*Math.PI/8*(i)), this.FixedSL, this.FixedSL);
				}
			}
			GCCT.globalAlpha = 1;

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

			// Skill1技能格繪製
			GCCT.translate(-centerX, -centerY);
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

			if(window.innerWidth > window.innerHeight*window.devicePixelRatio) {
				// 繪製FPS資訊
				GCCT.strokeStyle = "White";
				GCCT.textAlign = "left";
				GCCT.textBaseline = "top";
				GCCT.lineWidth = 2;            
				GCCT.strokeText("FPS : " + FPS, 0, 0);
	
				// 繪製時間資訊
				minute = (Math.floor(Math.floor(GameTime)/60) < 10) ? ("0" + Math.floor(Math.floor(GameTime)/60)) : (Math.floor(Math.floor(GameTime)/60));
				second = (Math.floor(GameTime)%60 < 10) ? ("0" + Math.floor(GameTime)%60) : (Math.floor(GameTime)%60);
				GCCT.strokeText("Time : " + minute + ":" + second, 0, 40);
	
				// 繪製分數
				GCCT.strokeText("Score : " + (10*role.GetGoldCoin()+5*role.GetSilverCoin()+role.GetBronzeCoin()), 0, 80);
			}
		}
		GCCT.restore();
	},
};