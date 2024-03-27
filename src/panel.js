
import * as PIXI from "pixi.js";
import { Application } from "pixi.js";
import { Container, Sprite } from "pixi.js";
import { app } from "./index.js";
import Game from "./game.js";

export default class Panel extends Container {
    constructor() {
        super();
        this.init();
    }

    init() {

        //Orange panel sprite and attributes
        this.background = Sprite.from("./assets/orange-pane.png");
        this.background.width = 300;
        this.background.height = 50;
        this.background.x = 50;
        this.background.y = 650;
        this.addChild(this.background);

        // Cross sprite and attributes
        this.cross = Sprite.from("./assets/cross.png");
        this.cross.anchor.set(0.5);
        this.cross.width = 35;
        this.cross.height = 35;
        this.cross.x = 320;
        this.cross.y = 675;
        this.addChild(this.cross);

        //Tick sprite and attributes
        this.tick = Sprite.from("./assets/tick.png");
        this.tick.anchor.set(0.5);
        this.tick.width = 35;
        this.tick.height = 35;
        this.tick.x = 320;
        this.tick.y = 675;
        this.addChild(this.tick);

        //Set the tick clickable
        this.tick.interactive = true;
        this.tick.buttonMode = true;
        this.tick.on("pointerdown", () => {
        this.emit("tickClicked"); 
        });

        //cross and tick are invisible default
        this.cross.visible = false;
        this.tick.visible = false;

        
    }

    //Set the default orange panel function
    setToDefaultPanel(){
        this.background.texture = PIXI.Texture.from("./assets/orange-pane.png");
        this.tick.visible= false;
    }


    // Update entities according to meanful word or not 
    update(isMeaningful) {

        if (isMeaningful) {
            
            this.background.texture = PIXI.Texture.from("./assets/green-pane.png");
            this.tick.visible = true;
            this.cross.visible = false;
            
        } else {
            
            this.background.texture = PIXI.Texture.from("./assets/gray-pane.png");
            this.cross.visible = true;
            this.tick.visible = false;
        }
}
}

  