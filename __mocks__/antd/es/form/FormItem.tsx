import React, { ReactNode } from "react";

type Rule = {
  required?: boolean;
};

type FormItemProps = {
  name?: string;
  label?: string;
  className?: string;
  rules?: Rule[];
  valuePropName?: string;
  // getValueFromEvent?: (...args) => any,
  children?: ReactNode;
};

const FormItem = ({
  name,
  label,
  className,
  rules,
  valuePropName,
  children,
}: FormItemProps) => {
  return (
    <>
      <div data-testid="form-item-label">{label}</div>
      <div data-testid="form-item-name">{name}</div>
      <div data-testid="form-item-class">{className}</div>
      {rules?.some((rule) => {
        rule.required != undefined;
      }) && <div data-testid="form-item-required"></div>}
      <div data-testid="form-item-value-prop-name">{valuePropName}</div>
      {/* <div data-test-id="form-item-get-value-from-event">{getValueFromEvent}</div> */}
      <div data-testid="form-item-children">{children}</div>
    </>
  );
};

export default FormItem;
