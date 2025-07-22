export function toMilliseconds(minutes: number, seconds: number) {
    return ((minutes * 60) + seconds) * 1000;
}

export function toMinutesSeconds(ms: number) {
    const fullSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(fullSeconds / 60);
    const seconds = fullSeconds % 60;

    return [minutes, seconds];
}