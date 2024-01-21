export const mockID = 1;
export const mockIsOpen = true;
export const mockSetModal = jest.fn();
export const mockUpdateTeam = jest.fn();
export const mockCreateTeam = jest.fn();

export const useModalContext = () => {
    return {
        modalStore: {
            setModal: mockSetModal, 
            modalsState: {
                deleteStreetcode: {
                    isOpen: mockIsOpen,
                    fromCardId: mockID,
                },
            }
        } 
    }
};

export const useMobx = () => {
    return {
        teamStore: {
            updateTeam: mockUpdateTeam,
            createTeam: mockCreateTeam,
            getTeamArray: [
                {
                    name: 'name',
                    imageId: 1,
                }
            ]
        }
    }
};

export default useMobx;
