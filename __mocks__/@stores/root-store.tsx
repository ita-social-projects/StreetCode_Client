const mockID = 1;
export const mockSetModal = jest.fn();

export const useModalContext = () => {
    return {
        modalStore: {
            setModal: mockSetModal, 
            modalsState: {
                deleteStreetcode: {
                    isOpen: true,
                    fromCardId: mockID,
                },
            }
        } 
    }
}
