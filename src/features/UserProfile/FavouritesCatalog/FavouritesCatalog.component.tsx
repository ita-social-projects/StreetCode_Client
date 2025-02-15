import './FavouritesCatalog.styles.scss';

import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import useMobx from '@stores/root-store';

import { Badge, Menu, MenuProps } from 'antd';

import FAVOURITE_STREETCODE_TYPES from '@/app/common/constants/favourite-streetcode-types';
import { StreetcodeType } from '@/models/streetcode/streetcode-types.model';

import FavouritesCatalogItemComponent from './FavouritesCatalogItem/FavouritesCatalogItem.component';

const FavouritesCatalog = () => {
    const { imagesStore, favouritesCatalogStore } = useMobx();
    const { getFavouritesArray } = favouritesCatalogStore;
    const [selectedType, setSelectedType] = useState<StreetcodeType | undefined>(undefined);
    const [filter, setFilter] = useState(FAVOURITE_STREETCODE_TYPES.ALL.label);

    const types: MenuProps['items'] = [
        {
            icon: selectedType === undefined ? <Badge color='#D12F1F' /> : undefined,
            label: FAVOURITE_STREETCODE_TYPES.ALL.label,
            key: FAVOURITE_STREETCODE_TYPES.ALL.key,
        },
        {
            icon: selectedType === StreetcodeType.Person ? <Badge color='#D12F1F' /> : undefined,
            label: FAVOURITE_STREETCODE_TYPES.PERSON.label,
            key: FAVOURITE_STREETCODE_TYPES.PERSON.key,
        },
        {
            icon: selectedType === StreetcodeType.Event ? <Badge color='#D12F1F' /> : undefined,
            label: FAVOURITE_STREETCODE_TYPES.EVENT.label,
            key: FAVOURITE_STREETCODE_TYPES.EVENT.key,
        },
    ];

    const handleMenuClick: MenuProps['onClick'] = async (e) => {
        try {
            const selectedKey = +e.key;

            switch (selectedKey) {
            case FAVOURITE_STREETCODE_TYPES.PERSON.key:
                setFilter(FAVOURITE_STREETCODE_TYPES.PERSON.label);
                setSelectedType(StreetcodeType.Person);
                break;
            case FAVOURITE_STREETCODE_TYPES.EVENT.key:
                setFilter(FAVOURITE_STREETCODE_TYPES.EVENT.label);
                setSelectedType(StreetcodeType.Event);
                break;
            case FAVOURITE_STREETCODE_TYPES.ALL.key:
                setFilter(FAVOURITE_STREETCODE_TYPES.ALL.label);
                setSelectedType(undefined);
                break;
            default:
                setFilter(FAVOURITE_STREETCODE_TYPES.ALL.label);
                setSelectedType(undefined);
                break;
            }
        } catch (error) { }
    };

    const menuProps = {
        items: types.filter((t) => 'label' in t! && t.label !== filter),
        onClick: handleMenuClick,
    };

    return (
        <div className="favourites">
            <Menu
                onClick={handleMenuClick}
                style={{ width: 256 }}
                defaultSelectedKeys={[FAVOURITE_STREETCODE_TYPES.ALL.key.toString()]}
                mode='inline'
                items={types}
            />
            <div className="favouritesContainer">
                {getFavouritesArray.map((streetcode, index) => (
                    selectedType === streetcode.type || selectedType === undefined) && (
                    <FavouritesCatalogItemComponent
                        key={streetcode.id}
                        streetcode={streetcode}
                        image={imagesStore.getImage(streetcode.imageId)}
                    />
                ))}
            </div>
        </div>
    );
};

export default observer(FavouritesCatalog);
