import * as PIXI from "pixi.js";
import { Container, Sprite } from "pixi.js";
import { Application } from "pixi.js";
import { initAssets } from "./assets";
import { app } from "./index.js";
import { GAME_WIDTH, GAME_HEIGHT } from "./index.js";

export default class Balloon extends PIXI.Container {
    constructor(x, y, letter) {
        super();
        this.init(x, y, letter);

    }

    //Initialization of Balloon object
    init(x, y, letter) {
        //random radius
        const radius = Math.floor(Math.random() * 4) + 7;

        //balloon object attributes
        this.balloonSprite = PIXI.Sprite.from("./assets/bubble-white.png");
        this.balloonSprite.anchor.set(0.5);
        this.balloonSprite.scale.set(radius / 30);
        this.balloonSprite.x = x;
        this.balloonSprite.y = y;
        app.stage.addChild(this.balloonSprite);


        // Text inside the Balloon
        this.text = new PIXI.Text(letter, {
            fill: "orange", 
            fontSize: 40, 
            fontWeight: "bold", 
        });
        this.text.anchor.set(0.5); 
        this.text.x = this.balloonSprite.x; 
        this.text.y = this.balloonSprite.y; 
        app.stage.addChild(this.text);


        //Physics rules initialization
        this.gravity = 0.1;
        this.velocityY = 0;
        this.radius = radius;
        this.rotationSpeed = Math.random() > 0.5 ? -0.02 : 0.02;
        this.velocityX = (Math.random() - 0.5) * 4;

    }

    //Select the ballon that we choose
    select() {
        this.balloonSprite.texture = PIXI.Texture.from("./assets/circle0.png");
        
        this.text.style.fill = "white";
      }


    // Reselect the Balloon that we selected
      reselect() {
        this.balloonSprite.texture = PIXI.Texture.from("./assets/bubble-white.png"); 

        this.text.style.fill = "orange"; 
    }

    


    update() {

        //Physics rules
        this.velocityY += this.gravity;
        this.balloonSprite.y += this.velocityY;
        this.balloonSprite.x += this.velocityX;
        this.balloonSprite.rotation += this.rotationSpeed;


       // Collision with Panel check
        const PANEL_Y = 650;
        if (this.balloonSprite.y + this.balloonSprite.height / 2 >= PANEL_Y) {
            this.balloonSprite.y = PANEL_Y - this.balloonSprite.height / 2;
            this.velocityY *= -0.3; 
        }


        // Update the letter location
        this.text.x = this.balloonSprite.x;
        this.text.y = this.balloonSprite.y;

    

    }
}