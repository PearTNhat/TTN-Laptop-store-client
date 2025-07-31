// src/pages/ProductManagement/components/ProductDetailFormStep2.jsx

import React from "react";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import ProductDetailFields from "./ProductDetailFields";

const ProductDetailFormStep2 = ({ colorsOptions }) => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "productDetailRequest",
  });

  const watchedDetails = useWatch({
    name: "productDetailRequest",
    control,
  });

  const addNewVersion = () => {
    append({
      title: "",
      colorId: undefined,
      originalPrice: 0,
      slug: "",
      thumbnail: "",
      images: [""],
      configRequest: {
        cpu: "",
        ram: "",
        hardDrive: "",
        graphicCard: "",
        displaySize: "",
      },
    });
  };
  return (
    <div className="space-y-4">
      <div className="bg-slate-50 p-4 rounded-lg border">
        <Accordion
          type="multiple"
          defaultValue={[fields[0]?.id]}
          className="w-full"
        >
          {fields.map((field, index) => {
            const title =
              watchedDetails[index]?.title || `Phiên bản mới ${index + 1}`;
            return (
              <AccordionItem
                value={field.id}
                key={field.id}
                className="border-b-0 mb-2 last:mb-0"
              >
                {/* STYLE MỚI: Thêm nền, bo tròn và bóng đổ cho mỗi item */}
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
                  <AccordionTrigger className="px-4 hover:no-underline rounded-t-lg data-[state=open]:bg-slate-50">
                    <div className="flex justify-between items-center w-full">
                      <span className="font-semibold text-blue-600">
                        {`Phiên bản ${index + 1}: ${title}`}
                      </span>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:bg-red-50 hover:text-red-600 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            remove(index);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-6 border-t bg-white rounded-b-lg">
                    <ProductDetailFields
                      index={index}
                      colorsOptions={colorsOptions}
                    />
                  </AccordionContent>
                </div>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={addNewVersion}
        className="w-full border-dashed h-12 text-slate-600 hover:text-blue-600 hover:border-blue-500"
      >
        <PlusCircle className="mr-2 h-5 w-5" />
        Thêm phiên bản khác
      </Button>
    </div>
  );
};

export default ProductDetailFormStep2;
