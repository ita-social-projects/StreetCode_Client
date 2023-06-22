/* eslint-disable max-len */
import './StreetcodeCatalogItem.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useMobx from '@stores/root-store';

import useOnScreen from '@/app/common/hooks/scrolling/useOnScreen.hook';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import { StreetcodeCatalogRecord } from '@/models/streetcode/streetcode-types.model';
import { toStreetcodeRedirectClickEvent } from '@/app/common/utils/googleAnalytics.unility';

interface Props {
    streetcode: StreetcodeCatalogRecord;
    isLast: boolean;
    handleNextScreen: () => void;
}

const StreetcodeCatalogItem = ({ streetcode, isLast, handleNextScreen }: Props) => {
    const { imagesStore: { getImage, fetchImage } } = useMobx();
    const elementRef = useRef<HTMLDivElement>(null);
    const classSelector = 'catalogItem';
    const isOnScreen = useOnScreen(elementRef, classSelector);

    useEffect(() => (isOnScreen && isLast ? () => handleNextScreen() : () => { }), [isOnScreen]);

    useEffect(() => {
        Promise.all([fetchImage(streetcode.imageId)]);
    }, []);

    const LinkProps = {
        className: classSelector,
        style: { backgroundImage: `url(${base64ToUrl(getImage(streetcode.imageId)?.base64, getImage(streetcode.imageId)?.mimeType)})` },
        to: `../${streetcode.url}`,
    }
    const windowsize = useWindowSize();

    return (
        <>
            {windowsize.width > 1024 && (
                <Link {...LinkProps} onClick={() => toStreetcodeRedirectClickEvent(streetcode.url, 'catalog')}>
                    <div ref={elementRef} className="catalogItemText">
                        <div className="heading">
                            <p>{streetcode.title}</p>
                            {
                                streetcode.alias !== null ? (
                                    <p className="aliasText">
                                        ({streetcode.alias})
                                    </p>
                                ) : undefined
                            }
                        </div>
                    </div>
                </Link>
            )}
            {windowsize.width <= 1024 && (
                <div>
                    <Link {...LinkProps} />
                    <div ref={elementRef} className="catalogItemText mobile">
                        <div className="heading">
                            <p>{streetcode.title}</p>
                            {
                                streetcode.alias !== null ? (
                                    <p className="aliasText">
                                        ({streetcode.alias})
                                    </p>
                                ) : undefined
                            }
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default observer(StreetcodeCatalogItem);
