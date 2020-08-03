import {run} from '../utils';


const canvas = <HTMLCanvasElement>document.getElementById("app") || document.createElement('canvas');

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const ctx: CanvasRenderingContext2D = canvas.getContext('2d') || new CanvasRenderingContext2D();

const RGBA = (r: number, g: number, b: number, a: number) => `rgb(${r}, ${g}, ${b}, ${a})`
const toSecond = (f: (time: number) => void)=> (time: number): void => f(time*0.001)

const update = toSecond((time: number) => {
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    for (let i = 1; i < 2e3; i++) {
        ctx.fillStyle = RGBA( 99*i, 2*i, i, i?1:.4 );
        const F = 260 * (time + 9) / i + Math.sin(i * i);
        const x: number = (width / 2) + i * Math.sin(F);
        const y: number = (height / 2) + .2 * ( 2 * i * Math.cos(F) + 2e4/i );
        const w: number = Math.sin(i) * 9;
        const h: number = w;
        ctx.fillRect(x, y, w, h);
    }
})

let unsubscribe = run(update);;

window.onresize = () => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    unsubscribe();
    unsubscribe = run(update);
}
