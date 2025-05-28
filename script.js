let structures = [];
if (localStorage.getItem("structures")) {
  structures = JSON.parse(localStorage.getItem("structures"));
}
let drawing = false;
let startX, startY, currentRect = null;

function startGame() {
  myGameArea.start();
  animatedObject.loadImages();
  bushObject.loadImages();
}

var backgroundImage = new Image();
backgroundImage.src = "images/1.png";
function nextScene() {
  animatedObject.y = 700 - animatedObject.height; 
  backgroundImage.src = "images/2.png";
  animatedObject.loadImages();
}
function prevScene() {
  animatedObject.y = 0;
  backgroundImage.src = "images/1.png";
  animatedObject.loadImages();
}
var myGameArea = {
  canvas: document.createElement("canvas"),
  start: function() {
    this.canvas.width = 1000;
    this.canvas.height = 700;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);

    // Listener per disegnare strutture con il mouse
    this.canvas.addEventListener('mousedown', function(e) {
      drawing = true;
      const rect = myGameArea.canvas.getBoundingClientRect();
      startX = e.clientX - rect.left; 
      startY = e.clientY - rect.top;
      currentRect = { x: startX, y: startY, width: 0, height: 0 };
    });

    this.canvas.addEventListener('mousemove', function(e) {
      if (!drawing) return;
      const rect = myGameArea.canvas.getBoundingClientRect();
      let mouseX = e.clientX - rect.left;
      let mouseY = e.clientY - rect.top;
      currentRect.width = mouseX - startX;
      currentRect.height = mouseY - startY;
    });

    this.canvas.addEventListener('mouseup', function(e) {
      if (drawing && currentRect.width !== 0 && currentRect.height !== 0) {
        // Normalizza dimensioni e posizione se disegnato "al contrario"
        if (currentRect.width < 0) {
          currentRect.x += currentRect.width;
          currentRect.width *= -1;
        }
        if (currentRect.height < 0) {
          currentRect.y += currentRect.height;
          currentRect.height *= -1;
        }
        structures.push({ ...currentRect });
        localStorage.setItem("structures", JSON.stringify(structures));
      }
      drawing = false;
      currentRect = null;
    });
  },

  draw: function(component) {
    this.context.fillStyle = component.color;
    this.context.fillRect(
      component.x,
      component.y,
      component.width,
      component.height
    );
  },

  drawGameObject: function(gameObject) {
    this.context.drawImage(
      gameObject.image,
      gameObject.x,
      gameObject.y,
      gameObject.width,
      gameObject.height
    );
  },
  
  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
};

function updateGameArea() {
  myGameArea.clear();
  myGameArea.context.drawImage(backgroundImage, 0, 0, myGameArea.canvas.width, myGameArea.canvas.height);
  // Disegna tutte le strutture (blu trasparente)
  myGameArea.context.fillStyle = "rgba(0,0,255,0.3)";
  for (let s of structures) {
    myGameArea.context.fillRect(s.x, s.y, s.width, s.height);
}
  // Disegna il rettangolo in corso di disegno (verde trasparente)
  if (drawing && currentRect) {
    myGameArea.context.fillStyle = "rgba(0,255,0,0.3)";
    myGameArea.context.fillRect(currentRect.x, currentRect.y, currentRect.width, currentRect.height);
  }

  animatedObject.update();
  myGameArea.drawGameObject(animatedObject);
   if (animatedObject.y < 0) {
    nextScene(); // Funzione che gestisce il cambio scena
   }
   if (animatedObject.y + animatedObject.height > myGameArea.canvas.height) {
    prevScene()
  }
}

function isOnGroundOrObject() {
  // Controllo terreno
  if (animatedObject.y + animatedObject.height >= 700) return true;

  // Controllo tutte le strutture disegnate
  let myleft = animatedObject.x;
  let myright = animatedObject.x + animatedObject.width;
  let mybottom = animatedObject.y + animatedObject.height;
  for (let s of structures) {
    let otherleft = s.x;
    let otherright = s.x + s.width;
    let othertop = s.y;
    if (
      mybottom >= othertop - 1 && mybottom <= othertop + 5 &&
      myright > otherleft &&
      myleft < otherright
    ) {
      return true;
    }
  }
}
function clearStructures() {
  structures = [];
  localStorage.removeItem("structures");
}
function jump() {
  if (isOnGroundOrObject()) {
    animatedObject.gravitySpeed = -20;
  }
}
let lastDirection = "right"; // variabile globale

function moveleft() {
  animatedObject.speedX = -2;
  if (animatedObject.direction !== "left") {
    animatedObject.direction = "left";
    animatedObject.loadImages();
    animatedObject.actualFrame = 0;
  }
}

function moveright() {
  animatedObject.speedX = 2;
  if (animatedObject.direction !== "right") {
    animatedObject.direction = "right";
    animatedObject.loadImages();
    animatedObject.actualFrame = 0;
  }
}
function clearmove() {
  animatedObject.speedX = 0;
}
var bushObject = {
  width: 100,
  height: 50,
  x: 100,
  y: 400,

  loadImages: function() {
    this.image = new Image(this.width, this.height);
    this.image.src = "https://i.ibb.co/CPdHYdB/Bush-1.png";
  }
};

document.addEventListener('keydown', (event) => {
  if(event.key === 'w' || event.key === ' ') { // spazio o W per saltare
    jump();
  }
  if(event.key === 'a') {
    moveleft();
  }
  if(event.key === 'd') {
    moveright();
  }
});
window.addEventListener('keyup', (event) => {
  if (event.key === 'a' || event.key === 'd') {
    animatedObject.speedX = 0;
  }
});