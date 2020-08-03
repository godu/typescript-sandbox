import { vec2 as Vector2 } from 'gl-matrix';
import { run } from '../utils';

type Grid = [Int32Array, number, number];
const createGrid = (xLenght: number, y: number): Grid => {
    const data = new Int32Array(xLenght * y);
    return [data, xLenght, y];
}
const setGrid = (x: number, y: number, value: number, grid: Grid): Grid => {
    const [data, xLenght] = grid;
    data[x + y * xLenght] = value;
    return grid;
}
const getGrid = (x: number, y: number, grid: Grid): number => {
    const [data, xLenght] = grid;
    return data[x + y * xLenght];
}

function range(start: number, end: number) {
    return Math.floor(Math.random() * (end - start) + start);
}

function sqrMagniture(a: Vector2, b: Vector2) {
    return Vector2.sqrDist(a, b);
}

function isValid(
    candidate: Vector2,
    sampleRegionSize: Vector2,
    cellSize: number,
    radius: number,
    points: Vector2[],
    grid: Grid,
    gridX: number,
    gridY: number
) {
    if (candidate[0] >= 0 && candidate[0] < sampleRegionSize[0] && candidate[1] >= 0 && candidate[1] < sampleRegionSize[1]) {
        const cellX = Math.floor(candidate[0] / cellSize);
        const cellY = Math.floor(candidate[1] / cellSize);

        const searchStartX = Math.max(0, cellX - 2);
        const searchEndX = Math.min(cellX + 2, gridX - 1);
        const searchStartY = Math.max(0, cellY - 2);
        const searchEndY = Math.min(cellY + 2, gridY - 1);

        for (let x = searchStartX; x <= searchEndX; x++) {
            for (let y = searchStartY; y <= searchEndY; y++) {
                const pointIndex = getGrid(x, y, grid) - 1;
                if (pointIndex !== -1) {
                    if (sqrMagniture(candidate, points[pointIndex]) <= (radius * radius)) {
                        return false;
                    }
                }
            }
        }
        return true;

    }
    return false;
}

function* generatePoints(radius: number, sampleRegionSize: Vector2, centerPoint: Vector2, numSamplesBeforeRejection: number = 30) {
    const cellSize = radius / Math.sqrt(2);

    const gridX = Math.ceil(sampleRegionSize[0] / cellSize);
    const gridY = Math.ceil(sampleRegionSize[1] / cellSize);
    const grid: Grid = createGrid(gridX, gridY);

    const points: Vector2[] = [];
    const spawnPoints: Vector2[] = [];
    spawnPoints.push(centerPoint);

    let dir = Vector2.create();
    let candidate = Vector2.create();
    while (spawnPoints.length > 0) {
        const spawnIndex = range(0, spawnPoints.length);
        const spawnCenter = spawnPoints[spawnIndex];
        let candidateAccepted = false;
        dir = Vector2.create();
        candidate = Vector2.create();
        for (let i = 0; i < numSamplesBeforeRejection; i++) {
            dir = Vector2.random(dir);
            const factor = range(radius, radius * 2);
            candidate = Vector2.add(
                candidate,
                spawnCenter,
                Vector2.multiply(dir, dir, Vector2.fromValues(factor, factor))
            )
            if (isValid(candidate, sampleRegionSize, cellSize, radius, points, grid, gridX, gridY)) {
                points.push(candidate);
                spawnPoints.push(candidate);

                setGrid(Math.floor(candidate[0] / cellSize), Math.floor(candidate[1] / cellSize), points.length, grid);
                candidateAccepted = true;
                yield candidate;
                break;
            }
            else {
                yield null;
            }
        }
        if (!candidateAccepted) {
            spawnPoints.splice(spawnIndex, 1);
        }
    }
}

function drawCicle(ctx: CanvasRenderingContext2D, point: Vector2, radius: number) {
    ctx.lineWidth = 0;
    ctx.fillStyle = "#a85a54";
    ctx.beginPath();
    ctx.arc(point[0], point[1], radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(point[0], point[1], radius * 0.10, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

const start = () => {
    const canvas = <HTMLCanvasElement>document.getElementById("app") || document.createElement('canvas');

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const ctx: CanvasRenderingContext2D = canvas.getContext('2d') || new CanvasRenderingContext2D();

    const { width, height } = canvas;

    const radius: number = 10;
    const vectorOf2 = Vector2.fromValues(2, 2);
    let regionSize: Vector2 = Vector2.fromValues(width, height);
    let centerPoint = Vector2.fromValues(regionSize[0] / 2, regionSize[1] / 2);
    const rejectSamples: number = 30;
    const displayRadius: number = radius / 2;

    let genPoints = generatePoints(radius, regionSize, centerPoint, rejectSamples);
    let requestId: number | undefined;

    window.onresize = () => {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        regionSize = Vector2.set(regionSize, canvas.width, canvas.height);
        centerPoint = Vector2.divide(centerPoint, regionSize, vectorOf2);
        genPoints = generatePoints(radius, regionSize, centerPoint, rejectSamples);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        unsubscribe();
        unsubscribe = run(update);
    }

    document.addEventListener('click', (ev: MouseEvent) => {
        regionSize = Vector2.set(regionSize, canvas.width, canvas.height);
        centerPoint = Vector2.set(centerPoint, ev.x, ev.y);
        genPoints = generatePoints(radius, regionSize, centerPoint, rejectSamples)

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        unsubscribe();
        unsubscribe = run(update);
    });

    const SIXTY_FRAMES_PER_SECOND = 1000 / 70;
    let frameCount = 0;

    const update = () => {
        const start = Date.now();
        frameCount++;
        do {
            const { done, value } = genPoints.next();
            if (!done && value) drawCicle(ctx, value, displayRadius)
            if (done) return console.log({
                frameCount
            });
        }
        while ((Date.now() - start) < SIXTY_FRAMES_PER_SECOND)
    };
    let unsubscribe = run(update);
}
start();

export { };
