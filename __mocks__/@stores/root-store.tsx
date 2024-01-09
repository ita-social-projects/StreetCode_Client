export const mockID = 1;
export const mockIsOpen = true;
export const mockSetModal = jest.fn();

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
}
