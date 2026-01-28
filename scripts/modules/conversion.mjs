const kgMult = 0.45359237;
const cmMult = 30.48;

export function lbToKG(lb) {
    return lb * kgMult;
}

export function ftToCm(ft) {
    return ft * cmMult;
}
