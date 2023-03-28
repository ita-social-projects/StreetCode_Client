import React, { useState, useEffect } from 'react';
import './Video.styles.scss';
import ReactPlayer from 'react-player';

interface Props {
    videoUrls: string[] | string;
}

const VideoPlayer = ({ videoUrls, ...rest }: Props) => {
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
