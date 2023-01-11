import './Video.styles.scss';

import ReactPlayer from 'react-player';
import YouTube, { YouTubeProps } from 'react-youtube';

interface Props {
  videoUrls: string[] | string;
}

const options = {
    className: 'YouTube',
    height: '674',
    width: '1200',
    playerVars: {
        autoplay: 0,
    },
};

const VideoPlayer = ({ videoUrls, ...rest }: Props) => {
    const opts: YouTubeProps['opts'] = {
        className: 'YouTube',
        height: '674',
        width: '1200',
        playerVars: {
            autoplay: 0,
        },
    };

    return (
        <div className="videoComponent">
            <div {...rest}>
                {/* <YouTube className='videoComponent' videoId={props.videoUrls}  opts={opts} />       */}
                <ReactPlayer
                    className="react-player"
                    height="674px"
                    width="1200px"
                    url={videoUrls}
                    controls
                />
            </div>
        </div>
    );
};
export default VideoPlayer;
