var runningR = [
  "images/idle.png",
  "images/run1.png",
  "images/run2.png",
  "images/run3.png",
];
var runningL = [
  "images/idleLEFT.png",
  "images/run1LEFT.png",
  "images/run2LEFT.png",
  "images/run3LEFT.png",
]


var animatedObject = {
  speedX: 0,
  speedY: 0,
  width: 80,
  height: 100,
  x: 10,
  y: 120,
  imageList: [],
  contaFrame: 0,
  actualFrame: 0,
  image: "",
  tryX: 0,
  tryY: 0,
  isMoving: false, // Nuova proprietà per tracciare se il personaggio è in movimento
  direction: "right",
  gravity: 0.5,           
  gravitySpeed: 0, 
  sbalzoFrame: 0,

  
  
  update: function() {
    this.gravitySpeed += this.gravity;
    this.tryY = this.y + this.speedY + this.gravitySpeed;
    this.tryX = this.x + this.speedX;

    // Aggiorna lo stato di movimento
    this.isMoving = (this.speedX !== 0 || this.speedY !== 0);

    // Prima di spostarmi realmente verifico che non ci siano collisioni
    this.crashWith();
    
      this.x = this.tryX;
      this.y = this.tryY;
    if (this.sbalzoFrame > 0) {
      this.sbalzoFrame--;
      if (this.sbalzoFrame === 0) {
        this.speedX = 0;
      }
    }
     if (this.y + this.height >= 700) { // 700 è l'altezza del canvas
      this.gravitySpeed = 0;
      this.y = 700 - this.height;
    }
    // Aggiorna l'animazione
    this.contaFrame++;
    if (this.isMoving) {
      if (this.contaFrame == 3) {
        this.contaFrame = 0;
        this.actualFrame = (1 + this.actualFrame) % (this.imageList.length - 1) + 1; // Esclude "idle.png" dall'animazione di corsa
        this.image = this.imageList[this.actualFrame];
      }
    } else {
      // Se non è in movimento, imposta l'immagine su "idle.png"
      this.actualFrame = 0;
      this.image = this.imageList[this.actualFrame];
      this.contaFrame = 0; // Resetta il contatore dei frame
    }

    if (this.contaFrame >= 3) {
      this.contaFrame = 0;
    }
  },

loadImages: function() {
  this.imageList = [];
  let running = (this.direction === "left") ? runningL : runningR;
  for (let imgPath of running) {
    let img = new Image(this.width, this.height);
    img.src = imgPath;
    this.imageList.push(img);
  }
  this.image = this.imageList[this.actualFrame];
},
crashWith: function() {
  // Controllo collisione con tutte le strutture
  for (let s of structures) {
    let myleft = this.tryX;
    let myright = this.tryX + this.width;
    let mytop = this.tryY;
    let mybottom = this.tryY + this.height;
    let otherleft = s.x;
    let otherright = s.x + s.width;
    let othertop = s.y;
    let otherbottom = s.y + s.height;

    // Collisione dal basso (atterra su una piattaforma)
    if (
      this.y + this.height <= othertop &&
      mybottom > othertop &&
      myright > otherleft &&
      myleft < otherright
    ) {
      this.tryY = othertop - this.height;
      this.gravitySpeed = 0;
    }

    // Collisione dal basso (sbatti la testa)
    if (
      this.y >= otherbottom &&
      mytop < otherbottom &&
      myright > otherleft &&
      myleft < otherright
    ) {
      this.tryY = otherbottom;
      this.gravitySpeed = 0;
    }

    // Collisione da sinistra (urta il lato destro della piattaforma)
    if (
      this.x + this.width <= otherleft &&
      myright > otherleft &&
      mybottom > othertop &&
      mytop < otherbottom
    ) {
      this.tryX = otherleft - this.width;
      this.speedX = 5; // Sbalza a destra
    }

    // Collisione da destra (urta il lato sinistro della piattaforma)
    if (
      this.x >= otherright &&
      myleft < otherright &&
      mybottom > othertop &&
      mytop < otherbottom
    ) {
      this.tryX = otherright;
      this.speedX = -10; // Sbalza a sinistra
    }
  }
},
};