/PingPongScoreboard

├── Controllers/

│   └── GameController.cs

├── Models/

│   ├── Player.cs

│   ├── Match.cs

│   └── GameSettings.cs

├── Views/
│   ├── Game/
│   │   ├── Index.cshtml        <-- Main menu & match setup

│   │   └── Scoreboard.cshtml   <-- Live match scoring

│   └── Shared/

│       └── _Layout.cshtml

├── wwwroot/

│   ├── css/

│   │   └── site.css

│   └── js/

│       └── site.js

├── appsettings.json

├── Program.cs

└── Startup.cs (if not using .NET 6+ minimal hosting)
