"use client";

import { ClipboardCheck, ClipboardCopy } from "lucide-react";
import { useState } from "react";
import copy from 'copy-to-clipboard';

const Clipboard = ({ text = "npm install react-video-audio-player" }: { text?: string }) => {

  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    copy(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="w-full p-2 bg-muted rounded-lg flex items-center gap-1">
      <pre className="overflow-x-auto p-4 bg-black rounded-lg w-full">
        <code className="text-white text-sm">{text}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="p-2"
      >
        {isCopied ? (
            <ClipboardCheck className="h-6 w-6 text-green-500" />
        ) : (
            <ClipboardCopy className="h-6 w-6" />
        )}
      </button>
    </div>
  );
}

export default Clipboard;
