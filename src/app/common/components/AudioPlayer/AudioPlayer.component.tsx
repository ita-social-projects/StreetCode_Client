import './AudioPlayer.styles.scss';

import PauseBtn from '@images/audio-player/PauseBtn.png';
import PlayBtn from '@images/audio-player/PlayBtn.png';

import React, { useEffect, useRef, useState } from 'react';
import useMobx from '@stores/root-store';

import base64ToUrl from '../../utils/base64ToUrl.utility';

const AudioPlayer:React.FC<{ immediatelyPlay?:boolean }> = ({ immediatelyPlay }) => {
    const { audiosStore: { audio } } = useMobx();
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const audioPlayer = useRef<HTMLMediaElement>(null);
    const progressBar = useRef<HTMLInputElement | null>(null);
    const animationRef = useRef<number>();

    const setMaxDuration = () => {
        if (progressBar.current) {
            progressBar.current.max = Math.floor(Number(audioPlayer.current?.duration)).toString();
        }
    };

    const changePlayerCurrentTime = () => {
        progressBar.current?.style.setProperty(
            '--seek-before-width',
            `${Number(Number(progressBar.current?.value) / (Number(progressBar.current.max))) * 100.0}%`,
        );
        if (Number(progressBar.current?.value) / Number(progressBar.current?.max) >= 1) {
            setIsPlaying(false);
        }
    };

    const whilePlaying = (): void => {
        if (progressBar.current) {
            progressBar.current.value = String(audioPlayer.current?.currentTime);
        }

        changePlayerCurrentTime();
        animationRef.current = requestAnimationFrame(whilePlaying);
    };

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
        if (!isPlaying) {
            audioPlayer.current?.play();
            animationRef.current = requestAnimationFrame(whilePlaying);
        } else {
            audioPlayer.current?.pause();
            cancelAnimationFrame(Number(animationRef.current));
        }
    };

    const changeRange = () => {
        setMaxDuration();
        if (audioPlayer.current) {
            audioPlayer.current.currentTime = Number(progressBar.current?.value);
        }
        changePlayerCurrentTime();
    };
    useEffect(
        () => {
            setMaxDuration();
            if (immediatelyPlay && !isPlaying) {
                setTimeout(() => {
                    togglePlayPause();
                }, (1000));
            }
        },
        [audioPlayer.current?.readyState],
    );

    return (
        <div className="audioPlayer">
            <audio
                ref={audioPlayer}
                src={base64ToUrl(audio?.base64, audio?.mimeType)}
                preload="metadata"
            />
            {isPlaying
                ? (
                    <div className="buttonContainer">
                        <img src={PauseBtn} alt="Пауза" className="play" onClick={togglePlayPause} />
                    </div>
                )
                : (
                    <div className="buttonContainer">
                        <img src={PlayBtn} alt="Програти" className="play" onClick={togglePlayPause} />
                    </div>
                )}
            <div className="progressBarWrapper">
                <input
                    ref={progressBar}
                    type="range"
                    className="progressBar"
                    defaultValue="0"
                    onChange={changeRange}
                />
            </div>
        </div>
    );
};

export { AudioPlayer };
