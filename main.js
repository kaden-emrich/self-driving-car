const bigTimmy = '{"levels":[{"inputs":[0.5485376253504012,0.16580630472458646,0,0,0],"outputs":[1,1,1,0,1,1],"biases":[-0.04792117936298591,-0.30469651673313825,-0.12187147572138969,0.1003367973151069,-0.03722209112518983,-0.027760007473259823],"weights":[[0.37034996305512746,0.12084429132176626,-0.06768703556840994,-0.10790575721709925,0.11741356989267264,0.037618996257984656],[-0.082168359783305,-0.11235094182084406,-0.3793529848210658,-0.25054171793610663,-0.08993331450076637,0.33942126276016826],[-0.11997341343239179,0.09792670591337979,-0.08727921316345374,0.19072788257725198,-0.08414373063541988,-0.18257487626532123],[0.03444722052019307,0.026816385759853407,-0.000953538108490087,-0.06262594786583307,-0.30775006365102364,-0.20673047702126435],[0.13773589556432098,0.11962099896061976,0.13013590573111217,-0.02004678109335209,0.12926836352644333,-0.09660217143062876]]},{"inputs":[1,1,1,0,1,1],"outputs":[1,0,0,0],"biases":[0.04377722914311517,-0.07674371573443867,-0.012523057835949387,0.23141451221316656],"weights":[[0.06452813836439307,0.14726954609020712,-0.0328429194717225,0.053987170390813896],[0.2181155546498113,0.1780485423718522,0.13666714412421285,-0.03207456028819919],[-0.032687877304774696,0.01852861361445729,-0.22660422341009373,-0.18282535480655554],[0.05981189867107853,-0.31638946663893885,-0.07904451155741177,0.07787081019782337],[-0.06203183125927316,-0.30584912404920506,-0.11500231321446777,-0.2980000056270724],[-0.08508368924375838,-0.16525157806652546,0.014643060956927998,-0.08183107736037137]]}]}';

const joeSlalom = '{"levels":[{"inputs":[0.18689150099780016,0,0,0,0.11307304403340146],"outputs":[0,1,0,0,0,1],"biases":[0.10569500056331288,-0.1355477599299185,0.01921313600193774,0.15793095796572584,-0.025973820845149445,-0.13551370980375244],"weights":[[-0.07415333981520986,-0.13960977987128262,-0.1209176989101017,-0.03147404581890412,-0.22801420102236644,0.03671332187397319],[-0.01275407682335853,0.24273261753530131,0.014996986242434375,0.0981024245511228,-0.15482870441566615,0.08164328622240355],[0.09077883921129644,-0.005431838078482095,-0.13236625442367914,0.22772890758879488,-0.007746078003659677,-0.05062309300606194],[-0.3293397691158102,0.2360156677109065,-0.11085855318320631,0.21023495446344284,0.1676495101850029,-0.05255889780686876],[0.0013446888709976838,0.030700712222484623,0.02255781353696074,-0.2029426981119538,0.07910793811388227,-0.2383734949457317]]},{"inputs":[0,1,0,0,0,1],"outputs":[1,0,1,0],"biases":[-0.22147063261931266,0.0006671960763221865,-0.21681592712799386,0.07455684195805219],"weights":[[-0.09263536509686798,0.158093808206833,-0.05486585460163273,-0.012832332354920036],[0.05341010838807256,-0.1466424182840866,-0.34649086082760383,0.0822099260464639],[0.0699993518864699,-0.078884431660912,-0.10083011191180097,-0.129509198688208],[0.0018044954023192956,-0.3074167268485193,0.0019758927388194014,0.06021144075866239],[0.14085447222340955,0.21707944949139846,-0.2633894759096886,0.11441443790145338],[-0.029790539517172684,0.08829406600078968,0.3140498659954903,-0.1844968491359054]]}]}';

const carCanvas = document.getElementById('carCanvas');
carCanvas.width = 200;
const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.width = 500;

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');
const road = new Road(carCanvas.width / 2, carCanvas.width*0.9);

var DEADLYLASERSPEED = 3.1;
var deadlyLaserStart = 300;
var deadlyLaserY = deadlyLaserStart;

var alwaysShowPrevBest = true;
var prioritizePrevBest = true;
var seeLikeAnAI = false;

var drawAmount = 20;

var exploritoryFactor = 1 / 10;
var mutationFactor = 0.15;

var stopAnimaion = false;

const TRAFFIC_SPEED = 0;

var trafficAmount = 10;

var trafficType = 'default';

var trafficYStart = -100;
var trafficYIncrement = -150;

var N = 200;
var cars = generateCars(N);
let bestCar = cars[0];
if(localStorage.getItem('bestBrain')) {
    newGeneration();
}

var defaultTraffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", TRAFFIC_SPEED, getRandomColor()),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", TRAFFIC_SPEED, getRandomColor()),
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", TRAFFIC_SPEED, getRandomColor()),
    new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", TRAFFIC_SPEED, getRandomColor()),
    new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", TRAFFIC_SPEED, getRandomColor()),
    new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", TRAFFIC_SPEED, getRandomColor()),
    new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", TRAFFIC_SPEED, getRandomColor())
];

