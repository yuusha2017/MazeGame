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
	Skill1、Skill2技能(function), 需在各自的結構特別定義, 每個物品皆有被動功能(PassiveUse function)與主動功能(ActiveUse function)
	 , 需在各自的結構特別定義, 如未特別定義則無效果。*/
// 12/16更新 : 物品與幣結構有contact函式來為角色的接觸做出反應

// 基本物件結構
function BaseObj(argX, argY, argZ, ArgImg) {
	var x = argX;
	var y = argY;
	var z = argZ;
	var img = ArgImg;
	var state = "visible";
	this.getX = function() { return x; };
	this.getY = function() { return y; };
	this.getZ = function() { return z; };
	this.GetImage = function() {
		return img;
	};
	this.GetState = function() {
		return state;
	};
	this.setX = function(argX) {
		x = argX;
	};
	this.setY = function(argY) {
		y = argY;
	};
	this.setZ = function(argZ) {
		z = argZ;
	}
	this.SetPosition = function(argX, argY, argZ) {
		x = argX;
		y = argY;
		z = argZ;
	};
	this.SetImage = function(ArgImg) {
		img = ArgImg;
	};
	this.SetState = function(ArgState) {
		state = ArgState;
	};
	this.update = function(progress) {
		return;
	};
	this.DrawingSetting = function() {
		return;
	};
}

// 角色物件基本結構，identity為"TreasureHunter"或"TreasureDefender"，空的道具格為"NoItem"，
// operator一開始皆為"unknown"，方向預設為下。
function Role(argX, argY, argZ, ArgImg, ArgName, ArgSpeed, ArgViewScope, ArgMaxSkill1CD, ArgMaxSkill2CD, ArgIdentity, ArgSkill1Image, ArgSkill2Image) {
	BaseObj.call(this, argX, argY, argZ, ArgImg);
	var name = ArgName;
	var speed = ArgSpeed;
	var ViewScope = ArgViewScope;
	var operator = "unknown";		
	var PreX = argX;
	var PreY = argY;
	var PreZ = argZ;
	var MaxSkill1CD = ArgMaxSkill1CD;
	var MaxSkill2CD = ArgMaxSkill2CD;
	var Skill1CD = 0;
	var Skill2CD = 0;
	var Skill1Image = ArgSkill1Image;
	var Skill2Image = ArgSkill2Image;
	var visibility = 100;
	var WidthScale = 1;
	var HeightScale = 1;
	var items = ["NoItem", "NoItem", "NoItem", "NoItem", "NoItem", "NoItem", "NoItem", "NoItem"];
	var GoldCoin = 0;
	var SilverCoin = 0;
	var BronzeCoin = 0;
	var ItemSelection = 0;
	var direction = "down";		
	var identity = ArgIdentity;
	this.GetName = function() {
		return name;
	};
	this.GetSpeed = function() {
		return speed;
	};
	this.GetViewScope = function() {
		return ViewScope;
	};
	this.GetOperator = function() {
		return operator;
	};
	this.GetPreX = function() {
		return PreX;
	};
	this.GetPreY = function() {
		return PreY;
	};
	this.GetPreZ = function() {
		return PreZ;
	};
	this.GetMaxSkill1CD = function() {
		return MaxSkill1CD;
	};
	this.GetMaxSkill2CD = function() {
		return MaxSkill2CD;
	};
	this.GetSkill1CD = function() {
		return Skill1CD;
	};
	this.GetSkill2CD = function() {
		return Skill2CD;
	};
	this.GetSkill1Image = function() {
		return Skill1Image;
	};
	this.GetSkill2Image = function() {
		return Skill2Image;
	};
	this.GetVisibility = function() {
		return visibility;
	};
	this.GetWidthScale = function() {
		return WidthScale;
	};
	this.GetHeightScale = function() {
		return HeightScale;
	};
	this.GetItem = function(ItemNumber) {
		return items[ItemNumber];
	};
	this.GetItemSelection = function() {
		return ItemSelection;
	};
	this.GetDirection = function() {
		return direction;
	};
	this.GetIdentity = function() {
		return identity;
	};
	this.GetGoldCoin = function() {
		return GoldCoin;
	};
	this.GetSilverCoin = function() {
		return SilverCoin;
	};
	this.GetBronzeCoin = function() {
		return BronzeCoin;
	};
	this.SetSpeed = function(ArgSpeed) {
		speed = ArgSpeed;
	};
	this.SetViewScope = function(ArgViewScope) {
		ViewScope = ArgViewScope;
	};
	this.SetOperator = function(ArgOperator) {
		operator = ArgOperator;
	};
	this.SetPreX = function(ArgPreX) {
		PreX = ArgPreX;
	};
	this.SetPreY = function(ArgPreY) {
		PreY = ArgPreY;
	};
	this.SetPreZ = function(ArgPreZ) {
		PreZ = ArgPreZ;
	};
	this.SetMaxSkill1CD = function(ArgMaxCD) {
		MaxSkill1CD = ArgMaxCD;
	};
	this.SetMaxSkill2CD = function(ArgMaxCD) {
		MaxSkill2CD = ArgMaxCD;
	};
	this.SetSkill1CD = function(ArgCD) {
		Skill1CD = ArgCD;
	};
	this.SetSkill2CD = function(ArgCD) {
		Skill2CD = ArgCD;
	};
	this.SetVisibility = function(ArgVisibility) {
		visibility = ArgVisibility;
	};
	this.SetWidthScale = function(ArgScale) {
		WidthScale = ArgScale;
	};
	this.SetHeightScale = function(ArgScale) {
		HeightScale = ArgScale;
	};
	this.SetItem = function(item) {
		var j = 0;
		for(var i = 0; i <= 7; ++i) {
			if(items[this.GetItemSelection() + j] == "NoItem") {
				items[this.GetItemSelection() + j] = item;
				break;
			}
			else {
				++j
				if(this.GetItemSelection() + j >= 8) {
					j = -this.GetItemSelection();
				}
			}
		}
	};
	this.SetItemSelection = function(ArgItemSelection) {
		ItemSelection = ArgItemSelection;
	};
	this.SetPrePosition = function(ArgPreX, ArgPreY, ArgPreZ) {
		PreX = ArgPreX;
		PreY = ArgPreY;
		PreZ = ArgPreZ;
	};
	this.SetDirection = function(ArgDirection) {
		direction = ArgDirection;
	};
	this.SetGoldCoin = function(ArgNum) {
		GoldCoin = ArgNum;
	};
	this.SetSilverCoin = function(ArgNum) {
		SilverCoin = ArgNum;
	};
	this.SetBronzeCoin = function(ArgNum) {
		BronzeCoin = ArgNum;
	};
	this.MoveLeft = function(scale) {
		this.SetDirection("left");
		this.setX(this.getX() - scale*speed);
	};
	this.MoveUp = function(scale) {
		this.SetDirection("up");
		this.setY(this.getY() - scale*speed);
	};
	this.MoveRight = function(scale) {
		this.SetDirection("right");
		this.setX(this.getX() + scale*speed);
	};
	this.MoveDown = function(scale) {
		this.SetDirection("down");
		this.setY(this.getY() + scale*speed);
	};
	this.Skill1 = function() {
		return;
	};
	this.Skill2 = function() {
		return;
	};
	this.update = function(progress) {
		if(this.GetSkill1CD() > 0) {
			this.SetSkill1CD((this.GetSkill1CD()-progress < 0 ) ? 0 : (this.GetSkill1CD()-progress));
		}
		if(this.GetSkill2CD() > 0) {
			this.SetSkill2CD((this.GetSkill2CD()-progress < 0 ) ? 0 : (this.GetSkill2CD()-progress));
		}
		if(this.GetState() == "BeCatched") {
			this.SetWidthScale((this.GetWidthScale() - 3*progress > 0) ? (this.GetWidthScale() - 3*progress) : 0);
			if(this.GetWidthScale() == 0) {
				this.SetState("vanish");
			}
		}
	};
}

