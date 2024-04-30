/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
    ChangeEventHandler,
    MouseEventHandler,
    ReactNode,
} from 'react';

export { default as Form } from './es/form/Form';

type ModalProps = {
  title: string;
  open: boolean;
  onOk: MouseEventHandler<HTMLButtonElement>;
  onCancel: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
};

type InputProps = {
  showCount: boolean;
  maxLength: number;
  value: string;
};

type FileUploaderProps = {
  onChange: typeof jest.fn;
  fileList: any[];
  className: string;
  multiple: boolean;
  accept: string;
  listType: string;
  maxCount: number;
  onPreview: typeof jest.fn;
  onRemove: typeof jest.fn;
  uploadTo: string;
  onSuccessUpload: typeof jest.fn;
  children: ReactNode;
};

export type MockPaginationProps = {
  current: number;
  total: number;
  pageSize: number;
  onChange: typeof jest.fn;
};

type ButtonProps = {
  className: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
};

type PopoverProps = {
  content: string;
  trigger: string;
  children: ReactNode;
};

type SelectProps = {
  className: string;
  onSelect: MouseEventHandler<HTMLButtonElement>;
  mode: string;
  onDeselect: MouseEventHandler<HTMLButtonElement>;
  value: Array<any>;
  children: ReactNode;
};

type CheckboxProps = {
  checked: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

type OptionProps = {
  value?: string;
};

export const mockConfig = jest.fn();

export const Modal = ({
    title,
    open,
    onOk,
    onCancel,
    children,
}: ModalProps) => (
    <>
        <div className="modalTitle">{title}</div>
        <div className="isModalOpen">{JSON.stringify(open)}</div>
        <button type="button" className="modalOkButton" onClick={onOk}>
          okButton
        </button>
        <button type="button" className="modalCancelButton" onClick={onCancel}>
          cancelButton
        </button>
        <div className="modal-children">{children}</div>
    </>
);

export const Button = ({ className, onClick, children }: ButtonProps) => (
    <>
        <div data-test-id="button-class" className={className} />
        <button type="button" data-test-id="button-button" onClick={onClick} />
        <div data-test-id="modal-children">{children}</div>
    </>
);

export const message = {
    config: mockConfig,
};

export const Popover = ({ content, trigger, children }: PopoverProps) => (
    <>
        <div data-test-id="popover-content">{content}</div>
        <div data-test-id="popover-trigger">{trigger}</div>
        <div data-test-id="popover-children">{children}</div>
    </>
);

const Option = ({ value }: OptionProps) => (
    <div data-test-id="option-value">{value}</div>
);

const Select = ({
    className,
    onSelect,
    mode,
    onDeselect,
    value,
    children,
}: SelectProps) => (
    <>
        <div className={className} data-test-id="select-class-name" />
        <button
            type="button"
            data-test-id="select-on-select"
            onClick={onSelect}
        />
        <div data-test-id="select-mode">{mode}</div>
        <button
            type="button"
            data-test-id="select-on-deselect"
            onClick={onDeselect}
        />
        <div data-test-id="select-value">{value}</div>
        <div data-test-id="select-children">{children}</div>
    </>
);

Select.Option = Option;

export { Select };

export const Input = ({ value, showCount, maxLength }: InputProps) => (
    <>
        <div data-testid="input-show-count">{showCount}</div>
        <div data-testid="input-max-length">{maxLength}</div>
        <input data-testid="input-value" value={value} />
    </>
);

Input.Password = ({ value }: InputProps) => (
    <input type="password" data-testid="input-value" value={value} />
);

export const Checkbox = ({ checked, onChange }: CheckboxProps) => (
    <input type="checkbox" checked={checked} onChange={onChange} />
);

export const MockPagination = ({ current, total, pageSize, onChange }: MockPaginationProps) => {
    const totalPages = total % pageSize === 0 ? total / pageSize : (total / pageSize) + 1;
    return (
        <ul>
            <li>
                <button type="button" disabled={current === 1} onChange={onChange}>{'<'}</button>
            </li>
            <li>
                <input type="text" size={3} />
                {totalPages}
            </li>
            <li>
                <button type="button" disabled={current >= totalPages} onChange={onChange}>{'>'}</button>
            </li>
        </ul>
    );
};
