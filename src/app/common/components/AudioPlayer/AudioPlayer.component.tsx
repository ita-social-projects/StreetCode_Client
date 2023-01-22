import './AudioPlayer.styles.scss';

import PauseBtn from '@images/audio-player/PauseBtn.png';
import PlayBtn from '@images/audio-player/PlayBtn.png';

import { useEffect, useRef, useState } from 'react';
import useMobx from '@stores/root-store';

const AudioPlayer = () => {
    const { audiosStore: { Audio } } = useMobx();

    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const audioPlayer = useRef<HTMLMediaElement>(null);
    const progressBar = useRef<HTMLInputElement | null>(null);
    const animationRef = useRef<number>();
    
    useEffect(() => {
        setMaxDuration();
    }, [audioPlayer.current?.readyState]);

    const setMaxDuration = (): void => {
        if (progressBar.current) {
            progressBar.current.max = String(Math.floor(Number(audioPlayer.current?.duration)));
        }
    };

    const togglePlayPause = (): void => {
        setIsPlaying(!isPlaying);
        if (!isPlaying) {
            audioPlayer.current?.play();
            animationRef.current = requestAnimationFrame(whilePlaying);
        } else {
            audioPlayer.current?.pause();
            cancelAnimationFrame(Number(animationRef.current));
        }
    };

    const whilePlaying = (): void => {
        if (progressBar.current) {
            progressBar.current.value = String(audioPlayer.current?.currentTime);
        }
        changePlayerCurrentTime();
        animationRef.current = requestAnimationFrame(whilePlaying);
    };

    const changeRange = (): void => {
        setMaxDuration();
        if (audioPlayer.current) {
            audioPlayer.current.currentTime = Number(progressBar.current?.value);
        }
        changePlayerCurrentTime();
    };

    const changePlayerCurrentTime = (): void => {
        progressBar.current?.style.setProperty('--seek-before-width', `${Number(progressBar.current?.value) / Number(progressBar.current.max) * 100}%`);
        if (Number(progressBar.current?.value) / Number(progressBar.current?.max) >= 1) {
            setIsPlaying(false);
        }
    };

    return (
        <div className="audioPlayer">
            <audio ref={audioPlayer} src={Audio?.url?.href} preload="metadata" />
            {isPlaying ? 
                <div className="buttonContainer">
                    <img src={PauseBtn} className="play" onClick={togglePlayPause} />
                </div> : 
                <div className="buttonContainer">
                    <img src={PlayBtn} className="play" onClick={togglePlayPause} />
                </div>}
            <div>
                <input type="range" className="progressBar" defaultValue="0" ref={progressBar} onChange={changeRange} />
            </div>
        </div>
    );
};

export { AudioPlayer };
