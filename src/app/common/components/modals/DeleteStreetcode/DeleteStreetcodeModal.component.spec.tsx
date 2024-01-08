import { render, fireEvent } from '@testing-library/react';
import { mockSetModal } from '../../../../../../__mocks__/@stores/root-store';

import { TITLE, DELETE_STREETCODE } from '../../../constants/modal.constant';

import DeleteStreetcodeModalComponent from "./DeleteStreetcodeModal.component";

describe('DeleteStreetcodeModalComponent', () => {
    it('should render itself and its elements', () => {
        const { container } = render(<DeleteStreetcodeModalComponent />);

        const title = container.getElementsByClassName('modalTitle');
        expect(title).toHaveLength(1);
        expect(title[0].textContent).toBe(TITLE);

        const isModalOpen = container.getElementsByClassName('isModalOpen');
        expect(isModalOpen).toHaveLength(1);
        expect(isModalOpen[0].textContent).toBe('true'); // from mock

        const okButton = container.getElementsByClassName('modalOkButton');
        expect(okButton).toHaveLength(1);

        const cancelButton = container.getElementsByClassName('modalCancelButton');
        expect(cancelButton).toHaveLength(1);

        const modalChildren = container.getElementsByClassName('modal-children');
        expect(modalChildren).toHaveLength(1);
        expect(modalChildren[0].textContent).toEqual('1'); // from mock
    });

    it('should call setModal from useModalContext when clicking onClick button', () => {
        const { container } = render(<DeleteStreetcodeModalComponent />);
        const okButton = container.getElementsByClassName('modalOkButton')[0];

        fireEvent.click(okButton);
        expect(mockSetModal).toHaveBeenCalledWith(DELETE_STREETCODE);
    });

    it('should call setModal from useModalContext when clicking onCancel button', () => {
        const { container } = render(<DeleteStreetcodeModalComponent />);
        const cancelButton = container.getElementsByClassName('modalCancelButton')[0];

        fireEvent.click(cancelButton);
        expect(mockSetModal).toHaveBeenCalledWith(DELETE_STREETCODE);
    });
});
