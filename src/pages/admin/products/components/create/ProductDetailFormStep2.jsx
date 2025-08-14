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
import { PlusCircle, Trash2, Loader2 } from "lucide-react";
import ProductDetailFields from "./ProductDetailFields";
import { apiDeleteProductDetail } from "~/apis/productApi";
import { showToastError, showToastSuccess } from "~/utils/alert";
import { useSelector } from "react-redux";

const ProductDetailFormStep2 = ({ colorsOptions }) => {
  const { accessToken } = useSelector((state) => state.user);
  const { control } = useFormContext();
  const [deletingId, setDeletingId] = React.useState(null);
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
      images: [],
      id: -1,
      configRequest: {
        cpu: "Intel Core i5",
        madeIn: "Việt Nam",
        displaySize: "15.6 inch",
        graphicCard: "NVIDIA GeForce GTX 1650",
        ram: "8GB DDR4",
        ramValue: "8GB",
        weight: "1.5 kg",
        hardDrive: "512GB SSD",
        hardDriveValue: "512GB",
        nameConfig: "1080p Gaming",
      },
    });
  };
  const handleDelete = async (index, productDetailId) => {
    console.log("Deleting product detail with ID:", productDetailId);
    // Nếu ID âm (phiên bản mới chưa lưu), chỉ xóa khỏi form
    if (productDetailId < 0) {
      remove(index);
      return;
    }
    setDeletingId(productDetailId);
    try {
      const response = await apiDeleteProductDetail({
        accessToken,
        id: productDetailId,
      });
      if (response && response.code === 200) {
        remove(index);
        showToastSuccess("Xóa phiên bản thành công!");
      } else {
        throw new Error(response?.message || "Xóa không thành công từ API");
      }
    } catch (error) {
      showToastError(error.message || "Có lỗi xảy ra khi xóa phiên bản.");
    } finally {
      setDeletingId(null);
    }
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
            const productDetailId = watchedDetails[index]?.id;
            const isDeleting = deletingId === productDetailId;
            return (
              <AccordionItem
                value={field.id}
                key={field.id}
                className="border-b-0 mb-2 last:mb-0"
              >
                {/* STYLE MỚI: Thêm nền, bo tròn và bóng đổ cho mỗi item */}
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
                  {/* <div className="flex items-center justify-between w-full px-4 rounded-t-lg data-[state=open]:bg-slate-50"> */}
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
                          disabled={isDeleting}
                          className="text-red-500 hover:bg-red-50 hover:text-red-600 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(index, productDetailId);
                          }}
                        >
                          {/* ✅ HIỂN THỊ SPINNER KHI ĐANG XÓA */}
                          {isDeleting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
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
                  {/* </div> */}
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
