class Nodo {
    constructor(valor, alpha, beta) {
        this.valor = valor; //identificador
        this.alpha = alpha;
        this.beta = beta;
        this.distancia = 0;
        this.adyacentes = [];
    }

    addAdyacente(nodo, distancia) {
        this.adyacentes.push({ 'nodo': nodo, 'distancia': distancia });
    }

    // removeAdyacente(nodo){
    //     let remover = this.adyacentes.find(n => n.valor == nodo.valor);
    //     this.adyacentes.pop()
    // }

    printAdyacentes() {
        console.log(this.adyacentes);
    }

    printNodo() {
        console.log(this.valor);
    }
}

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

    getP2Y() {
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

    dibujarCirculo(r, g, b, a) {
        fill(r, g, b, a);
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

let puntos = [];
let puntoschidos = [];
let puntosSize = 30;
let k = 3;

function setup() {
    createCanvas(width, height);
    angleMode(DEGREES);

    brazo = new Brazo(l1 = 200, l2 = 100, alphai = 120, betaj = 0, color = [255, 51, 78]);
    circulo1 = new Circulo(0, 100, 90);
    circulo2 = new Circulo(-200, 300, 100);

    generarPuntos();

    let alphas = [];
    let betas = [];

    let nodosbuenos = [];

    let alphasbuenos = [];
    let betasbuenos = [];

    let alphasmalos = [];
    let betasmalos = [];

    for (let i = 0; i < puntosSize; i++) {
        if (!evaluateNode(puntos[i])) {
            nodosbuenos.push(puntos[i]);
            alphasbuenos.push(puntos[i]['alpha']);
            betasbuenos.push(puntos[i]['beta']);
        }
        else {
            alphasmalos.push(puntos[i]['alpha']);
            betasmalos.push(puntos[i]['beta']);
        }
        alphas.push(puntos[i]['alpha']);
        betas.push(puntos[i]['beta']);
    }


    var databueno = {
        x: alphasbuenos,
        y: betasbuenos,
        name: 'libre',
        mode: "markers",
        marker: {
            size: 8,
            color: 'blue'
        },
    };

    var data = [{
        x: alphasbuenos,
        y: betasbuenos,
        name: 'libre',
        mode: "markers",
        marker: {
            size: 8,
            color: 'blue'
        },
    }];

    // Define Layout
    var layout = {
        xaxis: { range: [0, 180], title: "Alpha" },
        yaxis: { range: [0, 360], title: "Beta" },
        title: "Espacio de configuraciones muestreo (Libres)",
    };

    // Display using Plotly
    Plotly.newPlot("myPlotLibres", data, layout);

    var datamalo = {
        x: alphasmalos,
        y: betasmalos,
        name: 'colision',
        mode: "markers",
        marker: {
            size: 8,
            color: 'red'
        }
    };

    var plotData = [databueno, datamalo];

    var layout = {
        xaxis: { range: [0, 180], title: "Alpha" },
        yaxis: { range: [0, 360], title: "Beta" },
        title: "Espacio de configuraciones muestreo"
    };

    // Display using Plotly
    Plotly.newPlot("myPlotTodos", plotData, layout);

    let grafo = [];

    nodosbuenos.forEach(nodo => {
        let vecinos = kvecinos(nodo, nodosbuenos, k);
        n = new Nodo(nodo['nodo'],nodo['alpha'],nodo['beta']);
        
        for (let i = 0; i < vecinos.length; i++) {
            n.addAdyacente(vecinos[i].nodo,vecinos[i].distancia);    
        }

        grafo.push(n);
    });

    console.log(grafo);
}



function draw() {
    background(200);
    translate(width / 2, height);

    hit = lineCircle(0, 0, brazo.getP2X(), brazo.getP2Y(), circulo1.x, circulo1.y, circulo1.radio)
        || lineCircle(brazo.getP2X(), brazo.getP2Y(), brazo.getP3X(), brazo.getP3Y(), circulo1.x, circulo1.y, circulo1.radio);


    hit2 = lineCircle(0, 0, brazo.getP2X(), brazo.getP2Y(), circulo2.x, circulo2.y, circulo2.radio)
        || lineCircle(brazo.getP2X(), brazo.getP2Y(), brazo.getP3X(), brazo.getP3Y(), circulo2.x, circulo2.y, circulo2.radio);


    push();
    brazo.dibujarBrazo();
    pop();

    // draw the circle
    if (hit) {
        circulo1.dibujarCirculo(255, 150, 0, 150);
    }
    else {
        circulo1.dibujarCirculo(0, 150, 255, 150);
    }

    // draw the circle 2
    if (hit2) {
        circulo2.dibujarCirculo(255, 150, 0, 150);
    }
    else {
        circulo2.dibujarCirculo(0, 150, 255, 150);
    }
}

function generarPuntos() {
    let alphai;
    let betaj;

    for (let i = 0; i < puntosSize; i++) {
        alphai = Math.floor((Math.random() * maxAlpha));
        betaj = Math.floor((Math.random() * maxBeta));
        puntos.push({ 'nodo': i, 'alpha': alphai, 'beta': betaj });
    }
}

function evaluateNode(node) {
    let x2 = (cos(node['alpha']) * brazo.l1);

    let y2 = (sin(node['alpha']) * brazo.l1);

    let x3 = (brazo.l1 * cos(node['alpha']) + brazo.l2 * cos(node['alpha'] + node['beta']));

    let y3 = (brazo.l1 * sin(node['alpha']) + brazo.l2 * sin(node['alpha'] + node['beta']));

    hit = lineCircle(0, 0, x2, brazo.y2, circulo1.x, circulo1.y, circulo1.radio)
        || lineCircle(x2, y2, x3, y3, circulo1.x, circulo1.y, circulo1.radio);


    hit2 = lineCircle(0, 0, x2, y2, circulo2.x, circulo2.y, circulo2.radio)
        || lineCircle(x2, y2, x3, y3, circulo2.x, circulo2.y, circulo2.radio);

    return hit || hit2;
}

function kvecinos(nodo, poblacion, k) {
    let distancias = [];
    let vecinos = [];

    for (let i = 0; i < poblacion.length; i++) {
        distancias.push({ 'distancia': dist(nodo['alpha'], nodo['beta'], poblacion[i]['alpha'], poblacion[i]['beta']), 'nodo': poblacion[i] });
    }

    distancias.sort(function (a, b) {
        return a.distancia - b.distancia;
    });

    let j = 0, i = 1;
    let puntomedio, puntocuarto1, puntocuarto2, puntoctavo1, puntoctavo2, puntoctavo3, puntoctavo4;

    while (j < k && i < distancias.length) {
        puntomedio = [(nodo['alpha'] + distancias[i].nodo['alpha']) / 2, (nodo['beta'] + distancias[i].nodo['beta']) / 2];
        puntocuarto1 = [(nodo['alpha'] + puntomedio[0]) / 2, (nodo['beta'] + puntomedio[1]) / 2];
        puntocuarto2 = [(distancias[i].nodo['alpha'] + puntomedio[0]) / 2, (distancias[i].nodo['beta']) / 2];
        puntoctavo1 = [(nodo['alpha'] + puntocuarto1[0]) / 2, (nodo['beta'] + puntocuarto1[1]) / 2];
        puntoctavo2 = [(puntomedio[0] + puntocuarto1[0]) / 2, (puntomedio[0] + puntocuarto1[1]) / 2];
        puntoctavo3 = [(puntomedio[0] + puntocuarto2[0]) / 2, (puntomedio[1] + puntocuarto2[1]) / 2];
        puntoctavo4 = [(puntocuarto2[0] + distancias[i].nodo['alpha']) / 2, (puntocuarto2[1] + distancias[i].nodo['beta']) / 2];

        if (!evaluateNode({ 'alpha': puntomedio[0], 'beta': puntomedio[1] }) &&
            !evaluateNode({ 'alpha': puntocuarto1[0], 'beta': puntocuarto1[1] }) &&
            !evaluateNode({ 'alpha': puntocuarto2[0], 'beta': puntocuarto2[1] }) &&
            !evaluateNode({ 'alpha': puntoctavo1[0], 'beta': puntoctavo1[1] }) &&
            !evaluateNode({ 'alpha': puntoctavo2[0], 'beta': puntoctavo2[1] }) &&
            !evaluateNode({ 'alpha': puntoctavo3[0], 'beta': puntoctavo3[1] }) &&
            !evaluateNode({ 'alpha': puntoctavo4[0], 'beta': puntoctavo4[1] })) {
            vecinos.push({'nodo':distancias[i].nodo,'distancia':distancias[i].distancia});
            i++;
            j++;
        }
        else {
            //console.log(`nodo ${distancias[i]} no sirve, aumentando i = ${i} a ${i+1}`);
            i++;
            continue;
        }
    }

    if (i >= distancias.length) {
        console.log('nodo \'encerrado\' ')
    }
    return vecinos;
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