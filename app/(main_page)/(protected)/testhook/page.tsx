import React from "react";
import QRCode from "react-qr-code";
import P5Render from "@/components/renderer/markdown_render/p5Render";
import { Cat } from "react-kawaii";
import ChartRender from "@/components/renderer/markdown_render/ChartRender";

const TestPage = () => {
    return (
        <>
            <div className=" flex flex-col max-w-[120ch] px-8 md:px-20 mx-auto mt-6 items-center gap-4">
                <div
                    style={{
                        height: "auto",
                        margin: "0 auto",
                        maxWidth: 300,
                        width: "100%",
                    }}>
                    <QRCode
                        size={256}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        value={"https://www.google.com/"}
                        viewBox={`0 0 256 256`}
                    />
                </div>

                <P5Render
                    sketch={`function sketch(p5) {
                                const isDarkTheme = false;
                                p5.setup = () => p5.createCanvas(600, 100, p5.WEBGL);
                                p5.draw = () => {
                                    if (isDarkTheme){
                                        p5.background(100);
                                    }else{
                                        p5.background(250);
                                    }
                                    p5.normalMaterial();

                                    p5.strokeWeight(4);
                                    p5.stroke(51);
                                    p5.circle(p5.mouseX-p5.width/2, p5.mouseY-p5.height/2, 5);


                                    p5.push();
                                    p5.rotateZ(p5.frameCount * 0.01);
                                    p5.plane(100);
                                    p5.pop();
                                };
                            }`}
                />
                <P5Render  />

                <ChartRender></ChartRender>

                <Cat size={320} mood="happy" color="#596881" />
                <Cat size={320} mood="excited" color="#596881" />
                <Cat size={320} mood="ko" color="#aac2c6" />
            </div>
        </>
    );
};

export default TestPage;
