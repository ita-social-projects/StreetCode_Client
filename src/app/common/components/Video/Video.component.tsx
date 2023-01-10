import "./Video.styles.scss";
import YouTube, { YouTubeProps } from "react-youtube";
import ReactPlayer from "react-player";

interface Props {
  videoUrls: string[] | string;
}

const options = {
  className: "YouTube",
  height: "674",
  width: "1200",
  playerVars: {
    autoplay: 0,
  },
};

const VideoPlayer = (props: Props) => {
  const opts: YouTubeProps["opts"] = {
    className: "YouTube",
    height: "674",
    width: "1200",
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    <div className="videoComponent">
      <div {...props}>
        {/* <YouTube className='videoComponent' videoId={props.videoUrls}  opts={opts} />       */}
        <ReactPlayer
          className="react-player"
          height="674px"
          width="1200px"
          url={props.videoUrls}
        />
      </div>
    </div>
  );
};
export default VideoPlayer;
