// register service worker
navigator.serviceWorker.register("./sw.js",{
  scope:"./"
});

// import mss module
import {clamp,iRandom,lerp,gap} from "./mss.js";

// get canvas context
const c=document.querySelector("canvas").getContext("2d");

// declare variables
const colors=["#f27979","#8ff279","#969df2","#f096f2"];
let width,height,state,player,i,enemy=[],x,y,speed;

// resize canvas to fill window
function resize(){
  width=c.canvas.width=window.innerWidth;
  height=c.canvas.height=window.innerHeight;
}
resize();

// mock antialiasing
function smoothing(){
  c.translate(.5,.5);
  c.lineWidth=.5;
}
smoothing();

// state machine
state=""

// ball prototype
class Ball{
  constructor(x,y,size,color){
    this.x=x; this.y=y;
    this.size=size;
    this.color=color;
  }
  // draw ball method
  draw(){
    c.beginPath();
    c.fillStyle=this.color;
    c.arc(this.x,this.y,this.size,0,2*Math.PI);
    c.fill();
    c.shadowColor="rgba(0,0,0,0.3)";
    c.shadowBlur=10;
    c.shadowOffsetX=0;
    c.shadowOffsetY=5;
    c.closePath();
  }
  // update to be run every frame
  update(){
    this.draw();
  }
}

// player prototype inherits from ball
class Player extends Ball{
  constructor(x,y,size,color){
    super(x,y,size,color);
  }
  draw(){
    super.draw();
  }
  update(){
    super.update();
  }
  // touch control method
  touch(e){
    player.x=clamp(lerp(player.x,e.targetTouches[0].pageX,0.8),player.size,width-player.size);
    player.y=clamp(lerp(player.y,e.targetTouches[0].pageY,0.8),player.size,height-player.size);
  }
  // mouse control method
  mouse(e){
    player.x=clamp(lerp(player.x,e.pageX,0.8),player.size,width-player.size);
    player.y=clamp(lerp(player.y,e.pageY,0.8),player.size,height-player.size);
  }
}

// create player object as instance of player class
player=new Player(width/2,height*0.75,40,"#00b9b8");

// enemy prototype also inherits from ball
class Enemy extends Ball{
  constructor(x,y,size,color,speed){
    super(x,y,size,color);
    // enemies have a velocity for each axis
    this.xVel=this.yVel=speed;
  }
  draw(){
    super.draw();
  }
  // bounce off sides of canvas
  bounce(){
    if(this.x<this.size){
      this.x=this.size;
      this.xVel*=-1;
    }
    if(this.x>width-this.size){
      this.x=width-this.size;
      this.xVel*=-1;
    }
    if(this.y<this.size){
      this.y=this.size;
      this.yVel*=-1;
    }
    if(this.y>height-this.size){
      this.y=height-this.size;
      this.yVel*=-1;
    }
  }
  // move position by velocity every frame
  move(){
    this.x+=this.xVel;
    this.y+=this.yVel;
  }
  update(){
    super.update();
    this.bounce();
    this.move();
  }
}

// enemy instance creation loop, based on display width
for(i=0;i<width/75;i++){
  // enemy instance properties are relative to the player's
  const size=iRandom(player.size/1.4,player.size*1.5);
  x=iRandom(size,width-size);
  y=iRandom(size,height/2-size);
  const color=colors[iRandom(0,colors.length-1)];
  speed=iRandom(-2,2);
  // check if enemies spawn ontop of eachother
  if(enemy.length!==0){
    for(let j=0;j<enemy.length;j++){
      if(Math.hypot(x-enemy[j].x,y-enemy[j].y)<=(size+enemy[j].size)){
        x=iRandom(size,width-size);
        y=iRandom(size,height/2-size);
        console.log("relocating enemy");
        j=-1;
      }
      // check for enemies with no velocity
      if(speed===undefined||speed===0){
        speed=iRandom(-2,2);
        console.log("accelerated enemy");
        j=-1;
      }
    }
  }
  enemy[i]=new Enemy(x,y,size,color,speed);
}

// update() is called once every frame
function update(){
  requestAnimationFrame(update);
  c.clearRect(0,0,width,height);
  // check each enemy for collision with player instance
  for(i=0;i<enemy.length;i++){
    if(gap(player,enemy[i])<(player.size+enemy[i].size)){
      if(player.size>=enemy[i].size){
        // destroy enemy if < player
        let grow=enemy[i].size/6;
        enemy.splice(i,1);
        // grow player size by a 6th of the enemy's size
        player.size+=grow;
        console.log("enemy destroyed");
      }else{
        location.reload();
      }
    }
    // call enemy's update method
    enemy[i].update();
  }
  // call player's update method
  player.update();
}
update();

// execute function or method when "event" is registered
window.addEventListener("resize",resize);
window.addEventListener("mousemove",player.mouse);
window.addEventListener("touchmove",player.touch);