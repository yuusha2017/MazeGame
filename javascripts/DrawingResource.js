var GC = document.getElementById("GameCanvas");								
var GCCT = GC.getContext("2d");
GCCT.lineWidth = 2;
GCCT.font = "40px verdana";
var centerX = GC.width/2;
var centerY = GC.height/2;
var BorderTolerance = 0.2;      		// 需>=最高移動速度/60
var DoublePI = 2*Math.PI;
var offset = 0.000001;
var AngleOffset = 0;
var MazeWall = new Image();
var MazeFrontWall = new Image();
var MazeFloor = new Image();
var MazeFloorWall = new Image();
var MazeWallFloor = new Image();
var OutOfMaze = new Image();
var WallOutOfMaze = new Image();
var OutOfMazeWall = new Image();
var MazeWallUpPassageDown = new Image();
var MazeWallRightPassageDown = new Image();
var MazeWallDownPassageDown = new Image();
var MazeWallLeftPassageDown = new Image();
var MazeWallUpPassageUp = new Image();
var MazeWallRightPassageUp = new Image();
var MazeWallDownPassageUp = new Image();
var MazeWallLeftPassageUp = new Image();
var goldcoin = new Image();
var silvercoin = new Image();
var bronzecoin = new Image();
var treasure = new Image();
var exit = new Image();
var ItemBorder = new Image();
var flash = new Image();
var sheep = new Image();
var wolf = new Image();
var WaitDrawObjects = [];


/* 各個物件皆有update用來更新一些數值，以及DrawingSetting來控制物件的繪畫表現，
	狀態有"visible"、"invisible"、"vanish"三種，visible需繪製，invisible不需繪製，vanish需移除。
	以BaseObj為基本結構延伸出角色, 物品等，為使物件之變數private無法將method放入prototype 。每個角色皆有
	S1、S2技能(function), 需在各自的結構特別定義, 每個物品皆有被動功能(PassiveUse function)與主動功能(ActiveUse function)
	 , 需在各自的結構特別定義, 如未特別定義則無效果。*/
// 12/16更新 : 物品與幣結構有contact函式來為角色的接觸做出反應

// 基本物件結構
function BaseObj(argX, argY, argZ, ArgImg) {
	var x = argX;										// x軸位置
	var y = argY;										// y軸位置
	var z = argZ;										// z軸位置
	var img = ArgImg;									// 外表圖片
	var state = "visible";								// 狀態(visible, invisible, vanish, GoUp, GoDown)
	this.getX = function() {							// 取得x
		return x; 
	};
	this.getY = function() { 							// 取得y
		return y; 
	};
	this.getZ = function() { 							// 取得z
		return z; 
	};
	this.GetImg = function() {						// 取得外表圖片
		return img;
	};
	this.GetState = function() {						// 取得狀態
		return state;
	};
	this.moveX = function(argX) {						// x軸移動argX值
		x += argX;
		x = (x > maxX) ? maxX : x;
		x = (x < minX) ? minX : x;
	};
	this.moveY = function(argY) {						// y軸移動argY值
		y += argY;
		y = (y > maxY) ? maxY : y;
		y = (y < minY) ? minY : y;
	};
	this.moveZ = function(argZ) {						// z軸移動argZ值
		z += argZ;
		z = (z > maxZ) ? maxZ : z;
		z = (z < minZ) ? minZ : z;
	};
	this.setX = function(argX) {
		x = argX;
	};
	this.setY = function(argY) {
		y = argY;
	};
	this.setZ = function(argZ) {
		z = argZ;
	};
	this.SetPosition = function(argX, argY, argZ) {		// 設定位置
		x = argX;
		y = argY;
		z = argZ;
	};
	this.SetState = function(ArgState) {				// 設定狀態
		state = ArgState;
	};
	this.update = function(progress) {					// 更新內部值
		return;
	};
	this.DrawingSetting = function() {					// 呈現設定
		return;
	};
}

