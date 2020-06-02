let pos = [], orig = [], morph = [], morphtarget = [];
let morphed, dmorphed, morphtoggle;
let morphDetail;
let lilies = [], lilynumber;
let pyramid;
let timeconst;
let pendulum_y, pendulum_x, pendulum_up, pendulum_down, pendulum_left, pendulum_right;
let time = 0;
let json;
let brightness;
let lilypic;
let dx, dy, dz;
let roty, rotz;
let rockx, rocky;
let font = [];
let r = [], g = [], b = [];
let footprint = [], a=0;
let timer = 0;
let tick, tock, ticktoggle=false;

function preload(){
  pyramid = loadStrings('pyramid.txt');
  json = loadJSON('victims.json');
  lilypic = loadImage('assets/sidelily.png');
  font[0] = loadFont('assets/GARA.TTF');
  font[1] = loadFont('assets/GARABD.TTF');
  font[2] = loadFont('assets/noto.otf');
  font[3] = loadFont('assets/notobd.otf');
  tick = loadSound('assets/tick.wav');
  tock = loadSound('assets/tock.wav');
}


function setup(){
  createCanvas (windowWidth, windowHeight, WEBGL);
  loadMorphTarget(pyramid);

  //camera set-up
  cam_x = 0;
  cam_y = 0;
  cam_z = -(windowHeight / 2 / tan(PI * 30.0 / 180.0));
  cam_dx = 0;
  cam_dy = 0;
  cam_dz = 0;
  pan = 0;
  tilt = 0;
  aim_rad = abs(cam_z)/10 ;
  updateCamCenter();

  //default mouse sensitivity
  sensitivity = 8;

   perspective(PI / 6.0);
   pendulum_x = 0;
   pendulum_y = 100;
   pendulum_up = true;
   pendulum_down = false;
   pendulum_left = true;
   pendulum_right = false;
   brightness = 55;


   lilies[0] = new Lily();
   lilynumber = 1;

   roty = 0;
   rotz = 0;
   morphed = 0;
   dmorphed = 0;
   morphtoggle = false;

   rockx = 550;
   rocky = -400;

   setInterval(function(){
     tick.play();
   }, 6000);

   setTimeout(function(){
     setInterval(function(){
       tock.play();
     }, 6000);
  },3000);
}

function draw(){
lights();
ambientLight(brightness);

background(0);

timeconst= (deltaTime / 1000) * 60;

//camera set-up
camera(cam_x, cam_y, cam_z, cam_cx, cam_cy, cam_cz, 0, -1, 0);
pan += radians(movedX) / sensitivity*2;
tilt -= radians(movedY) / sensitivity;
updateCamCenter();
handleUserInput();

  // morphing
  push();
  translate(0,-500,Object.keys(json).length*510);
  for (let i = 0; i < morphDetail; i++) {
    let o = orig[i];
    let t = morphtarget[i];
    let interpolated = p5.Vector.lerp(o, t, morphed);
    morph[i] = interpolated;
  }
  // render morphed geometry
  beginShape();
  noFill();
  stroke(128);
  strokeWeight(4);
  for (let i = 0; i < morphDetail; i++) { let v = morph[i];
    vertex(v.x, v.y, v.z);
  }
  endShape(CLOSE);
  pop();
  //pyramid morph
  if (morphtoggle == true){
    if(dmorphed < 0.025){
      morphed+= 0.002;
      dmorphed+=0.002;
    }
    else{
      dmorphed = 0;
      morphtoggle = false;
    }
  }

  //pendulum
  pendulumswing();
  push();
  strokeWeight(4);
  stroke(128,128,128);
  line(0,500,0, pendulum_x, pendulum_y, 0);
  pop();
  push();
  noStroke();
  fill(100,100,100);
  translate(pendulum_x, pendulum_y, 0);
  ellipsoid(50,50,5);
  pop();

noStroke();

walls(json);

//automatic movement
if(brightness != 255){
  if(cam_z < Object.keys(json).length*500-(windowHeight / 2 / tan(PI * 30.0 / 180.0))-2000){
    cam_z += 1;
  }
  else if(cam_z >= Object.keys(json).length*500-(windowHeight / 2 / tan(PI * 30.0 / 180.0))-2000){
    cam_z = -(windowHeight / 2 / tan(PI * 30.0 / 180.0));
  }
}

//render lily
for (let i = 0; i<lilies.length; i++){
  lilies[i].render();
}
//lily movement
if(lilies[lilynumber-1].y > -450  && lilies[lilynumber-1].y < 450 &&
  lilies[lilynumber-1].x > -450 && lilies[lilynumber-1].x < 450){
  lilies[lilynumber-1].x += dx*5;
  lilies[lilynumber-1].y += dy*5;
  lilies[lilynumber-1].z += dz*5;
  lilies[lilynumber-1].rotz += roty;
  lilies[lilynumber-1].roty += rotz;
}

//sisyphus' rock
if(morphed < 1){
  if(rockx >= morph[6].x){
    rockx -= 1;
    rocky += morph[5].y/550;
  }
  else if (rockx >= morph[12].x ){
    rockx -= 1;
  }
  else if(rockx < morph[12].x){
    rockx -= 1;
    rocky -= morph[5].y/550;
    if(rockx < -550){
      rockx = 550;
      rocky = -450;
    }
  }
}
else{
  rockx = 0;
  rocky = -440;
}
push();
translate(rockx,rocky,Object.keys(json).length*510);
sphere(100);
pop();

//footprints
for (let i = 0; i<a; i++){
  footprint[i].render();
}
if (timer % 100 == 0){
  footprint[a] = new Footprint();
  a+=1;
}
if (timer % 100 == 50){
  footprint[a] = new Footprint2();
  a+=1;
}
timer += 1;
}

