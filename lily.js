class Lily{
  constructor(){

    this.seed = random(15, 22);

    this.x = aim_x;
    this.y = aim_y;
    this.z = aim_z;

    this.w = this.seed;
    this.h = this.seed*3;

    this.texture = lilypic;
    this.roty = 0;
    this.rotz = 0;
  }

  render (){
    push();
    translate(this.x, this.y, this.z);
    rotateX(-HALF_PI);
    rotateY(this.roty);
    rotateZ(this.rotz);
    texture(this.texture);
    plane(this.w, this.h);
    pop();
  }

}

class Footprint{
  constructor(){
    this.x = cam_x + random(-100, 100);
    this.y = -480 + random(-1, 1);
    this.z = cam_z-50;
    this.rand1 = int(random(Object.keys(json).length));
    this.color = color(json[this.rand1].color[0], json[this.rand1].color[1], json[this.rand1].color[2]);

    this.randfont = int(random(4));
    this.randsize = random(20,70);
  }

  render(){
    push();
    translate(this.x, this.y, this.z);
    rotateX(-HALF_PI);
    rotateZ(HALF_PI);
    textFont(font[this.randfont]);
    fill(this.color);
    textSize(this.randsize);
    text(json[this.rand1].name,0,0);
    pop();
  }
}

class Footprint2{
  constructor(){
    this.x = cam_x + random(-200, 200);
    this.y = -480 + random(-1, 1);
    this.z = cam_z-50;
    this.rand1 = int(random(Object.keys(json).length));
    this.color = color(json[this.rand1].color[0], json[this.rand1].color[1], json[this.rand1].color[2]);

    this.randfont = int(random(4));
    this.randsize = random(20,70);
  }

  render(){
    push();
    translate(this.x, this.y, this.z);
    rotateX(-HALF_PI);
    rotateZ(HALF_PI);
    textFont(font[this.randfont]);
    fill(this.color);
    textSize(this.randsize);
    text(json[this.rand1].last_word,0,0);
    pop();
  }
}