// 角色" "結構
function Sheep(argX, argY, argZ) {
	Role.call(this, argX, argY, argZ, sheep, "Sheep", 4, 4, 15, 1, "TreasureHunter", flash, flash);
	this.Skill1 = function() {
		return;
	};
	this.Skill2 = function() {
		if(this.GetSkill2CD() == 0) {
			this.SetPreX(this.getX());
			this.SetPreY(this.getY());
			this.SetSkill2CD(this.GetMaxSkill2CD());
			WaitDrawObjects.push(new Flash(this.getX(), this.getY(), Math.round(this.getZ())));
			if(this.GetDirection() == "left") {
				this.setX(Math.round(this.getX()-2));
			}
			else if(this.GetDirection() == "up") {
				this.setY(Math.round(this.getY()-2));
			}
			else if(this.GetDirection() == "right") {
				this.setX(Math.round(this.getX()+2));
			}
			else {
				this.setY(Math.round(this.getY()+2));
			}
		}
	};
	this.DrawingSetting = function() {
		GCCT.scale(this.GetWidthScale(), 1);
	};
}

// 角色" "結構
function Wolf(argX, argY, argZ) {
	Role.call(this, argX, argY, argZ, wolf, "Wolf", 5, 4, 20, 20, "TreasureDefender", flash, flash);
	var HideTime = 0;
	var SpeedTime = 0;
	var OnHide = false;
	var OnSpeed = false;
	var SkillSpeed = 2;
	var ExistTime = 0;
	this.Skill1 = function() {
		if(this.GetSkill1CD() == 0) {
			this.SetSkill1CD(this.GetMaxSkill1CD());
			OnSpeed = true;
			SpeedTime = 5;
			if(HideTime != 0) {
				HideTime = 0;
				SkillSpeed = 4;
				SpeedTime = 2;
				this.SetSpeed(this.GetSpeed() + SkillSpeed);
			}
			else {
				SkillSpeed = 2;
				SpeedTime = 5;
				this.SetSpeed(this.GetSpeed() + SkillSpeed);
			}
		}
	};

	// 這裡寫得不好
	this.Skill2 = function() {
		if(this.GetSkill2CD() == 0) {
			this.SetSkill2CD(this.GetMaxSkill2CD());
			SpeedTime = 0;
			HideTime = 10;
			OnHide = true;
			this.SetSpeed(this.GetSpeed() - 0.5);
		}
	};

	// 這裡寫得不好
	this.DrawingSetting = function() {
			GCCT.globalAlpha = this.GetVisibility();
	};
	this.update = function(progress) {
		ExistTime += progress;
		if(this.GetSkill1CD() > 0) {
			this.SetSkill1CD((this.GetSkill1CD()-progress < 0 ) ? 0 : (this.GetSkill1CD()-progress));
		}
		if(this.GetSkill2CD() > 0) {
			this.SetSkill2CD((this.GetSkill2CD()-progress < 0 ) ? 0 : (this.GetSkill2CD()-progress));
		}
		if(SpeedTime > 0) {
			SpeedTime = (SpeedTime-progress < 0) ? 0 : (SpeedTime-progress);
		}
		else {
			if(OnSpeed == true) {
				this.SetSpeed(this.GetSpeed() - SkillSpeed);
				OnSpeed = false;
			}
		}
		if(HideTime > 0) {
			HideTime = (HideTime-progress < 0) ? 0 : (HideTime-progress);
		}
		if(OnHide == true) {
			this.SetVisibility(((this.GetVisibility()-Math.sin(progress)/2 < 0) ? 0 : (this.GetVisibility()-Math.sin(progress)/2)));
			if(this.GetVisibility() == 0) {
				this.SetState("invisible");
			}
			if(HideTime == 0) {
				ExistTime = 0;
				OnHide = false;
				this.SetState("visible");
				this.SetSpeed(this.GetSpeed() + 0.5);
			}
		}
		else {
			this.SetVisibility(Math.abs(Math.sin(ExistTime/2)));
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
	}
}

// 寶藏結構(歸類為物品)
function Treasure(argX, argY, argZ) {
	Item.call(this, argX, argY, argZ, treasure);
	this.contact = function(role) {
		if(role.GetIdentity() == "TreasureHunter") {
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

function SpeedShoes(argX, argY, argZ) {
	Item.call(this, argX, argY, argZ, Item_SpeedShoes);
	var OnPassiveUse = false;
	this.PassiveUse = function() {
		if(!OnPassiveUse) {
			this.GetOwner().SetSpeed(this.GetOwner().GetSpeed() + 0.5);
		}
		if(OnPassiveUse == false) {
			OnPassiveUse = true;
		}
	};
}

// 閃光效果結構
function Flash(argX, argY, argZ) {
	BaseObj.call(this, argX, argY, argZ, flash);
	var ExistTime = 0;
	this.DrawingSetting = function() {
		GCCT.globalAlpha = 1 - ExistTime/0.3;
	};
	this.update = function(progress) {
		ExistTime += progress;
		if(ExistTime > 0.3) {
			this.SetState("vanish");
		}
	};
}

// 幣結構
function Coin(argX, argY, argZ, ArgImg) {
	BaseObj.call(this, argX, argY, argZ, ArgImg);
	var ExistTime = 0;
	this.update = function(progress) {
		ExistTime += progress;
		this.setY(Math.round(this.getY()) + Math.sin(3*ExistTime)/10);
	};
	this.contact = function(role) {
		return;
	};
}

// 金幣結構
function GoldCoin(argX, argY, argZ) {
	Coin.call(this, argX, argY, argZ, goldcoin);
	this.contact = function(role) {
		if(role.GetIdentity() == "TreasureHunter") {
			role.SetGoldCoin(role.GetGoldCoin()+1);
			this.SetState("vanish");
		}
	};
}

// 銀幣結構 
function SilverCoin(argX, argY, argZ) {
	Coin.call(this, argX, argY, argZ, silvercoin);
	this.contact = function(role) {
		if(role.GetIdentity() == "TreasureHunter") {
			role.SetSilverCoin(role.GetSilverCoin()+1);
			this.SetState("vanish");
		}
	};
}

// 銅幣結構 
function BronzeCoin(argX, argY, argZ) {
	Coin.call(this, argX, argY, argZ, bronzecoin);
	this.contact = function(role) {
		if(role.GetIdentity() == "TreasureHunter") {
			role.SetBronzeCoin(role.GetBronzeCoin()+1);
			this.SetState("vanish");
		}
	};
}