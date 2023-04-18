var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');
var center = {x: canvas.width / 2, y: canvas.height / 2};


function Circle(x,y,radius,fillColor){
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.fillColor = fillColor;
  
  c.beginPath();
  c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
  c.fillStyle = this.fillColor;
  c.fill();
}



function Cloud(x,y,dx,cloudWidth,cloudLength){
  
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.cloudWidth = cloudWidth;
  this.cloudLength = cloudLength;

  
  this.draw = function(){
    c.save();
    c.beginPath();
    c.arc(center.x, center.y, 120, 0, Math.PI * 2, false);
    c.clip();
    c.beginPath();
    c.moveTo(this.x, this.y);
    c.lineCap = 'round';
    c.lineWidth = this.cloudWidth;
    c.lineTo(this.x + this.cloudLength,this.y);
    c.strokeStyle = 'white';
    c.stroke();
    c.restore();
  }
  this.update = function(){
    if(this.x < (center.x - 240)){
      this.x = center.x+240;
    }
    this.x -= this.dx;
    this.draw();
  }
  
}

function ShootingStar(x,y,dx,dy,radius,color){
  
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.color = color;

  
  this.draw = function(){
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    c.closePath();
    c.fillStyle = this.color;
    c.fill();
  }
  this.update = function(){
    this.x += this.dx;
    this.y += this.dy;
    this.draw();
  }
  this.reset = function(){
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.dx = (Math.random() - 0.5) * 10;
    this.dy = (Math.random() - 0.5) * 10;
    this.radius = (Math.random() * 2) + 1;
  }
  
}

function Land(x,y,dx,landWidth,landLength){
  
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.landWidth = landWidth;
  this.landLength = landLength;

  
  this.draw = function(){
    c.save();
    c.beginPath();
    c.arc(center.x, center.y, 120, 0, Math.PI * 2, false);
    c.clip();
    c.beginPath();
    c.moveTo(this.x, this.y);
    c.lineCap = 'round';
    c.lineWidth = this.landWidth;
    c.lineTo(this.x + this.landLength,this.y);
    c.strokeStyle = '#85cc66';
    c.stroke();
    c.restore();
  }
  this.update = function(){
    if(this.x < (center.x-240)){
      this.x = center.x +240;
    }
    this.x -= this.dx;
    this.draw();
  }
  
}

function SemiCircle(x,y,radius,fillColor){
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.fillColor = fillColor;
  
  c.beginPath();
  c.arc(this.x, this.y, this.radius, Math.PI * 1.5, 1.5, false);
  c.fillStyle = this.fillColor;
  c.fill();
}



function Star(cx, cy, spikes, outerRadius, innerRadius) {
    this.rot = Math.PI / 2 * 3;
    this.x = cx;
    this.y = cy;
    this.spikes = spikes;
    this.outerRadius = outerRadius;
    this.innerRadius = innerRadius;
    
    this.step = Math.PI / this.spikes;

    c.strokeSyle = "#000";
    c.beginPath();
    c.moveTo(cx, cy - this.outerRadius)
    for (i = 0; i < this.spikes; i++) {
        this.x = cx;
        this.y = cy;
        x = cx + Math.cos(this.rot) * this.outerRadius;
        y = cy + Math.sin(this.rot) * this.outerRadius;
        c.lineTo(x, y)
        this.rot += this.step

        x = cx + Math.cos(this.rot) * this.innerRadius;
        y = cy + Math.sin(this.rot) * this.innerRadius;
        c.lineTo(x, y)
        this.rot += this.step
    }
    c.lineTo(cx, cy - this.outerRadius)
    c.closePath();
    c.lineWidth=5;
    c.strokeStyle='rgb(32, 66, 136)';
    c.stroke();
    c.fillStyle='skyblue';
    c.fill();
}

//Initial object arrays
var earthWidth = 120;
var planets = [{x: 20,y:10}];
var clouds = [{x: 20,y:10}];
var land = [{x: 20,y:10}];
var stars = [{x: 10,y:10}];

function drawStars(a){
  for (var i = 0; i <= a; ++i) {
    var bestLocation = sample(stars);
    stars.push( new Star(bestLocation[0], bestLocation[1], 4, Math.floor(Math.random() * 4) + 2, 1));
  }
}

function drawPlanets(a){
  for (var i = 0; i <= a; ++i) {
    var bestLocation = sample(planets);
    planets.push(new Circle(bestLocation[0],bestLocation[1], Math.random() * 5,'rgb(32, 66, 136)'));
  }
}

