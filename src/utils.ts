export const run = (update: (time: number) => void) => {
    const start = performance.now();
    const frame = (timestamp: number) => {
        const time = timestamp - start;
        update(time);
        requestId = requestAnimationFrame(frame)
    };
    let requestId = requestAnimationFrame(frame)

    return () => cancelAnimationFrame(requestId);
}
