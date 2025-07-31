export const mapProductToFormValues = (product) => {
    if (!product) return null;

    return {
        // Thông tin chung (Bước 1)
        description: product.description || "",
        brandId: product.brand?.id,
        categoryId: product.category?.id,
        seriesId: product.series?.id,

        // Chi tiết phiên bản (Bước 2)
        productDetailRequest: product.productDetails.map(detail => ({
            // Thêm `id` của productDetail để backend biết cần cập nhật record nào
            id: detail.id,
            title: detail.title || "",
            slug: detail.slug || "",
            colorId: detail.color?.id,
            originalPrice: detail.originalPrice || 0,
            discountPrice: detail.discountPrice || 0,
            warrantyProd: detail.warrantyProd || "",
            thumbnail: detail.thumbnail || "",
            images: detail.images || [],
            configRequest: {
                id: detail.config?.id, // Thêm id của config
                cpu: detail.config?.cpu || "",
                ram: detail.config?.ram || "",
                hardDrive: detail.config?.hardDrive || "",
                graphicCard: detail.config?.graphicCard || "",
                displaySize: detail.config?.displaySize || "",
                weight: detail.config?.weight || "",
                madeIn: detail.config?.madeIn || "",
                ramValue: detail.config?.ramValue || "",
                hardDriveValue: detail.config?.hardDriveValue || "",
                nameConfig: detail.config?.nameConfig || "",
            },
        })),
    };
};