var sTraffic = [
    new Car(road.getLaneCenter(0), -100, 30, 50, "DUMMY", TRAFFIC_SPEED, getRandomColor()),
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", TRAFFIC_SPEED, getRandomColor()),
    new Car(road.getLaneCenter(1), -250, 30, 50, "DUMMY", TRAFFIC_SPEED, getRandomColor()),
    new Car(road.getLaneCenter(2), -250, 30, 50, "DUMMY", TRAFFIC_SPEED, getRandomColor()),
    new Car(road.getLaneCenter(0), -400, 30, 50, "DUMMY", TRAFFIC_SPEED, getRandomColor()),
    new Car(road.getLaneCenter(1), -400, 30, 50, "DUMMY", TRAFFIC_SPEED, getRandomColor()),
    new Car(road.getLaneCenter(1), -550, 30, 50, "DUMMY", TRAFFIC_SPEED, getRandomColor()),
    new Car(road.getLaneCenter(2), -550, 30, 50, "DUMMY", TRAFFIC_SPEED, getRandomColor()),
    new Car(road.getLaneCenter(0), -700, 30, 50, "DUMMY", TRAFFIC_SPEED, getRandomColor()),
    new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", TRAFFIC_SPEED, getRandomColor()),
    new Car(road.getLaneCenter(1), -850, 30, 50, "DUMMY", TRAFFIC_SPEED, getRandomColor()),
    new Car(road.getLaneCenter(2), -850, 30, 50, "DUMMY", TRAFFIC_SPEED, getRandomColor())

];

function generateRandomTraffic(amount) {
    let newTraffic = [];
    let y = trafficYStart;

    for(let i = 0; i < amount; i++) {
        let carsInLane = Math.floor(Math.random() * 4); // if it is 0 there is one car per lane otherwise there are 2

        if(carsInLane == 0) {
            newTraffic.push(new Car(
                road.getLaneCenter(Math.floor(Math.random() * road.laneCount)),
                y,
                30,
                50,
                'DUMMY',
                TRAFFIC_SPEED,
                getRandomColor()
            ));
        }
        else {
            let carLane1 = Math.floor(Math.random() * road.laneCount);
            let carLane2 = Math.floor(Math.random() * road.laneCount);

            while(carLane1 == carLane2) {
                carLane2 = Math.floor(Math.random() * road.laneCount);
            }

            newTraffic.push(new Car(
                road.getLaneCenter(carLane1),
                y,
                30,
                50,
                'DUMMY',
                TRAFFIC_SPEED,
                getRandomColor()
            ));
            newTraffic.push(new Car(
                road.getLaneCenter(carLane2),
                y,
                30,
                50,
                'DUMMY',
                TRAFFIC_SPEED,
                getRandomColor()
            ));
        }

        y += trafficYIncrement;
    }

    return newTraffic;
}

function getNewTraffic() {
    switch(trafficType) {
        case 's':
            return sTraffic;
            break;
        case 'random':
            return generateRandomTraffic(trafficAmount);
            break;
        case 'default':
        default:
            return defaultTraffic;
            break;
    }
}

var traffic = getNewTraffic();

animate();

function save() {
    localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain));
}

function discard() {
    localStorage.removeItem('bestBrain');

    deadlyLaserY = 300;
    cars = generateCars(N);
    bestCar = cars[0];

    traffic = getNewTraffic();
}

function generateCars(n) {
    const cars = [];
    for(let i = 0; i < n; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }
    return cars;
}

async function newGeneration() {
    deadlyLaserY = deadlyLaserStart;
    cars = generateCars(N);
    bestCar = cars[0];

    for(let i = 0; i < cars.length * (1 - exploritoryFactor); i++) {
        cars[i].brain = JSON.parse(localStorage.getItem('bestBrain'));
        if(i != 0) {
            NeuralNetwork.mutate(cars[i].brain, mutationFactor);
        }
    }

    traffic = getNewTraffic();

    return;
}

async function nextGeneration() {
    save();
    await newGeneration();
    return;
}

async function importBrain(newBrain) {
    await newGeneration();
    cars[0].brain = newBrain;
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

    
    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

    if(!seeLikeAnAI) {
        road.draw(carCtx);
        for(let i = 0; i < traffic.length; i++) {
            traffic[i].draw(carCtx);
        }
    }
    carCtx.globalAlpha = 0.2;
    let carsDrawn = 0;
    for(let i = 0; i < cars.length; i++) {
        if((i == 0 && alwaysShowPrevBest) || (carsDrawn < drawAmount && !cars[i].damaged)) {
            cars[i].draw(carCtx);
            carsDrawn++;
        }
    }
    carCtx.globalAlpha = 1;

    
    networkCtx.lineDashOffset = -time / 50;
    if(prioritizePrevBest && cars[0].damaged == false) {
        cars[0].draw(carCtx, true);
        Visualizer.drawNetwork(networkCtx, cars[0].brain);
    }
    else {
        bestCar.draw(carCtx, true);
        Visualizer.drawNetwork(networkCtx, bestCar.brain);
    }

    if(!seeLikeAnAI) {
        carCtx.beginPath();
        carCtx.moveTo(0, deadlyLaserY);
        carCtx.lineTo(carCanvas.width, deadlyLaserY);
        carCtx.strokeStyle = 'red';
        carCtx.stroke();
    }

    carCtx.restore();

    deadlyLaserY -= DEADLYLASERSPEED;

    if(liveCars < 1) {
        nextGeneration();
    }

    if(!stopAnimaion) {
        requestAnimationFrame(animate);
    }
}

function slalomMode() {
    trafficType = 's';
    deadlyLaserStart = 600;
}