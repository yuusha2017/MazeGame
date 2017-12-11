// 所有未知的變數如未特別命名皆為unknown
var Control = {
    state : "GameMenuScene",      
    EventListener1 : function() {},
    EventListener2 : function() {},
    GameOver : false,
    winner : "unknown",
    RoleList : [],
    PlayerList : [],
    AIMaze : [],
    AIList : [],
    ItemList : [],
    audio : document.createElement("audio"),
    LastTimeStamp : 0,
    AINumber : 1,
    ViewRoleNum : 0,                    // 觀賞哪個角色視角
    OpeRoleNum : 0,                     // 操作哪個角色

    start : function() {
        this.LoadGameMenuScene ();
    },

    LoadGameMenuScene : function() {
        LoadImage();
        this.state = "GameMenuScene";
        this.LoadingScene();			// temp
        GameMenuScene.RecreateMenuItems();
        GameMenuScene.render();
        this.StartGameMenuSelect();
    },
    
    LoadingScene : function() {
        // add sth here.
    },
    
    StartGameMenuSelect : function() {
        this.EventListener1 = this.GameMenuSelect.bind(this);
        window.addEventListener("keydown", this.EventListener1);
    },	

    StartOptionSelect : function() {
        this.EventListener1 = this.OptionSelect.bind(this);
        window.addEventListener("keydown", this.EventListener1);
    },
    
    GameMenuSelect : function(e) {
        switch(e.keyCode) {
            case(13): {
                removeEventListener("keydown", this.EventListener1);
                this.EventListener1 = function() {};
                switch(GameMenuScene.GetSelection()) {
                    case 0: {
                        GameMenuScene.clear();
                        this.Single();
                        break;
                    }
                    case 1: {
                        GameMenuScene.clear();
                        this.Multiplayer();
                        break;
                    }
                    case 2: {
                        GameMenuScene.clear();
                        this.Exit();
                        break;
                    }
                    case 3: {
                        GameMenuScene.clear();
                        this.Option();
                        break;
                    }
                    default: break;	
                }
                break;
            }
            case(38): {
                GameMenuScene.Up(); 
                break;
            }
            case(40): {
                GameMenuScene.Down();
                break;
            }
            default: {
                break;
            }
        };
    },	

    OptionSelect : function(e) {
        switch(e.keyCode) {
            case(13): {
                if(OptionScene.GetState() == "MazeValueSetting") {
                    OptionScene.OnSelect();
                }
                else if(OptionScene.GetSelection() == 3) {
                    OptionScene.clear();
                    removeEventListener("keydown", this.EventListener1);
                    this.LoadGameMenuScene();
                }
                else {
                    OptionScene.UnSelect();
                    OptionScene.OnMazeValueSelect();
                }
                break;
            }
            case(37) : {
                OptionScene.Left();
                break;
            }
            case(38): {
                OptionScene.Up(); 
                break;
            }
            case(39): {
                OptionScene.Right();
                break;
            }
            case(40): {
                OptionScene.Down();
                break;
            }
            default: {
                break;
            }
        };
    },
    
    Single : function() {
        this.LastTimeStamp = window.performance.now() - 17;      // 不清楚的時間問題
        GameScene.UpdateMaze(OptionScene.GetMazeLength(), OptionScene.GetMazeWidth(), OptionScene.GetMazeHeight());
        this.LoadGameScene();
    },

    Multiplayer : function() {

    },

    Option : function() {
        this.LoadOptionScene();
    },

    Exit : function() {
        window.close();
    },

    LoadGameScene : function() {
        this.state = "GameScene";
        this.transition();			// temp
        this.RoleList = [new Sheep(0,0,0)];
        this.PlayerList = [new Player("Player1", this.RoleList[0])];
        for(AINum = 0; AINum < this.AINumber; ++AINum) {
            this.RoleList.push(new Wolf(0,0,0));
            this.AIList.push(new Vega("Vega"+(AINum+1), this.RoleList[AINum+1]));
        }
        RoleListLength = this.RoleList.length;
        AIListLength = this.AIList.length;
        this.RoleList[0].SetOperator(this.PlayerList[this.OpeRoleNum]);
        for(AINum = 0; AINum < AIListLength; ++AINum) {
            this.RoleList[AINum+1].SetOperator(this.AIList[AINum]);
        }
        WaitDrawObjects.objects.push(new Exit(0,0,0));
        WaitDrawObjects.objects.push(new Treasure(0,0,0));
        for(RoleNum = 0; RoleNum < RoleListLength; ++RoleNum) {
            WaitDrawObjects.objects.push(this.RoleList[RoleNum]);
        }
        for(AINum = 0; AINum < AIListLength; ++AINum) {
            this.AIMaze.push(MazeCopier(GameScene.maze));
        }
        for(AINum = 0; AINum < AIListLength; ++AINum) {
            this.AIList[AINum].Info_Init(RoleListLength-1);
        }
        ObjectPositionInit(GameScene.maze, this.RoleList);
        GameScene.SetFixedSL((window.innerHeight*window.devicePixelRatio)/2/5);
        GameScene.SetSL(4*(window.innerHeight*window.devicePixelRatio)/2/5/(this.RoleList[this.ViewRoleNum].GetViewScope()));
        this.StartGame();
    },

    LoadOptionScene : function() {
        this.state = "OptionScene";
        OptionScene.RecreateMenuItems();
        OptionScene.render();
        this.StartOptionSelect();
    },

    transition : function() {
        // add sth here.
    },
    
    StartGame : function() {
        GameScene.AllBlack();
        this.EventListener1 = this.KeyDownEventHandler.bind(this);
        this.EventListener2 = this.KeyUpEventHandler.bind(this);
        window.addEventListener("keydown", this.EventListener1);
        window.addEventListener("keyup", this.EventListener2);
        this.RequestID = requestAnimationFrame(this.UpdateGameProgress.bind(this));
        this.audio.setAttribute("src","heartbeat-01a.mp3");
        this.audio.setAttribute("autoplay", "autoplay");
        this.audio.setAttribute("loop", "loop");
        document.body.appendChild(this.audio);
    },
    
    KeyDownEventHandler : function(e) {
        switch(e.keyCode) {
            case 37 : {
                this.PlayerList[this.OpeRoleNum].SetKeyboardState(this.PlayerList[this.OpeRoleNum].GetKeyboardState() | KeyLeft);  
                break;
            }
            case 38 : {
                this.PlayerList[this.OpeRoleNum].SetKeyboardState(this.PlayerList[this.OpeRoleNum].GetKeyboardState() | KeyUp);   
                break;
            }
            case 39 : {
                this.PlayerList[this.OpeRoleNum].SetKeyboardState(this.PlayerList[this.OpeRoleNum].GetKeyboardState() | KeyRight);   
                break;
            }
            case 40 : {
                this.PlayerList[this.OpeRoleNum].SetKeyboardState(this.PlayerList[this.OpeRoleNum].GetKeyboardState() | KeyDown);  
                break;
            }
            case 68 : {
                this.PlayerList[this.OpeRoleNum].SetKeyboardState(this.PlayerList[this.OpeRoleNum].GetKeyboardState() | KeyD);   
                break;
            }
            case 70 : {
                this.PlayerList[this.OpeRoleNum].SetKeyboardState(this.PlayerList[this.OpeRoleNum].GetKeyboardState() | KeyF);   
                break;
            }
            case 81 : {
                this.PlayerList[this.OpeRoleNum].SetKeyboardState(this.PlayerList[this.OpeRoleNum].GetKeyboardState() | KeyQ);   
                break;
            }
            case 87 : {
                this.PlayerList[this.OpeRoleNum].SetKeyboardState(this.PlayerList[this.OpeRoleNum].GetKeyboardState() | KeyW);   
                break;
            }
            default: {
                break;
            }
        };
    },

    KeyUpEventHandler : function(e) {
        switch(e.keyCode) {
            case 37 : {
                this.PlayerList[this.OpeRoleNum].SetKeyboardState(this.PlayerList[this.OpeRoleNum].GetKeyboardState() & (AllKey - KeyLeft));   
                break;
            }
            case 38 : {
                this.PlayerList[this.OpeRoleNum].SetKeyboardState(this.PlayerList[this.OpeRoleNum].GetKeyboardState() & (AllKey - KeyUp));   
                break;
            }
            case 39 : {
                this.PlayerList[this.OpeRoleNum].SetKeyboardState(this.PlayerList[this.OpeRoleNum].GetKeyboardState() & (AllKey - KeyRight));  
                break;
            }
            case 40 
            : {
                this.PlayerList[this.OpeRoleNum].SetKeyboardState(this.PlayerList[this.OpeRoleNum].GetKeyboardState() & (AllKey - KeyDown)); 
                break;
            }
            case 68 : {
                this.PlayerList[this.OpeRoleNum].SetKeyboardState(this.PlayerList[this.OpeRoleNum].GetKeyboardState() & (AllKey - KeyD));   
                break;
            }
            case 70 : {
                this.PlayerList[this.OpeRoleNum].SetKeyboardState(this.PlayerList[this.OpeRoleNum].GetKeyboardState() & (AllKey - KeyF));   
                break;
            }
            case 81 : {
                this.PlayerList[this.OpeRoleNum].SetKeyboardState(this.PlayerList[this.OpeRoleNum].GetKeyboardState() & (AllKey - KeyQ));   
                break;
            }
            case 87 : {
                this.PlayerList[this.OpeRoleNum].SetKeyboardState(this.PlayerList[this.OpeRoleNum].GetKeyboardState() & (AllKey - KeyW));   
                break;
            }
            default: {
                break;
            }
        };
    },   
    UpdateGameProgress : function(timestamp) {
        var progress = (timestamp - this.LastTimeStamp)/1000;
        this.LastTimeStamp = timestamp;
        GameTime += progress;

        for(AINum = 0; AINum < AIListLength; ++AINum) {
            this.AIList[AINum].StrategyThinking();
         }
        for(AINum = 0; AINum < AIListLength; ++AINum) {
            this.AIList[AINum].CollectInfo(GetAIAvailableInfo(this.AIList[AINum].GetRole(), this.RoleList, this.AIMaze[AINum]));
            this.AIList[AINum].ActionThinking();
        }
        for(RoleNum = 0; RoleNum < RoleListLength; ++RoleNum) {
            for(ItemNum = 0; ItemNum <= 7; ++ItemNum) {
                if(this.RoleList[RoleNum].GetItem(ItemNum) != "NoItem") {
                    this.RoleList[RoleNum].GetItem(ItemNum).PassiveUse();
                }
            }
            this.RoleList[RoleNum].SetPrePosition(this.RoleList[RoleNum].getX(), this.RoleList[RoleNum].getY(), this.RoleList[RoleNum].getZ());

            if(Math.round(this.RoleList[RoleNum].getZ()) == this.RoleList[RoleNum].getZ()) {
                if((this.RoleList[RoleNum].GetOperator().GetKeyboardState() & KeyLeft) == KeyLeft) {
                    this.RoleList[RoleNum].MoveLeft(progress);
                }
                else if((this.RoleList[RoleNum].GetOperator().GetKeyboardState() & KeyUp) == KeyUp) {
                    this.RoleList[RoleNum].MoveUp(progress);
                }
                else if((this.RoleList[RoleNum].GetOperator().GetKeyboardState() & KeyRight) == KeyRight) {
                    this.RoleList[RoleNum].MoveRight(progress);
                }
                else if((this.RoleList[RoleNum].GetOperator().GetKeyboardState() & KeyDown) == KeyDown) {
                    this.RoleList[RoleNum].MoveDown(progress);
                }
                if((this.RoleList[RoleNum].GetOperator().GetKeyboardState() & KeyD) == KeyD) {
                    this.RoleList[RoleNum].Skill1();
                }
                if((this.RoleList[RoleNum].GetOperator().GetKeyboardState() & KeyF) == KeyF) {
                    this.RoleList[RoleNum].Skill2();
                }
            }
            if((this.RoleList[RoleNum].GetOperator().GetKeyboardState() & KeyQ) == KeyQ) {
                if( GameScene.ChangeItemAnimationRequest == false) {
                    this.RoleList[RoleNum].SetItemSelection(this.RoleList[RoleNum].GetItemSelection()-1);
                    if(this.RoleList[RoleNum].GetItemSelection() < 0) {
                        this.RoleList[RoleNum].SetItemSelection(7);
                    }
                }
                GameScene.ChangeItemAnimationRequest = true;
                GameScene.ItemChangeDirection = "counterclockwise";
            }
            if((this.RoleList[RoleNum].GetOperator().GetKeyboardState() & KeyW) == KeyW) {
                if( GameScene.ChangeItemAnimationRequest == false) {
                    this.RoleList[RoleNum].SetItemSelection(this.RoleList[RoleNum].GetItemSelection()+1);
                    if(this.RoleList[RoleNum].GetItemSelection() > 7) {
                        this.RoleList[RoleNum].SetItemSelection(0);
                    }
                }
                GameScene.ChangeItemAnimationRequest = true;
                GameScene.ItemChangeDirection = "clockwise";
            }
            PositionCorrection(GameScene.maze[Math.round(this.RoleList[RoleNum].getZ())], this.RoleList[RoleNum]);      // 無法符合斜角走的要求，需更正

            // 上樓下樓
            if(Math.round(this.RoleList[RoleNum].getX()) == this.RoleList[RoleNum].getX() && Math.round(this.RoleList[RoleNum].getY()) == this.RoleList[RoleNum].getY() && (this.RoleList[RoleNum].GetPreX() != this.RoleList[RoleNum].getX() || this.RoleList[RoleNum].GetPreY() != this.RoleList[RoleNum].getY()) && GameScene.maze[Math.round(this.RoleList[RoleNum].getZ())][this.RoleList[RoleNum].getX()][this.RoleList[RoleNum].getY()].object == "PassageUp" || this.RoleList[RoleNum].GetState() == "GoUp") {
                this.RoleList[RoleNum].SetState("GoUp");
                this.RoleList[RoleNum].setZ(this.RoleList[RoleNum].getZ() + 1/60);
                if(RoleNum == this.ViewRoleNum) {
                    GameScene.GoUpAnimationRequest = true;
                }
                if(Math.floor(this.RoleList[RoleNum].GetPreZ()) != Math.floor(this.RoleList[RoleNum].getZ())) {
                    this.RoleList[RoleNum].setZ(Math.round(this.RoleList[RoleNum].getZ()));
                    this.RoleList[RoleNum].SetState("visible");
                    if(RoleNum == this.ViewRoleNum) {
                        GameScene.GoUpAnimationRequest = false;
                    }
                }
            }
            else if(Math.round(this.RoleList[RoleNum].getX()) == this.RoleList[RoleNum].getX() && Math.round(this.RoleList[RoleNum].getY()) == this.RoleList[RoleNum].getY() && (this.RoleList[RoleNum].GetPreX() != this.RoleList[RoleNum].getX() || this.RoleList[RoleNum].GetPreY() != this.RoleList[RoleNum].getY()) && GameScene.maze[Math.round(this.RoleList[RoleNum].getZ())][this.RoleList[RoleNum].getX()][this.RoleList[RoleNum].getY()].object == "PassageDown" || this.RoleList[RoleNum].GetState() == "GoDown") {
                this.RoleList[RoleNum].SetState("GoDown");
                this.RoleList[RoleNum].setZ(this.RoleList[RoleNum].getZ() - 1/60);
                if(RoleNum == this.ViewRoleNum) {
                    GameScene.GoDownAnimationRequest = true;
                }
                if(Math.ceil(this.RoleList[RoleNum].GetPreZ()) != Math.ceil(this.RoleList[RoleNum].getZ())) {
                    this.RoleList[RoleNum].setZ(Math.round(this.RoleList[RoleNum].getZ()));
                    this.RoleList[RoleNum].SetState("visible");
                    if(RoleNum == this.ViewRoleNum) {
                        GameScene.GoDownAnimationRequest = false;
                    }
                }
            }

            if(this.RoleList[RoleNum].GetIdentity() == "TreasureHunter" && ReachDetermination(this.RoleList[RoleNum], WaitDrawObjects.objects[1]) == true) {
                WaitDrawObjects.objects[1].SetOwner(this.RoleList[RoleNum]);
            }
            for(ItemNum = 0; ItemNum < this.ItemList.length; ++ItemNum) {
                if(ReachDetermination(this.RoleList[RoleNum], this.ItemList[ItemNum]) == true && this.ItemList[ItemNum].GetOwner() == "NoOwner") {
                    this.ItemList[ItemNum].SetOwner(this.RoleList[RoleNum]);
                    this.RoleList[RoleNum].SetItem(this.ItemList[ItemNum]);
                }
            }
            for(OtherRoleNum = 0; OtherRoleNum < RoleListLength; ++OtherRoleNum) {
                if(RoleNum == OtherRoleNum) {
                    continue;
                }
                if(this.RoleList[RoleNum].GetIdentity() != this.RoleList[OtherRoleNum].GetIdentity() 
                && ReachDetermination(this.RoleList[RoleNum], this.RoleList[OtherRoleNum]) == true) {
                    this.GameOver = true;
                }
            }
            if(this.RoleList[RoleNum] == WaitDrawObjects.objects[1].GetOwner() && ReachDetermination(this.RoleList[RoleNum], WaitDrawObjects.objects[0]) == true) {
                this.winner = "TreasureHunter";
                this.GameOver = true;
            }
        }

        // 心跳音效
        var distance;
        var ShortestDistance = Infinity;
        for(RoleNum = 1; RoleNum < RoleListLength; ++ RoleNum) {
            distance = Math.pow(Math.pow(this.RoleList[this.OpeRoleNum].getX() - this.RoleList[RoleNum].getX(), 2) + Math.pow(this.RoleList[this.OpeRoleNum].getY() - this.RoleList[RoleNum].getY(), 2), 0.5);
            if(distance < ShortestDistance && this.RoleList[RoleNum].getZ() == this.RoleList[this.OpeRoleNum].getZ()) {
                ShortestDistance = distance;
            }
        }
        if(ShortestDistance <= 10) {
            this.audio.playbackRate = 3 - ShortestDistance/5;
        }


        if(this.GameOver == true) {
            this.EndGame();
        }
        else {
            // console.time('GameScene.UpdateViewScope');
            GameScene.UpdateViewScope(this.RoleList[this.ViewRoleNum]);
            ++CalFPS;
            TimeElapsed += progress;
            if(TimeElapsed > 0.5) {
                FPS = Math.round(CalFPS/TimeElapsed);
                CalFPS = 0;
                TimeElapsed = 0;
            }
            if(window.devicePixelRatio <= 1.5) {
                GCCT.fillStyle = "Black";
                GCCT.fillRect(0,0,210,50);
            }
                GCCT.strokeStyle = "White";
                GCCT.textAlign = "left";
                GCCT.textBaseline = "top";
                GCCT.lineWidth = 2;            
                GCCT.strokeText("FPS : " + FPS, 0, 0);
            // console.timeEnd('GameScene.UpdateViewScope');
            requestAnimationFrame(this.UpdateGameProgress.bind(this));
        }
    },		

    getState : function() {
        return this.state;
    },

    EndGame : function() {
        window.removeEventListener("keydown", this.EventListener1);
        window.removeEventListener("keyup", this.EventListener2);
        document.body.removeChild(this.audio);
        if(this.winner == "TreasureHunter") {
            console.log("You success!");
        }
        else {
            console.log("You have been catched!");
        }
        this.ResetGame();
        this.LoadGameMenuScene();
    },

    ResetGame : function() {
        this.GameOver = false;
        this.winner = "unknown";
        for(AINum = 0; AINum < AIListLength; ++AINum) {
            this.AIMaze.pop();
        }
        WaitDrawObjects.objects.splice(0,WaitDrawObjects.objects.length);
        AngleOffset = 0;
    }
}