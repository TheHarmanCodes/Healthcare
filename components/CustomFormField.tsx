"use client";

import Image from "next/image";
import React from "react";
import DatePicker from "react-datepicker";
import PhoneInput, { type Value } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  Controller,
  type Control,
  type ControllerFieldState,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phone",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

type CustomFormFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  fieldType: FormFieldType;
  label?: string;
  controlClassName?: string;
  labelColor?: string;
  placeholder?: string;
  autoComplete?: string;
  description?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  defaultCountry?: string;
  showTimeSelect?: boolean;
  dateFormat?: string;
  children?: React.ReactNode;
  renderSkeleton?: (
    field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>,
  ) => React.JSX.Element;
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
  showTimeSelect,
  dateFormat,
  renderSkeleton,
  children,
  label,
  controlClassName,
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

    case FormFieldType.DATE_PICKER:
      return (
        <div className="flex w-full items-center rounded-md border border-dark-500 bg-dark-400">
          {iconSrc && (
            <Image
              src={iconSrc}
              alt={iconAlt ?? "calendar"}
              width={24}
              height={24}
              className="ml-2 shrink-0"
            />
          )}
          <DatePicker
            selected={(field.value as Date | null | undefined) ?? null}
            onChange={(date: Date | null) => field.onChange(date)}
            dateFormat={dateFormat ?? "dd-MM-yyyy"}
            showTimeSelect={showTimeSelect ?? false}
            placeholderText={placeholder}
            id={String(name)}
            name={String(name)}
            disabled={disabled}
            aria-invalid={String(fieldState.invalid)}
            className="date-picker"
          />
        </div>
      );

    case FormFieldType.SKELETON:
      return renderSkeleton ? renderSkeleton(field) : null;

    case FormFieldType.SELECT:
      return (
        <Select onValueChange={field.onChange} value={field.value}>
          <SelectTrigger
            id={String(name)}
            aria-invalid={fieldState.invalid}
            className="shad-select-trigger w-full"
          >
            <SelectValue placeholder={placeholder} className="text-dark-600" />
          </SelectTrigger>
          <SelectContent
            className="shad-select-content"
            sideOffset={8}
            align="start"
            position="popper"
          >
            <div className="shad-select-scroll">
              {React.Children.map(children, (child, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <div className="shad-select-separator" />}
                  <div className="shad-select-item-wrapper">{child}</div>
                </React.Fragment>
              ))}
            </div>
          </SelectContent>
        </Select>
      );

    case FormFieldType.TEXTAREA:
      return (
        <Textarea
          {...field}
          id={String(name)}
          placeholder={placeholder}
          className={cn("shad-textArea", controlClassName)}
          disabled={disabled}
          aria-invalid={fieldState.invalid}
        />
      );

    case FormFieldType.CHECKBOX:
      return (
        <div className="flex items-center gap-1">
          <Field orientation="horizontal">
            <Checkbox
              id={String(name)}
              name={String(name)}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <FieldLabel htmlFor={String(name)} className="cursor-pointer">
              {label}
            </FieldLabel>
          </Field>
        </div>
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
  controlClassName,
  labelColor,
  placeholder,
  autoComplete,
  description,
  iconSrc,
  iconAlt,
  disabled,
  showTimeSelect,
  dateFormat,
  renderSkeleton,
  children,
}: CustomFormFieldProps<TFieldValues>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label &&
            fieldType !== FormFieldType.CHECKBOX &&
            (fieldType === FormFieldType.SKELETON ? (
              <div className={labelColor ?? "text-dark-700"}>{label}</div>
            ) : (
              <FieldLabel htmlFor={String(name)} className={labelColor ?? "text-dark-700"}>
                {label}
              </FieldLabel>
            ))}

          <FieldContent>
            <RenderField
              field={field}
              fieldState={fieldState}
              control={control}
              name={name}
              controlClassName={controlClassName}
              fieldType={fieldType}
              label={label}
              placeholder={placeholder}
              autoComplete={autoComplete}
              description={description}
              iconSrc={iconSrc}
              iconAlt={iconAlt}
              disabled={disabled}
              showTimeSelect={showTimeSelect}
              dateFormat={dateFormat}
              renderSkeleton={renderSkeleton}
            >
              {children}
            </RenderField>

            {description && <FieldDescription>{description}</FieldDescription>}
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </FieldContent>
        </Field>
      )}
    />
  );
};

export default CustomFormField;