// 角色物件基本結構，identity為"TreasureHunter"或"TreasureDefender"，空的道具格為"NoItem"，
// operator一開始皆為"unknown"，方向預設為下。
function Role(argX, argY, argZ, ArgImg, ArgSpeed, ArgViewScope, ArgCDT1, ArgCDT2, ArgID, ArgS1Img, ArgS2Img) {
	BaseObj.call(this, argX, argY, argZ, ArgImg);	// 繼承BaseObj
	var speed = ArgSpeed;							// 速度
	var ViewScope = ArgViewScope;					// 視野半徑
	var OriginalViewScope = ArgViewScope;			// 視野半徑(紀錄)
	var CDT1 = ArgCDT1;								// 技能1的冷卻時間
	var CDT2 = ArgCDT2;								// 技能2的冷卻時間
	var ID = ArgID;									// 身分
	var S1Img = ArgS1Img;							// 技能1的圖片
	var S2Img = ArgS2Img;							// 技能2的圖片
	var operator = "unknown";						// 操作者
	var preX = argX;								// 前幀x
	var preY = argY;								// 前帧y
	var preZ = argZ;								// 前幀z
	var CD1 = 0;									// 技能1剩下的冷卻時間
	var CD2 = 0;									// 技能2剩下的冷卻時間
	var alpha = 1;									// 可見度
	var WidthScale = 1;								// 水平伸縮值
	var items = ["NoItem", "NoItem", "NoItem",		// 擁有物品
				 "NoItem", "NoItem", "NoItem", 		// 擁有物品
				 "NoItem", "NoItem"];				// 擁有物品
	var ItemSelection = 0;							// 所選物品格編號
	var direction = "down";							// 面向方向
	this.GetSpeed = function() {					// 取得速度
		return speed;
	};
	this.GetViewScope = function() {				// 取得視野半徑
		return ViewScope;
	};
	this.GetOriginalViewScope = function() {		// 取得視野半徑(紀錄)
		return OriginalViewScope;
	};
	this.GetOperator = function() {					// 取得操作者
		return operator;
	};
	this.GetPreX = function() {						// 取得前幀x
		return preX;
	};
	this.GetPreY = function() {						// 取得前幀y
		return preY;
	};
	this.GetPreZ = function() {						// 取得前幀z
		return preZ;
	};
	this.GetCDT1 = function() {						// 取得技能1的冷卻時間
		return CDT1;
	};
	this.GetCDT2 = function() {						// 取得技能2的冷卻時間
		return CDT2;
	};
	this.GetCD1 = function() {						// 取得技能1剩餘的冷卻時間
		return CD1;
	};
	this.GetCD2 = function() {						// 取得技能2剩餘的冷卻時間
		return CD2;
	};
	this.GetS1Img = function() {					// 取得技能1的圖片
		return S1Img;
	};
	this.GetS2Img = function() {					// 取得技能2的圖片
		return S2Img;
	};
	this.GetAlpha = function() {					// 取得可見度
		return alpha;
	};
	this.GetWidthScale = function() {				// 取得水平伸縮值
		return WidthScale;
	};
	this.GetItem = function(ItemNum) {				// 取得所選物品
		return items[ItemNum];
	};
	this.GetItemSelection = function() {			// 取得所選物品格編號
		return ItemSelection;
	};
	this.GetDirection = function() {				// 取得面向方向
		return direction;
	};
	this.GetID = function() {					// 取得身分
		return ID;
	};
	this.ChangeSpeed = function(ArgSpeed) {			// 改變速度
		speed += ArgSpeed;
		speed = (speed < 0) ? 0 : speed;
	};
	this.ChangeViewScope = function(ArgViewScope) {	// 改變視野半徑
		ViewScope += ArgViewScope;
		ViewScope = (ViewScope < 0) ? 0 : ViewScope;
	};
	this.SetViewScope = function(ArgViewScope) {
		ViewScope = ArgViewScope;
	};
	this.SetOperator = function(ArgOperator) {		// 設定操作者
		operator = ArgOperator;
	};
	this.SetPrePosition = function(ArgPreX, ArgPreY, ArgPreZ) {	// 設定前幀位置
		preX = ArgPreX;
		preY = ArgPreY;
		preZ = ArgPreZ;
	};
	this.ChangeCD1 = function(ArgCD) {				// 改變技能1的剩餘CD時間
		CD1 += ArgCD;
		CD1 = (CD1 < 0) ? 0 : CD1;
	};
	this.ChangeCD2 = function(ArgCD) {				// 改變技能2的剩餘CD時間
		CD2 += ArgCD;
		CD2 = (CD2 < 0) ? 0 : CD2;
	};
	this.ChangeAlpha = function(ArgAlpha) {			// 改變可見度
		alpha += ArgAlpha;
		alpha = (alpha > 1) ? 1 : alpha;
		alpha = (alpha < 0) ? 0 : alpha;
	};
	this.ChangeWidthScale = function(ArgScale) {	// 改變水平伸縮值
		WidthScale += ArgScale;
		WidthScale = (WidthScale < 0) ? 0 : WidthScale;
	};
	this.SetItem = function(item) {					// 設定物品
		for(var i = 0; i <= 7; ++i) {
			if(items[(ItemSelection + i) % 8] == "NoItem") {
				items[(ItemSelection + i) % 8] = item;
				break;
			}
		}
	};
	this.ChangeItemSelection = function(ArgItemSelection) {		// 改變物品選擇
		ItemSelection += ArgItemSelection;
		ItemSelection = (ItemSelection > 7) ? (ItemSelection%8) : ItemSelection;
		ItemSelection = (ItemSelection < 0) ? (7-(-(ItemSelection+1)%8)) : ItemSelection;
	};
	this.MoveLeft = function(scale) {							// 向左移動
		direction = "left";
		this.moveX(-scale*speed);
	};
	this.MoveUp = function(scale) {								// 向上移動
		direction = "up";
		this.moveY(-scale*speed);
	};
	this.MoveRight = function(scale) {							// 向右移動
		direction = "right";
		this.moveX(scale*speed);
	};
	this.MoveDown = function(scale) {							// 向下移動
		direction = "down";
		this.moveY(scale*speed);
	};
	this.GoUp = function(scale) {								// 上樓
		this.moveZ(scale*speed/5);
	};
	this.GoDown = function(scale) {								// 下樓
		this.moveZ(-scale*speed/5);
	};
	this.S1 = function() {										// 技能1
		return;
	};
	this.S2 = function() {										// 技能2
		return;
	};
	this.BasicRoleUpdate = function(progress) {					// 每個角色都有的更新
		this.ChangeCD1(-progress);
		this.ChangeCD2(-progress);
	};
	this.update = function(progress) {
		this.BasicRoleUpdate(progress);
	};
}

