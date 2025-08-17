// src/components/comments/Comment.js
import moment from "moment";
import "moment/locale/vi"; // Cho hiển thị "vài giây trước"
import CommentForm from "./CommentForm";
moment.locale("vi");
// Ảnh đại diện mặc định, bạn cần thay thế bằng đường dẫn đúng
import { DefaultUser } from "~/assets/images";

const ImageGallery = ({ images }) => {
  if (!images || images.length === 0) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {images.map((image, index) => {
        const imageUrl = typeof image === "string" ? image : image?.url;
        if (!imageUrl) return null;

        return (
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            key={typeof image === "object" ? image.public_id : imageUrl}
          >
            <img
              src={imageUrl}
              alt={`comment-img-${index}`}
              className="w-24 h-24 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
            />
          </a>
        );
      })}
    </div>
  );
};

function Comment({
  comment,
  replies,
  currentUserId,
  onDelete,
  handleSubmitComment,
  affectedComment,
  setAffectedComment,
  userAvatar,
}) {
  const isUserComment = comment.userId === currentUserId;
  const isReplying =
    affectedComment?.type === "REPLY" && affectedComment.id === comment.id;
  return (
    <div className="flex items-start space-x-3 mt-4">
      <img
        src={comment.avatarUrl || DefaultUser}
        alt={comment.username}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1">
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-sm text-gray-800">
              {comment.username}
            </span>
          </div>
          <div className="text-sm text-gray-700 mt-1">
            {comment.replyOnUser &&
              comment.replyOnUser !== comment.username && (
                <span className="inline-block text-blue-500 leading-[16px]">
                  @{comment?.username}
                </span>
              )}
            {comment.content}
            <ImageGallery images={comment.reviewImages} />
          </div>
        </div>
        <div className="flex items-center mt-1 space-x-4 text-xs text-gray-500 font-medium">
          <span>{moment(comment.reviewDate).add(7, "hours").fromNow()}</span>
          <button
            className="hover:underline"
            onClick={() =>
              setAffectedComment({ type: "REPLY", id: comment.id })
            }
          >
            Trả lời
          </button>
          {isUserComment && (
            <button
              className="hover:underline"
              onClick={() => onDelete({ commentId: comment.id })}
            >
              Xóa
            </button>
          )}
        </div>
        {isReplying && (
          <CommentForm
            submitLabel="Trả lời"
            userAvatar={userAvatar}
            onSubmit={(data) => {
              handleSubmitComment({
                ...data,
                parentId: comment.parentId ? comment.parentId : comment.id,
                replyOnUser: comment?.userId,
              });
            }}
            onCancel={() => setAffectedComment(null)}
          />
        )}
        {/* Render Replies Recursively */}
        <div className="space-y-4">
          {replies.map((reply) => (
            <Comment
              key={reply._id}
              comment={reply}
              replies={[]} // A reply doesn't have further nested replies in this model
              currentUserId={currentUserId}
              onDelete={onDelete}
              handleSubmitComment={handleSubmitComment}
              affectedComment={affectedComment}
              setAffectedComment={setAffectedComment}
              userAvatar={userAvatar}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Comment;