function drawClouds(a){
  for (var i = 0; i <= a; ++i) {
    var bestLocation = earthMask(clouds);
    var cloudWidth = Math.floor(Math.random() * 20) + 5;
    var cloudLength = Math.floor(Math.random() * 30) + 18;
    var dx = (Math.random() + 0.2 )* 1;
    clouds.push(new Cloud(bestLocation[0],bestLocation[1],dx,cloudWidth,cloudLength));
  }
}


function drawLand(a){
  for (var i = 0; i <= a; ++i) {
    var bestLocation = earthMask(land);
    var landWidth = Math.floor(Math.random() * 25) + 10;;
    var landLength = Math.floor(Math.random() * 30) + 18;
    dx = 0.5;
    land.push(new Land(bestLocation[0],bestLocation[1],dx,landWidth,landLength));
  }
}

//Use best candidate algorithm to evenly distribute across the canvas
function sample(samples) {
  var bestCandidate, bestDistance = 0;
  for (var i = 0; i < 20; ++i) {
    var c = [Math.random() * canvas.width, Math.random() * canvas.height],
        d = distance(findClosest(samples, c), c);
    if (d > bestDistance) {
      bestDistance = d;
      bestCandidate = c;
    }
  }
  return bestCandidate;
}

//Use best candidate algorithm to evenly distribute across the earth mask
function earthMask(samples) {
  var bestCandidate, bestDistance = 0;
  //The higher the iteration the better the distribution
  //Performance takes a hit with higher iteration
  for (var i = 0; i < 20; ++i) {
    var c = [Math.floor(Math.random() * ((center.x+240) - (center.x-240) + 1)) + (center.x-240), Math.floor(Math.random() * ((center.y+120) - (center.y-120) + 1)) + (center.y-120)],
        d = distance(findClosest(samples, c), c);
    if (d > bestDistance) {
      bestDistance = d;
      bestCandidate = c;
    }
  }
  return bestCandidate;
}

function distance(a, b) {
  var dx = a.x - b[0],
      dy = a.y - b[1];
  return Math.sqrt(dx * dx + dy * dy);
}


function findClosest(points, b) {
  var distance = null;
  var closestPoint;
  for (var i = 0; i < points.length; ++i) {
      var dx = points[i].x - b[0];
      var dy = points[i].y - b[1];
      if(distance == null){
        distance = Math.sqrt(dx * dx + dy * dy);
        closestPoint = points[i];
      } else if(distance > Math.sqrt(dx * dx + dy * dy)){
        distance = Math.sqrt(dx * dx + dy * dy);
        closestPoint = points[i];
      }
  }
  return closestPoint;
}

//Generate how many elements you want
drawPlanets(50);
drawStars(20);
drawClouds(25);
drawLand(15);

//Sloppy code for two randomly generated shooting stars
var shootingStar = new ShootingStar(10,10,8,8,2,'#2c62c2');
var shootingStar2 = new ShootingStar(400,300,-8,8,2,'#2c62c2');

window.setInterval(resetShootingStar, 3000);
window.setInterval(resetShootingStar2, 5000);
function resetShootingStar() {
  shootingStar.reset();
}
function resetShootingStar2() {
  shootingStar2.reset();
}

// Animate canvas
function animate(){
  requestAnimationFrame(animate);
  
  c.fillStyle = 'rgba(11, 21, 56,0.3)';
  c.fillRect(0, 0, canvas.width, canvas.height);
  shootingStar.update();
  shootingStar2.update();
  
  for (var i = 0; i < stars.length; i++){
    Star(stars[i].x,stars[i].y,stars[i].spikes,stars[i].innerRadius,stars[i].outerRadius);
  }
  for (var i = 0; i < planets.length; i++){
    Circle(planets[i].x,planets[i].y,planets[i].radius,planets[i].fillColor);
  }
  var ring3 = new Circle(center.x,center.y, 245,'rgba(10, 23, 66, 0.5)');
  var ring2 = new Circle(center.x,center.y, 215,'rgba(9, 30, 75, 0.5)');
  var ring1 = new Circle(center.x,center.y, 175,'rgba(8, 34, 83, 0.5)');
  var earthBorder = new Circle(center.x,center.y, 135,'rgb(12, 20, 56)');
  var earth = new Circle(center.x,center.y, earthWidth,'rgb(25, 118, 181)');
  for (var i = 1; i < land.length; i++){
    land[i].update();
  }
  for (var i = 1; i < clouds.length; i++){
    clouds[i].update();
  }
  var semi = new SemiCircle(center.x,center.y,earthWidth,'rgba(0, 0, 0, 0.4)');
}

animate();