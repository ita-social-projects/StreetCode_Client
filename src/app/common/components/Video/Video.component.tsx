import React, { useState, useEffect } from 'react';
import './Video.styles.scss';
import ReactPlayer from 'react-player';

interface Props {
    videoUrls: string[] | string;
}

const VideoPlayer = ({ videoUrls, ...rest }: Props) => {
    // const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    //
    // useEffect(() => {
    //     function handleResize() {
    //         setWindowWidth(window.innerWidth);
    //     }
    //
    //     window.addEventListener('resize', handleResize);
    //
    //     return () => {
    //         window.removeEventListener('resize', handleResize);
    //     };
    // }, []);
    //
    // let videoHeight = windowWidth > 768 ? 700 : 417; // Вычисляем высоту видео в зависимости от ширины окна
    // if (windowWidth < 768 && windowWidth > 360) {
    //     videoHeight = 417;
    // } else if (windowWidth < 360) {
    //     videoHeight = 190;
    // }
    return (
        <div className="videoComponent">
            <div className="player-wrapper">
                <ReactPlayer
                    width="100%"
                    height="50vw"
                    className="react-player"
                    url={videoUrls}
                    controls
                />
            </div>
        </div>
    );
};

export default VideoPlayer;
