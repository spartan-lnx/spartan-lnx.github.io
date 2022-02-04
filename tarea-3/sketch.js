//Tarea 3 Robotica Movil - Algoritmo Frente de Expansion de Onda
//Alumno: Orozco Lomeli Daniel Uriel
//Fecha: 03/02/2022

class Casilla {
    constructor(i = 200, j = 200, size = 40, color = 'white', type = 'air', visited = false, value = 0) {
        this.i = i;
        this.j = j;
        this.size = size;
        this.color = color;
        this.type = type;
        this.visited = visited;
        this.value = value;
    }

    setColor(color) {
        this.color = color;
    }

    drawCasilla() {
        fill(this.color);
        rect(this.j * this.size, this.i * this.size, this.size, this.size);


        if(this.visited)
        {
            push();
            fill('black');
            text(this.value.toString() - 3,20 + this.j * this.size,20 + this.i * this.size);
            pop();
        }
    }
}


/**
 * initializeMapa permite inicializar un Mapa mediante codigo.
 * el valor 0 indica aire o camino por donde puede pasar el robot
 * 1 indica pared, lugar donde no puede pasar el robot
 * 2 indica punto de salida
 * 3 indica destino o meta
 * @returns 
 */
function initializeMapa() {
//    let customMapa = [[1, 1, 1, 0, 0, 0, 1, 1, 1, 1],
//    [1, 1, 0, 0, 2, 0, 0, 0, 1, 1],
//    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
//    [0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
//    [0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
//    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//    [1, 1, 1, 1, 0, 0, 0, 3, 0, 0],
//    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0]];

     let customMapa = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
    return customMapa;
}

class Mapa {
    constructor() {
        let mapa = initializeMapa();
        this.casillas = [];
        for (let i = 0; i < 10; i++) {
            this.casillas.push([]);
            for (let j = 0; j < 10; j++) {
                switch (mapa[i][j]) {
                    case 0:
                        this.casillas[i].push(new Casilla(i, j, 40, 'white', 'air', false, 0));
                        break;

                    case 1:
                        this.casillas[i].push(new Casilla(i, j, 40, 'black', 'wall', false, 1));
                        break;

                    case 2:
                        this.casillas[i].push(new Casilla(i, j, 40, 'green', 'start', false, 2));
                        break;

                    case 3:
                        this.casillas[i].push(new Casilla(i, j, 40, 'red', 'goal', false, 3));
                        break;
                }
            }
        }
    }

    logMapa() {
        let msg;
        for (let i = 0; i < 10; i++) {
            msg = "";
            for (let j = 0; j < 10; j++) {
                msg = msg + this.casillas[i][j].value + " ";
            }
            console.log(msg);
        }
    }

    drawMapa() {
        for (let i = 0; i < 10; i++) {
            this.casillas.push([]);
            for (let j = 0; j < 10; j++) {
                this.casillas[i][j].drawCasilla();
            }
        }
    }
}

let m1;
let btnCalcular;

function setup() {
    var canvas = createCanvas(400, 400);
    canvas.parent('sketch-holder');
    m1 = new Mapa();

    btnCalcular = createButton('Calcular');
    btnCalcular.mousePressed(frenteExpansionOnda);
}

function draw() {
    background(234, 43, 134);
    m1.drawMapa();
}

/**
 * mousePressed detecta cuando se hace clic con el mouse.
 * Su funcion es verificar que este sobre una casilla y actualizar su tipo segun el tipo que era anteriormente
 * De esta manera se inicializa el mapa manualmente sin intervenir en el codigo
 */
function mousePressed()
{
    let px = mouseX;
    let py = mouseY;

    //Verificar que el cursor se encuentre dentro de canvas
    if(px >= 0 && px <= 400 && py >= 0 && py <= 400)
    {
        //obtener las coordenas de la casilla a la que se le hizo clic
        let i = Math.floor(py/40);
        let j = Math.floor(px/40);

        //verificar y actualizar el valor de la casilla segun sea el caso
        switch(m1.casillas[i][j].value)
        {
            //Aire a pared
            case 0:
                m1.casillas[i][j].color = 'black';
                m1.casillas[i][j].type = 'wall';
                m1.casillas[i][j].value = 1;
                break;
            
            //Pared a punto de salida
            case 1:
                m1.casillas[i][j].color = 'green';
                m1.casillas[i][j].type = 'start';
                m1.casillas[i][j].value = 2;
                break;

            //Punto de salida a meta
            case 2:
                m1.casillas[i][j].color = 'red';
                m1.casillas[i][j].type = 'goal';
                m1.casillas[i][j].value = 3;
                break;

            //Meta a aire
            case 3:
                m1.casillas[i][j].color = 'white';
                m1.casillas[i][j].type = 'air';
                m1.casillas[i][j].value = 0;
                break;
        }   
    }
}

