var dog, dogImg, happyDog;
var database;
var foodS, foodStock;

var feedPet, addfood;
var foodObj;
var lastFed, fedTime;

function preload()
{
  dogImg = loadImage("dogImg.png");
  happyDog = loadImage("dogImg1.png");
}

function setup() {
	createCanvas(1000, 450);
  database = firebase.database();
  foodStock = database.ref("Food");
  foodStock.on("value", readStock);
  foodStock.set(20);

  dog = createSprite(750, 250, 20, 20);
  dog.addImage(dogImg);
  dog.scale = 0.3;

  foodObj = new Food(); 

  addFood=createButton("Add Food");
  addFood.position(600, 30);
  addFood.mousePressed(addFood);

  feedPet=createButton("Feed The Dog");
  feedPet.position(500, 30);
  feedPet.mousePressed(feedPet);

}


function draw() {  
  background("green");
  drawSprites();

  textSize(20);
  fill("white");
  if(lastFed>=12){
    text("Last Feed : " + lastFed%12 + "PM", 300, 40);
  }
  else if(lastFed==0){
    text("Last Feed : 12AM" , 300, 40);
  }
  else{
    text("Last Feed : " + lastFed + "AM", 300, 40)
  }

  foodObj.display();

  fedTime = database.ref("feedTime");
  fedTime.on("value", function(data){
    lastFed=data.val();
  });

}

function readStock(data){
  foodS = data.val();
  foodObj = updateFoodStock(foodStock);
}

function feedDog(){
  dog.addImage(happyDog);
  foodObj = updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    feed: foodObj.getFoodStock(),
    feedTime: hour()
  });
}

function addFood(){
  foodS++;
  database.ref('/').update({
    Food : foodS
  })
}