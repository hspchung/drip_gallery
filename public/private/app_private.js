let snow = [];
let r, g, b;
let roomSign;

//Client-side socket connection to private rooms
let socket = io('/private');

//Private room name prompt
window.addEventListener('load', () => {
  let roomName = window.prompt('Enter room name: ');
  console.log(roomName);
  roomSign = roomName;
  //Send roomname to the server
  socket.emit('room-name', { room: roomName });
});

socket.on('connect', function () {
  console.log('connected');
});

//Listen for welcome message
socket.on('joined', (data) => {
  console.log(data.msg);
});

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  //Client-side 'On' event
  socket.on('data', function (obj) {
    console.log('message received');
    console.log(obj);

    //Make snow with object data
    snowMachine(obj);
  });

  //assign random colors to client
  r = random(255);
  g = random(255);
  b = random(255);
}

//Object functions in draw
function draw() {

  //Room name
  fill(250);
  textSize(120);
  textAlign(CENTER, CENTER);
  text(`${roomSign} Drip Gallery`, windowWidth / 2, windowHeight / 2);


  //Call class functions
  for (let i = 0; i < snow.length; i++) {
    snow[i].show();
    snow[i].move();
    snow[i].melt();
  }
  //Delete snow object after it leaves the canvas 
  for (let i = snow.length - 1; i >= 0; i--) {
    if (snow[i].toDelete) {
      snow.splice(i, 1);
    }
  }
}

//Client-side 'Emit' Event
function mouseDragged() {
  let mousePos = {
    x: mouseX,
    y: mouseY,
    red: r,
    green: g,
    blue: b
  };
  socket.emit('data', mousePos);
}

//Make snow with received data
function snowMachine(pos) {
  let snowflake = new Snowflakes(pos.x, pos.y, random(5, 10), random(-1, 1), 1, pos.red, pos.green, pos.blue);
  snow.push(snowflake);
}


class Snowflakes {
  constructor(x, y, d, vX, vY = 1, rValue, gValue, bValue) {
    this.x = x;
    this.y = y;
    this.d = d;
    this.vX = vX;
    this.vY = vY;
    this.toDelete = false;
    this.rValue = rValue;
    this.gValue = gValue;
    this.bValue = bValue;
  }
  show() {
    stroke(random(255), random(255), random(255), random(255));
    fill(this.rValue, this.gValue, this.bValue, 220);
    circle(this.x, this.y, this.d);
  }
  move() {
    this.x = this.x + this.vX;
    this.y = this.y + this.vY;
  }
  melt() {
    if (this.y >= height) {
      this.toDelete = true;
    }
  }
}