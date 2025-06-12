import React, { useState } from "react";

interface CommentBoxProps {
    onSubmit: (author: string, message: string) => void;
    currentUserName?: string;
    members: string[]; // รายชื่อสมาชิกในโปรเจค
}

export default function CommentBox({ onSubmit, currentUserName, members }: CommentBoxProps) {
    const [author, setAuthor] = useState(members.length > 0 ? members[0] : currentUserName || "");
    const [message, setMessage] = useState("");

    const handleSubmit = () => {
        if (!message.trim()) return;
        onSubmit(author || "Anonymous", message);
        setMessage("");
    };

    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">Add Comment</h3>
            <label className="block text-sm font-medium mb-2">Select Author</label>
            <select
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="border rounded-lg px-3 py-2 mb-4 w-full"
            >
                {members.map((member, index) => (
                    <option key={index} value={member} className="text-gray-700">
                        {member}
                    </option>
                ))}
                {!members.length && (
                    <option value={currentUserName || "Anonymous"} >
                        {currentUserName || "Anonymous"}
                    </option>
                )}
            </select>
            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your comment"
                className="border rounded-lg px-3 py-2 min-h-[100px] w-full"
            />
            <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full mt-2"
            >
                Submit Comment
            </button>
        </div>
    );
}