function walls(jsonobj){
  push();
  rotateY(HALF_PI);
  for(let i = 0; i< Object.keys(jsonobj).length; i++){
    r[i] = 255-jsonobj[i].color[0];
    g[i] = 255-jsonobj[i].color[1];
    b[i] = 255-jsonobj[i].color[2];
    fill(r[i],g[i],b[i]);
    push();
    translate(-i*500,0,500);
    plane(500,1000);
    pop();
    push();
    translate(-i*500,0,-500);
    plane(500,1000);
    pop();
    push();
    rotateY(-HALF_PI);
    rotateX(HALF_PI);
    translate(0,500*i,-500);
    plane(1000,500);
    pop();
    push();
    rotateY(-HALF_PI);
    rotateX(HALF_PI);
    translate(0,500*i,500);
    plane(1000,500);
    pop();

  }
  pop();
}


function keyPressed() {
  //movement key input
  if (key == " ") {
    if (jump_toggle == false) {
      jump_toggle = true;
      t0 = millis();
    }
  }

  if (key == 'w') {
    forward = true;
  }
  if (key == 's') {
    back = true;
  }
  if (key == 'a') {
    left = true;
  }
  if (key == 'd') {
    right = true;
  }
}


function keyReleased() {
  //finish movement key input
  if (key == 'w') {
    forward = false;
  }
  if (key == 's') {
    back = false;
  }
  if (key == 'a') {
    left = false;
  }
  if (key == 'd') {
    right = false;
  }
}


function mouseClicked(){
  requestPointerLock();
  lilies[lilynumber] = new Lily();
  lilynumber +=1;
  dx = cam_dx;
  dy = cam_dy;
  dz = cam_dz;
  roty = random(-radians(1), radians(1));
  rotz = random(-radians(1), radians(1));
  brightness += 5;
  if (brightness >= 255){
    brightness = 255;
  }
  if (morphed <= 1){
    morphtoggle = true;
  }
}

function negfill(r,g,b){
  fill(255-r, 255-g, 255-b);
}

function pendulumswing(){
  time += timeconst;
    if (pendulum_left == true){

      pendulum_y += (-2)*sin(radians(time*2));
      pendulum_x += (-2.5)*cos(radians(time));
      if (pendulum_y >= -1){
        pendulum_left = false;
        pendulum_right = true;
        time = 0;
      }
    }
    else if (pendulum_right == true){

      pendulum_y += (2)*sin(radians(time*2));
      pendulum_x += (2.5)*cos(radians(time));
      if (pendulum_y <= -99){
        pendulum_left = true;
        pendulum_right = false;
        time = 0;
      }
    }
}


function loadMorphTarget(pyramid) {
  morphDetail = 0;

  // load target geometry
    for (let i = 0; i < pyramid.length; i++) {
      let pieces = split(pyramid[i], ',');
      if(pieces.length < 3){
        break;
      }
      let v = new p5.Vector(int(pieces[0]), int(pieces[1]), int(pieces[2]));
      morphtarget.push(v);
      morph.push(new p5.Vector());
      morphDetail+=1;
    }

  // set pyramid geometry
    for (let i = 0; i < pyramid.length; i++) {
      let pieces = split(pyramid[i], ',');
      let v;
      if(pieces.length < 3){
        break;
      }
      if(int(pieces[1]) != 0){
        v = new p5.Vector(0,int(pieces[1])+900, 0);
      }
      else{
        v = new p5.Vector(int(pieces[0]), int(pieces[1]), int(pieces[2]));
      }
      orig.push(v);
    }
}
