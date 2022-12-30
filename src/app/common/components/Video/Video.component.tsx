import YouTube, { YouTubeProps } from 'react-youtube';
import "./Video.styles.scss"

type Props ={video: string[]}
const Video=(props: Props)=> {
    const onPlayerReady: YouTubeProps['onReady'] = (event) => {
      event.target.pauseVideo();
    }
  
    const opts: YouTubeProps['opts'] = {
      height: '674',
      width: '1200',
      borderRadius: "50px",
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay:0,
      },
    };
  
    return (
      <div className='videoComponent'>
          <div className='videoComponent1'{...props}>
              {props.video.map(video1=>
                (
                  <YouTube className='videoComponent' videoId={video1}  opts={opts} />
                )
              )}
          </div>
      </div>
    );
  }
export default Video;