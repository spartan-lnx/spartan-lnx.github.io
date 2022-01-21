let x1,y1;//punta nave
let x2,y2;//ala derecha
let x3,y3;//centro nave
let x4,y4;//ala izquieda
let rotacion;//rotacion nave
let velocidad;
let pausa;

function setup(){
  createCanvas(windowWidth, windowHeight);
  velocidad = 6;
  x1 = windowWidth * 0.5;
  y1 = windowHeight * 0.1;
  x2 = x1 + 20;
  y2 = y1 + 60;
  x3 = x1;
  y3 = y1 + 40;
  x4 = x1 - 20;
  y4 = y1 + 60;
  pause = false;
}

function draw(){
  background(51);
  
  quad(x1,y1,x2,y2,x3,y3,x4,y4);
  
  if(!pausa){
    if(x1 < mouseX){
      x1 += velocidad;
      x2 += velocidad;
      x3 += velocidad;
      x4 += velocidad;
    }
    if(x1 > mouseX){
      x1 -= velocidad;
      x2 -= velocidad;
      x3 -= velocidad;
      x4 -= velocidad;
    }
    if(y1 < mouseY){
      y1 += velocidad;
      y2 += velocidad;
      y3 += velocidad;
      y4 += velocidad;
    }
    if(y2 > mouseY){
      y1 -= velocidad;
      y2 -= velocidad;
      y3 -= velocidad;
      y4 -= velocidad;
    }
  }
}

function dibujarCuadricula(size_c){

  for(let x=0; x<windowWidth;x+=size_c)
  {
    if(x > windowWidth/2){
      stroke(0,200,0);
    }
    line(x,0,x,windowHeight);
  }
  stroke(0,0,0);
  for(let y=0;y<windowHeight;y+=size_c){
    if(y > windowHeight/2){
      stroke(0,200,0);
    }
    line(0,y,windowWidth,y);
  }
  stroke(0,0,0);
}

function keyTyped() {
  if(key === 'p') {
    pausa = !pausa;
  }
  //return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
