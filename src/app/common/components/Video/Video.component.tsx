import './Video.styles.scss';

import ReactPlayer from 'react-player';

interface Props {
  videoUrls: string[] | string;
}

const VideoPlayer = ({ videoUrls, ...rest }: Props) => (
    <div className="videoComponent">
        <div {...rest}>
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
export default VideoPlayer;
