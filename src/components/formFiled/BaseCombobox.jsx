// src/components/formFiled/BaseCombobox.jsx

import React from "react";
import { useFormContext } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "~/lib/utils";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";

const BaseCombobox = ({
  name,
  label,
  placeholder,
  options,
  isLoading,
  disabled = false,
  renderOption,
  renderValue,
}) => {
  const { control } = useFormContext();
  const defaultRender = (option) => <span>{option?.label || ""}</span>;
  const renderOptionContent = renderOption || defaultRender;
  const renderValueContent = renderValue || defaultRender;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Tìm option đã được chọn
        const selectedOption = options.find((o) => o.value === field.value);

        return (
          <FormItem className="flex flex-col">
            <FormLabel className="font-semibold text-slate-700">
              {label}
            </FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    disabled={disabled}
                    className={cn(
                      "w-full justify-between font-normal h-10 border-slate-300",
                      !field.value && "text-slate-500",
                      field.value && "bg-blue-50 border-blue-300 text-blue-900",
                      disabled && "bg-slate-100 cursor-not-allowed"
                    )}
                  >
                    {/* SỬA LỖI Ở ĐÂY */}
                    {field.value && selectedOption
                      ? renderValueContent(selectedOption)
                      : // Nếu có value nhưng options chưa tải xong, hiển thị "Đang tải lựa chọn..."
                      field.value && isLoading
                      ? "Đang tải lựa chọn..."
                      : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput
                    placeholder={`Tìm kiếm ${label.toLowerCase()}...`}
                  />
                  <CommandList>
                    {isLoading && (
                      <div className="p-4 text-sm text-center text-slate-500">
                        Đang tải...
                      </div>
                    )}
                    <CommandEmpty>Không tìm thấy.</CommandEmpty>
                    <CommandGroup>
                      {options?.map((option) => (
                        <CommandItem
                          value={option.label}
                          key={option.value}
                          onSelect={() => field.onChange(option.value)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              option.value === field.value
                                ? "opacity-100 text-blue-600"
                                : "opacity-0"
                            )}
                          />
                          {renderOptionContent(option)}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default BaseCombobox;
