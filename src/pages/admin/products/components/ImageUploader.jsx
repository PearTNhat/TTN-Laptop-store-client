import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { ImagePlus, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { showToastError } from "~/utils/alert";
import { apiGetImgString } from "~/apis/fileApi";

const ImageUploader = ({ value, onChange, maxFiles = 1, label, fieldId }) => {
  const { accessToken } = useSelector((state) => state.user);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);

  // Tạo unique ID cho mỗi ImageUploader instance
  const uniqueId =
    fieldId || `${label}-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    // Sync state từ react-hook-form với state nội bộ khi component mount
    if (value && value.length > 0) {
      const initialPreviews = (Array.isArray(value) ? value : [value]).map(
        (url) => ({
          id: url,
          status: "uploaded",
          previewUrl: url,
          serverUrl: url,
        })
      );
      setPreviews(initialPreviews);
    }
  }, [value]); // Chạy 1 lần duy nhất

  const getImageUrl = useCallback(
    async (file) => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await apiGetImgString({ accessToken, formData });
        if (response.code === 200) {
          return { success: true, url: response.data };
        } else {
          showToastError(response.message);
          return { success: false, error: response.message };
        }
      } catch (error) {
        const errorMessage =
          error.message || "An unknown error occurred during upload.";
        showToastError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [accessToken]
  );
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(
      0,
      maxFiles - previews.length
    );
    if (files.length === 0) return;

    const newUploads = files.map((file) => {
      const id = `${file.name}-${Date.now()}-${Math.random()}`;
      const previewUrl = URL.createObjectURL(file);
      return { id, status: "uploading", previewUrl, serverUrl: null, file };
    });

    // Thêm các uploads mới vào previews
    setPreviews((prev) => [...prev, ...newUploads]);

    // Upload từng file một cách bất đồng bộ
    newUploads.forEach(async (upload) => {
      try {
        const result = await getImageUrl(upload.file);

        setPreviews((prev) => {
          const updated = prev.map((p) => {
            if (p.id === upload.id) {
              return result.success
                ? { ...p, status: "uploaded", serverUrl: result.url }
                : { ...p, status: "error", error: result.error };
            }
            return p;
          });

          // Cập nhật form values sau khi upload xong
          const serverUrls = updated
            .filter((p) => p.status === "uploaded")
            .map((p) => p.serverUrl);
          onChange(maxFiles === 1 ? serverUrls[0] || "" : serverUrls);

          return updated;
        });
      } catch (error) {
        // Handle error cho từng file riêng biệt
        setPreviews((prev) => {
          const updated = prev.map((p) => {
            if (p.id === upload.id) {
              return { ...p, status: "error", error: error.message };
            }
            return p;
          });
          return updated;
        });
      }
    });

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const removeImage = (idToRemove) => {
    setPreviews((prev) => {
      const updated = prev.filter((p) => p.id !== idToRemove);
      const serverUrls = updated
        .filter((p) => p.status === "uploaded")
        .map((p) => p.serverUrl);
      onChange(maxFiles === 1 ? serverUrls[0] || "" : serverUrls);
      return updated;
    });
  };

  const retryUpload = async (imageId) => {
    const imageToRetry = previews.find((p) => p.id === imageId);
    if (!imageToRetry || !imageToRetry.file) return;

    // Đặt lại trạng thái uploading
    setPreviews((prev) =>
      prev.map((p) =>
        p.id === imageId ? { ...p, status: "uploading", error: null } : p
      )
    );

    try {
      const result = await getImageUrl(imageToRetry.file);

      setPreviews((prev) => {
        const updated = prev.map((p) => {
          if (p.id === imageId) {
            return result.success
              ? { ...p, status: "uploaded", serverUrl: result.url }
              : { ...p, status: "error", error: result.error };
          }
          return p;
        });

        // Cập nhật form values
        const serverUrls = updated
          .filter((p) => p.status === "uploaded")
          .map((p) => p.serverUrl);
        onChange(maxFiles === 1 ? serverUrls[0] || "" : serverUrls);

        return updated;
      });
    } catch (error) {
      setPreviews((prev) =>
        prev.map((p) =>
          p.id === imageId ? { ...p, status: "error", error: error.message } : p
        )
      );
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-slate-700">{label}</span>
        {previews.some((p) => p.status === "uploading") && (
          <div className="flex items-center gap-2 text-xs text-blue-600">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>
              Đang upload{" "}
              {previews.filter((p) => p.status === "uploading").length} ảnh...
            </span>
          </div>
        )}
      </div>
      <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {previews.map((image) => (
          <div key={image.id} className="relative aspect-square">
            <img
              src={image.previewUrl}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg border-2 border-slate-200"
            />
            {image.status === "uploading" && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
            {image.status === "error" && (
              <div className="absolute inset-0 bg-red-600/70 flex flex-col items-center justify-center rounded-lg">
                <AlertTriangle className="w-4 h-4 text-white mb-1" />
                <button
                  type="button"
                  onClick={() => retryUpload(image.id)}
                  className="text-white text-xs underline hover:no-underline"
                  title={image.error}
                >
                  Thử lại
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={() => removeImage(image.id)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 transition-transform hover:scale-110"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {previews.length < maxFiles && (
          <label
            htmlFor={uniqueId}
            className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-slate-50 transition-colors"
          >
            <ImagePlus className="w-8 h-8 text-slate-400" />
            <span className="mt-1 text-xs text-slate-500 text-center">
              Thêm ảnh
            </span>
            <input
              id={uniqueId}
              type="file"
              className="hidden"
              accept="image/*"
              multiple={maxFiles > 1}
              onChange={handleFileChange}
              ref={fileInputRef}
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
