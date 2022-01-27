// Tarea 1 Robotica Movil
// Alumno: Orozco Lomeli Daniel Uriel
// Fecha: 25/01/2022

class Vehiculo{

    constructor(x=72,y=432,L=60,angulo=0,gamma=0,color=[33,33,33]){
        this.x = x;
        this.y = y;
        this.L = L;
        this.angulo = angulo;
        this.gamma = gamma;
        this.color = color;
        this.err = [];
    }

    avanzar(velocidad,gamma){
        this.x += (velocidad * cos(this.angulo));
        this.y += (velocidad * sin(this.angulo));
        this.angulo += ((velocidad/this.L) * tan(gamma));
        this.gamma = gamma;
    }

    controladorPI(x,y,d){
        let e,v,kv=0.01,ki=0.000008;
        e = sqrt(pow(x - this.x,2) + pow(y - this.y,2)) - d;
        this.err.push(e);
        let sum = this.err.reduce((parcial,actual) => parcial + actual,0);
        v = kv*e + ki*sum;
        return v;
    }

    controladorAngulo(x,y){
        let theta,gamma,kh=0.5;
        theta = atan((y-this.y)/(x-this.x));
        gamma = kh*(theta-this.angulo);
        console.log(gamma);
        return gamma;
    }

    dibujar(){
        scale(0.8);
        translate(this.x,this.y);
        rotate(this.angulo); // rotacion vehiculo
        fill(this.color[0],this.color[1],this.color[2]);
        rect(0,0,30,15); // rueda trasera
        push();
        stroke("purple");
        strokeWeight(3);
        line(15,0,this.L-15,0);
        //rect(0,40,30,15); // rueda para visualizarlo como automovil
        pop();
        translate(this.L,0);
        rotate(this.gamma); // rotacion rueda delantera
        rect(0,0,30,15); // rueda delantera
        //rect(0,40,30,15); // rueda para visualizarlo como automovil
    }
}

let carro;
let carro2;

let velocidad;
let gamma;

let width;
let height;

function setup(){

    width = windowWidth;
    height = windowHeight;
    createCanvas(width,height);
    rectMode(CENTER);

    velocidad = 0;
    gamma = 0;

    x = Math.floor(Math.random() * (width));
    y = Math.floor(Math.random() * (height));
    angulo = Math.floor(Math.random() * (2*PI));

    carro2 = new Vehiculo(x,y,60,angulo,0,[23,230,15]); //vehiculo a perseguir: posicion aleatoria, rotacion aleatoria
    carro = new Vehiculo(width/2,height/2,60,Math.floor(Math.random() * (2*PI)),0); //vehiculo controlador: posicion abajo-izquierda, rotacion aleatoria
}

function draw(){
    background(232,232,232);

    push();
    carro.dibujar();
    pop();
    push();
    carro2.dibujar();
    pop();

    velocidad = carro.controladorPI(carro2.x,carro2.y,70);
    gamma = carro.controladorAngulo(carro2.x,carro2.y);

    textSize(16);
    text(velocidad.toFixed(3).toString()+" velocidad",width*0.9,height*0.9);
    text(gamma.toFixed(3).toString()+" gamma",width*0.9,height*0.95);

    carro.avanzar(velocidad,gamma);
    carro2.avanzar(1,0);
}
