import './StreetcodeCatalogItem.styles.scss';

import { useRef } from 'react';
import { Link } from 'react-router-dom';
import useMobx from '@stores/root-store';

import useOnScreen from '@/app/common/hooks/scrolling/useOnScreen.hook';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import { StreetcodeCatalogRecord } from '@/models/streetcode/streetcode-types.model';

interface Props {
    streetcode: StreetcodeCatalogRecord;
    isLast: boolean;
    handleNextScreen: () => void;
}

const StreetcodeCatalogItem = ({ streetcode, isLast, handleNextScreen }: Props) => {
    const { imagesStore: { fetchImageByStreetcodeId, getImage } } = useMobx();
    const elementRef = useRef<HTMLDivElement>(null);
    const classSelector = 'catalogItem';
    const isOnScreen = useOnScreen(elementRef, classSelector);

    useAsync(() => (isOnScreen && isLast
        ? () => handleNextScreen() : () => {}), [isOnScreen]);
    useAsync(() => fetchImageByStreetcodeId(streetcode.id));

    return (
        <div>
            <Link
                className={classSelector}
                style={{ backgroundImage: `url(${base64ToUrl(getImage(6)?.base64, getImage(6)?.mimeType)})` }}
                to={`../streetcode/${streetcode.transliterationUrl}`}
            >
                <div ref={elementRef} className="catalogItemText">
                    <div className="heading">
                        <p>{streetcode.title}</p>
                        {
                            streetcode.alias !== null
                                ? (
                                    <p className="aliasText">
                                (
                                        {streetcode.alias}
                                )
                                    </p>
                                )
                                : undefined
                        }
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default StreetcodeCatalogItem;
