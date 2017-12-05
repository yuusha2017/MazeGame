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
                        this.Option();
                        break;
                    }
                    case 3: {
                        GameMenuScene.clear();
                        this.Exit();
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
                if(OptionScene.GetState() == "MazeLengthSetting" || OptionScene.GetState() == "MazeWidthSetting" || OptionScene.GetState() == "MazeHeightSetting") {
                    OptionScene.OnSelect();
                    OptionScene.SetState("OptionSelect");
                    break;
                }
                switch(OptionScene.GetSelection()) {
                    case 0 : {
                        OptionScene.ClearMenuItem(0);
                        GCCT.fillStyle = "RGB(210,210,210)";
                        OptionScene.OnMazeLengthSelect();
                        OptionScene.SetState("MazeLengthSetting");
                        break;
                    }
                    case 1 : {
                        OptionScene.ClearMenuItem(1);
                        GCCT.fillStyle = "RGB(210,210,210)";
                        OptionScene.OnMazeWidthSelect();
                        OptionScene.SetState("MazeWidthSetting");
                        break;
                    }
                    case 2 : {
                        OptionScene.ClearMenuItem(2);
                        GCCT.fillStyle = "RGB(210,210,210)";
                        OptionScene.OnMazeHeightSelect();
                        OptionScene.SetState("MazeHeightSetting");
                        break;
                    }
                    case 3 : {
                        OptionScene.clear();
                        removeEventListener("keydown", this.EventListener1);
                        this.EventListener1 = function() {};
                        this.LoadGameMenuScene();
                        break;
                    }
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
        this.RoleList = [new Wolf(0,0,0)
                                  /*, new Wolf(0,0,0)*/];
        this.PlayerList = [new Player("Player1", this.RoleList[0])];
        // this.AIList = [new Vega("Vega1", this.RoleList[1])];
        this.RoleList[0].SetOperator(this.PlayerList[0]);
        // this.RoleList[1].SetOperator(this.AIList[0]);
        WaitDrawObjects.objects.push(new Exit(0,0,0));
        WaitDrawObjects.objects.push(new Treasure(0,0,0));
        WaitDrawObjects.objects.push(this.RoleList[0]);
        // WaitDrawObjects.objects.push(this.RoleList[1]);
        for(var AINumber = 0; AINumber <= this.AIList.length-1; ++AINumber) {
            this.AIMaze.push(MazeCopier(GameScene.maze));
        }
       // console.log("start");
        //console.log(GameScene.maze);
        //console.log(this.AIMaze[0]);
        //console.log(this.AIMaze[0]);
        //console.log("passed = true");    
        //this.AIMaze[0][0][0].passed = true;  // 順序奇怪
        //console.log("passed = end");
        //GameScene.render();
        for(var AINumber = 0; AINumber <= this.AIList.length - 1; ++AINumber) {
            this.AIList[AINumber].Information_Initialization(this.RoleList.length-1);
        }
        ObjectPositionInitialization(GameScene.maze, this.RoleList);
        GameScene.SetFixedSL((window.innerHeight*window.devicePixelRatio)/2/5);
        GameScene.SetSL(4*(window.innerHeight*window.devicePixelRatio)/2/5/(this.RoleList[0].GetViewScope()));
        // WaitDrawObjects.objects.push(new SpeedShoes(1,1));
        // this.ItemList.push(WaitDrawObjects.objects[WaitDrawObjects.objects.length-1]);
        // WaitDrawObjects.objects.push(new SpeedShoes(1,2));
        // this.ItemList.push(WaitDrawObjects.objects[WaitDrawObjects.objects.length-1]);
        // WaitDrawObjects.objects.push(new SpeedShoes(1,3));
        // this.ItemList.push(WaitDrawObjects.objects[WaitDrawObjects.objects.length-1]);
        // WaitDrawObjects.objects.push(new SpeedShoes(1,4));
        // this.ItemList.push(WaitDrawObjects.objects[WaitDrawObjects.objects.length-1]);
        // WaitDrawObjects.objects.push(new SpeedShoes(1,5));
        // this.ItemList.push(WaitDrawObjects.objects[WaitDrawObjects.objects.length-1]);
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
        this.LastTimeStamp = performance.now();
        this.RequestID = requestAnimationFrame(this.UpdateGameProgress.bind(this));
        this.audio.setAttribute("src","heartbeat-01a.mp3");
        this.audio.setAttribute("autoplay", "autoplay");
        this.audio.setAttribute("loop", "loop");
        // this.audio.muted = true;
        document.body.appendChild(this.audio);
        // console.log(GameScene.maze);
    },

    TransInformation : function() {
        for(var AINumber = 0; AINumber <= this.AIList.length-1; ++AINumber) {
            this.AIList[AINumber].CollectInformation(GetAIAvailableInformation(this.AIList[AINumber].GetRole(), this.RoleList, this.AIMaze[AINumber]));
            this.AIList[AINumber].ActionThinking();
        }
    },
    
    KeyDownEventHandler : function(e) {
        switch(e.keyCode) {
            case(37): {
                this.PlayerList[0].SetKeyboardState(this.PlayerList[0].GetKeyboardState() | KeyLeft);  
                break;
            }
            case(38): {
                this.PlayerList[0].SetKeyboardState(this.PlayerList[0].GetKeyboardState() | KeyUp);   
                break;
            }
            case(39): {
                this.PlayerList[0].SetKeyboardState(this.PlayerList[0].GetKeyboardState() | KeyRight);   
                break;
            }
            case(40): {
                this.PlayerList[0].SetKeyboardState(this.PlayerList[0].GetKeyboardState() | KeyDown);  
                break;
            }
            case 68 : {
                this.PlayerList[0].SetKeyboardState(this.PlayerList[0].GetKeyboardState() | KeyD);   
                break;
            }
            case 70 : {
                this.PlayerList[0].SetKeyboardState(this.PlayerList[0].GetKeyboardState() | KeyF);   
                break;
            }
            case 81 : {
                this.PlayerList[0].SetKeyboardState(this.PlayerList[0].GetKeyboardState() | KeyQ);   
                break;
            }
            case 87 : {
                this.PlayerList[0].SetKeyboardState(this.PlayerList[0].GetKeyboardState() | KeyW);   
                break;
            }
            default: {
                break;
            }
        };
    },

    KeyUpEventHandler : function(e) {
        switch(e.keyCode) {
            case(37): {
                this.PlayerList[0].SetKeyboardState(this.PlayerList[0].GetKeyboardState() & (AllKey - KeyLeft));   
                break;
            }
            case(38): {
                this.PlayerList[0].SetKeyboardState(this.PlayerList[0].GetKeyboardState() & (AllKey - KeyUp));   
                break;
            }
            case(39): {
                this.PlayerList[0].SetKeyboardState(this.PlayerList[0].GetKeyboardState() & (AllKey - KeyRight));  
                break;
            }
            case(40): {
                this.PlayerList[0].SetKeyboardState(this.PlayerList[0].GetKeyboardState() & (AllKey - KeyDown)); 
                break;
            }
            case 68 : {
                this.PlayerList[0].SetKeyboardState(this.PlayerList[0].GetKeyboardState() & (AllKey - KeyD));   
                break;
            }
            case 70 : {
                this.PlayerList[0].SetKeyboardState(this.PlayerList[0].GetKeyboardState() & (AllKey - KeyF));   
                break;
            }
            case 81 : {
                this.PlayerList[0].SetKeyboardState(this.PlayerList[0].GetKeyboardState() & (AllKey - KeyQ));   
                break;
            }
            case 87 : {
                this.PlayerList[0].SetKeyboardState(this.PlayerList[0].GetKeyboardState() & (AllKey - KeyW));   
                break;
            }
            default: {
                break;
            }
        };
    },   

    UpdateGameProgress : function(timestamp) {
        var progress = this.LastTimeStamp - timestamp;
        for(var AINumber = 0; AINumber <= this.AIList.length-1; ++AINumber) {
            this.AIList[AINumber].StrategyThinking();
         }
         this.TransInformation();
        for(var RoleNumber = 0; RoleNumber <= this.RoleList.length-1; ++RoleNumber) {
            for(var ItemNumber = 0; ItemNumber <= 7; ++ItemNumber) {
                if(this.RoleList[RoleNumber].GetItem(ItemNumber) != "NoItem") {
                    this.RoleList[RoleNumber].GetItem(ItemNumber).PassiveUse();
                }
            }

            // 目前不支援斜角移動
            /*
            if((this.RoleList[RoleNumber].GetOperator().GetKeyboardState() & (KeyLeft + KeyUp)) == (KeyLeft + KeyUp)) {
                MoveLeftUp(this.RoleList[RoleNumber]);
            }
            else if((this.RoleList[RoleNumber].GetOperator().GetKeyboardState() & (KeyUp + KeyRight)) == (KeyUp + KeyRight)) {
                MoveRightUp(this.RoleList[RoleNumber]);
            }
            else if((this.RoleList[RoleNumber].GetOperator().GetKeyboardState() & (KeyRight + KeyDown)) == (KeyRight + KeyDown)) {
                MoveRightDown(this.RoleList[RoleNumber]);
            }
            else if((this.RoleList[RoleNumber].GetOperator().GetKeyboardState() & (KeyDown + KeyLeft)) == (KeyDown + KeyLeft)) {
                MoveLeftDown(this.RoleList[RoleNumber]);
            }
            */
            if(Math.round(this.RoleList[RoleNumber].getZ()) == this.RoleList[RoleNumber].getZ()) {
                if((this.RoleList[RoleNumber].GetOperator().GetKeyboardState() & KeyLeft) == KeyLeft) {
                    this.RoleList[RoleNumber].GetOperator().GetKeyboardSetting().KeyLeft(this.RoleList[RoleNumber]);
                }
                else if((this.RoleList[RoleNumber].GetOperator().GetKeyboardState() & KeyUp) == KeyUp) {
                    this.RoleList[RoleNumber].GetOperator().GetKeyboardSetting().KeyUp(this.RoleList[RoleNumber]);
                }
                else if((this.RoleList[RoleNumber].GetOperator().GetKeyboardState() & KeyRight) == KeyRight) {
                    this.RoleList[RoleNumber].GetOperator().GetKeyboardSetting().KeyRight(this.RoleList[RoleNumber]);
                }
                else if((this.RoleList[RoleNumber].GetOperator().GetKeyboardState() & KeyDown) == KeyDown) {
                    this.RoleList[RoleNumber].GetOperator().GetKeyboardSetting().KeyDown(this.RoleList[RoleNumber]);
                }
                if((this.RoleList[RoleNumber].GetOperator().GetKeyboardState() & KeyD) == KeyD) {
                    this.RoleList[RoleNumber].GetOperator().GetKeyboardSetting().KeyD(this.RoleList[RoleNumber]);
                }
                if((this.RoleList[RoleNumber].GetOperator().GetKeyboardState() & KeyF) == KeyF) {
                    this.RoleList[RoleNumber].GetOperator().GetKeyboardSetting().KeyF(this.RoleList[RoleNumber]);
                }
            }
            if((this.RoleList[RoleNumber].GetOperator().GetKeyboardState() & KeyQ) == KeyQ) {
                if( GameScene.ChangeItemAnimationRequest == false) {
                    this.RoleList[RoleNumber].SetItemSelection(this.RoleList[RoleNumber].GetItemSelection()-1);
                    if(this.RoleList[RoleNumber].GetItemSelection() < 0) {
                        this.RoleList[RoleNumber].SetItemSelection(7);
                    }
                }
                GameScene.ChangeItemAnimationRequest = true;
                GameScene.ItemChangeDirection = "counterclockwise";
            }
            if((this.RoleList[RoleNumber].GetOperator().GetKeyboardState() & KeyW) == KeyW) {
                if( GameScene.ChangeItemAnimationRequest == false) {
                    this.RoleList[RoleNumber].SetItemSelection(this.RoleList[RoleNumber].GetItemSelection()+1);
                    if(this.RoleList[RoleNumber].GetItemSelection() > 7) {
                        this.RoleList[RoleNumber].SetItemSelection(0);
                    }
                }
                GameScene.ChangeItemAnimationRequest = true;
                GameScene.ItemChangeDirection = "clockwise";
            }
            PositionCorrection(GameScene.maze[Math.round(this.RoleList[RoleNumber].getZ())], this.RoleList[RoleNumber]);      // 無法符合斜角走的要求，需更正

            // 上樓下樓
            if(Math.round(this.RoleList[RoleNumber].getX()) == this.RoleList[RoleNumber].getX() && Math.round(this.RoleList[RoleNumber].getY()) == this.RoleList[RoleNumber].getY() && (this.RoleList[RoleNumber].GetPreX() != this.RoleList[RoleNumber].getX() || this.RoleList[RoleNumber].GetPreY() != this.RoleList[RoleNumber].getY()) && GameScene.maze[Math.round(this.RoleList[RoleNumber].getZ())][this.RoleList[RoleNumber].getX()][this.RoleList[RoleNumber].getY()].object == "PassageUp" || this.RoleList[RoleNumber].GetState() == "GoUp") {
                console.log(Math.round(this.RoleList[RoleNumber].getZ()));
                this.RoleList[RoleNumber].SetPrePosition(this.RoleList[RoleNumber].getX(),this.RoleList[RoleNumber].getY(), this.RoleList[RoleNumber].getZ());
                this.RoleList[RoleNumber].SetState("GoUp");
                this.RoleList[RoleNumber].setZ(this.RoleList[RoleNumber].getZ() + 1/60);
                if(RoleNumber == 0) {
                    GameScene.GoUpAnimationRequest = true;
                }
                if(Math.floor(this.RoleList[RoleNumber].GetPreZ()) != Math.floor(this.RoleList[RoleNumber].getZ())) {
                    this.RoleList[RoleNumber].setZ(Math.round(this.RoleList[RoleNumber].getZ()));
                    this.RoleList[RoleNumber].SetState("visible");
                    if(RoleNumber == 0) {
                        GameScene.GoUpAnimationRequest = false;
                    }
                }
            }
            else if(Math.round(this.RoleList[RoleNumber].getX()) == this.RoleList[RoleNumber].getX() && Math.round(this.RoleList[RoleNumber].getY()) == this.RoleList[RoleNumber].getY() && (this.RoleList[RoleNumber].GetPreX() != this.RoleList[RoleNumber].getX() || this.RoleList[RoleNumber].GetPreY() != this.RoleList[RoleNumber].getY()) && GameScene.maze[Math.round(this.RoleList[RoleNumber].getZ())][this.RoleList[RoleNumber].getX()][this.RoleList[RoleNumber].getY()].object == "PassageDown" || this.RoleList[RoleNumber].GetState() == "GoDown") {
                console.log(Math.round(this.RoleList[RoleNumber].getZ()));
                this.RoleList[RoleNumber].SetPrePosition(this.RoleList[RoleNumber].getX(), this.RoleList[RoleNumber].getY(), this.RoleList[RoleNumber].getZ());
                this.RoleList[RoleNumber].SetState("GoDown");
                this.RoleList[RoleNumber].setZ(this.RoleList[RoleNumber].getZ() - 1/60);
                if(RoleNumber == 0) {
                    GameScene.GoDownAnimationRequest = true;
                }
                if(Math.ceil(this.RoleList[RoleNumber].GetPreZ()) != Math.ceil(this.RoleList[RoleNumber].getZ())) {
                    this.RoleList[RoleNumber].setZ(Math.round(this.RoleList[RoleNumber].getZ()));
                    this.RoleList[RoleNumber].SetState("visible");
                    if(RoleNumber == 0) {
                        GameScene.GoDownAnimationRequest = false;
                    }
                }
            }

            if(this.RoleList[RoleNumber].GetIdentity() == "TreasureHunter" && ReachDetermination(this.RoleList[RoleNumber], WaitDrawObjects.objects[1]) == true) {
                WaitDrawObjects.objects[1].SetOwner(this.RoleList[RoleNumber]);
            }
            for(var ItemNumber = 0; ItemNumber <= this.ItemList.length-1; ++ItemNumber) {
                if(ReachDetermination(this.RoleList[RoleNumber], this.ItemList[ItemNumber]) == true && this.ItemList[ItemNumber].GetOwner() == "NoOwner") {
                    this.ItemList[ItemNumber].SetOwner(this.RoleList[RoleNumber]);
                    this.RoleList[RoleNumber].SetItem(this.ItemList[ItemNumber]);
                }
            }
            for(var OtherRoleNumber = 0; OtherRoleNumber <= this.RoleList.length-1; ++OtherRoleNumber) {
                if(RoleNumber == OtherRoleNumber) {
                    continue;
                }
                if(this.RoleList[RoleNumber].GetIdentity() != this.RoleList[OtherRoleNumber].GetIdentity() 
                && ReachDetermination(this.RoleList[RoleNumber], this.RoleList[OtherRoleNumber]) == true) {
                    this.GameOver = true;
                }
            }
            if(this.RoleList[RoleNumber] == WaitDrawObjects.objects[1].GetOwner() && ReachDetermination(this.RoleList[RoleNumber], WaitDrawObjects.objects[0]) == true) {
                this.winner = "TreasureHunter";
                this.GameOver = true;
            }
        }

        // 心跳音效
        var distance;
        var ShortestDistance = Infinity;
        for(var RoleNumber = 1; RoleNumber <= this.RoleList.length-1; ++ RoleNumber) {
            distance = Math.pow(Math.pow(this.RoleList[0].getX() - this.RoleList[RoleNumber].getX(), 2) + Math.pow(this.RoleList[0].getY() - this.RoleList[RoleNumber].getY(), 2), 1/2);
            if(distance < ShortestDistance && this.RoleList[RoleNumber].getZ() == this.RoleList[0].getZ()) {
                ShortestDistance = distance;
            }
        }
        if(ShortestDistance <= 10) {
            // this.audio.muted = false;
            this.audio.playbackRate = 3 - ShortestDistance/5;
        }
        // else {
        //     this.audio.muted = true;
        // }


        if(this.GameOver == true) {
            this.EndGame();
        }
        else {
            // console.time('GameScene.UpdateViewScope');
            GameScene.UpdateViewScope(this.RoleList[0]);
            // console.timeEnd('GameScene.UpdateViewScope');
            //  console.time('requestAnimationFrame');
            this.LastTimeStamp = timestamp;
            requestAnimationFrame(this.UpdateGameProgress.bind(this));
            // console.timeEnd('requestAnimationFrame');
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
        for(var AINumber = 0; AINumber <= this.AIList.length-1; ++AINumber) {
            this.AIMaze.pop();
        }
        WaitDrawObjects.objects.splice(0,WaitDrawObjects.objects.length);
        AngleOffset = 0;
    }
}