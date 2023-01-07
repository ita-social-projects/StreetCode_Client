import './Video.styles.scss';
import YouTube, { YouTubeEvent } from 'react-youtube';

interface Props {
    videoUrls: string[] | string;
}

const options = {
    className: 'YouTube',
    height: '674',
    width: '1200',
    playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 0,
    },
};

const Video = ({ videoUrls, ...props }: Props) => {
    const onPlayerReady = (event: YouTubeEvent) => {
        event.target.pauseVideo();
    }

    return (
        <div className="videoComponent">
            <div {...props}>
                {typeof videoUrls === 'string' ? (
                    <YouTube
                        className="videoComponent"
                        videoId={videoUrls}
                        opts={options}
                    />
                ) : (
                    videoUrls.map((video, idx) => (
                            <YouTube
                                key={idx}
                                className="videoComponent"
                                videoId={video}
                                opts={options}
                            />
                        )
                    ))}
            </div>
        </div>
    );
}

export default Video;