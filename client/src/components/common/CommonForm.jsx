
import React from "react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

const CommonForm = ({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled = false,
}) => {
  function renderInputsByComponentType(getControlItem) {
    const value = formData[getControlItem.name] || "";

    switch (getControlItem.componentType) {
      case "input":
        return (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            disabled={isBtnDisabled}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );

      case "select":
        return (
          <Select
            value={value}
            disabled={isBtnDisabled}
            onValueChange={(selectedValue) =>
              setFormData({
                ...formData,
                [getControlItem.name]: selectedValue,
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItem.placeholder} />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectLabel>{getControlItem.label}</SelectLabel>

                {getControlItem.options?.map((optionItem, index) => (
                  <SelectItem
                    key={`${optionItem.value || optionItem.id || index}-${optionItem.label}`}
                    value={optionItem.value || optionItem.id}
                  >
                    {optionItem.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        );

      case "textarea":
        return (
          <Textarea
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            value={value}
            disabled={isBtnDisabled}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );

      default:
        return (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            disabled={isBtnDisabled}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            <Label htmlFor={controlItem.name} className="mb-1">
              {controlItem.label}
            </Label>

            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>

      <Button
        disabled={isBtnDisabled}
        type="submit"
        className="mt-2 w-full"
      >
        {buttonText || "Submit"}
      </Button>
    </form>
  );
};

export default CommonForm;
