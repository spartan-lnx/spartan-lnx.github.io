//Tarea 2 Robotica Movil - Espacio de Configuraciones
//Alumno: Orozco Lomeli Daniel Uriel
//Fecha: 03/02/2022

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

    calcularPosicion() {
        let x = Math.floor(this.l1 * cos(this.alphai) + this.l2 * cos(this.alphai + this.betaj));
        let y = Math.floor(this.l1 * sin(this.alphai) + this.l2 * sin(this.alphai + this.betaj));
        return [x,y];
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

        translate(this.l1+35, 0);
        rotate(-this.betaj);

        push();
        fill(255, 194, 97);
        circle(0, 0, this.grosor);
        pop();

        rect(18, -15, this.l2, this.grosor);
    }
}

class Circulo {
    constructor(x, y, diametro, color) {
        this.x = x;
        this.y = y;
        this.radio = diametro;
        this.color = color;
    }

    dibujarCirculo() {
        fill(this.color);
        circle(this.x, -this.y, this.radio);
    }
}

const WIDTH = 860;
const HEIGHT = 860;

const MAX_ALPHA = 180;
const MAX_BETA = 360;

let brazo;
let circulo;
let plano;

let btnCalcular;
let sliderAlpha;
let sliderBeta;
let sldl1;
let sldl2;
let sldradio;

function setup() {
    var canvas = createCanvas(WIDTH, HEIGHT);
    canvas.parent('sketch-holder');
    angleMode(DEGREES);

    brazo = new Brazo(l1 = 200, l2 = 160, alphai = 0, betaj = 0);
    circulo = new Circulo(300, 200, 80, 'blue');
    plano = matrix(MAX_ALPHA, MAX_BETA);

    btnCalcular = createButton('Calcular');
    btnCalcular.mousePressed(actualizarEspacioConf);

    sliderAlpha = createSlider(0, MAX_ALPHA, 0, 1);
    sliderAlpha.changed(verificarColision)

    sliderBeta = createSlider(0, MAX_BETA, 0,1);
    sliderBeta.changed(verificarColision);
    sliderBeta.changed(verificarColision);

    sldl1 = createSlider(20, 300, 200,1);
    sldl2 = createSlider(20, 300, 160,1);
    sldradio = createSlider(20, 400, 80,1);
}

function draw() {
    background(248, 212, 255);

    //Trasladar centro a 400,400
    translate(WIDTH/2, HEIGHT/2);

    //Dibujar circulo
    circulo.dibujarCirculo();

    //Dibujar brazo
    brazo.dibujarBrazo();


    //Acualizar valores de alpha y beta del brazo
    brazo.alphai = sliderAlpha.value();
    brazo.betaj = sliderBeta.value();

    //Acualizar valores L1 y L2 del brazo
    brazo.l1 = sldl1.value();
    brazo.l2 = sldl2.value();

    //Actualiza el valor del radio
    circulo.radio = sldradio.value();
}

/**
 * verificarColision calcula en la simulacion en vivo si la punta del brazo esta en contacto con la pelota o no.
 * en caso de que este en contacto actuliza el color de la pelota a negro
 * en caso contario lo deja en azul
 */
function verificarColision(){
    let xy = brazo.calcularPosicion();
    if (dist(xy[0], xy[1], circulo.x, circulo.y) < circulo.radio/2) {
        circulo.color = 'black';
    }
    else{
        circulo.color = 'blue';
    }
}

/**
 * mouseDragged detecta si el cursor se encuentra encima de la pelota o no y si se ha realizado clic
 * en caso de que sea asi, se puede arrastar el mouse sin soltar el clic para posicionar la pelota
 */
function mouseDragged() {
    let x = mouseX - 400;
    let y = -(mouseY - 400);

    let dista = dist(x, y, circulo.x, circulo.y);

    if (dista < circulo.radio) {
        circulo.x = x;
        circulo.y = y;
        verificarColision();    
    }
}

/**
 * actualizarEspacioConf comprueba cada configuracion posible de alpha y beta para determinar si la punta del brazo se encuentra en colision con la pelota o no.
 * en caso de que si, actualiza el valor del mapa de configuraciones a 1.
 * en caso contrario, lo actualiza a 0.
 */
function actualizarEspacioConf() {
    
    //Iteradores
    let alphai, betaj;
    
    let l1 = brazo.l1;
    let l2 = brazo.l2;
    
    let circ_x = circulo.x;
    let circ_y = circulo.y;
    let radio = circulo.radio;

    //Itera en cada configuracion posible de los angulos alpha y beta y calcula si se encuentra en colision con la pelota o no.
    for (alphai = 0; alphai < MAX_ALPHA; alphai++) {
        for (betaj = 0; betaj < MAX_BETA; betaj++) {
            let x = l1 * cos(alphai) + l2 * cos(alphai + betaj);
            let y = l1 * sin(alphai) + l2 * sin(alphai + betaj);
            if (dist(x, y, circ_x, circ_y) < radio/2) {
                plano[alphai][betaj] = 1;
            }
            else{
                plano[alphai][betaj] = 0;
            }
        }
    }

    //Obtiene el contendor con id 'output'
    let out = document.getElementById('output');
    
    //Elimina cualquier nodo hijo en caso de que exista alguno
    while(out.firstChild){
        out.removeChild(out.firstChild);
    }

    let newp;
    let buffer = "";


    //Escribe los valores de toda una fila en una nueva etiqueta p
    for(alphai = MAX_ALPHA-1; alphai >= 0; alphai--)
    {
        newp = document.createElement('p');
        buffer = "";
        for (betaj = 0; betaj < MAX_BETA; betaj++) {
            buffer += (plano[alphai][betaj] == 1) ? '■' : '□';
        }
        newp.innerHTML = buffer;
        out.appendChild(newp);
    }
    console.info('Espacio de configuraciones calculado');
}

function matrix(m, n) {
    return Array.from({
        length: m
    }, () => new Array(n).fill(0));
};