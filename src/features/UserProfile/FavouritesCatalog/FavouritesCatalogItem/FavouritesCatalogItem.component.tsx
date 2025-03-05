import './FavouritesCatalogItem.styles.scss';

import { Link } from 'react-router-dom';

import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import { toStreetcodeRedirectClickEvent } from '@/app/common/utils/googleAnalytics.unility';
import Image from '@/models/media/image.model';
import { StreetcodeFavourite } from '@/models/streetcode/streetcode-types.model';

interface Props {
  streetcode: StreetcodeFavourite;
  image: Image | undefined;
}

const FavouritesCatalogItem = ({ streetcode, image }: Props) => {
    const LinkProps = {
        className: 'favouriteItem',
        style: {
            backgroundImage: `url(${base64ToUrl(image?.base64, image?.mimeType)})`,
        },
    };

    return (
        <Link
            {...LinkProps}
            to={`/${streetcode.transliterationUrl}`}
            onClick={() => toStreetcodeRedirectClickEvent(streetcode.transliterationUrl, 'profile')}
        >
            <div className="favouritesItemText">
                <div className="heading">
                    <p>{streetcode.title}</p>
                    {
                        streetcode.alias !== null && streetcode?.alias?.trim() !== '' ? (
                            <p className="aliasText">
                            (
                                {streetcode.alias}
                            )
                            </p>
                        ) : undefined
                    }
                </div>
            </div>
        </Link>
    );
};

export default FavouritesCatalogItem;
