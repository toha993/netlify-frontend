"use client";

import React from "react";

interface VoteButtonProps {
  onVote: () => void;
  disabled: boolean;
  existingVote: string | null;
}

const VoteButton: React.FC<VoteButtonProps> = ({
  onVote,
  disabled,
  existingVote,
}) => {
  return (
    <button
      onClick={onVote}
      disabled={disabled}
      className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-full text-lg font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 hover:bg-blue-600"
    >
      {existingVote ? "Update Vote" : "Submit Vote"}
    </button>
  );
};

export default VoteButton;
