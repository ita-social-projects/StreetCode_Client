import "./TextBlock.styles.scss";
import ReadMore from "./ReadMore/ReadMore.component";
import VideoPlayer from "@/app/common/components/Video/Video.component";
import useMobx from "@stores/root-store";
import { useParams } from "react-router-dom";
import BlockHeading from "../HeadingBlock/BlockHeading.component";
import { useAsync } from "@/app/common/hooks/stateful/useAsync.hook";
import videosApi from "@/app/api/media/videos.api";
import textsApi from "@/app/api/streetcode/text-content/texts.api";
import Video from "@/models/media/video.model";
import { Text } from "@/models/streetcode/text-contents.model";

const useRouteId = () => {
  const params = useParams<{ id: string }>();
  return parseInt(params.id ?? "1");
};

const TextComponent = () => {
  const streetcodeId = useRouteId();
  const { getByStreetcodeId: getVideo } = videosApi;
  const { getByStreetcodeId: getText } = textsApi;

  const { value } = useAsync(
    () => Promise.all([getText(streetcodeId), getVideo(streetcodeId)]),
    [streetcodeId]
  );

  const [text, video] = (value as [Text, Video]) ?? [undefined, undefined];

  return (
    <div className={"textComponentContainer"}>
      <BlockHeading headingText={String(text?.title)} />
      <div className="textComponent">
        <div className={"TextContainer"}>
          <ReadMore children={String(text?.textContent)}></ReadMore>
        </div>
      </div>
      <div className="videoComponent">
        <VideoPlayer videoUrls={String(video?.url.href)} />
        {/* <Video videoUrls={"f55dHPEY-0U"}/> */}
      </div>
    </div>
  );
};
export default TextComponent;