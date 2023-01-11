import { useState, useRef, useEffect } from 'react'
import "./AudioPlayer.styles.scss";
import PlayBtn from '@images/audio-player/PlayBtn.png';
import PauseBtn from '@images/audio-player/PauseBtn.png';

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const audioPlayer = useRef<HTMLAudioElement>(null);   
  const progressBar = useRef<HTMLInputElement | null>(null);  
  const animationRef = useRef<number>();

  useEffect(() => {
    if(progressBar.current){
      progressBar.current.max = String(Math.floor(Number(audioPlayer.current?.duration)));
    }
  }, [audioPlayer?.current?.onloadedmetadata, audioPlayer?.current?.readyState]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      audioPlayer.current?.play();
      animationRef.current = requestAnimationFrame(whilePlaying)
    } else {
      audioPlayer.current?.pause();
      cancelAnimationFrame(Number(animationRef.current));
    }
  }

  const whilePlaying = () => {
    if (progressBar.current) {
      progressBar.current.value = String(audioPlayer.current?.currentTime);
    }
    changePlayerCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
  }

  const changeRange = () => {
    if(audioPlayer.current){
      audioPlayer.current.currentTime = Number(progressBar.current?.value);
    }
    changePlayerCurrentTime();
  }

  const changePlayerCurrentTime = () => {
    progressBar.current?.style.setProperty('--seek-before-width', `${Number(progressBar.current?.value) / Number(progressBar.current.max) * 100}%`);
    if (Number(progressBar.current?.value) / Number(progressBar.current?.max) >= 1){
      setIsPlaying(false);
    }
  }

  return (
    <div className={"audioPlayer"}>
      <audio ref={audioPlayer} src="https://cdn.simplecast.com/audio/cae8b0eb-d9a9-480d-a652-0defcbe047f4/episodes/af52a99b-88c0-4638-b120-d46e142d06d3/audio/500344fb-2e2b-48af-be86-af6ac341a6da/default_tc.mp3" preload="metadata"></audio>
        {isPlaying ? <img src={PauseBtn} className='play' onClick={togglePlayPause}/> : <img src={PlayBtn} className='play' onClick={togglePlayPause}/>}
      <div>
        <input type="range" className={"progressBar"} defaultValue="0" ref={progressBar} onChange={changeRange} />
      </div>
    </div>
  )
}

export { AudioPlayer }