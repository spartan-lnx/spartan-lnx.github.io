class Brazo {
    constructor(l1 = 200, l2 = 200, alphai = 0, betaj = 0, color = [255, 51, 78]) {
        this.x = 0;
        this.y = 0;
        this.l1 = l1;
        this.l2 = l2;
        this.alphai = alphai;
        this.betaj = betaj;
        this.color = color;
        this.grosor = 30;
    }

    getP2X() {
        return (cos(this.alphai) * this.l1);
    }

    getP2Y(){
        return (sin(this.alphai) * this.l1);
    }

    getP3X() {
        return (this.l1 * cos(this.alphai) + this.l2 * cos(this.alphai + this.betaj));
    }

    getP3Y() {
        return (this.l1 * sin(this.alphai) + this.l2 * sin(this.alphai + this.betaj));
        
    }

    dibujarBrazo2() {
        strokeWeight(8);
        stroke('red');
        rotate(-this.alphai);
        line(0, 0, this.l1, 0);

        stroke('blue');
        translate(this.l1, 0);
        rotate(-this.betaj);
        line(0, 0, this.l2, 0);
    }

    dibujarBrazo() {
        //Color de borde y grosor
        stroke("black");
        strokeWeight(6);

        //Rotar estructura L1
        rotate(-this.alphai);

        //Guardar el estado de rotacion,posicion y color
        push();
        fill(255, 194, 97);

        //Dibujar circulo(articulacion) del brazo
        circle(0, 0, this.grosor);

        //Restaurar el estado de rotacion,posicion y color anterior
        pop();

        //Establecer color de la estructura L1
        fill(this.color[0], this.color[1], this.color[2]);

        //Dibujar la estructura L1
        rect(18, -15, this.l1, this.grosor);

        translate(this.l1 + 35, 0);
        rotate(-this.betaj);

        push();
        fill(255, 194, 97);
        circle(0, 0, this.grosor);
        pop();

        rect(18, -15, this.l2, this.grosor);
    }
}

class Circulo {
    constructor(x, y, radio) {
        this.x = x;
        this.y = y;
        this.radio = radio;
    }

    dibujarCirculo(r,g,b,a) {
        fill(r,g,b,a);
        noStroke();
        circle(this.x, -this.y, this.radio);
    }
}

let brazo;
let circulo1;
let circulo2;


let width = 800;
let height = 800;

let maxAlpha = 180;
let maxBeta = 360;

function setup() {
    createCanvas(width, height);
    angleMode(DEGREES);
    
    brazo = new Brazo(l1 = 200, l2 = 100, alphai = 0, betaj = 0, color = [255, 51, 78]);
    circulo1 = new Circulo(0, 100, 90);
    circulo2 = new Circulo(-200, 300, 60);
}


function draw() {
    background(200);
    translate(width/2,height);

    hit = lineCircle(0, 0, brazo.getP2X(), brazo.getP2Y(), circulo1.x, circulo1.y, circulo1.radio) 
        || lineCircle(brazo.getP2X(), brazo.getP2Y(), brazo.getP3X(), brazo.getP3Y(), circulo1.x, circulo1.y, circulo1.radio);

    
    hit2 = lineCircle(0, 0, brazo.getP2X(), brazo.getP2Y(), circulo2.x, circulo2.y, circulo2.radio) 
    || lineCircle(brazo.getP2X(), brazo.getP2Y(), brazo.getP3X(), brazo.getP3Y(), circulo2.x, circulo2.y, circulo2.radio);

    
    push();
    brazo.dibujarBrazo();
    pop();

    // draw the circle
    if (hit){
        circulo1.dibujarCirculo(255,150,0, 150);
    }
    else{
        circulo1.dibujarCirculo(0,150,255, 150);
    }
    
    // draw the circle 2
    if (hit2){
        circulo2.dibujarCirculo(255,150,0, 150);
    }
    else{
        circulo2.dibujarCirculo(0,150,255, 150);
    }
}


let puntos = [];
let puntosSize = 100;

function generarPuntos(){
    let alphai;
    let betaj;

    for (let i = 0; i < puntosSize; i++) {
        alphai = Math.random() % maxAlpha;
        betaj = Math.random() % maxBeta;

        puntos.add()
    }
}

class Graph {
    constructor() {
      this.adjacencyList = {};
    }
    addVertex(vertex) {
      if (!this.adjacencyList[vertex]) {
        this.adjacencyList[vertex] = [];
      }
    }
    addEdge(source, destination) {
      if (!this.adjacencyList[source]) {
        this.addVertex(source);
      }
      if (!this.adjacencyList[destination]) {
        this.addVertex(destination);
      }
      this.adjacencyList[source].push(destination);
      this.adjacencyList[destination].push(source);
    }
    removeEdge(source, destination) {
      this.adjacencyList[source] = this.adjacencyList[source].filter(vertex => vertex !== destination);
      this.adjacencyList[destination] = this.adjacencyList[destination].filter(vertex => vertex !== source);
    }
    removeVertex(vertex) {
      while (this.adjacencyList[vertex]) {
        const adjacentVertex = this.adjacencyList[vertex].pop();
        this.removeEdge(vertex, adjacentVertex);
      }
      delete this.adjacencyList[vertex];
    }  
  }  
  
// POINT/CIRCLE
function pointCircle(px, py, cx, cy, r) {

    // get distance between the point and circle's center
    // using the Pythagorean Theorem
    distX = px - cx;
    distY = py - cy;
    distance = sqrt((distX * distX) + (distY * distY));

    // if the distance is less than the circle's
    // radius the point is inside!
    if (distance <= r) {
        return true;
    }
    return false;
}

// LINE/CIRCLE
function lineCircle(x1, y1, x2, y2, cx, cy, r) {

    // is either end INSIDE the circle?
    // if so, return true immediately
    inside1 = pointCircle(x1, y1, cx, cy, r);
    inside2 = pointCircle(x2, y2, cx, cy, r);
    if (inside1 || inside2) return true;

    // get length of the line
    distX = x1 - x2;
    distY = y1 - y2;
    len = sqrt((distX * distX) + (distY * distY));

    // get dot product of the line and circle
    dot = (((cx - x1) * (x2 - x1)) + ((cy - y1) * (y2 - y1))) / pow(len, 2);

    // find the closest point on the line
    closestX = x1 + (dot * (x2 - x1));
    closestY = y1 + (dot * (y2 - y1));

    // is this point actually on the line segment?
    // if so keep going, but if not, return false
    onSegment = linePoint(x1, y1, x2, y2, closestX, closestY);
    if (!onSegment) return false;

    // optionally, draw a circle at the closest
    // point on the line
    // fill(255, 0, 0);
    // noStroke();
    // ellipse(closestX, closestY, 20, 20);

    // get distance to closest point
    distX = closestX - cx;
    distY = closestY - cy;
    distance = sqrt((distX * distX) + (distY * distY));

    if (distance <= r) {
        return true;
    }
    return false;
}

// LINE/POINT
function linePoint(x1, y1, x2, y2, px, py) {

    // get distance from the point to the two ends of the line
    d1 = dist(px, py, x1, y1);
    d2 = dist(px, py, x2, y2);

    // get the length of the line
    lineLen = dist(x1, y1, x2, y2);

    // since s are so minutely accurate, add
    // a little buffer zone that will give collision
    buffer = 0.1;    // higher # = less accurate

    // if the two distances are equal to the line's
    // length, the point is on the line!
    // note we use the buffer here to give a range,
    // rather than one #
    if (d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer) {
        return true;
    }
    return false;
}