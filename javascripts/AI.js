function Vega(name, role) {
    this.name = name;
    this.role = role;
    this.Memory_OtherPlayers = [];
    this.Memory_Maze = []; 
    this.Memory_PreAction = "";
    this.Memory_PreActionValue = 0;
    this.Memory_PrePassed;
    this.RolePreRelativeX = 0;
    this.RolePreRelativeY = 0;
    this.RolePreRelativeZ = 0;
    this.RoleRelativeX = 0;
    this.RoleRelativeY = 0;
    this.RoleRelativeZ = 0;
    this.RoleInitialX = 0;
    this.RoleInitialY = 0;		
    this.RoleInitialZ = 0;	
    this.RoleX = 0;
    this.RoleY = 0;
    this.RoleZ = 0;						
    this.ObjectPositionX = "unknown";
    this.ObjectPositionY = "unknown";
    this.KeyboardState = NoKey;
    this.Strategy = "ExploreMaze";
    this.GetRole = function() {
        return this.role;
    }
    this.Action_Push_KeyLeft = function() {
        this.KeyboardState |= KeyLeft;
        return "KeyLeftDown";
    };
    this.Action_Push_KeyUp = function() {
        this.KeyboardState |= KeyUp;
        return "KeyUpDown";
    };
    this.Action_Push_KeyRight = function() {
        this.KeyboardState |= KeyRight;
        return "KeyRightDown";
    };
    this.Action_Push_KeyDown = function() {
        this.KeyboardState |= KeyDown;
        return "KeyDownDown";
    };
    this.Action_Release_KeyLeft = function() {
        this.KeyboardState &= AllKey - KeyLeft;
        return "KeyLeftUp";
    };
    this.Action_Release_KeyUp = function() {
        this.KeyboardState &= AllKey - KeyUp;
        return "KeyUpUp";
    };
    this.Action_Release_KeyRight = function() {
        this.KeyboardState &= AllKey - KeyRight;
        return "KeyRightUp";
    };
    this.Action_Release_KeyDown = function() {
        this.KeyboardState &= AllKey - KeyDown;
        return "KeyDownUp";
    };
    this.Action_Release_AllKey = function() {
        this.KeyboardState &= NoKey;
        return "AllKeyUp";
    };
    this.CollectInfo = function(Info) {
        // console.log(Info.Maze);
        this.RolePreRelativeX = this.RoleRelativeX;
        this.RolePreRelativeY = this.RoleRelativeY;
        this.RolePreRelativeZ = this.RoleRelativeZ;

        // 更新位置資訊
        this.RoleRelativeX += Info.ChangeOfX;
        this.RoleRelativeY += Info.ChangeOfY;
        this.RoleRelativeZ += Info.ChangeOfZ;
        this.RoleX = this.RoleInitialX + Math.round(this.RoleRelativeX);
        this.RoleY = this.RoleInitialY + Math.round(this.RoleRelativeY);
        this.RoleZ = this.RoleInitialZ + Math.round(this.RoleRelativeZ);

        // 更新玩家資訊記憶
        for(PlayerNum = 0; PlayerNum < Info.OtherPlayers.length; ++PlayerNum) {
            this.Memory_OtherPlayers[PlayerNum].Name = Info.OtherPlayers[PlayerNum].Name;
            if(Info.OtherPlayers[PlayerNum].RelativeX != "unknown" && Info.OtherPlayers[PlayerNum].RelativeY != "unknown") {
                this.Memory_OtherPlayers[PlayerNum].RelativeX = Info.OtherPlayers[PlayerNum].RelativeX + this.RoleRelativeX;
                this.Memory_OtherPlayers[PlayerNum].RelativeY = Info.OtherPlayers[PlayerNum].RelativeY + this.RoleRelativeY;
            }
            else {
                this.Memory_OtherPlayers[PlayerNum].RelativeX = "unknown";
                this.Memory_OtherPlayers[PlayerNum].RelativeY = "unknown";
            }
        }

        // 擴充迷宮記憶空間
        while(this.RoleZ <= 0) {	
            this.Memory_Maze.unshift([]);	
            ++this.RoleInitialZ;
            ++this.RoleZ;								
            for(x = 0; x < this.Memory_Maze[1].length; ++x) {
                this.Memory_Maze[0].push([]);
                for(y = 0; y < this.Memory_Maze[1][x].length; ++y) {
                     this.Memory_Maze[0][x].push("unknown");
                }
            }
        }
        while(this.RoleZ >= this.Memory_Maze.length-1) {
            this.Memory_Maze.push([]);									
            for(x = 0; x < this.Memory_Maze[this.Memory_Maze.length-2].length; ++x) {
                this.Memory_Maze[this.Memory_Maze.length-1].push([]);
                for(y = 0; y < this.Memory_Maze[this.Memory_Maze.length-2][x].length; ++y) {
                    this.Memory_Maze[this.Memory_Maze.length-1][x].push("unknown");
                }
            }
        }
        while(this.RoleX - Info.MazeInfoCenterX < 1) {
            ++this.RoleInitialX;
            ++this.RoleX;
            for(z = 0; z < this.Memory_Maze.length; ++z) {
                this.Memory_Maze[z].unshift([]);
                for(y = 0; y < this.Memory_Maze[z][1].length; ++y) {
                    this.Memory_Maze[z][0].push("unknown");
                }
            }
        }
        while(this.RoleY - Info.MazeInfoCenterY < 1) {
            for(z = 0; z < this.Memory_Maze.length; ++z) {
                for(x = 0; x < this.Memory_Maze[z].length; ++x) {
                    this.Memory_Maze[z][x].unshift("unknown");
                }
            }
            ++this.RoleInitialY;
            ++this.RoleY;
        }
        while(this.RoleX + (Info.Maze.length - 1 - Info.MazeInfoCenterX) >= this.Memory_Maze[this.RoleZ].length-1) {
            for(z = 0; z < this.Memory_Maze.length; ++z) {
                this.Memory_Maze[z].push([]);
                for(y = 0; y < this.Memory_Maze[z][this.Memory_Maze[z].length - 2].length; ++y) {
                    this.Memory_Maze[z][this.Memory_Maze[z].length - 1].push("unknown");
                }
            }
        }
        while(this.RoleY + (Info.Maze[Info.MazeInfoCenterX].length - 1 - Info.MazeInfoCenterY) >= this.Memory_Maze[this.RoleZ][this.RoleX].length-1) {
            for(z = 0; z < this.Memory_Maze.length; ++z) {
                for(x = 0; x < this.Memory_Maze[z].length; ++x) {
                    this.Memory_Maze[z][x].push("unknown");
                }
            }
        }

        // 更新迷宮記憶
        for(x = 0; x < Info.Maze.length; ++x) {
            for(y = 0; y < Info.Maze[x].length; ++y) {
                if(Info.Maze[x][y] != "unknown") {
                    this.Memory_Maze[this.RoleZ][this.RoleX+x-Info.MazeInfoCenterX][this.RoleY+y-Info.MazeInfoCenterY] = Info.Maze[x][y];
                }
            }
        }

        if(this.Memory_OtherPlayers[0].RelativeX != "unknown" && this.Memory_OtherPlayers[0].RelativeY != "unknown")  {
            this.ObjectPositionX = this.RoleInitialX + Math.round(this.Memory_OtherPlayers[0].RelativeX);
            this.ObjectPositionY = this.RoleInitialY + Math.round(this.Memory_OtherPlayers[0].RelativeY);
        }
        if(this.RoleX == this.ObjectPositionX && this.RoleY == this.ObjectPositionY) {
            this.ObjectPositionX = "unknown";
            this.ObjectPositionY = "unknown";
        }
        if((Math.floor(this.RoleRelativeX+offset) == Math.ceil(this.RolePreRelativeX) 
        || Math.floor(this.RolePreRelativeX) == Math.ceil(this.RoleRelativeX-offset))
        && this.RoleRelativeX != this.RolePreRelativeX) {
            if(this.PrePassed != this.Memory_Maze[this.RoleZ][this.RoleX][this.RoleY]){
                ++this.Memory_Maze[this.RoleZ][this.RoleX][this.RoleY].passtimes;
                this.PrePassed = this.Memory_Maze[this.RoleZ][this.RoleX][this.RoleY];
            }
        }
        else if((Math.floor(this.RoleRelativeY+offset) == Math.ceil(this.RolePreRelativeY) 
        || Math.floor(this.RolePreRelativeY) == Math.ceil(this.RoleRelativeY-offset))
        && this.RoleRelativeY != this.RolePreRelativeY) {
            if(this.PrePassed != this.Memory_Maze[this.RoleZ][this.RoleX][this.RoleY]) {
                ++this.Memory_Maze[this.RoleZ][this.RoleX][this.RoleY].passtimes;
                this.PrePassed = this.Memory_Maze[this.RoleZ][this.RoleX][this.RoleY];
            }
        }
    };

    this.Info_Init = function(RoleNumber) {	
        for(z = 0; z <= 2; ++z) {	
            this.Memory_Maze.push([]);									
            for(x = 0; x <= 24; ++x) {
                this.Memory_Maze[z].push([]);
                for(y = 0; y <= 24; ++y) {
                    this.Memory_Maze[z][x].push("unknown");
                }
            }
        }
        for(RoleNum = 0; RoleNum < RoleNumber; ++RoleNum) {
            this.Memory_OtherPlayers.push({Name : "unknown", RelativeX : "unknown", RelativeY : "unknown"});
        }
        this.RoleInitialX = Math.floor(this.Memory_Maze[0].length/2);
        this.RoleInitialY = Math.floor(this.Memory_Maze[0][0].length/2);
        this.RoleInitialZ = Math.floor(this.Memory_Maze.length/2)
        this.Prepassed = this.Memory_Maze[this.RoleInitialZ][this.RoleInitialX][this.RoleInitialY];
        this.RoleRelativeX = 0;
        this.RoleRelativeY = 0;
        this.RoleRelativeZ = 0;
        this.RoleX = this.RoleInitialX;
        this.RoleY = this.RoleInitialY;
        this.RoleZ = this.RoleInitialZ;
    };

    this.ImaginaryGo = function(x,y,z,LastMove) {
        this.Memory_Maze[z][x][y].passed = true;
        if(this.Memory_Maze[z][x][y].object == "PassageUp" && LastMove != "GoDown") {
            var ValueGoUp = 0;
            if(this.Memory_Maze[z+1][x][y] == "unknown") {
                ValueGoUp += 20;
            }
            else {
                ValueGoUp += this.ImaginaryGo(x,y,z+1,"GoUp");
            }
            this.Memory_Maze[z][x][y].passed = false;
            return ValueGoUp;
        }
        if(this.Memory_Maze[z][x][y].object == "PassageDown" && LastMove != "GoUp") {
            var ValueGoDown = 0;
            if(this.Memory_Maze[z-1][x][y] == "unknown") {
                ValueGoDown += 20;
            }
            else {
                ValueGoDown += this.ImaginaryGo(x,y,z-1,"GoDown");
            }
            this.Memory_Maze[z][x][y].passed = false;
            return ValueGoDown;
        }
        var ValueUp = 0.01 - 0.1*this.Memory_Maze[z][x][y].passtimes;
        var ValueRight = 0.01 - 0.1*this.Memory_Maze[z][x][y].passtimes;
        var ValueDown = 0.01 - 0.1*this.Memory_Maze[z][x][y].passtimes;
        var ValueLeft = 0.01 - 0.1*this.Memory_Maze[z][x][y].passtimes;

        // 累加ValueUp
        if(LastMove != "down") {
            if(this.Memory_Maze[z][x][y-1] != "unknown") {
                if(this.Memory_Maze[z][x][y-1].object != "wall" && this.Memory_Maze[z][x][y-1].passed == false) {
                    ValueUp += this.ImaginaryGo(x, y-1, z, "up");	
                }
            } 
            else {
                ValueUp += 10;
            }
        }

        // 累加ValueRight
        if(LastMove != "left") {
            if(this.Memory_Maze[z][x+1][y] != "unknown") {
                if(this.Memory_Maze[z][x+1][y].object != "wall" && this.Memory_Maze[z][x+1][y].passed == false) {
                    ValueRight += this.ImaginaryGo(x+1, y, z, "right");	
                }
            } 
            else {
                ValueRight += 10;
            }
        }

        // 累加ValueDown
        if(LastMove != "up") {
            if(this.Memory_Maze[z][x][y+1] != "unknown") {
                if(this.Memory_Maze[z][x][y+1].object != "wall" && this.Memory_Maze[z][x][y+1].passed == false) {
                    ValueDown += this.ImaginaryGo(x, y+1, z, "down");	
                }
            } 
            else {
                ValueDown += 10;
            }
        }

        // 累加ValueLeft
        if(LastMove != "right") {
            if(this.Memory_Maze[z][x-1][y] != "unknown") {
                if(this.Memory_Maze[z][x-1][y].object != "wall" && this.Memory_Maze[z][x-1][y].passed == false) {
                    ValueLeft += this.ImaginaryGo(x-1, y, z, "left");	
                }
            } 
            else {
                ValueLeft += 10;
            }
        }

        this.Memory_Maze[z][x][y].passed = false;
        return Math.max(ValueUp, ValueRight, ValueDown, ValueLeft);
    };
    this.GoObjectPositionDistance = function(x,y,z,LastMove) {
        this.Memory_Maze[z][x][y].passed = true;
        if(x == this.ObjectPositionX && y == this.ObjectPositionY) {
            this.Memory_Maze[z][x][y].passed = false;
            return 1;
        }
        if(this.Memory_Maze[z][x][y].object == "PassageUp" && LastMove != "GoDown") {
            var DistanceGoUp = 0;
            if(this.Memory_Maze[z+1][x][y] == "unknown") {
                DistanceGoUp += Infinity;
            }
            else {
                DistanceGoUp += this.GoObjectPositionDistance(x,y,z+1,"GoDown");
            }
            this.Memory_Maze[z][x][y].passed = false;
            return DistanceGoUp;
        }
        if(this.Memory_Maze[z][x][y].object == "PassageDown" && LastMove != "GoUp") {
            var DistanceGoDown = 0;
            if(this.Memory_Maze[z-1][x][y] == "unknown") {
                DistanceGoDown += Infinity;
            }
            else {
                DistanceGoDown += this.GoObjectPositionDistance(x,y,z-1,"GoDown");
            }
            this.Memory_Maze[z][x][y].passed = false;
            return DistanceGoDown;
        }
        var DistanceUp = 1;
        var DistanceRight = 1;
        var DistanceDown = 1;
        var DistanceLeft = 1;

        // 累加DistanceUp
        if(LastMove != "down") {
            if(this.Memory_Maze[z][x][y-1] != "unknown") {
                if(this.Memory_Maze[z][x][y-1].object != "wall" && this.Memory_Maze[z][x][y-1].passed == false) {
                    DistanceUp += this.GoObjectPositionDistance(x, y-1, z, "up");	
                }
                else {
                    DistanceUp = Infinity;
                }
            } 
            else {
                DistanceUp = Infinity;
            }
        }
        else {
            DistanceUp = Infinity;
        }

        // 累加DistanceRight
        if(LastMove != "left") {
            if(this.Memory_Maze[z][x+1][y] != "unknown") {
                if(this.Memory_Maze[z][x+1][y].object != "wall" && this.Memory_Maze[z][x+1][y].passed == false) {
                    DistanceRight += this.GoObjectPositionDistance(x+1, y, z, "right");	
                }
                else {
                    DistanceRight = Infinity;
                }
            } 
            else {
                DistanceRight = Infinity;
            }
        }
        else {
            DistanceRight = Infinity;
        }

        // 累加DistanceDown
        if(LastMove != "up") {
            if(this.Memory_Maze[z][x][y+1] != "unknown") {
                if(this.Memory_Maze[z][x][y+1].object != "wall" && this.Memory_Maze[z][x][y+1].passed == false) {
                    DistanceDown += this.GoObjectPositionDistance(x, y+1, z, "down");	
                }
                else {
                    DistanceDown = Infinity;
                }
            } 
            else {
                DistanceDown = Infinity;
            }
        }
        else {
            DistanceDown = Infinity;
        }

        // 累加DistanceLeft
        if(LastMove != "right") {
            if(this.Memory_Maze[z][x-1][y] != "unknown") {
                if(this.Memory_Maze[z][x-1][y].object != "wall" && this.Memory_Maze[z][x-1][y].passed == false) {
                    DistanceLeft += this.GoObjectPositionDistance(x-1, y, z, "left");	
                }
                else {
                    DistanceLeft = Infinity;
                }
            } 
            else {
                DistanceLeft = Infinity;
            }
        }
        else {
            DistanceLeft = Infinity;
        }

        this.Memory_Maze[z][x][y].passed = false;
        return Math.min(DistanceUp, DistanceRight, DistanceDown, DistanceLeft);
    };

    this.ValueSystem = function(Action) {
        var ActionValue = 0;
        switch(Action) {
            case "ExploreMaze" : {
                ++ActionValue;
                break;
            }
            case "SearchMaze" : {
               // if(this.Memory_PreActionValue <= 5) {
                    //ActionValue = 5;
                //}
                break;
            }
            case "ChasePlayer" : {
                if(this.ObjectPositionX != "unknown" && this.ObjectPositionY != "unknown" && 
                    this.GoObjectPositionDistance(this.RoleX, this.RoleY, this.RoleZ, "NoLastMove") != Infinity) {
                    ActionValue += 10;
                }
                break;
            }
            case "MoveLeft" : {
                switch(this.Strategy) {
                    case "ExploreMaze" : {
                        if(this.Memory_PreAction == "MoveRight") {
                            ActionValue -= 5;
                        }
                        if(this.Memory_Maze[this.RoleZ][this.RoleInitialX + Math.floor(this.RoleRelativeX-5*offset)][this.RoleY].passtimes == 0) {
                            ++ActionValue;
                        }
                        ActionValue += this.ImaginaryGo(this.RoleInitialX + Math.floor(this.RoleRelativeX-5*offset), this.RoleY, this.RoleZ, "left");
                        break;
                    }
                    case "SearchMaze" : {

                        break;
                    }
                    case "ChasePlayer" : {
                        ActionValue = -this.GoObjectPositionDistance(this.RoleInitialX + Math.floor(this.RoleRelativeX - offset), this.RoleY, this.RoleZ, "left");
                        break;
                    }
                    default : {
                        break;
                    }
                }
                break;
            }
            case "MoveUp" : {
                switch(this.Strategy) {
                    case "ExploreMaze" : {
                        if(this.Memory_PreAction == "MoveDown") {
                            ActionValue -= 5;
                        }
                        if(this.Memory_Maze[this.RoleZ][this.RoleX][this.RoleInitialY + Math.floor(this.RoleRelativeY - 5*offset)].passtimes == 0) {
                            ActionValue += 5;
                        }
                        ActionValue += this.ImaginaryGo(this.RoleX, this.RoleInitialY + Math.floor(this.RoleRelativeY - 5*offset), this.RoleZ, "up");
                        break;
                    }
                    case "SearchMaze" : {
                        break;
                    }
                    case "ChasePlayer" : {
                        ActionValue = -this.GoObjectPositionDistance(this.RoleX, this.RoleInitialY + Math.floor(this.RoleRelativeY - offset), this.RoleZ, "up");
                        break;
                    }
                    default : {
                        break;
                    }
                }
                break;
            }
            case "MoveRight" : {
                switch(this.Strategy) {
                    case "ExploreMaze" : {
                        if(this.Memory_PreAction == "MoveLeft") {
                            ActionValue -= 5;
                        }
                        if(this.Memory_Maze[this.RoleZ][this.RoleInitialX + Math.ceil(this.RoleRelativeX + 5*offset)][this.RoleY].passtimes == 0) {
                            ActionValue += 5;
                        }
                        ActionValue += this.ImaginaryGo(this.RoleInitialX + Math.ceil(this.RoleRelativeX + 5*offset), this.RoleY, this.RoleZ, "right");
                        break;
                    }
                    case "SearchMaze" : {
                        break;
                    }
                    case "ChasePlayer" : {
                        ActionValue = -this.GoObjectPositionDistance(this.RoleInitialX + Math.ceil(this.RoleRelativeX + offset), this.RoleY, this.RoleZ, "right");
                        break;
                    }
                    default : {
                        break;
                    }
                }
                break;
            }
            case "MoveDown" : {
                switch(this.Strategy) {
                    case "ExploreMaze" : {
                        if(this.Memory_PreAction == "MoveUp") {
                            ActionValue -= 5;
                        }
                        if(this.Memory_Maze[this.RoleZ][this.RoleX][this.RoleInitialY + Math.ceil(this.RoleRelativeY + 5*offset)].passtimes == 0) {
                            ActionValue += 5;
                        }
                        ActionValue += this.ImaginaryGo(this.RoleX, this.RoleInitialY + Math.ceil(this.RoleRelativeY + 5*offset), this.RoleZ, "down");
                        break;
                    }
                    case "SearchMaze" : {
                        break;
                    }
                    case "ChasePlayer" : {
                        ActionValue = -this.GoObjectPositionDistance(this.RoleX, this.RoleInitialY + Math.ceil(this.RoleRelativeY + offset), this.RoleZ, "down");
                        break;
                    }
                    default : {
                        break;
                    }
                }
                break;
            }
            default : {
                break;
            }
        }
        return ActionValue;
    };
    this.StrategyThinking = function() {
        var NextStrategyList = [{Strategy : "ExploreMaze", Value : this.ValueSystem("ExploreMaze")},
                                {Strategy : "SearchMaze", Value : this.ValueSystem("SearchMaze")},
                                {Strategy : "ChasePlayer", Value : this.ValueSystem("ChasePlayer")}];
        NextStrategyList.sort(function(a, b){return b.Value-a.Value});
        for(i = NextStrategyList.length-1; i >= 1; --i) {
            if(NextStrategyList[i].Value < NextStrategyList[0].Value) {
                NextStrategyList.pop();
            }
            else {
                break;
            }
        }
        this.Strategy = NextStrategyList[RandomNum(0,NextStrategyList.length-1)].Strategy;
        // console.log(this.Strategy);
    };
      this.times = 0;
	this.ActionThinking = function() {
    //  if(this.times++%60 == 0) {
    //     console.log(this.RoleInitialX);
    //     console.log(this.RoleInitialY);
    //     console.log(this.RoleRelativeX);
    //     console.log(this.RoleRelativeY);
    //     console.log(this.Memory_Maze);
    //  }
        var NextActionList = [];
        //NextActionList.push({Action : "NoAction", Value : -10});
        if(this.Memory_Maze[this.RoleZ][this.RoleInitialX + Math.floor(this.RoleRelativeX-offset)][this.RoleY].object != "wall" 
        && Math.abs((this.RoleY) - (this.RoleInitialY + this.RoleRelativeY)) <= BorderTolerance/2) {
            NextActionList.push({Action : "MoveLeft", Value : this.ValueSystem("MoveLeft")});
        }
        if(this.Memory_Maze[this.RoleZ][this.RoleX][this.RoleInitialY + Math.floor(this.RoleRelativeY-offset)].object != "wall" 
        && Math.abs((this.RoleX) - (this.RoleInitialX + this.RoleRelativeX)) <= BorderTolerance/2) {
            NextActionList.push({Action : "MoveUp", Value : this.ValueSystem("MoveUp")});
        }
        if(this.Memory_Maze[this.RoleZ][this.RoleInitialX + Math.ceil(this.RoleRelativeX+offset)][this.RoleY].object != "wall" 
        && Math.abs((this.RoleY) - (this.RoleInitialY + this.RoleRelativeY)) <= BorderTolerance/2) {
            NextActionList.push({Action : "MoveRight", Value : this.ValueSystem("MoveRight")});
        }
        if(this.Memory_Maze[this.RoleZ][this.RoleX][this.RoleInitialY + Math.ceil(this.RoleRelativeY+offset)].object != "wall" 
        && Math.abs((this.RoleX) - (this.RoleInitialX + this.RoleRelativeX)) <= BorderTolerance/2) {
            NextActionList.push({Action : "MoveDown", Value : this.ValueSystem("MoveDown")});
        }

        // console.log(NextActionList);
        NextActionList.sort(function(a, b){return b.Value-a.Value});
        for(i = NextActionList.length-1; i >= 1; --i) {
            if(NextActionList[i].Value < NextActionList[0].Value) {
                NextActionList.pop();
            }
            else {
                break;
            }
        }
        // console.log(NextActionList[0]);
        switch(NextActionList[RandomNum(0,NextActionList.length-1)].Action) {
            case "MoveLeft" : {
                this.Action_Release_AllKey();
                this.Action_Push_KeyLeft();
                this.Memory_PreAction = "MoveLeft";
                break;
            }
            case "MoveUp" : {
                this.Action_Release_AllKey();
                this.Action_Push_KeyUp();
                this.Memory_PreAction = "MoveUp";
                break;
            }
            case "MoveRight" : {
                this.Action_Release_AllKey();
                this.Action_Push_KeyRight();
                this.Memory_PreAction = "MoveRight";
                break;
            }
            case "MoveDown" : {
                this.Action_Release_AllKey();
                this.Action_Push_KeyDown();
                this.Memory_PreAction = "MoveDown";
                break;
            }
            case "NoAction" : {
                this.Action_Release_AllKey();
                this.Memory_PreAction = "NoAction";
                break;
            }
            default : {
                break;
            }
        }
    };
    this.GetKeyboardState = function() {
        return this.KeyboardState;
    };
    this.GetName = function() {
        return this.name;
    };
    this.GetKeyboardSetting = function() {
        return this.KeyboardSetting;
    };
};
