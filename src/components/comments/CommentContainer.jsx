import { useCallback, useState } from "react";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import { DefaultUser } from "~/assets/images";
import { showToastError, showToastSuccess } from "~/utils/alert";
import {
  apiComment,
  apiReplyComment,
  apiDeleteComment,
} from "~/apis/commentApi";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

function CommentContainer({ productDetailId, comments, setFetchCommentAgain }) {
  const [affectedComment, setAffectedComment] = useState(null);
  const { accessToken, userData } = useSelector((state) => state.user);
  // Mock handlers
  const handleSubmitComment = useCallback(
    async ({ rating, content, parentId, replyOnUser, images }) => {
      if (!accessToken) {
        Swal.fire({
          title: "Bạn cần đăng nhập để bình luận",
          icon: "warning",
          confirmButtonText: "Đăng nhập",
          showCancelButton: true,
          cancelButtonText: "Hủy",
        }).then((result) => {
          if (result.isConfirmed) {
            // Redirect to login page
            window.location.href = "/login";
          }
        });
        return;
      }
      if (!parentId) {
        // Kiểm tra nội dung bình luận
        try {
          const res = await apiComment({
            accessToken,
            body: {
              productDetailId,
              content,
              rating,
              reviewImage: images,
            },
          });
          if (res.code === 200) {
            setFetchCommentAgain((prev) => !prev);
            showToastSuccess("Bình luận đã được gửi thành công!");
          } else {
            showToastError(res.message);
          }
        } catch (error) {
          const errorMessage =
            error.message || "An unknown error occurred during upload.";
          showToastError(errorMessage); // Uncomment if 'showToastError' is defined
        }
      } else {
        try {
          const res = await apiReplyComment({
            accessToken,
            body: {
              productDetailId,
              parentId,
              replyToUserid: replyOnUser,
              content,
              reviewImage: images,
            },
          });
          if (res.code === 200) {
            setFetchCommentAgain((prev) => !prev);
          } else {
            showToastError(res.message);
          }
        } catch (error) {
          const errorMessage =
            error.message || "An unknown error occurred during upload.";
          showToastError(errorMessage); // Uncomment if 'showToastError' is defined
        }
        setAffectedComment(null);
      }
    },
    [productDetailId, accessToken, setFetchCommentAgain]
  );

  const handleDeleteComment = useCallback(
    async ({ commentId }) => {
      try {
        // Hiển thị confirm dialog trước khi xóa
        const r = await Swal.fire({
          title: "Xóa bình luận",
          text: "Bạn có chắc chắn muốn xóa bình luận này không?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Xóa",
          cancelButtonText: "Hủy",
        });
        if (r.isConfirmed) {
          const res = await apiDeleteComment({
            accessToken,
            commentId,
          });
          if (res.code === 200) {
            setFetchCommentAgain((prev) => !prev);
            showToastSuccess("Xóa bình luận thành công!");
          } else {
            showToastError(res.message || "Có lỗi xảy ra khi xóa bình luận");
          }
        }
      } catch (error) {
        const errorMessage = error.message || "Có lỗi xảy ra khi xóa bình luận";
        showToastError(errorMessage);
      }
    },
    [accessToken, setFetchCommentAgain]
  );
  // Tìm comment của user hiện tại
  return (
    <div
      className="space-y-8 max-h-[1000px] 
      overflow-y-auto
      scrollbar-thin 
      scrollbar-thumb-gray-300
      hover:scrollbar-thumb-gray-400
      scrollbar-track-transparent
        "
    >
      {/* Vote Bar */}
      <div className="bg-white p-6 rounded-2xl border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Bình luận</h3>
        <CommentForm
          submitLabel="Gửi đánh giá"
          userAvatar={userData.avatar || DefaultUser}
          onSubmit={handleSubmitComment}
        />
      </div>

      {/* Comments List */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
          💬 Tất cả bình luận
        </h3>

        <div className="space-y-6">
          {comments?.map((comment) => (
            <div
              key={comment.id}
              className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0"
            >
              <Comment
                comment={comment}
                currentUserId={userData?.id}
                isAdmin={false}
                affectedComment={affectedComment}
                setAffectedComment={setAffectedComment}
                handleSubmitComment={handleSubmitComment}
                onDelete={handleDeleteComment}
                replies={comment.childReviewResponses || []}
              />
            </div>
          ))}
        </div>

        {(!comments || comments.length === 0) && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-lg">Chưa có bình luận nào</p>
            <p className="text-sm mt-2">
              Hãy là người đầu tiên chia sẻ trải nghiệm!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentContainer;
