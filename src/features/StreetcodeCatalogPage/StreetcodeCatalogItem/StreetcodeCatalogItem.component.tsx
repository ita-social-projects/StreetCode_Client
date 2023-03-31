import './StreetcodeCatalogItem.styles.scss';

import { Link } from 'react-router-dom';
import useMobx from '@stores/root-store';

import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import { StreetcodeCatalogRecord } from '@/models/streetcode/streetcode-types.model';

interface Props {
    streetcode: StreetcodeCatalogRecord;
}

const StreetcodeCatalogItem = ({ streetcode }: Props) => {
    const { imagesStore: { fetchImageByStreetcodeId, getImage } } = useMobx();
    useAsync(() => fetchImageByStreetcodeId(streetcode.id));
    return (
        <Link
            className="catalogItem"
            style={{ backgroundImage: `url(${getImage(6)?.url.href})` }}
            // change 5 to streetcode.id when all images will be downloaded
            to={`../streetcode/${streetcode.url}`}
        >
            <div className="catalogItemText">
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
    );
};

export default StreetcodeCatalogItem;
