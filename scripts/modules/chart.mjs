const sliceCentres = {
    carb: 30,
    fat: 270,
    protein: 150
};

const sliceProps = {
    radius: { inner: 20, outer: 192.5 },
    sliceAngle: { len: 120, offset: 3 },
};

function polarToCartesian(cx, cy, r, angle) {
    return {
        x: Math.round(cx + r * Math.cos(angle)),
        y: Math.round(cy - r * Math.sin(angle))
    }
}

function getArcAngles(centre, sliceLen, offset) {
    return {
        start: centre - sliceLen / 2 + offset,
        end: centre + sliceLen / 2 - offset
    }
}

function getInnerOffset(outer_offset, r_outer, r_inner) {
    return outer_offset * r_outer / r_inner;
}

export function getArcPaths() {
    return Object.fromEntries(
        Object.entries(sliceCentres).flatMap(([name, angle]) => [
            [`${name}`, {
                inner: getArcAngles(angle, sliceProps.sliceAngle.len, getInnerOffset(sliceProps.sliceAngle.offset, sliceProps.radius.outer, sliceProps.radius.inner)),
                outer: getArcAngles(angle, sliceProps.sliceAngle.len, sliceProps.sliceAngle.offset),
            }],
        ])
    );

    // console.log(angles);
}

export function getArcCoords(paths) {
    return Object.fromEntries(
        Object.entries(paths).flatMap(([name, angle]) => [
            [`${name}`, {
                inner: {
                    start: polarToCartesian(200, 200, sliceProps.radius.inner, angle.start),
                    end: polarToCartesian(200, 200, sliceProps.radius.inner, angle.end),
                },
                outer: {
                    start: polarToCartesian(200, 200, sliceProps.radius.inner, angle.start),
                    end: polarToCartesian(200, 200, sliceProps.radius.inner, angle.end),
                }
            }],
        ])
    );
}

export function plotArcs(svg, paths) {
    const svgNS = "http://www.w3.org/2000/svg";

    for (let i = 0; i < Object.keys(paths).length; i + 2) {
        const path = document.createElementNS(svgNS, "path");
        // path.setAttribute("d", "M " + points.)
    }
}
