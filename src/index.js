import * as PIXI from "pixi.js";
import { Application } from "pixi.js";
import { initAssets } from "./assets";
import { gsap } from "gsap";
import { Container, Sprite } from "pixi.js";
import { CustomEase, PixiPlugin } from "gsap/all";
import Game from "./game";
import Panel from "./panel";

export const GAME_WIDTH = 400;
export const GAME_HEIGHT = 800;

export const app = new Application({
  backgroundColor: 0x000000,
  antialias: true,
  hello: true,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
});

app.ticker.stop();
gsap.ticker.add(() => {
  app.ticker.update();
});

document.body.appendChild(app.view);

let assets = await initAssets();
console.log("assets", assets);

gsap.registerPlugin(PixiPlugin, CustomEase);
PixiPlugin.registerPIXI(PIXI);



// Creating the Play button
const button = new PIXI.Graphics();
button.beginFill(0xFFA500); 
button.drawRoundedRect(0, 0, 150, 50, 15); 
button.endFill();
button.x = (GAME_WIDTH - button.width) / 2;
button.y = GAME_HEIGHT / 2 ; 
button.interactive = true;
button.buttonMode = true;
app.stage.addChild(button);


// Adding button text
const buttonText = new PIXI.Text("Play", {
  fill: 0xFFFFFF,
  fontSize: 24,
  fontWeight: "bold",
  align: "center",
});
buttonText.anchor.set(0.5);
buttonText.x = button.width / 2;
buttonText.y = button.height / 2;
button.addChild(buttonText);

//Button Click
button.on("pointerdown", () => {
  app.stage.removeChildren();
  
  //setting orange background
  const background = PIXI.Sprite.from("./assets/background.png"); 
  background.width = GAME_WIDTH;
  background.height = GAME_HEIGHT;
  app.stage.addChild(background);


  //Create Game object and drop the first balloon group
  const game = new Game();
  game.createBalloons();
  
 // Set the default orange panel
  const defaultShowPanel = PIXI.Sprite.from("./assets/orange-pane.png");
  defaultShowPanel.width = 300;
  defaultShowPanel.height = 50;
  defaultShowPanel.x = 50;
  defaultShowPanel.y = 650;
  
  //Setting when default panel have to occur
  if(game.selectedBalloons.length == 0){
    app.stage.addChild(defaultShowPanel);
  }
  else {
    app.stage.removeChild(defaultShowPanel);
  }

  

  app.ticker.add(game.update, game);
});

