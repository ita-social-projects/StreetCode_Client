import './AudioPlayer.styles.scss';

import PauseBtn from '@images/audio-player/PauseBtn.png';
import PlayBtn from '@images/audio-player/PlayBtn.png';

import { useEffect, useRef, useState } from 'react';
import useMobx from '@stores/root-store';

const AudioPlayer = () => {
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

    useEffect(
        () => setMaxDuration(),
        [audioPlayer.current?.readyState],
    );

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

    return (
        <div className="audioPlayer">
           {/*  <audio ref={audioPlayer} src={audio?.url?.href} preload="metadata" /> */}
           <audio ref={audioPlayer} src={"https://www.kozco.com/tech/piano2-Audacity1.2.5.mp3"} preload="metadata" />
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
            <div>
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
