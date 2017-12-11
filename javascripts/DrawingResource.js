var GC = document.getElementById("GameCanvas");								
var GCCT = GC.getContext("2d");
GCCT.lineWidth = 2;
GCCT.font = "40px verdana";
var centerX = GC.width/2;
var centerY = GC.height/2;
var RefreshFrequency = 60;
var BorderTolerance = 0.2;      		// 需>=最高移動速度/60
var DoublePI = 2*Math.PI;
var offset = 0.000001;
var AngleOffset = 0;
var MazeWall = new Image();
var MazeFrontWall = new Image();
var MazeFloor = new Image();
var MazeFloorWall = new Image();
var MazeWallFloor = new Image();
var test = new Image();
var test2 = new Image();
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
var treasure = new Image();
var exit = new Image();
var ItemBorder = new Image();
var flash = new Image();
var sheep = new Image();
var wolf = new Image();
var WaitDrawObjects = {
	objects : [],
	check : function() {
		for(i = 0; i < this.objects.length; ++i) {
			if(this.objects[i].state == "vanish") {
				this.objects.splice(i, 1);
			}
		}
	}
}


/* 各個物件皆有update用來更新一些數值，以及DrawingSetting來控制物件的繪畫表現，
	狀態有"visible"、"invisible"、"vanish"三種，visible需繪製，invisible不需繪製，vanish需移除。
	以BaseObj為基本結構延伸出角色, 道具等，為使物件之變數private無法將method放入prototype 。每個角色皆有
	Skill1、Skill2技能(function), 需在各自的結構特別定義, 每個道具皆有被動功能(PassiveUse function)與主動功能(ActiveUse function)
	 , 需在各自的結構特別定義, 如未特別定義則無效果。*/

// 基本物件結構
function BaseObj(argX, argY, argZ, ArgImg) {
	var x = argX;
	var y = argY;
	var z = argZ;
	var img = ArgImg;
	var state = "visible";
	this.getX = function() {
		return x;
	};
	this.getY = function() {
		return y;
	};
	this.getZ = function() {
		return z;
	};
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
	this.update = function() {
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
	var items = ["NoItem", "NoItem", "NoItem", "NoItem", "NoItem", "NoItem", "NoItem", "NoItem"];
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
	this.SetItem = function(item) {
		var j = 0;
		for(i = 0; i <= 7; ++i) {
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
	this.update = function() {
		if(this.GetSkill1CD() != 0) {
			this.SetSkill1CD(this.GetSkill1CD()-1);
		}
		if(this.GetSkill2CD() != 0) {
			this.SetSkill2CD(this.GetSkill2CD()-1);
		}
	};
}

// 角色" "結構
function Sheep(argX, argY, argZ) {
	Role.call(this, argX, argY, argZ, sheep, "Sheep", 4, 4, 1000, 60, "TreasureHunter", flash, flash);
	this.Skill1 = function() {
		return;
	};
	this.Skill2 = function() {
		if(this.GetSkill2CD() == 0) {
			this.SetPreX(this.getX());
			this.SetPreY(this.getY());
			this.SetSkill2CD(this.GetMaxSkill2CD());
			WaitDrawObjects.objects.push(new Flash(this.getX(), this.getY(), Math.round(this.getZ())));
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
	}
}

// 角色" "結構
function Wolf(argX, argY, argZ) {
	Role.call(this, argX, argY, argZ, wolf, "Wolf", 3, 4, 1200, 1200, "TreasureDefender", flash, flash);
	var HideTime = 0;
	var SpeedTime = 0;
	var OnHide = false;
	var OnSpeed = false;
	var visibility = 100;
	this.Skill1 = function() {
		if(this.GetSkill1CD() == 0) {
			this.SetSkill1CD(this.GetMaxSkill1CD());
			HideTime = 1;
			SpeedTime = 300;
			OnSpeed = true;
			this.SetSpeed(this.GetSpeed() + 2);
		}
	};

	// 這裡寫得不好
	this.Skill2 = function() {
		if(this.GetSkill2CD() == 0) {
			this.SetSkill2CD(this.GetMaxSkill2CD());
			SpeedTime = 0;
			HideTime = 600;
			OnHide = true;
			this.SetSpeed(this.GetSpeed() - 0.5);
			if(visibility > 100) {
				visibility = 200 - visibility;
			}
		}
	};

	// 這裡寫得不好
	this.DrawingSetting = function() {
		if(OnHide == true) {
			--HideTime;
			if(visibility  != 0) {
				GCCT.globalAlpha = visibility--/100;
			}
			else {
				this.SetState("invisible");
			}
			if(HideTime == 0) {
				this.SetState("visible");
				OnHide = false;
				this.SetSpeed(this.GetSpeed() + 0.5);
				GCCT.globalAlpha = visibility++/100;
			}
		}
		else {
			++visibility;
			visibility %= 200;
			if(visibility > 100) {
				GCCT.globalAlpha = (200 - visibility)/100;
			}
			else {
				GCCT.globalAlpha = visibility/100;
			}
		}
	}
	this.update = function() {
		if(this.GetSkill1CD() != 0) {
			this.SetSkill1CD(this.GetSkill1CD()-1);
		}
		if(this.GetSkill2CD() != 0) {
			this.SetSkill2CD(this.GetSkill2CD()-1);
		}
		if(SpeedTime != 0) {
			--SpeedTime;
		}
		else {
			if(OnSpeed == true) {
				this.SetSpeed(this.GetSpeed() - 2);
				OnSpeed = false;
			}
		}
	};
}

// 道具基本結構，owner一開始皆為"NoOwner"
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
	this.update = function() {
		if(this.GetOwner() != "NoOwner") {
			this.SetState("invisible");
		} 
	};
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

// 寶藏結構(歸類為道具)
function Treasure(argX, argY, argZ) {
	Item.call(this, argX, argY, argZ, treasure);
}

// 出口結構
function Exit(argX, argY, argZ) {
	BaseObj.call(this, argX, argY, argZ, exit);
}

// 閃光效果結構
function Flash(argX, argY, argZ) {
	BaseObj.call(this, argX, argY, argZ, flash);
	var times = 0;
	this.DrawingSetting = function() {
		GCCT.globalAlpha = 1 - times/RefreshFrequency;
	};
	this.update = function() {
		times += 3;
		if(times == RefreshFrequency) {
			this.SetState("vanish");
		}
	};
}
