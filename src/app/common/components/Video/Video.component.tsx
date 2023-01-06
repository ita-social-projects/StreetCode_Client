import "./Video.styles.scss";
import YouTube, { YouTubeEvent } from 'react-youtube';

interface Props {
    videoUrls: string[];
}

const options = {
    className:"YouTube",
    height: '674',
    width: '1200',
    playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay:0,
    },
};

const Video = (props: Props) => {
    const onPlayerReady = (event: YouTubeEvent) => {
      event.target.pauseVideo();
    }

    return (
      <div className='videoComponent'>
          <div {...props}>
              {props.videoUrls.map(video => (
                  <YouTube
                      className='videoComponent'
                      videoId={video}
                      opts={options}
                  />
                )
              )}
          </div>
      </div>
    );
}

export default Video;