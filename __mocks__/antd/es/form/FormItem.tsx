import React, { ReactNode } from "react";

type Rule = {
  required?: boolean;
};

type FormItemProps = {
  name?: string;
  label?: string;
  className?: string;
  valuePropName?: string;
  children?: ReactNode;
};

const FormItem = ({
  name,
  label,
  className,
  valuePropName,
  children,
}: FormItemProps) => {
  return (
    <>
      <div data-testid="form-item-label">{label}</div>
      <div data-testid="form-item-name">{name}</div>
      <div data-testid="form-item-class">{className}</div>
      <div data-testid="form-item-value-prop-name">{valuePropName}</div>
      <div data-testid="form-item-children">{children}</div>
    </>
  );
};

export default FormItem;
