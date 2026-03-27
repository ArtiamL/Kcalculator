
const svgNS = "http://www.w3.org/2000/svg";
const circleSize = 360;

export function getSliceLen(numSlices) {
    return circleSize / numSlices;
}

export function getSliceCentres(startOffset, sliceLen, sliceNames) {
    const firstCentre = startOffset - sliceLen / 2;

    return Object.fromEntries(
        sliceNames.map((k, i) => [k, firstCentre + (i * sliceLen)])
    );
}

// Converts polar coords to cartesian
function polarToCartesian(cx, cy, r, angleDeg) {
    const angleRad = angleDeg * Math.PI / 180

    console.log(`${cx} ${cy} ${r} ${angleDeg}`);

    return {
        x: Math.round(cx + r * Math.cos(angleRad)),
        y: Math.round(cy - r * Math.sin(angleRad))
    }
}

// Gets the start and end angles for the given slice
function getArcAngles(centre, sliceLen, offset) {
    return {
        start: centre + sliceLen / 2 - offset,
        end: centre - sliceLen / 2 + offset
    }
}

// Used to calculate the offset of the inner arcs
function getInnerOffset(outer_offset, r_outer, r_inner) {
    return outer_offset * r_outer / r_inner;
}

// Creates an object holding the start and end paths for each arc
export function getArcPaths(centres, properties) {
    return Object.fromEntries(
        Object.entries(centres).map(([name, centreAngle]) => {
            const outer = getArcAngles(
                centreAngle,
                properties.sliceLen,
                properties.gapPerSide
            );

            const inner = getArcAngles(
                centreAngle,
                properties.sliceLen,
                getInnerOffset(
                    properties.gapPerSide,
                    properties.radius.outer,
                    properties.radius.inner
                )
            );

            return [name, {
                outerStartAngle: outer.start,
                outerEndAngle: outer.end,

                innerStartAngle: inner.start,
                innerEndAngle: inner.end,
            }];
        })
    );
}

// Appends the cartesian coords for the start and end points of each arc to the given dict
export function getArcCoords(paths, properties) {
    const {
        cx: cx,
        cy: cy,
        radius: {
            inner: rInner,
            outer: rOuter
        }
    } = properties;

    Object.values(paths).forEach(path => {
        path.outerStart = polarToCartesian(cx, cy, rOuter, path.outerStartAngle);
        path.outerEnd = polarToCartesian(cx, cy, rOuter, path.outerEndAngle);
        path.innerStart = polarToCartesian(cx, cy, rInner, path.innerStartAngle);
        path.innerEnd = polarToCartesian(cx, cy, rInner, path.innerEndAngle);
    });

    return paths;
}

// Creates and draws the paths for each arc using the given svg element and a dict of the path coords
export function plotArcs(svg, paths, properties) {
    const { inner: rInner, outer: rOuter } = properties.radius;

    Object.entries(paths).forEach(([name, path]) => {
        const pathElem = document.createElementNS(svgNS, "path");

        pathElem.setAttribute(
            "d",
            `M ${path.innerStart.x} ${path.innerStart.y}
            L ${path.outerStart.x} ${path.outerStart.y}
            A ${rOuter} ${rOuter} 0 0 1 ${path.outerEnd.x} ${path.outerEnd.y}
            L ${path.innerEnd.x} ${path.innerEnd.y}
            A ${rInner} ${rInner} 0 0 0 ${path.innerStart.x} ${path.innerStart.y}
            Z`
        );

        pathElem.setAttribute("id", `${name}-arc`);

        svg.appendChild(pathElem);
    });
}

// Draws a handle between each slice for interactivity
export function drawHandle(svg, properties) {
    console.log(properties);
    properties.names.forEach((n, i) => {
        const { x: startX, y: startY } = polarToCartesian(properties.cx, properties.cy, properties.radius.inner, properties.startDeg + (i * properties.sliceLen));
        const { x: endX, y: endY } = polarToCartesian(properties.cx, properties.cy, properties.radius.outer, properties.startDeg + (i * properties.sliceLen));
        const handle = document.createElementNS(svgNS, "path");

        handle.setAttribute(
            "d",
            `M ${startX} ${startY}
            L ${endX} ${endY}`
        );
        handle.setAttribute("id", `${n}-handle`);
        handle.setAttribute("class", "slice-handles");

        svg.appendChild(handle);
    });
}
