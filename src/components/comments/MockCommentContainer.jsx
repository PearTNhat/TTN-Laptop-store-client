import { useState } from "react";
import VoteBar from "./VoteBar";
import Comment from "./Comment";
import YourRating from "./YourRating";
import Button from "../Button";
//https://randomuser.me/api/portraits/men/1.jpg
// Mock CommentContainer cho demo
function MockCommentContainer({ comments, totalRating }) {
  const [affectedComment, setAffectedComment] = useState(null);

  // Mock handlers
  const handleSubmitComment = ({ rating, content, parentId, replyOnUser }) => {
    console.log("Submit comment:", { rating, content, parentId, replyOnUser });
    setAffectedComment(null);
  };

  const handleUpdateComment = ({ commentId, content, rating }) => {
    console.log("Update comment:", { commentId, content, rating });
    setAffectedComment(null);
  };

  const handleDeleteComment = ({ commentId }) => {
    console.log("Delete comment:", { commentId });
  };

  const handleLikeComment = ({ commentId }) => {
    console.log("Like comment:", { commentId });
  };

  const handleShowModalUpdateRating = () => {
    console.log("Show update rating modal");
  };

  // Tìm comment của user hiện tại
  const rated = comments?.find(
    (comment) => comment._id === comments._id && comment?.rating > 0
  );

  return (
    <div className="space-y-8">
      {/* Vote Bar */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
        <VoteBar totalRating={totalRating} comments={comments} />
      </div>

      {/* Rating Section */}
      {/* <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        ⭐ Đánh giá của bạn
      </h3> */}
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
          💬 Tất cả bình luận ({comments?.length || 0})
        </h3>

        <div className="space-y-6">
          {comments?.map((comment) => (
            <div
              key={comment._id}
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
                handleLikeComment={handleLikeComment}
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

export default MockCommentContainer;
