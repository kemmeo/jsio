// SERVICE WORKER
if("serviceWorker" in navigator){
  try{
    navigator.serviceWorker.register("sw.js");
    console.log("Service Worker Registered!");
  }catch(err){
    console.log("Service Worker failed to Register!");
  }
}

// get canvas context
const c=document.querySelector("canvas").getContext("2d");
let width,height;

// resize canvas to fit window
function resize(){
  width=c.canvas.width=window.innerWidth;
  height=c.canvas.height=window.innerHeight;
  //console.log("resized");
}
resize();

// clamp variables between 2 values
function clamp(num,min,max){
  return Math.max(min,Math.min(num,max));
}

// get random integer between min & max
function iRandom(min,max){
  return Math.floor(min+Math.random()*(max-min+1));
}

// linear interpolate between origin & goal at speed of rate
function lerp(origin,goal,rate) {
  return origin+=(goal-origin)*rate;
}

// get distance between points a & b
function gap(a,b){
  return Math.hypot(a.x-b.x,a.y-b.y);
}

// mock antialiasing
function smoothing(){
  c.translate(.5,.5);
  c.lineWidth=.5;
}
smoothing();

// Ball constructor
class Ball{
  constructor(x,y,radius,color,velocity){
    this.radius=radius;
    this.x=clamp(x,this.radius,width-this.radius);
    this.y=clamp(y,this.radius,height-this.radius);
    this.color=color;
    this.xVel=velocity;
    this.yVel=velocity;
    this.move=true;
  }
  // Ball draw method
  draw(){
    c.beginPath();
    c.fillStyle=this.color;
    c.arc(this.x,this.y,this.radius,0,2*Math.PI);
    c.fill();
    c.shadowColor="rgba(0,0,0,0.3)";
    c.shadowBlur=10;
    c.shadowOffsetX=0;
    c.shadowOffsetY=5;
    c.closePath();
  }
  // Ball update method
  update(){
    if(this.x<this.radius){
      this.x=this.radius;
      this.xVel*=-1;
    }
    if(this.x>width-this.radius){
      this.x=width-this.radius;
      this.xVel*=-1;
    }
    if(this.y<this.radius){
      this.y=this.radius;
      this.yVel*=-1;
    }
    if(this.y>height-this.radius){
      this.y=height-this.radius;
      this.yVel*=-1;
    }
    if(this.move===true){
      this.x+=this.xVel;
      this.y+=this.yVel;
    }
    
    this.draw();
  }
}

// player object
let player=new Ball(width/2,height*0.75,40,"#00b9b8",0);

// handle mouse input
player.mouse=(e)=>{
  let mX=e.pageX, mY=e.pageY;
  player.x=clamp(lerp(player.x,mX,0.8),player.radius,width-player.radius);
  player.y=clamp(lerp(player.y,mY,0.8),player.radius,height-player.radius);
}

// handle touch input
player.touch=(e)=>{
  let tX=e.targetTouches[0].pageX, tY=e.targetTouches[0].pageY;
  player.x=clamp(lerp(player.x,tX,0.8),player.radius,width-player.radius);
  player.y=clamp(lerp(player.y,tY,0.8),player.radius,height-player.radius);
}

// array of enemy objects
let enemy=[];
// array of possible enemy colors
const colors=["#f27979","#8ff279","#969df2","#f096f2"];
// loop creating enemy objects
for(let i=0; i<Math.floor(width/75);i++){
  const radius=iRandom(player.radius/1.4,player.radius*1.5);
  let x=iRandom(radius,width-radius);
  let y=iRandom(radius,height/2-radius);
  const color=colors[iRandom(0,colors.length-1)];
  const speed=iRandom(-4,4);
  if(enemy.length!==0){
    for(let j=0;j<enemy.length;j++){
      if(Math.hypot(x-enemy[j].x,y-enemy[j].y)<=(radius+enemy[j].radius)){
        x=iRandom(0,width);
        y=iRandom(0,height/2);
        j=-1;
        console.log("relocating enemy");
      }
    }
  }
  enemy[i]=new Ball(x,y,radius,color,speed);
}

// game loop
function update(){
  requestAnimationFrame(update);
  // clear canvas & draw background
  c.clearRect(0,0,width,height);
  c.fillStyle="#fff";
  c.fillRect(0,0,width,height);

  // check for collision with player
  for(let i=0;i<enemy.length;i++){
    enemy[i].update();
    if(gap(enemy[i],player)<=(player.radius+enemy[i].radius)){
      // grow player size & destroy enemy
      if(player.radius>=enemy[i].radius){
        let grow=enemy[i].radius/8;
        enemy.splice(i,1);
        player.radius+=grow;
        console.log("enemy destroyed");
      }
    }
    for(let j=0;j<enemy.length;j++){
      if(enemy[i]===enemy[j]){continue;}
      if(gap(enemy[i],enemy[j])<=(enemy[i].radius+enemy[j].radius)){
        enemy[i].move=enemy[j].move=false;
        enemy[i].xVel*=-1; enemy[i].yVel*=-1;
        enemy[j].xVel*=-1; enemy[j].yVel*=-1;
      }else{
        enemy[i].move=enemy[j].move=true;
      }
    }
  }

  // update player
  player.update();
}
update();

window.addEventListener("resize",resize);
window.addEventListener("touchmove",player.touch);
window.addEventListener("mousemove",player.mouse);