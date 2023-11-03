const bigSmart = '{"levels":[{"inputs":[0.5485376253504012,0.16580630472458646,0,0,0],"outputs":[1,1,1,0,1,1],"biases":[-0.04792117936298591,-0.30469651673313825,-0.12187147572138969,0.1003367973151069,-0.03722209112518983,-0.027760007473259823],"weights":[[0.37034996305512746,0.12084429132176626,-0.06768703556840994,-0.10790575721709925,0.11741356989267264,0.037618996257984656],[-0.082168359783305,-0.11235094182084406,-0.3793529848210658,-0.25054171793610663,-0.08993331450076637,0.33942126276016826],[-0.11997341343239179,0.09792670591337979,-0.08727921316345374,0.19072788257725198,-0.08414373063541988,-0.18257487626532123],[0.03444722052019307,0.026816385759853407,-0.000953538108490087,-0.06262594786583307,-0.30775006365102364,-0.20673047702126435],[0.13773589556432098,0.11962099896061976,0.13013590573111217,-0.02004678109335209,0.12926836352644333,-0.09660217143062876]]},{"inputs":[1,1,1,0,1,1],"outputs":[1,0,0,0],"biases":[0.04377722914311517,-0.07674371573443867,-0.012523057835949387,0.23141451221316656],"weights":[[0.06452813836439307,0.14726954609020712,-0.0328429194717225,0.053987170390813896],[0.2181155546498113,0.1780485423718522,0.13666714412421285,-0.03207456028819919],[-0.032687877304774696,0.01852861361445729,-0.22660422341009373,-0.18282535480655554],[0.05981189867107853,-0.31638946663893885,-0.07904451155741177,0.07787081019782337],[-0.06203183125927316,-0.30584912404920506,-0.11500231321446777,-0.2980000056270724],[-0.08508368924375838,-0.16525157806652546,0.014643060956927998,-0.08183107736037137]]}]}';

const carCanvas = document.getElementById('carCanvas');
carCanvas.width = 200;
const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.width = 500;

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');
const road = new Road(carCanvas.width / 2, carCanvas.width*0.9);

var DEADLYLASERSPEED = 3.1;
var deadlyLaserY = 300;

var drawAmount = 20;

var stopAnimaion = false;

const TRAFFIC_SPEED = 0;

var N = 200;
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

async function newGeneration() {
    deadlyLaserY = 300;
    cars = generateCars(N);
    bestCar = cars[0];

    for(let i = 0; i < cars.length * 3 / 4; i++) {
        cars[i].brain = JSON.parse(localStorage.getItem('bestBrain'));
        if(i != 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.15);
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

    return;
}

async function nextGeneration() {
    save();
    await newGeneration();
    return;
}

async function quickTrain(gens) {

    stopAnimaion = true;

    let numGens = 0;

    while(numGens < gens) {
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

        
        deadlyLaserY -= DEADLYLASERSPEED;

        if(liveCars < 1) {
            await nextGeneration();
            numGens++;
            console.log(`Gen${numGens} finished.`);
        }
    }

    setTimeout(() => {
        console.log('Trained for ' + numGens + ' generations.');
        stopAnimaion = false;
        animate();
    }, 100);
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

    deadlyLaserY -= DEADLYLASERSPEED;

    if(liveCars < 1) {
        nextGeneration();
    }

    if(!stopAnimaion) {
        requestAnimationFrame(animate);
    }
}