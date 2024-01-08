import React from "react";

type Props = {
  title: String,
  open: Boolean,
  onOk: React.MouseEventHandler<HTMLButtonElement>,
  onCancel: React.MouseEventHandler<HTMLButtonElement>,
  children: React.ReactNode,
}

export const Modal = ({ title, open, onOk, onCancel, children }: Props): React.JSX.Element => {
  return (
    <>
      <div className='modalTitle'>{title}</div>
      <div className="isModalOpen">{JSON.stringify(open)}</div>
      <button type='button' className='modalOkButton' onClick={onOk}>okButton</button>
      <button type='button' className='modalCancelButton' onClick={onCancel}>cancelButton</button>
      <div className='modal-children'>{children}</div>
    </>
  )
};
