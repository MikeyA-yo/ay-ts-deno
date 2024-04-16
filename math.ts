function rand(min = 0, max = 0) {
    if (min && max) {
        const num = Math.random() * (max - min + 1) + min;
        return num;
    }
    return Math.random();
}

function round(a: number) {
    return Math.round(a);
}

function PI() {
    return Math.PI;
}

function floor(a: number) {
    return Math.floor(a);
}

function exp(a: number, b: number) {
    return Math.pow(a, b);
}

function degToRad(degrees: number) {
    return degrees * (Math.PI / 180);
}

function radToDeg(rad: number) {
    return rad / (Math.PI / 180);
}

export {
    rand,
    round,
    PI,
    floor,
    exp,
    degToRad,
    radToDeg
};
