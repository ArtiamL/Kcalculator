import { lbToKG, ftToCm } from "./modules/conversion.mjs";
import { mifflinStJeor, katchMcArdle, tdeeCalc } from "./modules/bmr_calculations.mjs";
import { getArcPaths, getArcCoords, plotArcs, drawHandle } from "./modules/chart.mjs";
import { sliceProperties } from "./config/properties.mjs";

import { getSliceLen, getSliceCentres } from "./modules/chart.mjs";

const form = document.getElementById("measurements");
const bmrOutput = document.getElementById("bmr-output");
const tdeeOutput = document.getElementById("tdee-output");
const unitRdios = document.querySelectorAll("input[name='units']");

const weightInput = document.getElementById("weight");
const heightInput = document.getElementById("height");

// If browser changes initial checked radio, this can allow to see which is checked and update placeholder text.
const initialCheckedRadio = document.querySelector("input[name='units']:checked");

const macroChart = document.getElementById("macroChart");

const unitMap = {
    metric: {
        weight: "Weight (kg)",
        height: "Height (cm)"
    },
    imperial: {
        weight: "Weight (lb)",
        height: "Height (ft)"
    }
};

let handlInputPlaceholder = function(e) {
    const units = unitMap[e.target.value];
    weightInput.placeholder = units.weight;
    heightInput.placeholder = units.height;
}

if (initialCheckedRadio) {
    handlInputPlaceholder({ target: initialCheckedRadio });
}

unitRdios.forEach(radio => {
    radio.addEventListener("change", e => {
        handlInputPlaceholder({ target: radio });
    });
})

form.addEventListener("submit", e => {
    e.preventDefault()

    const data = new FormData(form);

    let weight = data.get("units") === "imperial"
        ? lbToKG(data.get("weight"))
        : data.get("weight");

    let height = data.get("units") === "imperial"
        ? ftToCm(data.get("height"))
        : data.get("height");

    let bmr = mifflinStJeor(weight, height, data.get("age"), data.get("gender"));
    let tdee = tdeeCalc(bmr, data.get("pal"));

    bmrOutput.innerHTML = bmr;
    tdeeOutput.innerHTML = tdee;
});

sliceProperties.sliceLen = getSliceLen(sliceProperties.names.length);

const sliceCentres = getSliceCentres(sliceProperties.startDeg, sliceProperties.sliceLen, sliceProperties.names);
console.log(sliceProperties);

const paths = getArcPaths(sliceCentres, sliceProperties);
const pathCoords = getArcCoords(paths, sliceProperties);
plotArcs(macroChart, pathCoords, sliceProperties);
drawHandle(
    macroChart,
    Object.fromEntries(
        Object.entries(pathCoords).map(([k, v]) => [
            k,
            v.outerEnd
        ])
    )
);