// 基本獵人結構
function Hunter(argX, argY, argZ, ArgImg, ArgSpeed, ArgViewScope, ArgCDT1, ArgCDT2, ArgID, ArgS1Img, ArgS2Img) {
	Role.call(this, argX, argY, argZ, ArgImg, ArgSpeed, ArgViewScope, ArgCDT1, ArgCDT2, ArgID, ArgS1Img, ArgS2Img);
	var money = 0;									// 擁有金錢
	this.GetMoney = function() {					// 取得擁有金錢
		return money;								
	};
	this.ChangeMoney = function(ArgMoney) {
		money += ArgMoney;
	};
	this.BasicHunterUpdate = function(progress) {	// 每個獵人都有的更新
		this.BasicRoleUpdate(progress);
		if(this.GetState() == "BeCatched") {
			this.ChangeWidthScale(-3*progress);
			this.SetState((this.GetWidthScale() == 0) ? "vanish": "BeCatched");
		}
	};
	this.update = function(progress) {
		this.BasicHunterUpdate(progress);
	}
}

// 基本守護者結構
function Defender(argX, argY, argZ, ArgImg, ArgSpeed, ArgViewScope, ArgCDT1, ArgCDT2, ArgID, ArgS1Img, ArgS2Img) {
	Role.call(this, argX, argY, argZ, ArgImg, ArgSpeed, ArgViewScope, ArgCDT1, ArgCDT2, ArgID, ArgS1Img, ArgS2Img);
	this.BasicDefenderUpdate = function(progress) {	// 每個守護者都有的更新
		this.BasicRoleUpdate(progress);
	};
	this.update = function(progress) {
		this.BasicDefenderUpdate(progress);
	}
}

