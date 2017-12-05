// 此AI維修中
function Vega(name, role) {
    this.name = name;
    this.role = role;
    this.Memory_OtherPlayers = [];
    this.Memory_RelativePositionX = 0;
    this.Memory_PreRelativePositionX = 0;
    this.Memory_RelativePositionY = 0;
    this.Memory_PreRelativePositionY = 0;
    this.Memory_InitialPointXIndex = 0;
    this.Memory_InitialPointYIndex = 0;									
    this.Memory_Maze = []; 
    this.Memory_PreAction = "";
    this.Memory_PreActionValue = 0;
    this.Memory_PrePassed;
    this.ObjectPositionX = "unknown";
    this.ObjectPositionY = "unknown";
    this.KeyboardState = NoKey;
    this.KeyboardSetting = {KeyLeft : role.MoveLeft.bind(role), KeyUp : role.MoveUp.bind(role), KeyRight : role.MoveRight.bind(role), KeyDown : role.MoveDown.bind(role),
                                            KeyD : role.Skill1.bind(role), KeyF : role.Skill2.bind(role)};
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
    this.CollectInformation = function(Information) {
       this.Memory_PreRelativePositionX = this.Memory_RelativePositionX;
       this.Memory_PreRelativePositionY = this.Memory_RelativePositionY;
        this.Memory_RelativePositionX += Information.ChangeOfPositionX;
        this.Memory_RelativePositionY += Information.ChangeOfPositionY;
        for(var PlayerNumber = 0; PlayerNumber <= Information.OtherPlayers.length-1; ++PlayerNumber) {
            this.Memory_OtherPlayers[PlayerNumber].Name = Information.OtherPlayers[PlayerNumber].Name;
            if(Information.OtherPlayers[PlayerNumber].RelativePositionX != "unknown" && Information.OtherPlayers[PlayerNumber].RelativePositionY != "unknown") {
                this.Memory_OtherPlayers[PlayerNumber].RelativePositionX = Information.OtherPlayers[PlayerNumber].RelativePositionX + this.Memory_RelativePositionX;
                this.Memory_OtherPlayers[PlayerNumber].RelativePositionY = Information.OtherPlayers[PlayerNumber].RelativePositionY + this.Memory_RelativePositionY;
            }
            else {
                this.Memory_OtherPlayers[PlayerNumber].RelativePositionX = "unknown";
                this.Memory_OtherPlayers[PlayerNumber].RelativePositionY = "unknown";
            }
        }
        for(var x = -Math.floor(Information.Maze.length/2); x <= Math.floor(Information.Maze.length/2); ++x) {
            for(var y = -Math.floor(Information.Maze[x+Math.floor(Information.Maze.length/2)].length/2); y <= Math.floor(Information.Maze[x+Math.floor(Information.Maze.length/2)].length/2); ++y) {
                if(this.Memory_Maze[this.Memory_InitialPointXIndex + Math.round(this.Memory_RelativePositionX) + x ][this.Memory_InitialPointYIndex + Math.round(this.Memory_RelativePositionY) + y] == "unknown") {
                    this.Memory_Maze[this.Memory_InitialPointXIndex + Math.round(this.Memory_RelativePositionX) + x ][this.Memory_InitialPointYIndex + Math.round(this.Memory_RelativePositionY) + y] = Information.Maze[x + Math.floor(Information.Maze.length/2)][y + Math.floor(Information.Maze[0].length/2)];
                }
                if(this.Memory_InitialPointXIndex + Math.round(this.Memory_RelativePositionX) + x  <= 2) {
                    this.Memory_Maze.unshift([]);
                    ++this.Memory_InitialPointXIndex;
                    for(var y2 = 0; y2 < this.Memory_Maze[1].length; ++y2) {
                        this.Memory_Maze[0].push("unknown");
                    }
                }
                if(this.Memory_InitialPointYIndex + Math.round(this.Memory_RelativePositionY) + y <= 2) {
                    for(var x2 = 0; x2 < this.Memory_Maze.length; ++x2) {
                        this.Memory_Maze[x2].unshift("unknown");
                    }
                    ++this.Memory_InitialPointYIndex;
                }
                if(this.Memory_InitialPointXIndex + Math.round(this.Memory_RelativePositionX) + x  >= this.Memory_Maze.length-3) {
                    this.Memory_Maze.push([]);
                    for(var y2 = 0; y2 < this.Memory_Maze[this.Memory_Maze.length - 2].length; ++y2) {
                        this.Memory_Maze[this.Memory_Maze.length - 1].push("unknown");
                    }
                }
                if(this.Memory_InitialPointYIndex + Math.round(this.Memory_RelativePositionY) + y >= this.Memory_Maze[x+Math.floor(Information.Maze.length/2)].length-3) {
                    for(var x2 = 0; x2 < this.Memory_Maze.length; ++x2) {
                        this.Memory_Maze[x2].push("unknown");
                    }
                }
            }
        }
        if( this.Memory_OtherPlayers[0].RelativePositionX != "unknown" && this.Memory_OtherPlayers[0].RelativePositionY != "unknown")  {
            this.ObjectPositionX = this.Memory_InitialPointXIndex + Math.round(this.Memory_OtherPlayers[0].RelativePositionX);
            this.ObjectPositionY = this.Memory_InitialPointYIndex + Math.round(this.Memory_OtherPlayers[0].RelativePositionY);
        }
        if(this.Memory_InitialPointXIndex + Math.round(this.Memory_RelativePositionX) == this.ObjectPositionX && this.Memory_InitialPointYIndex + Math.round(this.Memory_RelativePositionY) == this.ObjectPositionY) {
            this.ObjectPositionX = "unknown";
            this.ObjectPositionY = "unknown";
        }
        if((Math.floor(this.Memory_RelativePositionX+offset) == Math.ceil(this.Memory_PreRelativePositionX) 
        || Math.floor(this.Memory_PreRelativePositionX) == Math.ceil(this.Memory_RelativePositionX-offset))
        && this.Memory_RelativePositionX != this.Memory_PreRelativePositionX) {
            if(this.PrePassed != this.Memory_Maze[Math.round(this.Memory_InitialPointXIndex + this.Memory_RelativePositionX)][Math.round(this.Memory_InitialPointYIndex + this.Memory_RelativePositionY)]){
                ++this.Memory_Maze[Math.round(this.Memory_InitialPointXIndex + this.Memory_RelativePositionX)][Math.round(this.Memory_InitialPointYIndex + this.Memory_RelativePositionY)].passtimes;
                this.PrePassed = this.Memory_Maze[Math.round(this.Memory_InitialPointXIndex + this.Memory_RelativePositionX)][Math.round(this.Memory_InitialPointYIndex + this.Memory_RelativePositionY)];
            }
        }
        else if((Math.floor(this.Memory_RelativePositionY+offset) == Math.ceil(this.Memory_PreRelativePositionY) 
        || Math.floor(this.Memory_PreRelativePositionY) == Math.ceil(this.Memory_RelativePositionY-offset))
        && this.Memory_RelativePositionY != this.Memory_PreRelativePositionY) {
            if(this.PrePassed != this.Memory_Maze[Math.round(this.Memory_InitialPointXIndex + this.Memory_RelativePositionX)][Math.round(this.Memory_InitialPointYIndex + this.Memory_RelativePositionY)]) {
                ++this.Memory_Maze[Math.round(this.Memory_InitialPointXIndex + this.Memory_RelativePositionX)][Math.round(this.Memory_InitialPointYIndex + this.Memory_RelativePositionY)].passtimes;
                this.PrePassed = this.Memory_Maze[Math.round(this.Memory_InitialPointXIndex + this.Memory_RelativePositionX)][Math.round(this.Memory_InitialPointYIndex + this.Memory_RelativePositionY)];
            }
        }
    };
    this.Information_Initialization = function(RoleNumber) {											
        for(var x = 0; x <= 24; ++x) {
            this.Memory_Maze.push([]);
            for(var y = 0; y <= 24; ++y) {
                this.Memory_Maze[x].push("unknown");
            }
        }
        for(var RoleNum = 0; RoleNum <= RoleNumber-1; ++RoleNum) {
            this.Memory_OtherPlayers.push({Name : "unknown", RelativePositionX : "unknown", RelativePositionY : "unknown"});
        }
        this.Memory_InitialPointXIndex = Math.floor(this.Memory_Maze.length/2);
        this.Memory_InitialPointYIndex = Math.floor(this.Memory_Maze[0].length/2);
        this.Prepassed = this.Memory_Maze[this.Memory_InitialPointXIndex][this.Memory_InitialPointYIndex];
        this.Memory_RelativePositionX = 0;
        this.Memory_RelativePositionY = 0;
    };
    // this.times = 0;
    this.ImaginaryGo = function(x,y,LastMove) {
        this.Memory_Maze[x][y].passed = true;
        // ++this.times;
        // if(this.times >= 500) {
        //     console.log(this.times);
        // }
      //  this.Memory_Maze[x][y].passed = true;
        var ValueUp = 0.01 - 0.1*this.Memory_Maze[x][y].passtimes;
        var ValueRight = 0.01 - 0.1*this.Memory_Maze[x][y].passtimes;
        var ValueDown = 0.01 - 0.1*this.Memory_Maze[x][y].passtimes;
        var ValueLeft = 0.01 - 0.1*this.Memory_Maze[x][y].passtimes;
        var direction = RandomNum(1,4);
        for(var i = 0; i <= 3; ++i) {
            switch(direction) {
                case 1: {
                    if(LastMove == "down") {
                        ++direction;
                        break;
                    }
                    if(this.Memory_Maze[x][y-1] != "unknown") {
                        if(this.Memory_Maze[x][y-1].object == "road" && this.Memory_Maze[x][y-1].passed == false) {
                            ValueUp += this.ImaginaryGo(x, y-1, "up");	
                        }
                    } 
                    else {
                        ValueUp += 10;
                    }
                    ++direction;
                    break;
                }
                
                case 2: { 
                    if(LastMove == "left") {
                        ++direction;
                        break;
                    }
                    if(this.Memory_Maze[x+1][y] != "unknown") {
                        if(this.Memory_Maze[x+1][y].object == "road" && this.Memory_Maze[x+1][y].passed == false) {
                            ValueRight += this.ImaginaryGo(x+1, y, "right");	
                        }
                    } 
                    else {
                        ValueRight += 10;
                    }
                    ++direction;
                    break;
                }
                
                case 3: {
                    if(LastMove == "up") {
                        ++direction;
                        break;
                    }
                    if(this.Memory_Maze[x][y+1] != "unknown") {
                        if(this.Memory_Maze[x][y+1].object == "road" && this.Memory_Maze[x][y+1].passed == false) {
                            ValueDown += this.ImaginaryGo(x, y+1, "down");	
                        }
                    } 
                    else {
                        ValueDown += 10;
                    }
                    ++direction;
                    break;
                }
                
                case 4: {
                    if(LastMove == "right") {
                        ++direction;
                        break;
                    }
                    if(this.Memory_Maze[x-1][y] != "unknown") {
                        if(this.Memory_Maze[x-1][y].object == "road" && this.Memory_Maze[x-1][y].passed == false) {
                            ValueLeft += this.ImaginaryGo(x-1, y, "left");	
                        }
                    } 
                    else {
                        ValueLeft += 10;
                    }
                    ++direction;
                    break;
                }
                
                case 5: {
                    if(LastMove == "down") {
                        ++direction;
                        break;
                    }
                    if(this.Memory_Maze[x][y-1] != "unknown") {
                        if(this.Memory_Maze[x][y-1].object == "road" && this.Memory_Maze[x][y-1].passed == false) {
                            ValueUp += this.ImaginaryGo(x, y-1, "up");	
                        }
                    } 
                    else {
                        ValueUp += 10;
                    }
                    ++direction;
                    break;
                }	
                
                case 6: {
                    if(LastMove == "left") {
                        ++direction;
                        break;
                    }
                    if(this.Memory_Maze[x+1][y] != "unknown") {
                        if(this.Memory_Maze[x+1][y].object == "road" && this.Memory_Maze[x+1][y].passed == false) {
                            ValueRight += this.ImaginaryGo(x+1, y, "right");
                        }
                    } 
                    else {
                        ValueRight += 10;
                    }
                    ++direction;
                    break;
                }
                
                case 7: {
                    if(LastMove == "up") {
                        ++direction;
                        break;
                    }
                    if(this.Memory_Maze[x][y+1] != "unknown") {
                        if(this.Memory_Maze[x][y+1].object == "road" && this.Memory_Maze[x][y+1].passed == false) {
                            ValueDown += this.ImaginaryGo(x, y+1, "down");	
                        }
                    } 
                    else {
                        ValueDown += 10;
                    }
                    ++direction;
                    break;
                }
                default: {
                    break;
                }
            }
        }
       this.Memory_Maze[x][y].passed = false;
        return Math.max(ValueUp, ValueRight, ValueDown, ValueLeft);
    };
    this.GoObjectPositionDistance = function(x, y, LastMove) {
        // console.log(9);
        this.Memory_Maze[x][y].passed = true;
        if(x == this.ObjectPositionX && y == this.ObjectPositionY) {
            // console.log(9);
            this.Memory_Maze[x][y].passed = false;
            return 1;
        }
        var DistanceUp = 1;
        var DistanceRight = 1;
        var DistanceDown = 1;
        var DistanceLeft = 1;
        var direction = RandomNum(1,4);
        for(var i = 0; i <= 3; ++i) {
            switch(direction) {
                case 1: {
                    if(LastMove == "down") {
                        DistanceUp = Infinity;
                        ++direction;
                        break;
                    }
                    if(this.Memory_Maze[x][y-1] != "unknown") {
                        if(this.Memory_Maze[x][y-1].object == "road" && this.Memory_Maze[x][y-1].passed == false) {
                            DistanceUp += this.GoObjectPositionDistance(x, y-1, "up");	
                        }
                        else {
                            DistanceUp = Infinity;
                        }
                    } 
                    else {
                         DistanceUp = Infinity;
                    }
                    ++direction;
                    break;
                }
                
                case 2: { 
                    if(LastMove == "left") {
                        DistanceRight = Infinity;
                        ++direction;
                        break;
                    }
                    if(this.Memory_Maze[x+1][y] != "unknown") {
                        if(this.Memory_Maze[x+1][y].object == "road" && this.Memory_Maze[x+1][y].passed == false) {
                            DistanceRight += this.GoObjectPositionDistance(x+1, y, "right");	
                        }
                        else {
                            DistanceRight = Infinity;
                        }
                    } 
                    else {
                        DistanceRight = Infinity;
                    }
                    ++direction;
                    break;
                }
                
                case 3: {
                    if(LastMove == "up") {
                        DistanceDown = Infinity;
                        ++direction;
                        break;
                    }
                    if(this.Memory_Maze[x][y+1] != "unknown") {
                        if(this.Memory_Maze[x][y+1].object == "road" && this.Memory_Maze[x][y+1].passed == false) {
                            DistanceDown += this.GoObjectPositionDistance(x, y+1, "down");	
                        }
                        else {
                            DistanceDown = Infinity;
                        }
                    } 
                    else {
                        DistanceDown = Infinity;
                    }
                    ++direction;
                    break;
                }
                
                case 4: {
                    if(LastMove == "right") {
                        DistanceLeft = Infinity;
                        ++direction;
                        break;
                    }
                    if(this.Memory_Maze[x-1][y] != "unknown") {
                        if(this.Memory_Maze[x-1][y].object == "road" && this.Memory_Maze[x-1][y].passed == false) {
                            DistanceLeft += this.GoObjectPositionDistance(x-1, y, "left");	
                        }
                        else {
                            DistanceLeft = Infinity;
                        }
                    } 
                    else {
                        DistanceLeft = Infinity;
                    }
                    ++direction;
                    break;
                }
                
                case 5: {
                    if(LastMove == "down") {
                        DistanceUp = Infinity;
                        ++direction;
                        break;
                    }
                    if(this.Memory_Maze[x][y-1] != "unknown") {
                        if(this.Memory_Maze[x][y-1].object == "road" && this.Memory_Maze[x][y-1].passed == false) {
                            DistanceUp += this.GoObjectPositionDistance(x, y-1, "up");	
                        }
                        else {
                            DistanceUp = Infinity;
                        }
                    } 
                    else {
                        DistanceUp = Infinity;
                    }
                    ++direction;
                    break;
                }	
                
                case 6: {
                    if(LastMove == "left") {
                        DistanceRight = Infinity;
                        ++direction;
                        break;
                    }
                    if(this.Memory_Maze[x+1][y] != "unknown") {
                        if(this.Memory_Maze[x+1][y].object == "road" && this.Memory_Maze[x+1][y].passed == false) {
                            DistanceRight += this.GoObjectPositionDistance(x+1, y, "right");	
                        }
                        else {
                            DistanceRight = Infinity;
                        }
                    } 
                    else {
                        DistanceRight = Infinity;
                    }
                    ++direction;
                    break;
                }
                
                case 7: {
                    if(LastMove == "up") {
                        DistanceDown = Infinity;
                        ++direction;
                        break;
                    }
                    if(this.Memory_Maze[x][y+1] != "unknown") {
                        if(this.Memory_Maze[x][y+1].object == "road" && this.Memory_Maze[x][y+1].passed == false) {
                            DistanceDown += this.GoObjectPositionDistance(x, y+1, "down");	
                        }
                        else {
                            DistanceDown = Infinity;
                        }
                    } 
                    else {
                        DistanceDown = Infinity;
                    }
                    ++direction;
                    break;
                }
                default: {
                    break;
                }
            }
        }
        this.Memory_Maze[x][y].passed = false;
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
                // if(this.ObjectPositionX != "unknown" && this.ObjectPositionY != "unknown"  ) {
                // console.log(this.Memory_Maze[this.ObjectPositionX][this.ObjectPositionY]);
                // }
                if(this.ObjectPositionX != "unknown" && this.ObjectPositionY != "unknown" && 
                    this.GoObjectPositionDistance(this.Memory_InitialPointXIndex + Math.round(this.Memory_RelativePositionX), this.Memory_InitialPointYIndex + Math.round(this.Memory_RelativePositionY), "NoLastMove") != Infinity) {
                        // console.log(this.GoObjectPositionDistance(this.Memory_InitialPointXIndex + Math.round(this.Memory_RelativePositionX), this.Memory_InitialPointYIndex + Math.round(this.Memory_RelativePositionY), "NoLastMove"));
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
                        if(this.Memory_Maze[this.Memory_InitialPointXIndex + Math.floor(this.Memory_RelativePositionX-5*offset)][this.Memory_InitialPointYIndex + Math.round(this.Memory_RelativePositionY)].passtimes == 0) {
                            ++ActionValue;
                        }
                        // this.times = 0;
                        ActionValue += this.ImaginaryGo(this.Memory_InitialPointXIndex + Math.floor(this.Memory_RelativePositionX-5*offset), this.Memory_InitialPointYIndex + Math.round(this.Memory_RelativePositionY), "left");
                        break;
                    }
                    case "SearchMaze" : {

                        break;
                    }
                    case "ChasePlayer" : {
                        ActionValue = -this.GoObjectPositionDistance(this.Memory_InitialPointXIndex + Math.floor(this.Memory_RelativePositionX - offset), this.Memory_InitialPointYIndex + Math.round(this.Memory_RelativePositionY), "left");
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
                        if(this.Memory_Maze[this.Memory_InitialPointXIndex + Math.round(this.Memory_RelativePositionX)][this.Memory_InitialPointYIndex + Math.floor(this.Memory_RelativePositionY - 5*offset)].passtimes == 0) {
                            ++ActionValue;
                        }
                        // this.times = 0;
                        ActionValue += this.ImaginaryGo(this.Memory_InitialPointXIndex + Math.round(this.Memory_RelativePositionX), this.Memory_InitialPointYIndex + Math.floor(this.Memory_RelativePositionY - 5*offset), "up");
                        break;
                    }
                    case "SearchMaze" : {
                        break;
                    }
                    case "ChasePlayer" : {
                        ActionValue = -this.GoObjectPositionDistance(this.Memory_InitialPointXIndex + Math.round(this.Memory_RelativePositionX), this.Memory_InitialPointYIndex + Math.floor(this.Memory_RelativePositionY - offset), "up");
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
                        if(this.Memory_Maze[this.Memory_InitialPointXIndex + Math.ceil(this.Memory_RelativePositionX + 5*offset)][this.Memory_InitialPointYIndex + Math.round(this.Memory_RelativePositionY)].passtimes == 0) {
                            ++ActionValue;
                        }
                        // this.times = 0;
                        ActionValue += this.ImaginaryGo(this.Memory_InitialPointXIndex + Math.ceil(this.Memory_RelativePositionX + 5*offset), this.Memory_InitialPointYIndex + Math.round(this.Memory_RelativePositionY), "right");
                        break;
                    }
                    case "SearchMaze" : {
                        break;
                    }
                    case "ChasePlayer" : {
                        ActionValue = -this.GoObjectPositionDistance(this.Memory_InitialPointXIndex + Math.ceil(this.Memory_RelativePositionX + offset), this.Memory_InitialPointYIndex + Math.round(this.Memory_RelativePositionY), "right");
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
                        if(this.Memory_Maze[this.Memory_InitialPointXIndex + Math.round(this.Memory_RelativePositionX)][this.Memory_InitialPointYIndex + Math.ceil(this.Memory_RelativePositionY + 5*offset)].passtimes == 0) {
                           ++ActionValue;
                        }
                        // this.times = 0;
                        ActionValue += this.ImaginaryGo(this.Memory_InitialPointXIndex + Math.round(this.Memory_RelativePositionX), this.Memory_InitialPointYIndex + Math.ceil(this.Memory_RelativePositionY + 5*offset), "down");
                        break;
                    }
                    case "SearchMaze" : {
                        break;
                    }
                    case "ChasePlayer" : {
                        ActionValue = -this.GoObjectPositionDistance(this.Memory_InitialPointXIndex + Math.round(this.Memory_RelativePositionX), this.Memory_InitialPointYIndex + Math.ceil(this.Memory_RelativePositionY + offset), "down");
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
        for(var i = NextStrategyList.length-1; i >= 1; --i) {
            if(NextStrategyList[i].Value < NextStrategyList[0].Value) {
                NextStrategyList.pop();
            }
            else {
                break;
            }
        }
        this.Strategy = NextStrategyList[RandomNum(0,NextStrategyList.length-1)].Strategy;
        //  console.log(this.Strategy);
    };
    //   this.times = 0;
	this.ActionThinking = function() {
    //  if(this.times++%60 == 0) {
    //      console.log(this.Memory_Maze);
    //  }
        var NextActionList = [];
        //NextActionList.push({Action : "NoAction", Value : -10});
        if(this.Memory_Maze[this.Memory_InitialPointXIndex + Math.floor(this.Memory_RelativePositionX-offset)][this.Memory_InitialPointYIndex + Math.round(this.Memory_RelativePositionY)].object == "road" 
        && Math.abs((Math.round(this.Memory_InitialPointYIndex + this.Memory_RelativePositionY)) - (this.Memory_InitialPointYIndex + this.Memory_RelativePositionY)) <= BorderTolerance/2) {
            NextActionList.push({Action : "MoveLeft", Value : this.ValueSystem("MoveLeft")});
        }
        if(this.Memory_Maze[this.Memory_InitialPointXIndex + Math.round(this.Memory_RelativePositionX)][this.Memory_InitialPointYIndex + Math.floor(this.Memory_RelativePositionY-offset)].object == "road" 
        && Math.abs((Math.round(this.Memory_InitialPointXIndex + this.Memory_RelativePositionX)) - (this.Memory_InitialPointXIndex + this.Memory_RelativePositionX)) <= BorderTolerance/2) {
            NextActionList.push({Action : "MoveUp", Value : this.ValueSystem("MoveUp")});
        }
        if(this.Memory_Maze[this.Memory_InitialPointXIndex + Math.ceil(this.Memory_RelativePositionX+offset)][this.Memory_InitialPointYIndex + Math.round(this.Memory_RelativePositionY)].object == "road" 
        && Math.abs((Math.round(this.Memory_InitialPointYIndex + this.Memory_RelativePositionY)) - (this.Memory_InitialPointYIndex + this.Memory_RelativePositionY)) <= BorderTolerance/2) {
            NextActionList.push({Action : "MoveRight", Value : this.ValueSystem("MoveRight")});
        }
        if(this.Memory_Maze[this.Memory_InitialPointXIndex + Math.round(this.Memory_RelativePositionX)][this.Memory_InitialPointYIndex + Math.ceil(this.Memory_RelativePositionY+offset)].object == "road" 
        && Math.abs((Math.round(this.Memory_InitialPointXIndex + this.Memory_RelativePositionX)) - (this.Memory_InitialPointXIndex + this.Memory_RelativePositionX)) <= BorderTolerance/2) {
            NextActionList.push({Action : "MoveDown", Value : this.ValueSystem("MoveDown")});
        }
        //  console.log(NextActionList);
        NextActionList.sort(function(a, b){return b.Value-a.Value});
        for(var i = NextActionList.length-1; i >= 1; --i) {
            if(NextActionList[i].Value < NextActionList[0].Value) {
                NextActionList.pop();
            }
            else {
                break;
            }
        }
        //   console.log(NextActionList[0]);
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
