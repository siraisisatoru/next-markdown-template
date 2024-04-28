"use client";
import React from "react";
import yaml from "js-yaml";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import Image from "next/image";
interface Props {
    config: string;
    isOffautoscroll?: boolean;
}

interface GalleryConfig {
    original: string;
}

const GalleryRender = ({ config, isOffautoscroll }: Props) => {
    const configJson = yaml.load(config);
    const offautoscroll = isOffautoscroll || false;
    return (
        <ImageGallery
            items={configJson as GalleryConfig[]}
            showFullscreenButton={false}
            showPlayButton={false}
            lazyLoad={true}
            autoPlay={!offautoscroll}
            showBullets={true}
            renderItem={(item) => (
                <div className="max-h-full flex justify-center items-center overflow-hidden">
                    <Image
                        src={item.original}
                        alt={(item.description as string) || ""}
                        width={0}
                        height={0}
                        sizes="100vw"
                        // style={{ width: "100%", height: "auto" }}
                        className="h-[300px] w-auto object-contain"
                    />
                </div>
            )}
        />
    );
};

export default GalleryRender;
