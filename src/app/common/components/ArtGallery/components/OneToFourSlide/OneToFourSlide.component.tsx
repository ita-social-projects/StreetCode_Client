import './OneToFourSlide.styles.scss';

import StreetcodeArt from '@models/media/streetcode-art.model';
import base64ToUrl from '@utils/base64ToUrl.utility';

type Props = {
    streetcodeArts: StreetcodeArt[]
};
const OneToFourSlide = ({ streetcodeArts }: Props) => (
    <div className="oneToFourSlide">
        {streetcodeArts?.map((streetcodeArt) => {
            const { image } = streetcodeArt.art;
            return (<img src={base64ToUrl(image.base64, image.mimeType)} />);
        })}
    </div>
);

export default OneToFourSlide;
