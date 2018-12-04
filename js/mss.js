// clamp value between min & max
function clamp(num,min,max){
  return Math.max(min,Math.min(num,max));
}

// get random integer between min & max (includes min & max)
function iRandom(min,max){
  return Math.floor(min+Math.random()*(max-min+1));
}

// linear interpolate between origin & goal at speed of rate
function lerp(origin,goal,rate) {
  return origin+=(goal-origin)*rate;
}

// get distance between objects a & b (requires that objects have x & y properties)
function gap(a,b){
  return Math.hypot(a.x-b.x,a.y-b.y);
}

// check if value is between min and max
function within(value,min,max){
  if(value>=min&&value<=max){return true;}
  else{return false;}
}

// export functions as module
export {clamp,iRandom,lerp,gap,within};