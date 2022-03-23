const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;

var ground, rope, rope2, rope3, fruit, fruit_con, fruit_con2, fruit_con3, button, button2, button3, rabbit;
var bgImg, fruitImg, rabbitImg, muteImg, balloonImg;
var blink, eat, sad;
var airSound, eatingSound, ropeSound, sadSound, bgSound;


function preload (){
  bgImg = loadImage("background.png");
  fruitImg = loadImage("melon.png");
  rabbitImg = loadImage("Rabbit-01.png");
  blink = loadAnimation("blink_1.png", "blink_2.png", "blink_3.png");
  eat = loadAnimation("eat_0.png", "eat_1.png","eat_2.png","eat_3.png","eat_4.png");
  sad = loadAnimation("sad_1.png", "sad_2.png", "sad_3.png");

  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping = false;
  eat.looping = false;

  airSound = loadSound("air.wav"); // wav é extensão de som tb :)
  eatingSound = loadSound("eating_sound.mp3");
  ropeSound = loadSound("rope_cut.mp3");
  sadSound = loadSound("sad.wav");
  bgSound = loadSound("sound1.mp3");

}

function setup() 
{
  createCanvas(500,700);
  engine = Engine.create();
  world = engine.world;
  bgSound.play();
  bgSound.setVolume(0.02);
  push();

  imageMode(CENTER);
  button = createImg("cut_btn.png");
  button.position(216,50);
  button.size(50,50);
  button.mouseClicked(drop);

  button2 = createImg("cut_btn.png");
  button2.position(330,30);
  button2.size(50,50);
  button2.mouseClicked(drop2);

  button3 = createImg("cut_btn.png");
  button3.position(390,195);
  button3.size(50,50);
  button3.mouseClicked(drop3);

  pop();

  muteImg = createImg("mute.png");
  muteImg.position(450,20);
  muteImg.size(50,50); 
  muteImg.mouseClicked(mute);

  balloonImg = createImg("balloon.png");
  balloonImg.position(10,250);
  balloonImg.size(150,100);
  balloonImg.mouseClicked(airBlow);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)

  ground = new Ground(200,680,600,20);
  rope = new Rope(7,{x:220, y:50});
  rope2 = new Rope(7,{x:370, y:40});
  rope3 = new Rope(4,{x:420,y:215});

  fruit = Bodies.circle(50,300,20);
  Matter.Composite.add(rope.body,fruit);

  fruit_con = new Link(rope,fruit);
  fruit_con2 = new Link (rope2,fruit);
  fruit_con3 = new Link (rope3,fruit);

  rabbit = createSprite(200,620,100,100);
  rabbit.addImage(rabbitImg);
  rabbit.scale = 0.2;

  blink.frameDelay = 8;
  eat.frameDelay = 8;
  sad.frameDelay = 8;

  rabbit.addAnimation("blinking", blink);
  rabbit.addAnimation("crying", sad);
  rabbit.addAnimation("eating", eat);

  rabbit.changeAnimation("blinking");

}

function draw() 
{
  background(51);

  image(bgImg,0,0,500,700);
  ground.display();
  rope.show();
  rope2.show();
  rope3.show();
  //ellipse(fruit.position.x,fruit.position.y,30,30);
  Engine.update(engine);

  push();
  imageMode(CENTER);
  if(fruit!=null){
    image(fruitImg, fruit.position.x, fruit.position.y, 70,70);
  }
  pop();

  if(collide(fruit,rabbit)== true){
    rabbit.changeAnimation("eating");
    eatingSound.play();
  }

  if(fruit != null && fruit.position.y >= 650){
    rabbit.changeAnimation("crying");
    fruit = null; 
    sadSound.play();
  }

  drawSprites();
}

function drop (){
  rope.break();
  fruit_con.dettach();
  fruit_con = null;
}

function drop2 (){
  rope2.break();
  fruit_con2.dettach();
  fruit_con2 = null;
}

function drop3 (){
  rope3.break();
  fruit_con3.dettach();
  fruit_con3 = null;
}

function collide (body,sprite){
  if(body != null){
    var d = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y); // dist = distância
    if(d<=80){
      World.remove(engine.world,fruit);
      fruit = null;
      return true;
    }
    else {return false;}
  }
}

function airBlow (){
  Matter.Body.applyForce(fruit,{x:0, y:0},{x:0.01, y:0});
  airSound.play();
}

function mute (){
  if (bgSound.isPlaying()){
    bgSound.stop();
  }
  else{
    bgSound.play();
  }

}
