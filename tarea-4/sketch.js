var Graph = (function (undefined) {

    var extractKeys = function (obj) {
        var keys = [], key;
        for (key in obj) {
            Object.prototype.hasOwnProperty.call(obj, key) && keys.push(key);
        }
        return keys;
    }

    var sorter = function (a, b) {
        return parseFloat(a) - parseFloat(b);
    }

    var findPaths = function (map, start, end, infinity) {
        infinity = infinity || Infinity;

        var costs = {},
            open = { '0': [start] },
            predecessors = {},
            keys;

        var addToOpen = function (cost, vertex) {
            var key = "" + cost;
            if (!open[key]) open[key] = [];
            open[key].push(vertex);
        }

        costs[start] = 0;

        while (open) {
            if (!(keys = extractKeys(open)).length) break;

            keys.sort(sorter);

            var key = keys[0],
                bucket = open[key],
                node = bucket.shift(),
                currentCost = parseFloat(key),
                adjacentNodes = map[node] || {};

            if (!bucket.length) delete open[key];

            for (var vertex in adjacentNodes) {
                if (Object.prototype.hasOwnProperty.call(adjacentNodes, vertex)) {
                    var cost = adjacentNodes[vertex],
                        totalCost = cost + currentCost,
                        vertexCost = costs[vertex];

                    if ((vertexCost === undefined) || (vertexCost > totalCost)) {
                        costs[vertex] = totalCost;
                        addToOpen(totalCost, vertex);
                        predecessors[vertex] = node;
                    }
                }
            }
        }

        if (costs[end] === undefined) {
            return null;
        } else {
            return predecessors;
        }

    }

    var extractShortest = function (predecessors, end) {
        var nodes = [],
            u = end;

        while (u !== undefined) {
            nodes.push(u);
            u = predecessors[u];
        }

        nodes.reverse();
        return nodes;
    }

    var findShortestPath = function (map, nodes) {
        var start = nodes.shift(),
            end,
            predecessors,
            path = [],
            shortest;

        while (nodes.length) {
            end = nodes.shift();
            predecessors = findPaths(map, start, end);

            if (predecessors) {
                shortest = extractShortest(predecessors, end);
                if (nodes.length) {
                    path.push.apply(path, shortest.slice(0, -1));
                } else {
                    return path.concat(shortest);
                }
            } else {
                return null;
            }

            start = end;
        }
    }

    var toArray = function (list, offset) {
        try {
            return Array.prototype.slice.call(list, offset);
        } catch (e) {
            var a = [];
            for (var i = offset || 0, l = list.length; i < l; ++i) {
                a.push(list[i]);
            }
            return a;
        }
    }

    var Graph = function (map) {
        this.map = map;
    }

    Graph.prototype.findShortestPath = function (start, end) {
        if (Object.prototype.toString.call(start) === '[object Array]') {
            return findShortestPath(this.map, start);
        } else if (arguments.length === 2) {
            return findShortestPath(this.map, [start, end]);
        } else {
            return findShortestPath(this.map, toArray(arguments));
        }
    }

    Graph.findShortestPath = function (map, start, end) {
        if (Object.prototype.toString.call(start) === '[object Array]') {
            return findShortestPath(map, start);
        } else if (arguments.length === 3) {
            return findShortestPath(map, [start, end]);
        } else {
            return findShortestPath(map, toArray(arguments, 1));
        }
    }

    return Graph;

})();

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
    constructor(l1 = 200, l2 = 160, alphai = 0, betaj = 0, color = [255, 51, 78]) {
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

    getAlpha() {
        return this.alphai;
    }

    getBeta() {
        return this.betaj;
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
        //this.dibujarBrazo2();
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
        ellipse(this.x, -this.y, this.radio * 2, this.radio * 2);
        //circle(this.x, this.y, this.radio);
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
let ruta = [];
let puntosSize = 100;
let k = 5;

let inicial;
let final;

let sliderAlpha;
let sliderBeta;
let sldl1;
let sldl2;
let sldradio;
let sldradio2;
let calcular;
let setposeinicial;
let setposefinal;
let setrandom;


function setup() {
    var canvas = createCanvas(width, height);
    canvas.parent('sketch-holder');
    angleMode(DEGREES);
    frameRate(10);

    brazo = new Brazo();
    circulo1 = new Circulo(200, 200, 90);
    circulo2 = new Circulo(-200, 300, 100);

    sliderAlpha = createSlider(0, maxAlpha, 0, 1);
    sliderBeta = createSlider(0, maxBeta, 0, 1);

    sldl1 = createSlider(20, 300, 100, 1);
    sldl2 = createSlider(20, 300, 60, 1);
    sldradio = createSlider(20, 400, 80, 1);
    sldradio2 = createSlider(20, 400, 80, 1);

    calcular = createButton('Calcular');
    calcular.mousePressed(calc);

    setposeinicial = createButton('definir pose inicial');
    setposeinicial.mousePressed(setinicial);

    setposefinal = createButton('definir pose final');
    setposefinal.mousePressed(setfinal);

    setrandom = createButton('definir aleatorio');
    setrandom.mousePressed(setposerandom);
}

let rutaindex = 0;

function draw() {
    background(200);
    translate(width / 2, height);

    //Verificar colision con circulo 1
    hit = lineCircle(0, 0, brazo.getP2X(), brazo.getP2Y(), circulo1.x, circulo1.y, circulo1.radio)
        || lineCircle(brazo.getP2X(), brazo.getP2Y(), brazo.getP3X(), brazo.getP3Y(), circulo1.x, circulo1.y, circulo1.radio);

    //Verificar colision con circulo 2
    hit2 = lineCircle(0, 0, brazo.getP2X(), brazo.getP2Y(), circulo2.x, circulo2.y, circulo2.radio)
        || lineCircle(brazo.getP2X(), brazo.getP2Y(), brazo.getP3X(), brazo.getP3Y(), circulo2.x, circulo2.y, circulo2.radio);


    //Acualizar valores de alpha y beta del brazo
    brazo.alphai = sliderAlpha.value();
    brazo.betaj = sliderBeta.value();

    //Acualizar valores L1 y L2 del brazo
    brazo.l1 = sldl1.value();
    brazo.l2 = sldl2.value();

    //Actualiza el valor del radio
    circulo1.radio = sldradio.value();
    circulo2.radio = sldradio2.value();

    push();

    //Actualiza frame a nueva posicion despues de calcular la ruta
    if (ruta.length > 0) {
        brazo.alphai = ruta[rutaindex][0];
        brazo.betaj = ruta[rutaindex][1];
        rutaindex = (rutaindex + 1) % ruta.length;
    }



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
        circulo2.dibujarCirculo(255, 40, 0, 150);
    }
}


function setinicial() {
    inicial = { 'nodo': puntosSize, 'alpha': brazo.getAlpha(), 'beta': brazo.getBeta() };
}

function setfinal() {
    final = { 'nodo': puntosSize + 1, 'alpha': brazo.getAlpha(), 'beta': brazo.getBeta() };
}

function setposerandom() {
    let posinicial, posfinal;
    while (posinicial == undefined || posfinal == undefined) {
        let alphai = Math.floor((Math.random() * maxAlpha));
        let betaj = Math.floor((Math.random() * maxBeta));

        if (!evaluateNode({ 'alpha': alphai, 'beta': betaj })) {
            posinicial = { 'nodo': puntos.length, 'alpha': alphai, 'beta': betaj };
        }

        alphai = Math.floor((Math.random() * maxAlpha));
        betaj = Math.floor((Math.random() * maxBeta));

        if (!evaluateNode({ 'alpha': alphai, 'beta': betaj })) {
            posfinal = { 'nodo': puntos.length + 1, 'alpha': alphai, 'beta': betaj };
        }
    }

    inicial = posinicial;
    final = posfinal;
}

function calc() {

    generarPuntos();

    let posinicial;
    let posfinal;

    let nodosbuenos = [];

    let alphasbuenos = [];
    let betasbuenos = [];

    let alphasmalos = [];
    let betasmalos = [];

    let grafo = [];
    var map2 = {};
    ruta = [];
    rutaindex = 0;

    if (final == undefined || inicial == undefined) {
        alert('Falta definir pose inicial o final');
        return -1;
    }

    if (final.alpha == inicial.alpha && final.beta == inicial.beta) {
        alert('Pose inicial y pose final son iguales');
        return -2;
    }

    posfinal = final;
    posinicial = inicial;

    // while (posinicial == undefined || posfinal == undefined) {
    //     let alphai = Math.floor((Math.random() * maxAlpha));
    //     let betaj = Math.floor((Math.random() * maxBeta));

    //     if (!evaluateNode({ 'alpha': alphai, 'beta': betaj })) {
    //         posinicial = { 'nodo': puntos.length, 'alpha': alphai, 'beta': betaj };
    //     }

    //     alphai = Math.floor((Math.random() * maxAlpha));
    //     betaj = Math.floor((Math.random() * maxBeta));

    //     if (!evaluateNode({ 'alpha': alphai, 'beta': betaj })) {
    //         posfinal = { 'nodo': puntos.length + 1, 'alpha': alphai, 'beta': betaj };
    //     }
    // }



    //console.log(posinicial,posfinal);

    puntos.push(posinicial);
    puntos.push(posfinal);

    //console.log(puntos);



    for (let i = 0; i < puntosSize + 2; i++) {
        if (!evaluateNode(puntos[i])) {
            nodosbuenos.push(puntos[i]);
            alphasbuenos.push(puntos[i]['alpha']);
            betasbuenos.push(puntos[i]['beta']);
        }
        else {
            alphasmalos.push(puntos[i]['alpha']);
            betasmalos.push(puntos[i]['beta']);
        }
    }

    graficar(alphasbuenos, betasbuenos, alphasmalos, betasmalos, posinicial, posfinal);



    nodosbuenos.forEach(nodo => {
        let vecinos = kvecinos(nodo, nodosbuenos, k);
        n = new Nodo(nodo['nodo'], nodo['alpha'], nodo['beta']);

        for (let i = 0; i < vecinos.length; i++) {
            n.addAdyacente(vecinos[i].nodo, vecinos[i].distancia);
        }

        grafo.push(n);
    });
    //graficarGrafo(alphasbuenos, betasbuenos, grafo);

    grafo.forEach(nodo => {
        let adj = {};
        nodo.adyacentes.forEach(n => {
            adj[n.nodo.nodo] = n.distancia;
        });
        map2[nodo.valor] = adj;
    });

    graph2 = new Graph(map2);

    //console.log(grafo[0].valor,grafo[3].valor);
    console.log(grafo);
    console.log('pose inicial:', posinicial, posinicial.nodo);
    console.log('pose final: ', posfinal, posfinal.nodo);
    //console.log(`fuente: ${puntos.valor}, destino ${grafo[3].valor}`)
    // console.log(graph2.findShortestPath(posinicial.nodo.toString(),posfinal.nodo.toString()));
    let solucion = graph2.findShortestPath(posinicial.nodo.toString(), posfinal.nodo.toString());
    console.log(solucion);

    if (solucion) {
        solucion.forEach(pose => {
            let nodo = grafo.find(n => {
                return n['valor'] == parseInt(pose);
            });
            //console.log(nodo['alpha'],nodo['beta']);
            ruta.push([nodo['alpha'], nodo['beta']]);
        });
    }
    else {
        alert('No fue posible encontrar trayectoria valida entre pose inicial a pose final');
    }
    //console.log(grafo);
}


/**
 * Grafica los puntos generados aleatoriamente en el espacio de configuraciones
 * Los puntos azules corresponden a espacio libre
 * Los puntos rojos corresponden a colisiones, por lo que estos son descartados para encontrar la ruta de la pose inicial a la final
 */
function graficar(alphasbuenos, betasbuenos, alphasmalos, betasmalos, ini, fin) {


    var inicial = {
        x: [ini['alpha']],
        y: [ini['beta']],
        name: 'pose inicial',
        mode: "markers",
        marker: {
            size: 8,
            color: 'green'
        }
    };

    var final = {
        x: [fin['alpha']],
        y: [fin['beta']],
        name: 'pose final',
        mode: "markers",
        marker: {
            size: 8,
            color: 'pink'
        }
    };

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

    var data = [databueno, final, inicial];

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

    var plotData = [databueno, datamalo, inicial, final];

    var layout = {
        xaxis: { range: [0, 180], title: "Alpha" },
        yaxis: { range: [0, 360], title: "Beta" },
        title: "Espacio de configuraciones muestreo"
    };

    // Display using Plotly
    Plotly.newPlot("myPlotTodos", plotData, layout);
}

function graficarGrafo(alphasbuenos, betasbuenos, grafo) {
    var data = [];
    grafo.forEach(nodo => {

        let xval = [];
        let yval = [];
        console.log(nodo.alpha, nodo.beta, nodo.adyacentes);
        nodo.adyacentes.forEach(n => {
            xval.push(n.nodo.alpha);
            yval.push(n.nodo.beta);
        });
        xval.push(nodo.alpha);
        yval.push(nodo.beta);
        data.push({
            x: xval,
            y: yval,
            mode: 'lines+markers',
            type: 'scatter',

        });
    });

    var layout = {
        xaxis: { range: [0, 180], title: "Alpha" },
        yaxis: { range: [0, 360], title: "Beta" },
        title: "Grafo"
    };

    Plotly.newPlot('myDiv', data, layout);
}


/**
 * generarPuntos genera un conjunto de nodos(configuraciones alfa-beta) de manera aleatoria
 */
function generarPuntos() {
    let alphai;
    let betaj;

    puntos = [];
    for (let i = 0; i < puntosSize; i++) {
        alphai = Math.floor((Math.random() * maxAlpha));
        betaj = Math.floor((Math.random() * maxBeta));
        puntos.push({ 'nodo': i, 'alpha': alphai, 'beta': betaj });
    }
}


/**
 * Funcion para evaluar si un nodo ( una configuracion de alpha - beta) esta en espacio libre o si es obstaculo
 * @param {*} node 
 * @returns verdadero si esta en espacio libre, falso en cualquier otro caso
 */
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


/**
 * kvecinos regresa una lista de nodos correspondientes a los k vecinos mas cercanos
 * @param {Nodo} nodo 
 * @param {list} poblacion 
 * @param {*} k 
 * @returns 
 */
function kvecinos(nodo, poblacion, k) {
    let distancias = [];
    let vecinos = [];

    //Calcular la distancia entre nodo y todos los demas vertices del grafo
    for (let i = 0; i < poblacion.length; i++) {
        distancias.push({ 'distancia': dist(nodo['alpha'], nodo['beta'], poblacion[i]['alpha'], poblacion[i]['beta']), 'nodo': poblacion[i] });
    }


    //Ordenar los vertices por distancia de manera ascendente
    distancias.sort(function (a, b) {
        return a.distancia - b.distancia;
    });

    let j = 0, i = 1;
    let puntomedio, puntocuarto1, puntocuarto2, puntoctavo1, puntoctavo2, puntoctavo3, puntoctavo4;

    //Validar los nodos vecinos si no existe colision y agregarlos a vecinos
    while (j < k && i < distancias.length) {
        puntomedio = [(nodo['alpha'] + distancias[i].nodo['alpha']) / 2, (nodo['beta'] + distancias[i].nodo['beta']) / 2];

        puntocuarto1 = [(nodo['alpha'] + puntomedio[0]) / 2, (nodo['beta'] + puntomedio[1]) / 2];
        puntocuarto2 = [(distancias[i].nodo['alpha'] + puntomedio[0]) / 2, (distancias[i].nodo['beta']) + puntomedio[1] / 2];

        puntoctavo1 = [(nodo['alpha'] + puntocuarto1[0]) / 2, (nodo['beta'] + puntocuarto1[1]) / 2];
        puntoctavo2 = [(puntomedio[0] + puntocuarto1[0]) / 2, (puntomedio[1] + puntocuarto1[1]) / 2];
        puntoctavo3 = [(puntomedio[0] + puntocuarto2[0]) / 2, (puntomedio[1] + puntocuarto2[1]) / 2];
        puntoctavo4 = [(puntocuarto2[0] + distancias[i].nodo['alpha']) / 2, (puntocuarto2[1] + distancias[i].nodo['beta']) / 2];

        if (!evaluateNode({ 'alpha': puntomedio[0], 'beta': puntomedio[1] }) &&
            !evaluateNode({ 'alpha': puntocuarto1[0], 'beta': puntocuarto1[1] }) &&
            !evaluateNode({ 'alpha': puntocuarto2[0], 'beta': puntocuarto2[1] }) &&
            !evaluateNode({ 'alpha': puntoctavo1[0], 'beta': puntoctavo1[1] }) &&
            !evaluateNode({ 'alpha': puntoctavo2[0], 'beta': puntoctavo2[1] }) &&
            !evaluateNode({ 'alpha': puntoctavo3[0], 'beta': puntoctavo3[1] }) &&
            !evaluateNode({ 'alpha': puntoctavo4[0], 'beta': puntoctavo4[1] })) {
            vecinos.push({ 'nodo': distancias[i].nodo, 'distancia': distancias[i].distancia });
            i++;
            j++;
        }
        else {
            i++;
            continue;
        }
    }

    if (i >= distancias.length) {
        console.log('nodo \'encerrado\'');
    }

    //Regresar los k vecinos mas cercanos
    return vecinos;
}

/**
 * mouseDragged detecta si el cursor se encuentra encima de la pelota o no y si se ha realizado clic
 * en caso de que sea asi, se puede arrastar el mouse sin soltar el clic para posicionar la pelota
 */
function mouseDragged() {
    let x = mouseX - 400;
    let y = -(mouseY - 800);

    let dista = dist(x, y, circulo1.x, circulo1.y);

    let dista2 = dist(x, y, circulo2.x, circulo2.y);

    if (dista <= circulo1.radio) {
        circulo1.x = x;
        circulo1.y = y;
    }

    if (dista2 <= circulo2.radio) {
        circulo2.x = x;
        circulo2.y = y;
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
    //fill(255, 0, 0);
    //noStroke();
    //ellipse(closestX, closestY, 20, 20);

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