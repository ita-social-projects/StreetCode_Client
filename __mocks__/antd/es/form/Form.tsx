import React, { MouseEventHandler, ReactNode } from "react"
import Item from "./FormItem"

type FormProps = {
  form?: any,
  layout?: string,
  onFinish?: MouseEventHandler<HTMLButtonElement>
  children?: ReactNode
}

const Form = ({ form, layout, onFinish, children }: FormProps) => {
  return (
    <>
      <div data-test-id="form-form">{form && "form exists"}</div>
      <div data-test-id="form-layout">{layout}</div>
      <button type='button' data-test-id="form-on-finish" onClick={onFinish}/>
      <div data-test-id="form-children">{children}</div>
    </>
  )
}

const mockSetFieldsValue = jest.fn();
const mockResetFields = jest.fn();

const useForm = () => {
  return [{
    setFieldsValue: mockSetFieldsValue,
    resetFields: mockResetFields,
  }]
};


Form.useForm = useForm;
Form.Item = Item;
export default Form;