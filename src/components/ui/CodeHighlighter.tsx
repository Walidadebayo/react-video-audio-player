"use client";

import copy from "copy-to-clipboard";
import { useTheme } from "next-themes";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark, vs } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { ClipboardCheck, ClipboardCopy } from "lucide-react";
import { useState } from "react";
import useMounted from "@/hooks/useMounted";

interface CodeHighlighterProps {
  children: string;
  showLineNumbers?: boolean;
  language?: string;
}

export default function CodeHighlighter({
  children,
  showLineNumbers = true,
  language = "typescript",
}: CodeHighlighterProps) {
  const { theme } = useTheme();
  const [isCopied, setIsCopied] = useState(false);
  const mounted = useMounted();

  const handleCopy = () => {
    copy(children);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="w-full p-2 bg-muted rounded-lg flex items-center gap-1 my-2">
      <div className="w-full overflow-x-auto rounded-lg">
        <SyntaxHighlighter
          key={mounted ? theme : "light"}
          showLineNumbers={showLineNumbers}
          language={language}
          style={theme === "dark" ? atomOneDark : vs}
        >
          {children}
        </SyntaxHighlighter>
      </div>
      <button onClick={handleCopy} className="p-2">
        {isCopied ? (
          <ClipboardCheck className="h-6 w-6 text-green-500" />
        ) : (
          <ClipboardCopy className="h-6 w-6" />
        )}
      </button>
    </div>
  );
}
