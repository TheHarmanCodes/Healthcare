"use client";

import Image from "next/image";
import {
  Controller,
  type Control,
  type ControllerFieldState,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { Input } from "@/components/ui/input";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import "react-phone-number-input/style.css";
import PhoneInput, { type Value } from "react-phone-number-input";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phone",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
}

type CustomFormFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  fieldType: FormFieldType;

  label?: string;
  placeholder?: string;
  autoComplete?: string;
  description?: string;

  iconSrc?: string;
  iconAlt?: string;

  disabled?: boolean;
  defaultCountry?: string;
};

type RenderFieldProps<TFieldValues extends FieldValues> =
  CustomFormFieldProps<TFieldValues> & {
    field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>;
    fieldState: ControllerFieldState;
  };

const RenderField = <TFieldValues extends FieldValues>({
  field,
  fieldState,
  fieldType,
  name,
  placeholder,
  autoComplete,
  iconSrc,
  iconAlt,
  disabled,
}: RenderFieldProps<TFieldValues>) => {
  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex items-center rounded-md border border-dark-500 bg-dark-400">
          {iconSrc && (
            <Image
              src={iconSrc}
              alt={iconAlt ?? "icon"}
              width={24}
              height={24}
              className="ml-2 shrink-0"
            />
          )}
          <Input
            {...field}
            id={String(name)}
            type="text"
            placeholder={placeholder}
            autoComplete={autoComplete}
            disabled={disabled}
            aria-invalid={fieldState.invalid}
            className="border-0 shad-input"
          />
        </div>
      );
    case FormFieldType.PHONE_INPUT:
      return (
        <PhoneInput
          {...field}
          id={String(name)}
          name={String(name)}
          placeholder={placeholder}
          defaultCountry="IN"
          international
          autoComplete={autoComplete ?? "tel"}
          inputMode="tel"
          value={field.value as Value}
          onChange={field.onChange}
          disabled={disabled}
          aria-invalid={fieldState.invalid}
          className="input-phone"
        />
      );
    default:
      console.warn(`FormFieldType "${fieldType}" is not yet implemented`);
      return null;
  }
};

const CustomFormField = <TFieldValues extends FieldValues>({
  control,
  name,
  fieldType,
  label,
  placeholder,
  autoComplete,
  description,
  iconSrc,
  iconAlt,
  disabled,
}: CustomFormFieldProps<TFieldValues>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && <FieldLabel htmlFor={String(name)}>{label}</FieldLabel>}

          <FieldContent>
            <RenderField
              field={field}
              fieldState={fieldState}
              control={control}
              name={name}
              fieldType={fieldType}
              label={label}
              placeholder={placeholder}
              autoComplete={autoComplete}
              description={description}
              iconSrc={iconSrc}
              iconAlt={iconAlt}
              disabled={disabled}
            />

            {description && <FieldDescription>{description}</FieldDescription>}

            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </FieldContent>
        </Field>
      )}
    />
  );
};

export default CustomFormField;
