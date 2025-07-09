// This file simulates a database of users and comments.

// A mock "logged in" user. We use this ID to check for ownership of comments.
export const mockCurrentUser = {
    _id: "user-current",
    firstName: "John",
    lastName: "Doe",
    isAdmin: false,
    avatar: { url: "https://i.pravatar.cc/150?u=johndoe" },
};

// A list of other users who might comment.
const mockOtherUsers = [
    {
        _id: "user-1",
        firstName: "Alice",
        lastName: "Smith",
        avatar: { url: "https://i.pravatar.cc/150?u=alice" },
    },
    {
        _id: "user-2",
        firstName: "Bob",
        lastName: "Johnson",
        avatar: { url: "https://i.pravatar.cc/150?u=bob" },
    },
    {
        _id: "user-3",
        firstName: "Charlie",
        lastName: "Brown",
        avatar: { url: "https://i.pravatar.cc/150?u=charlie" },
    },
];


// The main list of comments, including nested replies.
export const mockComments = [
    {
        _id: "comment-1",
        user: mockOtherUsers[0], // Alice
        content: "This product is amazing! Highly recommended.",
        rating: 5,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        likes: ["user-2", "user-3"],
        replies: [
            {
                _id: "reply-1-1",
                user: mockOtherUsers[1], // Bob
                content: "I agree, the quality is top-notch.",
                createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
                likes: ["user-current"],
                replies: [],
                replyOnUser: mockOtherUsers[0], // Replying to Alice
            },
            {
                _id: "reply-1-2",
                user: mockCurrentUser, // You
                content: "Just bought it based on your review!",
                createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
                likes: [],
                replies: [],
                replyOnUser: mockOtherUsers[0], // Replying to Alice
            },
        ],
    },
    {
        _id: "comment-2",
        user: mockOtherUsers[2], // Charlie
        content: "It's okay, but I've seen better. The battery life could be improved.",
        rating: 3,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        likes: [],
        replies: [],
    },
];