// 角色" "結構
function Sheep(argX, argY, argZ) {
	Hunter.call(this, argX, argY, argZ, sheep, 4, 4, 15, 1, "TreasureHunter", flash, flash);
	this.S2 = function() {							// 技能2:瞬移
		if(this.GetCD2() == 0) {
			this.ChangeCD2(this.GetCDT2());
			WaitDrawObjects.push(new Flash(this.getX(), this.getY(), Math.round(this.getZ())));
			switch(this.GetDirection()) {
				case "left"  : {this.moveX(-2); break;}
				case "up"    : {this.moveY(-2); break;}
				case "right" : {this.moveX(2); break;}
				case "down"  : {this.moveY(2); break;}
			}
		}
	};
	this.DrawingSetting = function() {		
		GCCT.scale(this.GetWidthScale(), 1);
	};
}

// 角色" "結構
function Wolf(argX, argY, argZ) {
	Defender.call(this, argX, argY, argZ, wolf, 5, 4, 20, 20, "TreasureDefender", flash, flash);
	var SpeedTime = 5;							// 技能1的加速時間
	var BurstSpeedTime = 2;						// 技能1的爆發加速時間
	var SkillSpeed = 2;							// 技能1的加速值
	var BurstSkillSpeed = 4;					// 技能1的爆發加速值
	var HideTime = 10;							// 技能2的隱身時間
	var HideSpeed = -0.5;						// 技能2的隱身減速值
	var RemainingHideTime = 0;					// 剩餘的隱身時間
	var RemainingSpeedTime = 0;					// 剩餘的加速時間
	var OnHide = false;							// 是否在隱身中
	var OnSpeed = false;						// 是否在加速中
	var OnBurstSpeed = false;					// 是否在爆發加速中
	var ExistTime = 0;							// 已存在時間

	// 加速
	this.S1 = function() {
		if(this.GetCD1() == 0) {
			this.ChangeCD1(this.GetCDT1());
			if(RemainingHideTime != 0) {
				RemainingHideTime = 0;
				RemainingSpeedTime = BurstSpeedTime;
				OnBurstSpeed = true;
				this.ChangeSpeed(BurstSkillSpeed);
			}
			else {
				RemainingSpeedTime = SpeedTime;
				OnSpeed = true;
				this.ChangeSpeed(SkillSpeed);
			}
		}
	};

	// 隱身
	this.S2 = function() {
		if(this.GetCD2() == 0) {
			this.ChangeCD2(this.GetCDT2());
			RemainingSpeedTime = 0;
			RemainingHideTime = HideTime;
			OnHide = true;
			this.ChangeSpeed(HideSpeed);
		}
	};

	this.DrawingSetting = function() {
			GCCT.globalAlpha = this.GetAlpha();
	};

	this.update = function(progress) {
		this.BasicDefenderUpdate(progress);	
		ExistTime += progress;	

		// 加速部分更新
		RemainingSpeedTime = (RemainingSpeedTime-progress < 0) ? 0 : (RemainingSpeedTime-progress);
		if(OnSpeed == true && RemainingSpeedTime == 0) {
			this.ChangeSpeed(-SkillSpeed);
			OnSpeed = false;
		}
		else if(OnBurstSpeed == true && RemainingSpeedTime == 0) {
			this.ChangeSpeed(-BurstSkillSpeed);
			OnBurstSpeed = false;
		}

		// 隱身部分更新
		RemainingHideTime = (RemainingHideTime-progress < 0) ? 0 : (RemainingHideTime-progress);
		if(OnHide == true) {
			this.ChangeAlpha(-progress);
			this.SetState((this.GetAlpha() == 0) ? "invisible" : this.GetState());
			if(RemainingHideTime == 0) {
				ExistTime = 0;
				OnHide = false;
				this.SetState("visible");
				this.ChangeSpeed(-HideSpeed);
			}
		}
		else {
			this.ChangeAlpha(-this.GetAlpha());       			// 歸零
			this.ChangeAlpha(Math.abs(Math.sin(ExistTime/2)));	// 加上sin周期值的絕對值
		}
	};
}

