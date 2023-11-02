const carCanvas = document.getElementById('carCanvas');
carCanvas.width = 200;
const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.width = 500;

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');
const road = new Road(carCanvas.width / 2, carCanvas.width*0.9);

var carsDrawn = 20;

const N = 100;
var cars = [];
var bestBrain;
var bestTrafficScore = 0;

if(localStorage.getItem('bestBrain')) {
    bestBrain = JSON.parse(localStorage.getItem('bestBrain'));
    cars = createGeneration(JSON.parse(localStorage.getItem('bestBrain')));
    cars[0].brain = JSON.parse(localStorage.getItem('bestBrain'));
} else {
    cars = generateCars(N);
    bestBrain = cars[0].brain;
}
let bestCar = cars[0];


var traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2, getRandomColor())
];

animate();

function save() {
    localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain));
}

function discard() {
    localStorage.removeItem('bestBrain');
}

function generateCars(n) {
    let newCars = [];
    for(let i = 0; i < n; i++) {
        newCars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }
    return newCars;
}

function createGeneration(best) {
    let newCars = generateCars(N);
    for(let i = 0; i < cars.length; i++) {
        newCars[i].brain = best;
        if(i != 0) {
            NeuralNetwork.mutate(newCars[i].brain, 0.1);
        }
    }
    return newCars;
}

function newGeneration() {
    bestTrafficScore = 0;
    cars = [];
    cars = createGeneration(bestCar.brain);
    bestCar = cars[0];
    traffic = [
        new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2, getRandomColor()),
        new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2, getRandomColor()),
        new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2, getRandomColor()),
        new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2, getRandomColor()),
        new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2, getRandomColor()),
        new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2, getRandomColor()),
        new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2, getRandomColor())
    ];
}

function animate(time) {
    for(let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }
    
    for(let i = 0; i < cars.length; i++) {
        let deviation = Math.abs(cars[i].y - bestCar.y);
        cars[i].update(road.borders, traffic, deviation);
        if(!cars[i].damaged) {
            cars[i].trafficScore = 0;
            
            traffic.forEach((trafficCar) => {
                if(trafficCar.y >= cars[i].y) {
                    cars[i].trafficScore++;
                }
            });

            if(cars[i].trafficScore > bestTrafficScore) {
                bestTrafficScore = cars[i].trafficScore;
            }
        }
    }

    bestCar = cars.find(
        c => c.y == Math.min(
            ...cars.map(c => c.trafficScore >= bestTrafficScore ? c.y : 1000000)
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

    let drawnCars = 0;
    for(let i = 0; i < cars.length; i++) {
        if(drawnCars <= carsDrawn && !cars[i].damaged) {
            cars[i].draw(carCtx);
            drawnCars++;
        }
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, true);

    carCtx.restore();

    networkCtx.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
}