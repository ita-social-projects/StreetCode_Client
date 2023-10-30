/* eslint-disable max-len */
import './StreetcodeCatalogItem.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useMobx from '@stores/root-store';

import useOnScreen from '@/app/common/hooks/scrolling/useOnScreen.hook';
import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import { toStreetcodeRedirectClickEvent } from '@/app/common/utils/googleAnalytics.unility';
import { StreetcodeCatalogRecord } from '@/models/streetcode/streetcode-types.model';

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
        href: `../${streetcode.url}`,
    };
    const windowsize = useWindowSize();

    const handleClickRedirect = () => {
        toStreetcodeRedirectClickEvent(streetcode.url.toString(), 'catalog');
        window.location.href = `/${streetcode.url}`;
    };
    const handleTextClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        handleClickRedirect();
    };
    
    return (
        <>
            {windowsize.width > 1024 && (
                <a {...LinkProps} href={`/${streetcode.url}`} onClick={() => toStreetcodeRedirectClickEvent(streetcode.url, 'catalog')}>
                    <div ref={elementRef} className="catalogItemText">
                        <div className="heading">
                            <p>{streetcode.title}</p>
                            {
                                streetcode.alias !== null && streetcode.alias?.trim() !== '' ? (
                                    <p className="aliasText">({streetcode.alias})</p>
                                ) : undefined
                            }
                        </div>
                    </div>
                </a>
            )}
            {windowsize.width <= 1024 && (
                <div>
                    <a {...LinkProps} href={`/${streetcode.url}`} onTouchStart={() => toStreetcodeRedirectClickEvent(streetcode.url, 'catalog')}/>
                    <div ref={elementRef} className="catalogItemText mobile">
                        <div className="heading" onClick={handleTextClick}>
                            <p>{streetcode.title}</p>
                            {
                                streetcode.alias !== null && streetcode.alias?.trim() !== '' ? (
                                    <p className="aliasText">{streetcode.alias}</p>
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
