"use client";

import * as React from "react";
import dynamic from 'next/dynamic'
import { P5CanvasInstance, Sketch, P5WrapperProps } from '@p5-wrapper/react'
const ReactP5Wrapper = dynamic(() => import('@p5-wrapper/react')
    .then(mod => mod.ReactP5Wrapper as any), {
    ssr: false
}) as unknown as React.NamedExoticComponent<P5WrapperProps>

function default_sketch(p5: P5CanvasInstance) {
    p5.setup = () => p5.createCanvas(600, 100, p5.WEBGL);

    p5.draw = () => {
        p5.background(250);
        p5.normalMaterial();

        p5.strokeWeight(4);
        p5.stroke(51);
        p5.circle(p5.mouseX - p5.width / 2, p5.mouseY - p5.height / 2, 5);

        p5.push();
        p5.rotateZ(p5.frameCount * 0.01);
        p5.rotateX(p5.frameCount * 0.01);
        p5.rotateY(p5.frameCount * 0.01);
        p5.plane(100);
        p5.pop();
        // p5.fill(100);
    };
}

const P5Render = ({ sketch }:  { sketch?: string }) => {
    // const { isDarkTheme, setDarkTheme } = UseTheme();

    if (sketch) {
        // let executeCode = new Function(
        //     "return " +
        //         renderProps.sketch.replace(
        //             "const isDarkTheme = false;",
        //             isDarkTheme ? "const isDarkTheme = true;" : " const isDarkTheme = false;"
        //         )
        // )();
        let executeCode = new Function("return " + sketch)();
        // return <ReactP5Wrapper sketch={executeCode} />;
        return <ReactP5Wrapper sketch={executeCode} />;
    } else {
        return <ReactP5Wrapper sketch={default_sketch} />;
    }
};

export default P5Render;
