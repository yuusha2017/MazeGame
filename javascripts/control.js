// 所有未知的變數如未特別命名皆為unknown

// 地圖xyz限制
var minX = 1;
var minY = 1;
var minZ = 0;
var maxX = "unknown";
var maxY = "unknown";
var maxZ = "unknown";

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
    state : "GameMenuScene",                // 目前階段
    EventListener1 : function() {},
    EventListener2 : function() {},
    GameOver : false,
    winner : "unknown",
    RoleList : [],                          // 全部的角色清單
    HunterList : [],                        // 獵人的角色清單
    DefenderList : [],                      // 守衛者的角色清單
    Player : {},                            // 操控者
    PlayerRole : {},                        // 操控者的角色
    AIMaze : [],                            // AI用迷宮
    AIList : [],                            // AI清單
    ItemMap : [],                           // 物品圖
    exit : {},
    treasure : {},
    audio : document.createElement("audio"),
    LastTimeStamp : 0,                  // 上次的時間,計算時差用
    count : 0,                          // 計數用
    AINumber : 1,                       // AI數量
    ViewRoleNum : 0,                    // 觀賞哪個角色視角

    LoadGameMenuScene : function() {
        LoadImage();                        // 載入遊戲所需圖片
        this.state = "GameMenuScene";
        GameMenuScene.RecreateMenuItems();
        GameMenuScene.render();
        this.StartGameMenuSelect();         // 開始選擇
    },
    
    StartGameMenuSelect : function() {
        this.EventListener1 = this.GameMenuSelect.bind(this);
        window.addEventListener("keydown", this.EventListener1);
    },	

    StartOptionSelect : function() {
        this.EventListener1 = this.OptionSelect.bind(this);
        window.addEventListener("keydown", this.EventListener1);
    },

    StartSelectSelect : function() {
        this.EventListener1 = this.SelectSelect.bind(this);
        window.addEventListener("keydown", this.EventListener1);
    },

    StartRoleSelect : function() {
        this.EventListener1 = this.RoleSelect.bind(this);
        window.addEventListener("keydown", this.EventListener1);
    },

    StartItemSelect : function() {
        this.EventListener1 = this.ItemSelect.bind(this);
        window.addEventListener("keydown", this.EventListener1);
    },
    
    GameMenuSelect : function(e) {
        switch(e.keyCode) {
            case 13 : {
                removeEventListener("keydown", this.EventListener1);
                switch(GameMenuScene.GetSelection()) {
                    case 0 : { this.LoadGame(); break; }
                    case 1 : { this.Multiplayer(); break; }
                    case 2 : { this.LoadSelectScene(); break; }
                    case 3 : { this.LoadOptionScene();; break; }
                }
                break;
            }
            case 38 : { GameMenuScene.Up(); break; }
            case 40 : { GameMenuScene.Down(); break; }
        };
    },	

    OptionSelect : function(e) {
        switch(e.keyCode) {
            case 13 : {
                if(OptionScene.GetState() == "MazeValueSetting") {
                    OptionScene.OnSelect();
                }
                else if(OptionScene.GetSelection() == 3) {
                    removeEventListener("keydown", this.EventListener1);
                    this.LoadGameMenuScene();
                }
                else {
                    OptionScene.UnSelect();
                    OptionScene.OnMazeValueSelect();
                }
                break;
            }
            case 37 : { OptionScene.Left(); break; }
            case 38 : { OptionScene.Up(); break; }
            case 39 : { OptionScene.Right(); break; }
            case 40 : { OptionScene.Down(); break; }
        };
    },

    SelectSelect : function(e) {
        switch(e.keyCode) {
            case 13 : {
                removeEventListener("keydown", this.EventListener1);
                switch(SelectScene.GetSelection()) {
                    case 0 : { this.LoadRoleSelectScene(); break; }
                    case 1 : case 2 : case 3 : case 4 : { this.LoadItemSelectScene(SelectScene.GetSelection()); break;}
                    case 5 : {this.LoadGameMenuScene(); break; }
                }
                break;
            }
            case 38 : { SelectScene.Up(); break; }
            case 40 : { SelectScene.Down(); break; }
        };
    },

    RoleSelect : function(e) {
        switch(e.keyCode) {
            case 13 : {
                removeEventListener("keydown", this.EventListener1);
                SelectScene.SetRoleSelection(RoleSelectScene.GetSelection());
                this.LoadSelectScene();
                break;
            }
            case 37 : { RoleSelectScene.Left(); break; }
            case 38 : { RoleSelectScene.Up(); break; }
            case 39 : { RoleSelectScene.Right(); break; }
            case 40 : { RoleSelectScene.Down(); break; }
        };
    },

    ItemSelect : function(e) {
        switch(e.keyCode) {
            case 13 : {
                removeEventListener("keydown", this.EventListener1);
                SelectScene.SetItemSelections(ItemSelectScene.GetItemNum() ,ItemSelectScene.GetSelection());
                this.LoadSelectScene();
                break;
            }
            case 37 : { ItemSelectScene.Left(); break; }
            case 38 : { ItemSelectScene.Up(); break; }
            case 39 : { ItemSelectScene.Right(); break; }
            case 40 : { ItemSelectScene.Down(); break; }
        };
    },

    Multiplayer : function() {
        this.LoadGameMenuScene();
    },

    LoadSelectScene : function() {
        this.state = "SelectScene";
        SelectScene.RecreateMenuItems();
        SelectScene.render();
        this.StartSelectSelect();
    },

    LoadRoleSelectScene : function() {
        this.state = "RoleSelectScene";
        //RoleSelectScene.RecreateMenuItems();
        RoleSelectScene.render();
        this.StartRoleSelect();
    },

    LoadItemSelectScene : function(ItemNum) {
        this.state = "ItemSelectScene";
        ItemSelectScene.SetItemNum(ItemNum);
        //SelectScene.RecreateMenuItems();
        ItemSelectScene.render();
        this.StartItemSelect();
    },

    LoadOptionScene : function() {
        this.state = "OptionScene";
        OptionScene.RecreateMenuItems();
        OptionScene.render();
        this.StartOptionSelect();
    },

    LoadGame : function() {

        // 地圖xyz限制更新
        maxX = (2*OptionScene.GetMazeLength()+1)-2;
        maxY = (2*OptionScene.GetMazeWidth()+1)-2;
        maxZ = OptionScene.GetMazeHeight()-1;

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
        this.PlayerRole = new Blue(1,1,0);
        this.PlayerRoleOriginalScope = this.PlayerRole.GetViewScope();
        this.RoleList.push(this.PlayerRole);
        this.Player = new Player("Player", this.PlayerRole);
        this.RoleList[0].SetOperator(this.Player);

        // AI與AI角色
        for(var AINum = 0; AINum < this.AINumber; ++AINum) {
            this.RoleList.push(new Black(1,1,0));
            this.AIList.push(new AI("AI"+(AINum+1), this.RoleList[AINum+1]));
        }
        for(var AINum = 0; AINum < this.AIList.length; ++AINum) {
            this.RoleList[AINum+1].SetOperator(this.AIList[AINum]);
        }

        // 進行角色分類
        for(var RoleNum = 0; RoleNum < this.RoleList.length; ++RoleNum) {
            if(this.RoleList[RoleNum].GetID() == "TreasureHunter") {
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

    StartGame : function() {
        this.EventListener1 = this.KeyDownEventHandler.bind(this);
        this.EventListener2 = this.KeyUpEventHandler.bind(this);
        window.addEventListener("keydown", this.EventListener1);
        window.addEventListener("keyup", this.EventListener2);
        this.RequestID = requestAnimationFrame(this.UpdateGameProgress.bind(this));
        this.audio.setAttribute("src","heartbeat-01a.mp3");
        this.audio.setAttribute("autoplay", "autoplay");
        this.audio.setAttribute("loop", "loop");
        if(this.RoleList[this.ViewRoleNum].GetID() != "TreasureHunter") {
            this.audio.muted = true;
        }
        document.body.appendChild(this.audio);
    },
    
    KeyDownEventHandler : function(e) {
        switch(e.keyCode) {
            case 37 : { this.Player.SetKeyboardState(this.Player.GetKeyboardState() | KeyLeft);  break; }
            case 38 : { this.Player.SetKeyboardState(this.Player.GetKeyboardState() | KeyUp);    break; }
            case 39 : { this.Player.SetKeyboardState(this.Player.GetKeyboardState() | KeyRight); break; }
            case 40 : { this.Player.SetKeyboardState(this.Player.GetKeyboardState() | KeyDown);  break; }
            case 68 : { this.Player.SetKeyboardState(this.Player.GetKeyboardState() | KeyD);     break; }
            case 70 : { this.Player.SetKeyboardState(this.Player.GetKeyboardState() | KeyF);     break; }
            case 81 : { this.Player.SetKeyboardState(this.Player.GetKeyboardState() | KeyQ);     break; }
            case 87 : { this.Player.SetKeyboardState(this.Player.GetKeyboardState() | KeyW);     break; }
            default: { break; }
        };
    },

    KeyUpEventHandler : function(e) {
        switch(e.keyCode) {
            case 37 : { this.Player.SetKeyboardState(this.Player.GetKeyboardState() & (AllKey - KeyLeft));  break; }
            case 38 : { this.Player.SetKeyboardState(this.Player.GetKeyboardState() & (AllKey - KeyUp));    break; }
            case 39 : { this.Player.SetKeyboardState(this.Player.GetKeyboardState() & (AllKey - KeyRight)); break; }
            case 40 : { this.Player.SetKeyboardState(this.Player.GetKeyboardState() & (AllKey - KeyDown));  break; }
            case 68 : { this.Player.SetKeyboardState(this.Player.GetKeyboardState() & (AllKey - KeyD));     break; }
            case 70 : { this.Player.SetKeyboardState(this.Player.GetKeyboardState() & (AllKey - KeyF));     break; }
            case 81 : { this.Player.SetKeyboardState(this.Player.GetKeyboardState() & (AllKey - KeyQ));     break; }
            case 87 : { this.Player.SetKeyboardState(this.Player.GetKeyboardState() & (AllKey - KeyW));     break; }
            default: { break; }
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
                    this.RoleList[RoleNum].S1();
                }
                if((this.RoleList[RoleNum].GetOperator().GetKeyboardState() & KeyF) == KeyF) {
                    this.RoleList[RoleNum].S2();
                }
            }
            if((this.RoleList[RoleNum].GetOperator().GetKeyboardState() & KeyQ) == KeyQ) {
                this.RoleList[RoleNum].SetChangeItemDirection("CounterClockwise");
            }
            if((this.RoleList[RoleNum].GetOperator().GetKeyboardState() & KeyW) == KeyW) {
                this.RoleList[RoleNum].SetChangeItemDirection("clockwise");
            }
            PositionCorrection(GameScene.maze[Math.round(this.RoleList[RoleNum].getZ())], this.RoleList[RoleNum]);      // 無法符合斜角走的要求，需更正

            // 上樓下樓
            if(Math.round(this.RoleList[RoleNum].getX()) == this.RoleList[RoleNum].getX() && Math.round(this.RoleList[RoleNum].getY()) == this.RoleList[RoleNum].getY() && (this.RoleList[RoleNum].GetPreX() != this.RoleList[RoleNum].getX() || this.RoleList[RoleNum].GetPreY() != this.RoleList[RoleNum].getY()) && GameScene.maze[Math.round(this.RoleList[RoleNum].getZ())][this.RoleList[RoleNum].getX()][this.RoleList[RoleNum].getY()].object == "PassageUp" || this.RoleList[RoleNum].GetState() == "GoUp") {
                this.RoleList[RoleNum].SetState("GoUp");
                this.RoleList[RoleNum].GoUp(progress);
                // console.log( this.RoleList[RoleNum].GetViewScope());
                if(Math.floor(this.RoleList[RoleNum].GetPreZ()) != Math.floor(this.RoleList[RoleNum].getZ())) {
                    this.RoleList[RoleNum].setZ(Math.round(this.RoleList[RoleNum].getZ()));
                    this.RoleList[RoleNum].SetState("visible");
                    //this.RoleList[RoleNum].ChangeViewScope(-this.RoleList[RoleNum].GetViewScope());
                }
                if(this.RoleList[RoleNum].getZ() - Math.floor(this.RoleList[RoleNum].getZ()) <= 0.5) {
                    this.RoleList[RoleNum].SetViewScope(this.RoleList[RoleNum].GetOriginalViewScope() + 4*(this.RoleList[RoleNum].getZ() - Math.floor(this.RoleList[RoleNum].getZ())));
                }
                else {
                    this.RoleList[RoleNum].SetViewScope(this.RoleList[RoleNum].GetOriginalViewScope() - (this.RoleList[RoleNum].GetOriginalViewScope()-1)*(2-2*(this.RoleList[RoleNum].getZ() - Math.floor(this.RoleList[RoleNum].getZ()))));
                }
                if(RoleNum == this.ViewRoleNum) {
                    GameScene.SetSL(4*(window.innerHeight*window.devicePixelRatio)/2/5/(this.RoleList[RoleNum].GetViewScope()));
                }
            }
            else if(Math.round(this.RoleList[RoleNum].getX()) == this.RoleList[RoleNum].getX() && Math.round(this.RoleList[RoleNum].getY()) == this.RoleList[RoleNum].getY() && (this.RoleList[RoleNum].GetPreX() != this.RoleList[RoleNum].getX() || this.RoleList[RoleNum].GetPreY() != this.RoleList[RoleNum].getY()) && GameScene.maze[Math.round(this.RoleList[RoleNum].getZ())][this.RoleList[RoleNum].getX()][this.RoleList[RoleNum].getY()].object == "PassageDown" || this.RoleList[RoleNum].GetState() == "GoDown") {
                this.RoleList[RoleNum].SetState("GoDown");
                this.RoleList[RoleNum].GoDown(progress);
                // console.log( this.RoleList[RoleNum].GetViewScope());
                if(Math.ceil(this.RoleList[RoleNum].GetPreZ()) != Math.ceil(this.RoleList[RoleNum].getZ())) {
                    this.RoleList[RoleNum].setZ(Math.round(this.RoleList[RoleNum].getZ()));
                    this.RoleList[RoleNum].SetState("visible");
                   // this.RoleList[RoleNum].ChangeViewScope(-this.RoleList[RoleNum].GetViewScope());
                }
                if(this.RoleList[RoleNum].getZ() - Math.floor(this.RoleList[RoleNum].getZ()) >= 0.5) {
                    this.RoleList[RoleNum].SetViewScope(this.RoleList[RoleNum].GetOriginalViewScope() - (this.RoleList[RoleNum].GetOriginalViewScope()-1)*(2-2*(this.RoleList[RoleNum].getZ() - Math.floor(this.RoleList[RoleNum].getZ()))));
                }
                else {
                    this.RoleList[RoleNum].SetViewScope(this.RoleList[RoleNum].GetOriginalViewScope() + 4*(this.RoleList[RoleNum].getZ() - Math.floor(this.RoleList[RoleNum].getZ())));
                }
                if(RoleNum == this.ViewRoleNum) {
                    GameScene.SetSL(4*(window.innerHeight*window.devicePixelRatio)/2/5/(this.RoleList[RoleNum].GetViewScope()));
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
        if(this.RoleList[this.ViewRoleNum].GetID() == "TreasureHunter") {
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

        // 遊戲結束方面
        if(this.PlayerRole.GetState() == "vanish") {
            this.PlayerRole.ChangeViewScope(-progress);
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
        // console.log(this.RoleList[0].getX());
        // console.log(this.RoleList[0].getY());
        // console.log(this.RoleList[0].getZ());
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

    GetState : function() {
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
    }
}