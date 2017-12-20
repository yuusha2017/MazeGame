// 所有未知的變數如未特別命名皆為unknown

// 計算遊戲時間
var GameTime = 0;
var minute = "00";
var second = "00";

// 計算每秒幀數
var CalFPS = 0;
var FPS = 0;      
var TimeElapsed = 0;  

// 鍵位定義
var NoKey = 0;
var KeyDown = 1;
var KeyRight = 2;
var KeyUp = 4;
var KeyLeft = 8;
var KeyD = 16
var KeyF = 32;
var KeyQ = 64;
var KeyW = 128;
var AllKey = KeyDown + KeyRight + KeyUp + KeyLeft + KeyD + KeyF + KeyQ + KeyW;   // Number.MAX_SAFE_INTEGER; (IE不支援QAQ)

// 遊戲流程控制物件
var Control = {
    state : "GameMenuScene",      
    EventListener1 : function() {},
    EventListener2 : function() {},
    GameOver : false,
    GameStart : false,
    winner : "unknown",
    RoleList : [],
    HunterList : [],
    DefenderList : [],
    Player : {},
    PlayerRole : {},
    AIMaze : [],
    AIList : [],
    ItemMap : [],
    exit : {},
    treasure : {},
    audio : document.createElement("audio"),
    LastTimeStamp : 0,
    count : 0,
    AINumber : 1,
    ViewRoleNum : 0,                    // 觀賞哪個角色視角

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
        this.LoadGame();
    },

    Multiplayer : function() {

    },

    Option : function() {
        this.LoadOptionScene();
    },

    Exit : function() {
        window.close();
    },

    LoadGame : function() {

        // 更新迷宮
        GameScene.UpdateMaze(OptionScene.GetMazeLength(), OptionScene.GetMazeWidth(), OptionScene.GetMazeHeight());

        // 初始化物品圖
        for(var z = 0; z < GameScene.maze.length; ++z) {
            this.ItemMap.push([]);
            for(var x = 0; x < GameScene.maze[0].length; ++x) {
                this.ItemMap[z].push([]);
                for(var y = 0; y < GameScene.maze[0][0].length; ++y) {
                    this.ItemMap[z][x].push("NoItem");
                }
            }
        }

        // 出口與寶藏
        this.exit = new Exit(1,1,0);
        this.treasure = new Treasure(1,1,0);

        // 玩家與玩家角色
        this.PlayerRole = new Sheep(1,1,0);
        this.PlayerRoleOriginalScope = this.PlayerRole.GetViewScope();
        this.RoleList.push(this.PlayerRole);
        this.Player = new Player("Player", this.PlayerRole);
        this.RoleList[0].SetOperator(this.Player);

        // AI與AI角色
        for(var AINum = 0; AINum < this.AINumber; ++AINum) {
            this.RoleList.push(new Wolf(1,1,0));
            this.AIList.push(new AI("AI"+(AINum+1), this.RoleList[AINum+1]));
        }
        for(var AINum = 0; AINum < this.AIList.length; ++AINum) {
            this.RoleList[AINum+1].SetOperator(this.AIList[AINum]);
        }
        // 進行角色分類
        for(var RoleNum = 0; RoleNum < this.RoleList.length; ++RoleNum) {
            if(this.RoleList[RoleNum].GetIdentity() == "TreasureHunter") {
                this.HunterList.push(this.RoleList[RoleNum]);
            }
            else {
                this.DefenderList.push(this.RoleList[RoleNum]);
            }
        }
        // AI用迷宮
        for(var AINum = 0; AINum < this.AIList.length; ++AINum) {
            this.AIMaze.push(MazeCopier(GameScene.maze));
        }
        // AI資訊初始化
        for(var AINum = 0; AINum < this.AIList.length; ++AINum) {
            this.AIList[AINum].Info_Init(this.RoleList.length-1);
        }
        // 角色位置初始化
        for(var RoleNum = 0; RoleNum < this.RoleList.length; ++RoleNum) {
            var position = PositionGenerator(GameScene.maze, WaitDrawObjects, 10);
            if(!position) {
                break;
            }
            this.RoleList[RoleNum].SetPosition(position.x, position.y, position.z);
            this.RoleList[RoleNum].SetPrePosition(position.x, position.y, position.z);
        }
        this.exit.SetPosition(this.RoleList[0].getX(), this.RoleList[0].getY(), this.RoleList[0].getZ());
        var position = PositionGenerator(GameScene.maze, this.RoleList.slice(0,1), 10);
        this.treasure.SetPosition(position.x, position.y, position.z);
        this.ItemMap[position.z][position.x][position.y] = this.treasure;

        // 角色列入繪畫清單
        for(var RoleNum = 0; RoleNum < this.RoleList.length; ++RoleNum) {
            WaitDrawObjects.push(this.RoleList[RoleNum]);
        }

        // 出口與寶藏列入繪畫清單
        WaitDrawObjects.push(this.exit);
        WaitDrawObjects.push(this.treasure);
       
        // 金幣
        for(var i = 0; i < 10; ++i) {
            var position = PositionGenerator(GameScene.maze, WaitDrawObjects, 3);
            if(!position) {
                break;
            }
            this.ItemMap[position.z][position.x][position.y] = new GoldCoin(position.x, position.y, position.z);
            WaitDrawObjects.push(this.ItemMap[position.z][position.x][position.y]);
        }

        // 銀幣
        for(var i = 0; i < 50; ++i) {
            var position = PositionGenerator(GameScene.maze, WaitDrawObjects, 3);
            if(!position) {
                break;
            }
            this.ItemMap[position.z][position.x][position.y] = new SilverCoin(position.x, position.y, position.z);
            WaitDrawObjects.push(this.ItemMap[position.z][position.x][position.y]);
        }

        // 銅幣
        for(var i = 0; i < 100; ++i) {
            var position = PositionGenerator(GameScene.maze, WaitDrawObjects, 3);
            if(!position) {
                break;
            }
            this.ItemMap[position.z][position.x][position.y] = new BronzeCoin(position.x, position.y, position.z);
            WaitDrawObjects.push(this.ItemMap[position.z][position.x][position.y]);
        }

        // 迷宮格長設定
        GameScene.SetFixedSL((window.innerHeight*window.devicePixelRatio)/2/5);
        GameScene.SetSL(4*(window.innerHeight*window.devicePixelRatio)/2/5/(this.PlayerRole.GetViewScope()));

        // 遊戲開始
        // 轉場效果
        requestAnimationFrame(GameMenuScene.transition.bind(GameMenuScene));
    },

    LoadOptionScene : function() {
        this.state = "OptionScene";
        OptionScene.RecreateMenuItems();
        OptionScene.render();
        this.StartOptionSelect();
    },
    
    StartGame : function() {
        //GameScene.AllBlack();
        this.EventListener1 = this.KeyDownEventHandler.bind(this);
        this.EventListener2 = this.KeyUpEventHandler.bind(this);
        window.addEventListener("keydown", this.EventListener1);
        window.addEventListener("keyup", this.EventListener2);
        this.RequestID = requestAnimationFrame(this.UpdateGameProgress.bind(this));
        this.audio.setAttribute("src","heartbeat-01a.mp3");
        this.audio.setAttribute("autoplay", "autoplay");
        this.audio.setAttribute("loop", "loop");
        if(this.RoleList[this.ViewRoleNum].GetIdentity() != "TreasureHunter") {
            this.audio.muted = true;
        }
        document.body.appendChild(this.audio);
    },
    
    KeyDownEventHandler : function(e) {
        switch(e.keyCode) {
            case 37 : {
                this.Player.SetKeyboardState(this.Player.GetKeyboardState() | KeyLeft);  
                break;
            }
            case 38 : {
                this.Player.SetKeyboardState(this.Player.GetKeyboardState() | KeyUp);   
                break;
            }
            case 39 : {
                this.Player.SetKeyboardState(this.Player.GetKeyboardState() | KeyRight);   
                break;
            }
            case 40 : {
                this.Player.SetKeyboardState(this.Player.GetKeyboardState() | KeyDown);  
                break;
            }
            case 68 : {
                this.Player.SetKeyboardState(this.Player.GetKeyboardState() | KeyD);   
                break;
            }
            case 70 : {
                this.Player.SetKeyboardState(this.Player.GetKeyboardState() | KeyF);   
                break;
            }
            case 81 : {
                this.Player.SetKeyboardState(this.Player.GetKeyboardState() | KeyQ);   
                break;
            }
            case 87 : {
                this.Player.SetKeyboardState(this.Player.GetKeyboardState() | KeyW);   
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
                this.Player.SetKeyboardState(this.Player.GetKeyboardState() & (AllKey - KeyLeft));   
                break;
            }
            case 38 : {
                this.Player.SetKeyboardState(this.Player.GetKeyboardState() & (AllKey - KeyUp));   
                break;
            }
            case 39 : {
                this.Player.SetKeyboardState(this.Player.GetKeyboardState() & (AllKey - KeyRight));  
                break;
            }
            case 40 
            : {
                this.Player.SetKeyboardState(this.Player.GetKeyboardState() & (AllKey - KeyDown)); 
                break;
            }
            case 68 : {
                this.Player.SetKeyboardState(this.Player.GetKeyboardState() & (AllKey - KeyD));   
                break;
            }
            case 70 : {
                this.Player.SetKeyboardState(this.Player.GetKeyboardState() & (AllKey - KeyF));   
                break;
            }
            case 81 : {
                this.Player.SetKeyboardState(this.Player.GetKeyboardState() & (AllKey - KeyQ));   
                break;
            }
            case 87 : {
                this.Player.SetKeyboardState(this.Player.GetKeyboardState() & (AllKey - KeyW));   
                break;
            }
            default: {
                break;
            }
        };
    },   

    UpdateGameData : function(progress) {
        GameTime += progress;
        for(var i = 0; i <= WaitDrawObjects.length-1; ++i) { 
            WaitDrawObjects[i].update(progress);
        }
        for(var AINum = 0; AINum < this.AIList.length; ++AINum) {
            this.AIList[AINum].StrategyThinking();
         }
        for(var AINum = 0; AINum < this.AIList.length; ++AINum) {
            this.AIList[AINum].CollectInfo(GetAIAvailableInfo(this.AIList[AINum].GetRole(), this.RoleList, this.AIMaze[AINum]));
            this.AIList[AINum].ActionThinking();
        }
        for(var RoleNum = 0; RoleNum < this.RoleList.length; ++RoleNum) {
            for(var ItemNum = 0; ItemNum <= 7; ++ItemNum) {
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
                if(Math.floor(this.RoleList[RoleNum].GetPreZ()) != Math.floor(this.RoleList[RoleNum].getZ())) {
                    this.RoleList[RoleNum].setZ(Math.round(this.RoleList[RoleNum].getZ()));
                    this.RoleList[RoleNum].SetState("visible");
                    // this.RoleList[RoleNum].SetViewScope(this.Ori - (this.ViewScope-1)*(2-2*offsetZ));
                }
            }
            else if(Math.round(this.RoleList[RoleNum].getX()) == this.RoleList[RoleNum].getX() && Math.round(this.RoleList[RoleNum].getY()) == this.RoleList[RoleNum].getY() && (this.RoleList[RoleNum].GetPreX() != this.RoleList[RoleNum].getX() || this.RoleList[RoleNum].GetPreY() != this.RoleList[RoleNum].getY()) && GameScene.maze[Math.round(this.RoleList[RoleNum].getZ())][this.RoleList[RoleNum].getX()][this.RoleList[RoleNum].getY()].object == "PassageDown" || this.RoleList[RoleNum].GetState() == "GoDown") {
                this.RoleList[RoleNum].SetState("GoDown");
                this.RoleList[RoleNum].setZ(this.RoleList[RoleNum].getZ() - 1/60);
                if(Math.ceil(this.RoleList[RoleNum].GetPreZ()) != Math.ceil(this.RoleList[RoleNum].getZ())) {
                    this.RoleList[RoleNum].setZ(Math.round(this.RoleList[RoleNum].getZ()));
                    this.RoleList[RoleNum].SetState("visible");
                }
            }

            // 物品取得
            if(this.ItemMap[Math.round(this.RoleList[RoleNum].getZ())][Math.round(this.RoleList[RoleNum].getX())][Math.round(this.RoleList[RoleNum].getY())] != "NoItem") {
                this.ItemMap[Math.round(this.RoleList[RoleNum].getZ())][Math.round(this.RoleList[RoleNum].getX())][Math.round(this.RoleList[RoleNum].getY())].contact(this.RoleList[RoleNum]);
                if(this.ItemMap[Math.round(this.RoleList[RoleNum].getZ())][Math.round(this.RoleList[RoleNum].getX())][Math.round(this.RoleList[RoleNum].getY())].GetState() == "vanish") {
                    this.ItemMap[Math.round(this.RoleList[RoleNum].getZ())][Math.round(this.RoleList[RoleNum].getX())][Math.round(this.RoleList[RoleNum].getY())] = "NoItem"; 
                }
            }
        }
        // 逃出判定
        if(this.treasure.GetOwner() != "NoOwner" && ReachDetermination(this.treasure.GetOwner(), this.exit) == true) {
            this.winner = "TreasureHunter";
            this.GameOver = true;
        }
        // 捕捉判定
        for(var HunterNum = 0; HunterNum < this.HunterList.length; ++HunterNum) {
            for(var DefenderNum = 0; DefenderNum < this.DefenderList.length; ++DefenderNum) {
                if(ReachDetermination(this.HunterList[HunterNum], this.DefenderList[DefenderNum]) == true) {
                    this.HunterList[HunterNum].SetState("BeCatched");
                }
            }
        }
        check(WaitDrawObjects);
        check(this.RoleList);
        check(this.HunterList);

        // 心跳音效
        if(this.RoleList[this.ViewRoleNum].GetIdentity() == "TreasureHunter") {
            this.audio.muted = false;
            var distance = Infinity;
            var ShortestDistance = Infinity;
            for(var RoleNum = 0; RoleNum < this.RoleList.length; ++RoleNum) {
                if(RoleNum == this.ViewRoleNum) {
                    continue;
                }
                if(this.RoleList[RoleNum].getZ() - this.RoleList[this.ViewRoleNum].getZ() < 0.5) {
                    distance = distance2d(this.RoleList[this.ViewRoleNum].getX(), this.RoleList[this.ViewRoleNum].getY(), this.RoleList[RoleNum].getX(), this.RoleList[RoleNum].getY());
                }
                if(distance < ShortestDistance) {
                    ShortestDistance = distance;
                }
            }
            if(ShortestDistance <= 10) {
                this.audio.playbackRate = 3 - ShortestDistance/5;
            }
            else {
                this.audio.playbackRate = 1;
            }
        }
        else {
            this.audio.muted = true;
        }
        if(this.PlayerRole.GetState() == "vanish") {
            this.PlayerRole.SetViewScope((this.PlayerRole.GetViewScope()-progress > 0) ? this.PlayerRole.GetViewScope()-progress : 0);
        }
        if(this.PlayerRole.GetViewScope() == 0) {
            this.GameOver = true;
        }

        // FPS計算
        ++CalFPS;
        TimeElapsed += progress;
        if(TimeElapsed > 0.5) {
            FPS = Math.round(CalFPS/TimeElapsed);
            CalFPS = 0;
            TimeElapsed = 0;
        }
    },

    UpdateGameProgress : function(timestamp) {
        var progress = (timestamp - this.LastTimeStamp)/1000;
        this.LastTimeStamp = timestamp;
        if(++this.count < 2) {
            requestAnimationFrame(this.UpdateGameProgress.bind(this));
            return;
        }
        this.UpdateGameData(progress);
        GameScene.UpdateViewScope(this.PlayerRole);

        // 結束遊戲或下一幀
        if(this.GameOver == true) {
            this.EndGame();
        }
        else {
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
        this.GameStart = false;
        this.winner = "unknown";
        this.RoleList = [];
        this.HunterList = [];
        this.DefenderList = [];
        this.ItemMap = [];
        this.AIList = [];
        this.AIMaze = [];
        this.exit = {};
        this.treasure = {};
        this.LastTimeStamp = 0;
        this.ViewRoleNum = 0;     
        this.count = 0;          
        GameTime = 0;
        minute = "00";
        second = "00";
        CalFPS = 0;
        FPS = 0;
        TimeElapsed = 0;
        WaitDrawObjects = [];
        AngleOffset = 0;
    }
}
    