function frenteExpansionOnda() {

    let current;
    let salida;
    let meta;
    let queue = [];

    //Buscamos la casilla meta y la casilla salida
    for(let i = 0;i < 10; i++)
    {
        for(let j = 0; j < 10; j++)
        {
            if(m1.casillas[i][j].type == 'goal')
            {
                //Almacenamos la casilla goal en queue para tener punto de partida en el algoritmo de frente de expansion de onda
                meta = m1.casillas[i][j];
                queue.push(meta);
                break;
            }

            if(m1.casillas[i][j].type == 'start')
            {
                //Almacenamos la casilla de salida para posteriormente pintar el camino de salida hasta la meta
                salida = m1.casillas[i][j];
            }
        }
    }

    //Verificamos si existe meta
    if(!meta)
    {
        alert('No existe casilla Meta!!!');
        return -1;
    }

    //Verificamos si existe salida
    if(!salida)
    {
        alert('No existe casilla Salida!!!');
        return -1;
    }

    while(queue.length > 0)
    {
        //Extraemos la casilla de la lista
        current = queue.shift();

        //Marcamos como visitada
        current.visited = true;

        //verificamos si la casilla de arriba esta en los limites del mapa, si no es pared y si no ha sido visitada
        //Arriba
        if(current.i - 1 >= 0 && m1.casillas[current.i - 1][current.j].type != 'wall' && !m1.casillas[current.i - 1][current.j].visited)
        {
            //Aumentamos su valor
            m1.casillas[current.i - 1][current.j].value = current.value + 1;
            
            //Se guarda la casilla en queue
            queue.push(m1.casillas[current.i - 1][current.j]);
        }

        //Abajo
        if(current.i + 1 <= 9 && m1.casillas[current.i + 1][current.j].type != 'wall' && !m1.casillas[current.i + 1][current.j].visited)
        {
            //Aumentamos su valor
            m1.casillas[current.i + 1][current.j].value = current.value + 1;
            
            //Se guarda la casilla en queue
            queue.push(m1.casillas[current.i + 1][current.j]);
        }

        //Izquierda
        if(current.j - 1 >= 0 && m1.casillas[current.i][current.j - 1].type != 'wall' && !m1.casillas[current.i][current.j - 1].visited)
        {
            //Aumentamos su valor
            m1.casillas[current.i][current.j - 1].value = current.value + 1;
            
            //Se guarda la casilla en queue
            queue.push(m1.casillas[current.i][current.j - 1]);
        }
        
        //Derecha
        if(current.j + 1 <= 9 && m1.casillas[current.i][current.j + 1].type != 'wall' && !m1.casillas[current.i][current.j + 1].visited)
        {
            //Aumentamos su valor
            m1.casillas[current.i][current.j + 1].value = current.value + 1;
            
            //Se guarda la casilla en queue
            queue.push(m1.casillas[current.i][current.j + 1]);
        }
    }

    //Una vez hecho la busqueda, verificamos si la casilla inicio fue visitada
    //En caso contrario, indicar que no existe camino
    if(salida.visited)
    {
        //Marcamos el camino desde salida hasta meta
        //Agregamos la casilla salida
        queue.push(salida);
        while(queue.length > 0)
        {
            current = queue.shift();

            //Arriba
            if(current.i - 1 >= 0 && m1.casillas[current.i - 1][current.j].value == current.value - 1)
            {
                //Pintamos de rosa el camino
                m1.casillas[current.i - 1][current.j].color = 'pink';

                //Agregamos a queue la casilla superior de actual
                queue.push(m1.casillas[current.i - 1][current.j]);

                //Continuamos a la siguiente iteracion del ciclo para no pintar casillas demas
                continue;
            }

            //Abajo
            if(current.i + 1 <= 9 && m1.casillas[current.i + 1][current.j].value == current.value - 1)
            {
                //Pintamos de rosa el camino
                m1.casillas[current.i + 1][current.j].color = 'pink';

                //Agregamos a queue la casilla debajo de actual
                queue.push(m1.casillas[current.i + 1][current.j]);

                //Continuamos a la siguiente iteracion del ciclo para no pintar casillas demas
                continue;
            }

            //Izquierda
            if(current.j - 1 >= 0 && m1.casillas[current.i][current.j - 1].value == current.value - 1)
            {
                //Pintamos de rosa el camino
                m1.casillas[current.i][current.j - 1].color = 'pink';

                //Agregamos a queue la casilla a la izquierda de actual
                queue.push(m1.casillas[current.i][current.j - 1]);

                //Continuamos a la siguiente iteracion del ciclo para no pintar casillas demas
                continue;
            }
            
            //Derecha
            if(current.j + 1 <= 9 && m1.casillas[current.i][current.j + 1].value == current.value - 1)
            {
                //Pintamos de rosa el camino
                m1.casillas[current.i][current.j + 1].color = 'pink';

                //Agregamos a queue la casilla a la derecha de actual
                queue.push(m1.casillas[current.i][current.j + 1]);

                //Continuamos a la siguiente iteracion del ciclo para no pintar casillas demas
                continue;
            }
        }
    }
    else
    {
        alert('No existe trayectoria!!');
    }
    
}
