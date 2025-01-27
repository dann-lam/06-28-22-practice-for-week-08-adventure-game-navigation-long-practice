const http = require("http");
const fs = require("fs");

const { Player } = require("./game/class/player");
const { World } = require("./game/class/world");

const worldData = require("./game/data/basic-world-data");

let player;
let world = new World();
world.loadWorld(worldData);

const server = http.createServer((req, res) => {
  /* ============== ASSEMBLE THE REQUEST BODY AS A STRING =============== */
  let reqBody = "";
  req.on("data", (data) => {
    reqBody += data;
  });

  req.on("end", () => {
    // After the assembly of the request body is finished
    /* ==================== PARSE THE REQUEST BODY ====================== */
    if (reqBody) {
      req.body = reqBody
        .split("&")
        .map((keyValuePair) => keyValuePair.split("="))
        .map(([key, value]) => [key, value.replace(/\+/g, " ")])
        .map(([key, value]) => [key, decodeURIComponent(value)])
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
    }

    /* ======================== ROUTE HANDLERS ========================== */
    // Phase 1: GET /
    // GET / - Page to start the game with a form to name a new player
    //Submission of the form will start the Game
    if (req.method === "GET" && req.url.startsWith("/")) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      //Push a list of available rooms to the player.
      console.log(world.availableRoomsToString());
      const resBody = fs.readFileSync("views/new-player.html");

      return res.end(resBody);
    }
    // Phase 2: POST /player
    if (req.method === "POST" && req.url.startsWith("/player")) {
      res.statusCode = 200;
      // res.setHeader("Content-Type", "text/html")

      let name = reqBody.name;
      let startingRoom = reqBody.startingRoom;

      let player = new Player(name, startingRoom);
      console.log(player);
      let availableRooms = world.availableRoomsToString();
      for (let i = 0; i < availableRooms.length; i++) {
        availableRooms[i];
      }
      res.setHeader("Location", "/");
      //Create a list of available rooms

      return res.end(player);
    }

    // Phase 3: GET /rooms/:roomId

    // Phase 4: GET /rooms/:roomId/:direction

    // Phase 5: POST /items/:itemId/:action

    // Phase 6: Redirect if no matching route handlers
  });
});

const port = 5000;

server.listen(port, () => console.log("Server is listening on port", port));
