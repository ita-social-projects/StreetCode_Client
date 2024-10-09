import './AudioPlayer.styles.scss';

import PauseBtn from '@images/audio-player/PauseBtn.webp';
import PlayBtn from '@images/audio-player/PlayBtn.webp';

import React, { useEffect, useRef, useState } from 'react';
import { useAudioContext, useModalContext } from '@stores/root-store';

import base64ToUrl from '../../utils/base64ToUrl.utility';

const AudioPlayer: React.FC<{ immediatelyPlay?: boolean }> = ({ immediatelyPlay }) => {
    const { audio } = useAudioContext();
    const [audioState, setAudioState] = useState(audio);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const { modalStore: { modalsState } } = useModalContext();
    const audioModalState = modalsState.audio;

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
        } else {
            audioPlayer.current?.pause();
        }
    };

    const play = () => {
        setIsPlaying(true);
        audioPlayer.current?.play();
    };

    const pause = () => {
        setIsPlaying(false);
        audioPlayer.current?.pause();
    };

    const changeRange = () => {
        setMaxDuration();
        if (audioPlayer.current) {
            audioPlayer.current.currentTime = Number(progressBar.current?.value);
        }
        changePlayerCurrentTime();
    };

    useEffect(
        () => () => {
            cancelAnimationFrame(Number(animationRef.current));
        },
        [],
    );

    useEffect(() => {
        if (!isPlaying) {
            cancelAnimationFrame(Number(animationRef.current));
        } else {
            animationRef.current = requestAnimationFrame(whilePlaying);
        }
    }, [isPlaying]);

    const resetAudio = () => {
        if (audioPlayer.current && progressBar.current) {
            setMaxDuration();
            audioPlayer.current.currentTime = 0;
            progressBar.current.value = '0';
            changePlayerCurrentTime();
        }
    };

    useEffect(() => {
        resetAudio();
        if (!isPlaying && immediatelyPlay) {
            play();
        }
    }, [audioState]);

    useEffect(() => {
        if (!audioModalState) return;
        setAudioState(audio ? { ...audio } : audio);
    }, [audioModalState]);

    const handleOnLoadedData = () => {
        resetAudio();
        if (immediatelyPlay) {
            play();
        }
    };

    return (
        <div className="audioPlayer">
            <audio
                ref={audioPlayer}
                src={base64ToUrl(audioState?.base64, audioState?.mimeType)}
                preload="metadata"
                onLoadedData={handleOnLoadedData}
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
