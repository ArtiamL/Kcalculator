// Centre angles for each slice
const sliceCentres = {
    carb: 30,
    fat: 270,
    protein: 150
};

// Properties for all slices
const sliceProps = {
    cx: 200,
    cy: 200,
    radius: { inner: 20, outer: 192.5 },
    sliceAngle: { len: 120, offset: 3 },
};

// Converts polar coords to cartesian
function polarToCartesian(cx, cy, r, angleDeg) {
    const angleRad = angleDeg * Math.PI / 180

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
export function getArcPaths() {
    return Object.fromEntries(
        Object.entries(sliceCentres).map(([name, centreAngle]) => {
            const outer = getArcAngles(
                centreAngle,
                sliceProps.sliceAngle.len,
                sliceProps.sliceAngle.offset
            );

            const inner = getArcAngles(
                centreAngle,
                sliceProps.sliceAngle.len,
                getInnerOffset(
                    sliceProps.sliceAngle.offset,
                    sliceProps.radius.outer,
                    sliceProps.radius.inner
                )
            );

            return [name, {
                centreAngle,

                outerStartAngle: outer.start,
                outerEndAngle: outer.end,

                innerStartAngle: inner.start,
                innerEndAngle: inner.end,
            }];
        })
    );
}

// Appends the cartesian coords for the start and end points of each arc to the given dict
export function getArcCoords(paths) {
    const {
        cx: cx,
        cy: cy,
        radius: {
            inner: rInner,
            outer: rOuter
        }
    } = sliceProps;

    Object.values(paths).forEach(path => {
        path.outerStart = polarToCartesian(cx, cy, rOuter, path.outerStartAngle);
        path.outerEnd = polarToCartesian(cx, cy, rOuter, path.outerEndAngle);
        path.innerStart = polarToCartesian(cx, cy, rInner, path.innerStartAngle);
        path.innerEnd = polarToCartesian(cx, cy, rInner, path.innerEndAngle);
    });

    return paths;
}

// Creates and draws the paths for each arc using the given svg element and a dict of the path coords
export function plotArcs(svg, paths) {
    const svgNS = "http://www.w3.org/2000/svg";

    // for (let i = 0; i < Object.keys(paths).length; i + 2) {
    //     const path = document.createElementNS(svgNS, "path");
    //     // path.setAttribute("d", "M " + points.)
    // }

    Object.entries(paths).forEach(([name, path]) => {
        const { inner: rInner, outer: rOuter } = sliceProps.radius;

        // const aPath = `${cx} ${cy} 0 0`;

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
