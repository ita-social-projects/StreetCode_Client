import React, { JSX, MouseEventHandler, ReactNode } from 'react';

type Props = {
  title: string,
  open: boolean,
  onOk: MouseEventHandler<HTMLButtonElement>,
  onCancel: MouseEventHandler<HTMLButtonElement>,
  children: ReactNode,
};

export const Modal = ({
    title,
    open,
    onOk,
    onCancel,
    children,
}: Props): JSX.Element => (
    <>
        <div className="modalTitle">{title}</div>
        <div className="isModalOpen">{JSON.stringify(open)}</div>
        <button type="button" className="modalOkButton" onClick={onOk}>okButton</button>
        <button type="button" className="modalCancelButton" onClick={onCancel}>cancelButton</button>
        <div className="modal-children">{children}</div>
    </>
);
