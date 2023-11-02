const carCanvas = document.getElementById('carCanvas');
carCanvas.width = 200;
const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.width = 500;

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');
const road = new Road(carCanvas.width / 2, carCanvas.width*0.9);

var DEADLYLASERSPEED = 2.5;
var deadlyLaserY = 300;

var drawAmount = 100;

const TRAFFIC_SPEED = 0;

var N = 500;
var cars = generateCars(N);
let bestCar = cars[0];
if(localStorage.getItem('bestBrain')) {
    newGeneration();
}


var traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", TRAFFIC_SPEED, getRandomColor()),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", TRAFFIC_SPEED, getRandomColor()),
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", TRAFFIC_SPEED, getRandomColor()),
    new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", TRAFFIC_SPEED, getRandomColor()),
    new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", TRAFFIC_SPEED, getRandomColor()),
    new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", TRAFFIC_SPEED, getRandomColor()),
    new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", TRAFFIC_SPEED, getRandomColor())
];

animate();

function save() {
    localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain));
}

function discard() {
    localStorage.removeItem('bestBrain');

    deadlyLaserY = 300;
    cars = generateCars(N);
    bestCar = cars[0];

    traffic = [
        new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", TRAFFIC_SPEED, getRandomColor()),
        new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", TRAFFIC_SPEED, getRandomColor()),
        new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", TRAFFIC_SPEED, getRandomColor()),
        new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", TRAFFIC_SPEED, getRandomColor()),
        new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", TRAFFIC_SPEED, getRandomColor()),
        new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", TRAFFIC_SPEED, getRandomColor()),
        new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", TRAFFIC_SPEED, getRandomColor())
    ];
}

function generateCars(n) {
    const cars = [];
    for(let i = 0; i < n; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }
    return cars;
}

function newGeneration() {
    deadlyLaserY = 300;
    cars = generateCars(N);
    bestCar = cars[0];

    for(let i = 0; i < cars.length * 3 / 4; i++) {
        cars[i].brain = JSON.parse(localStorage.getItem('bestBrain'));
        if(i != 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.1);
        }
    }

    traffic = [
        new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", TRAFFIC_SPEED, getRandomColor()),
        new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", TRAFFIC_SPEED, getRandomColor()),
        new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", TRAFFIC_SPEED, getRandomColor()),
        new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", TRAFFIC_SPEED, getRandomColor()),
        new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", TRAFFIC_SPEED, getRandomColor()),
        new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", TRAFFIC_SPEED, getRandomColor()),
        new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", TRAFFIC_SPEED, getRandomColor())
    ];
}

function animate(time) {
    for(let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }

    let liveCars = 0;
    for(let i = 0; i < cars.length; i++) {
        let deviation = Math.abs(cars[i].y - bestCar.y);
        cars[i].update(road.borders, traffic, [{ x: 0, y: deadlyLaserY }, { x: carCanvas.width, y: deadlyLaserY }]);
        if(!cars[i].damaged) {
            liveCars++;
        }
    }

    bestCar = cars.find(
        c => c.y == Math.min(
            ...cars.map(c => c.y)
        )); // fitness function
    
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save;
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);
    road.draw(carCtx);
    for(let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx);
    }
    carCtx.globalAlpha = 0.2;
    let carsDrawn = 0;
    for(let i = 0; i < cars.length; i++) {
        if(carsDrawn <= drawAmount && !cars[i].damaged) {
            cars[i].draw(carCtx);
            carsDrawn++;
        }
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, true);

    carCtx.beginPath();
    carCtx.moveTo(0, deadlyLaserY);
    carCtx.lineTo(carCanvas.width, deadlyLaserY);
    carCtx.strokeStyle = 'red';
    carCtx.stroke();

    carCtx.restore();

    networkCtx.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
    deadlyLaserY -= DEADLYLASERSPEED;

    if(liveCars < 1) {
        save();
        newGeneration();
    }
}