// 物品基本結構，owner一開始皆為"NoOwner"
function Item(argX, argY, argZ, ArgImg) {
	BaseObj.call(this, argX, argY, argZ, ArgImg);
	var owner = "NoOwner";
	this.GetOwner = function() {
		return owner;
	};
	this.SetOwner = function(ArgOwner) {
		owner = ArgOwner;
	};
	this.PassiveUse = function() {
		return;
	};
	this.ActiveUse = function() {
		return;
	};
	this.contact = function(role) {
		return;
	};
}

// 寶藏結構(歸類為物品)
function Treasure(argX, argY, argZ) {
	Item.call(this, argX, argY, argZ, treasure);
	this.contact = function(role) {
		if(role.GetID() == "TreasureHunter") {
			role.SetItem(this);
			this.SetOwner(role);
			this.SetState("vanish");
		}
	}
}

// 出口結構
function Exit(argX, argY, argZ) {
	BaseObj.call(this, argX, argY, argZ, exit);
}

// 暫停使用
// function SpeedShoes(argX, argY, argZ) {
// 	Item.call(this, argX, argY, argZ, Item_SpeedShoes);
// 	var OnPassiveUse = false;
// 	this.PassiveUse = function() {
// 		if(!OnPassiveUse) {
// 			this.GetOwner().SetSpeed(this.GetOwner().GetSpeed() + 0.5);
// 		}
// 		if(OnPassiveUse == false) {
// 			OnPassiveUse = true;
// 		}
// 	};
// }

// 閃光效果結構
function Flash(argX, argY, argZ) {
	BaseObj.call(this, argX, argY, argZ, flash);
	var ExistTime = 0;
	this.DrawingSetting = function() {
		GCCT.globalAlpha = 1 - ExistTime/0.3;
	};
	this.update = function(progress) {
		ExistTime += progress;
		this.SetState((ExistTime > 0.3) ? "vanish" : this.GetState())
	};
}

// 幣結構
function Coin(argX, argY, argZ, ArgImg, ArgValue) {
	BaseObj.call(this, argX, argY, argZ, ArgImg);
	var ExistTime = 0;
	var value = ArgValue;
	this.update = function(progress) {
		ExistTime += progress;
		this.moveY(Math.round(this.getY()) - this.getY());			// 回到整數值
		this.moveY(Math.sin(3*ExistTime)/10);						// 加上sin週期值
	};
	this.contact = function(role) {
		if(role.GetID() == "TreasureHunter") {
			role.ChangeMoney(value);
			this.SetState("vanish");
		}
	};
}

// 金幣結構
function GoldCoin(argX, argY, argZ) {
	Coin.call(this, argX, argY, argZ, goldcoin, 10);
}

// 銀幣結構 
function SilverCoin(argX, argY, argZ) {
	Coin.call(this, argX, argY, argZ, silvercoin, 5);
}

// 銅幣結構 
function BronzeCoin(argX, argY, argZ) {
	Coin.call(this, argX, argY, argZ, bronzecoin, 1);
}