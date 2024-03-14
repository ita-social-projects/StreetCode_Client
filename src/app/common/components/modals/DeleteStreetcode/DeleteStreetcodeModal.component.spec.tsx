import React from 'react';
import { render, fireEvent, getByRole } from '@testing-library/react';
import { mockSetModal, mockID, mockIsOpen } from '../../../../../../__mocks__/@stores/root-store';
import { Modal } from "../../../../../../__mocks__/antd/Modal"
import { TITLE, DELETE_STREETCODE } from '../../../constants/modal.constants';

import DeleteStreetcodeModalComponent from "./DeleteStreetcodeModal.component";

jest.mock("antd", () => ({
    Modal: Modal
}))

const mockSetState = jest.fn();

describe('DeleteStreetcodeModalComponent', () => {

    // DEV NOTE:
    // for educational purposes there are two describe blocks
    // using getElementsByClassName and using getByRole
    // getElementsByClassName is more universal method
    // getByRole has it's own limitations for elements that have roles
    // for exp. div element do not have role so getByRole will not work

    describe('using getElementsByClassName', () => {
        beforeEach(() => {
            const mockUseState: any = (initValue: any) => [initValue, mockSetState];
            jest.spyOn(React, 'useState').mockImplementation(mockUseState);
        });

        afterEach(() => {
            jest.resetAllMocks();
        });

        it('should render itself and its elements', () => {
            const { container } = render(<DeleteStreetcodeModalComponent />);

            const title = container.getElementsByClassName('modalTitle');
            expect(title).toHaveLength(1);
            expect(title[0].textContent).toBe(TITLE);

            const isModalOpen = container.getElementsByClassName('isModalOpen');
            expect(isModalOpen).toHaveLength(1);
            expect(isModalOpen[0].textContent).toBe(`${mockIsOpen}`);

            const okButton = container.getElementsByClassName('modalOkButton');
            expect(okButton).toHaveLength(1);

            const cancelButton = container.getElementsByClassName('modalCancelButton');
            expect(cancelButton).toHaveLength(1);

            const modalChildren = container.getElementsByClassName('modal-children');
            expect(modalChildren).toHaveLength(1);
            expect(modalChildren[0].textContent).toEqual(`${mockID}`);
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
            expect(mockSetState).toHaveBeenCalledWith(false);
        });
    });

    describe('using getByRole', () => {
        beforeEach(() => {
            const mockUseState: any = (initValue: any) => [initValue, mockSetState];
            jest.spyOn(React, 'useState').mockImplementation(mockUseState);
        });

        afterEach(() => {
            jest.resetAllMocks();
        });

        it('should call setModal from useModalContext when clicking onClick button', () => {
            const { container } = render(<DeleteStreetcodeModalComponent />);
            const okButton = getByRole(container, 'button', {
                name: /okButton/ // button text
            });

            fireEvent.click(okButton);
            expect(mockSetModal).toHaveBeenCalledWith(DELETE_STREETCODE);
        });

        it('should call setModal from useModalContext when clicking onCancel button', () => {
            const { container } = render(<DeleteStreetcodeModalComponent />);
            const cancelButton = getByRole(container, 'button', {
                name: /cancelButton/ // button text
            });

            fireEvent.click(cancelButton);
            expect(mockSetState).toHaveBeenCalledWith(false);
        });
    })
});
