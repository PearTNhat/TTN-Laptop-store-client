import { useFormState } from "react-hook-form";
import { cn } from "~/lib/utils";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

const StyledFormField = ({
  control,
  name,
  label,
  placeholder,
  type = "text",
  ...rest
}) => {
  const { errors } = useFormState({ control, name });
  const fieldNameParts = name.split(".");
  const fieldError = fieldNameParts.reduce((acc, part) => acc?.[part], errors);
  const hasError = !!fieldError;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold text-slate-700">
            {label}
          </FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              {...field}
              {...rest}
              className={cn(
                "h-10",
                hasError ? "border-red-500" : "border-slate-300",
                "focus:ring-2 focus:ring-blue-300"
              )}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
export default StyledFormField;
