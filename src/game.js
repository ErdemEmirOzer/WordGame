import * as PIXI from "pixi.js";
import gsap from "gsap";
import { Container, Sprite } from "pixi.js";
import { GAME_HEIGHT, GAME_WIDTH } from ".";
import Balloon from "./balloon";
import Panel from "./panel";
import { app } from "./index.js";
import getwordList from './wordlist';


// Game Sounds
const selectSound = new Audio('./assets/select.mp3');
const reselectSound = new Audio('./assets/reselect.mp3');
const correctSound = new Audio('./assets/correct.mp3');
const winSound = new Audio('./assets/youWin.mp3');

selectSound.load();
reselectSound.load();
correctSound.load();
winSound.load();



export default class Game extends Container {
  constructor() {
    super();
    this.init(); 
  }


  init() {
    let sprite = Sprite.from("logo");
    sprite.anchor.set(0.5);
    sprite.scale.set(0.5);
    //this.addChild(sprite);
    sprite.x = GAME_WIDTH * 0.5;
    sprite.y = GAME_HEIGHT * 0.5;

    gsap.to(sprite, {
      pixi: {
        scale: 0.6,
      },
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "sine.easeInOut", 
    });

    

 //panel text
    this.wordText = new PIXI.Text("", {
      fill: "white",
      fontSize: 30,
      fontWeight: "bold",
  });
  this.wordText.anchor.set(0.5);
  this.wordText.x = 175;
  this.wordText.y = 675;

//score text
  this.scoreText = new PIXI.Text("Score: 0", {
    fill: "white",
    fontSize: 35,
    fontWeight: "bold",
});
  this.scoreText.anchor.set(0.5);
  this.scoreText.x = 200;
  this.scoreText.y = 120;
  

  this.panel = new Panel();
  this.panel.on("tickClicked", this.onTickClicked, this);

  this.score = 0;
  this.word = ""; 
  
  this.balloons = [];
  this.selectedBalloons = [];

  }


// Generating a random letter
  randomLetter() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return alphabet[Math.floor(Math.random() * alphabet.length)];
  }
 
  //Checking the word with wordlist.js which mathces or not.
  checkWord(word) {
    const wordList = getwordList(); 
    return wordList.includes(word.toLowerCase());
  }


// Balloon choosing and other functionalities
  onClickBalloon(balloon) {
    if (balloon.isSelected) {
        balloon.reselect(); 
        reselectSound.play();
        balloon.isSelected = false; 

       
        const index = this.selectedBalloons.indexOf(balloon);
        if (index !== -1) {
            this.selectedBalloons.splice(index, 1);
        }
    } else {
        balloon.select(); 
        selectSound.play();
        balloon.isSelected = true; 
        this.selectedBalloons.push(balloon);
    }
     const word = this.selectedBalloons.map(b => b.text.text).join("").toLowerCase();
    
     const isMeaningful = this.checkWord(word); 
     
     app.stage.addChild(this.panel);
     this.wordText.text = word;
     this.wordText.text = this.wordText.text.toUpperCase();
     app.stage.addChild(this.wordText);
     this.panel.update(isMeaningful);
 
}


//Correct Word Function
onTickClicked() {
  for (let i = 0; i < this.selectedBalloons.length; i++) {
    const balloon = this.selectedBalloons[i];
    app.stage.removeChild(balloon.balloonSprite); 
    app.stage.removeChild(balloon.text); 

    const index = this.balloons.indexOf(balloon);
    if (index !== -1) {
        this.balloons.splice(index, 1); 
    }
}
//score
app.stage.addChild(this.scoreText);
this.score++;
this.scoreText.text = "Score: " + this.score;
correctSound.play();

//cleaning word
this.word = "";
this.wordText.text = "";
this.selectedBalloons = [];

this.panel.setToDefaultPanel();
this.createBalloons();

 if (this.score >= 4) {
  this.gameOver();
  winSound.play();
}
}


// Creating random number and random sized Balloons
  createBalloons() {
        const balloonCount = Math.floor(Math.random() * 6) + 10;
        const startX = 200;
        const startY = 250;
        
        for (let i = 0; i < balloonCount; i++) {
            setTimeout(() => {
                const letter = this.randomLetter();
                const balloon = new Balloon(startX, startY, letter);
                this.addChild(balloon);
                this.balloons.push(balloon);

                balloon.balloonSprite.interactive = true;
                balloon.balloonSprite.buttonMode = true;
                balloon.balloonSprite.on("pointerdown", () => {
                    this.onClickBalloon(balloon);
                });

                this.update();
            }, i * 400);
        }
    }


    // Game Over function // little bug in here
    gameOver() {
    
    app.stage.removeChildren();

    const orangeBackground = PIXI.Sprite.from("./assets/background.png");
    orangeBackground.width = GAME_WIDTH;
    orangeBackground.height = GAME_HEIGHT;
    app.stage.addChild(background);

    const gameOverText = new PIXI.Text("Game Over\nHope you enjoyed", {
        fill: "white",
        fontSize: 50,
        fontWeight: "bold",
        align: "center",
    });
    gameOverText.anchor.set(0.5);
    gameOverText.position.set(200, 300);
    app.stage.addChild(gameOverText);
  }


update(delta) {
  for (let i = 0; i < this.balloons.length; i++) {
      const balloon = this.balloons[i];
      balloon.update(); 

      // Collision between balloons themselves // a little bug in here. I couldnt find
      for (let j = 0; j < this.balloons.length; j++) {
        if (i !== j) {
            const otherBalloon = this.balloons[j];
            const dx = balloon.balloonSprite.x - otherBalloon.balloonSprite.x;
            const dy = balloon.balloonSprite.y - otherBalloon.balloonSprite.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = balloon.balloonSprite.width / 2 + otherBalloon.balloonSprite.width / 2; 
            if (distance < minDistance) {
               
                const overlap = minDistance - distance;
                const angle = Math.atan2(dy, dx);
                const targetX = balloon.balloonSprite.x + Math.cos(angle) * overlap * 0.5;
                const targetY = balloon.balloonSprite.y + Math.sin(angle) * overlap * 0.5;
                balloon.balloonSprite.x = targetX;
                balloon.balloonSprite.y = targetY;
                //balloon.velocityX *= -0.1; 
                balloon.velocityY *= -0.5;
            }
         }
     }      

     //Collision between balloons and Walls
      if (balloon.balloonSprite.x + balloon.radius >= 360) {
          balloon.velocityX *= -0.3; 
          balloon.balloonSprite.x = 360 - balloon.radius; 
      } else if (balloon.balloonSprite.x - balloon.radius <= 35) {
          balloon.velocityX *= -0.3; 
          balloon.balloonSprite.x = 35 + balloon.radius;
       }
     }
   } 
 }
