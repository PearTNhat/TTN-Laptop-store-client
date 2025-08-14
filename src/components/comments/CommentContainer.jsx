import { useCallback, useState } from "react";
import VoteBar from "./VoteBar";
import Comment from "./Comment";
import YourRating from "./YourRating";
import CommentForm from "./CommentForm";
import { DefaultUser } from "~/assets/images";
import { showToastError, showToastSuccess } from "~/utils/alert";
import { apiComment, apiReplyComment } from "~/apis/commentApi";
import { useSelector } from "react-redux";

function CommentContainer({
  productDetailId,
  comments,
  totalRating,
  setFetchCommentAgain,
}) {
  const [affectedComment, setAffectedComment] = useState(null);
  const { accessToken } = useSelector((state) => state.user);
  // Mock handlers
  const handleSubmitComment = useCallback(
    async ({ rating, content, parentId, replyOnUser, images }) => {
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
    [productDetailId, accessToken]
  );

  const handleUpdateComment = ({ commentId, content, rating }) => {
    console.log("Update comment:", { commentId, content, rating });
    setAffectedComment(null);
  };

  const handleDeleteComment = ({ commentId }) => {
    console.log("Delete comment:", { commentId });
  };

  const handleShowModalUpdateRating = () => {
    console.log("Show update rating modal");
  };
  const currentUserAvatar = "https://randomuser.me/api/portraits/men/1.jpg";
  // Tìm comment của user hiện tại
  const rated = comments?.find(
    (comment) => comment._id === comments._id && comment?.rating > 0
  );

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
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
        <VoteBar totalRating={totalRating} comments={comments} />
      </div>
      <div className="bg-white p-6 rounded-2xl border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Bình luận</h3>
        <CommentForm
          submitLabel="Gửi đánh giá"
          userAvatar={currentUserAvatar || DefaultUser}
          onSubmit={handleSubmitComment}
        />
      </div>
      {rated && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
          <YourRating
            comment={rated}
            handleShowModalUpdateRating={handleShowModalUpdateRating}
            handleDeleteComment={handleDeleteComment}
          />
        </div>
      )}

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
                userId={comment.userId}
                comment={comment}
                isAdmin={false}
                affectedComment={affectedComment}
                setAffectedComment={setAffectedComment}
                handleSubmitComment={handleSubmitComment}
                handleUpdateComment={handleUpdateComment}
                handleDeleteComment={handleDeleteComment}
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
