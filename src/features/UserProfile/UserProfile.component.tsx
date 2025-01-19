import './UserProfile.styles.scss';

import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import defaultAvatar from '@assets/images/user-profile/default-avatar.webp';
import Calendar from '@assets/images/utils/calendar-regular.svg';
import Pencil from '@assets/images/utils/pencil-solid.svg';
import Loader from '@components/Loader/Loader.component';
import TagList from '@components/TagList/TagList.component';
import EditUserModal from '@features/UserProfile/EditUserProfileModal/EditUserProfileModal.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import useMobx from '@stores/root-store';
import base64ToUrl from '@utils/base64ToUrl.utility';

import { Button } from 'antd';

const UserProfile = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [activeButton, setActiveButton] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { userStore, imagesStore } = useMobx();
    const { user } = userStore;
    const buttonConfigs = [
        { label: 'Календар', icon: Calendar },
        { label: 'Панель', icon: Pencil },
    ];

    useAsync(async () => {
        setIsLoading(true);
        const fetchUserData = async () => {
            await userStore.fetchCurrentUser();
            const imageId = userStore?.user?.avatarId;
            if (imageId) {
                await imagesStore.fetchImage(imageId);
            }
        };

        await fetchUserData();
        setIsLoading(false);
    }, []);

    const handleIsActive = (buttonIndex: number) => {
        setActiveButton(buttonIndex);
    };

    const handleEditProfile = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        !isLoading ? (
            <div className="userContainer">
                <div>
                    <div className="mainUserBlock">
                        <div className="userContent">
                            <div className="userCard">
                                <div className="avatar">
                                    <div className="avatarContent">
                                        <img
                                            className="userImg"
                                            style={{ objectFit: 'contain' }}
                                            src={user?.avatarId
                                                ? base64ToUrl(
                                                    imagesStore.getImage(user?.avatarId)?.base64,
                                                    imagesStore.getImage(user?.avatarId)?.mimeType,
                                                )
                                                : defaultAvatar}
                                            alt=""
                                        />
                                    </div>
                                </div>
                                <div className="userInfoWrapper">
                                    <div className="userInfo">
                                        <div className="userIdentity">
                                            <div className="userIndex">
                                                {user?.userName}
                                            </div>
                                            <div className="userLabel">
                                                {user?.role}
                                            </div>
                                        </div>
                                        <h2 className="userFullName">
                                            {`${user?.name} ${user?.surname}`}
                                        </h2>
                                        <div className="userContacts">
                                            {user?.email}
                                            <div className={user?.phoneNumber ? 'separator' : ''} />
                                            {user?.phoneNumber}
                                        </div>
                                        <div className="tagListWrapper">
                                            <TagList
                                                tags={user?.expertises}
                                            />
                                        </div>
                                        <div className="userAboutYourself">
                                            {user?.aboutYourself}
                                        </div>
                                    </div>
                                    <div className="cardUserFooter">
                                        <Button
                                            onClick={handleEditProfile}
                                            className="cardFooterEditButton editButton"
                                        >
                                            <Pencil className="pencilSvg" />
                                            <span>Редагувати профіль</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="accountContent">
                            <div className="accountCard">
                                <div className="accountNav">
                                    {buttonConfigs.map((config, index) => (
                                        <div
                                            onClick={() => handleIsActive(index)}
                                            className={activeButton === index ? 'active navContainer' : 'navContainer'}
                                            key={config.label}
                                        >
                                            <config.icon className="navSvg" />
                                            <div
                                                className="navButton"
                                            >
                                                {config.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="accountInfo">
                                    {/* {buttonConfigs.at(activeButton)?.component} */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {isModalOpen && (
                    <EditUserModal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        image={user?.avatarId ? imagesStore.getImage(user.avatarId) : undefined}
                    />
                )}
            </div>
        ) : <Loader />
    );
};

export default observer(UserProfile);
