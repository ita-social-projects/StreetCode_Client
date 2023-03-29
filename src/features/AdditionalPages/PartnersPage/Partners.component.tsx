import './Partners.styles.scss';

import { useEffect, useState } from 'react';

import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import { useRouteId } from '@/app/common/hooks/stateful/useRouter.hook';
import useMobx from '@/app/stores/root-store';

import KeyPartnersBlock from './KeyPartnersBlock/KeyPartnersBlock.component';
import OtherPartnersBlock from './OtherPartnersBlock/OtherPartnersBlock.component';
import Title from './Title/Title.component';

const Partners = () => {
    const [partners, setPartners] = useState([
        { id: '1', logo: 'https://i.pinimg.com/736x/f4/d2/96/f4d2961b652880be432fb9580891ed62.jpg' },
        { id: '2', logo: 'https://images.prom.ua/2831466854_w600_h600_2831466854.jpg' },
        { id: '3', logo: 'https://cs11.pikabu.ru/post_img/2019/02/04/12/1549312329147951618.jpg' },
        { id: '4', logo: 'https://i.pinimg.com/736x/f4/d2/96/f4d2961b652880be432fb9580891ed62.jpg' },
        { id: '5', logo: 'https://images.prom.ua/2831466854_w600_h600_2831466854.jpg' },
        { id: '6', logo: 'https://cs11.pikabu.ru/post_img/2019/02/04/12/1549312329147951618.jpg' },
    ]);

    const { partnersStore } = useMobx();
    const { getAll } = partnersStore;

    const streetcodeId = useRouteId();

    useEffect(() => {
        const fetchData = async () => {
            const partners2 = await partnersStore.getAll();
            console.log(partners2);
        };
        fetchData();
    }, []);

    return (
        <div className="partnersContainer">
            <div className="wrapper">
                <Title />
                <KeyPartnersBlock partners={partners} />
                {/* <OtherPartnersBlock partners={partners} /> */}
                <div className="subTitle">
                    Тобі чи твоїй компанії відгукується наш проєкт?
                    Наперед тиснемо руку та мріємо про спільну залученість. Приєднуйся!
                </div>
            </div>
        </div>

    );
};

export default Partners;
