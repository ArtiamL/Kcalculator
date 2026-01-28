const genderConsts = {
    male: 5,
    female: -161,
}

export function mifflinStJeor(weight, height, age, gender) {
    gender = genderConsts[gender];
    return Math.round((10 * weight) + (6.25 * height) - (5 * age) + gender);
}

export function katchMcArdle() {
    throw new Error("Not Yet Implemented!");
}

export function tdeeCalc(bmr, pal) {
    return Math.round(bmr * pal);
}
