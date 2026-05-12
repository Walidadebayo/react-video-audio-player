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
    <div className="relative my-2 w-full max-w-full overflow-hidden rounded-lg bg-muted p-2">
      <div className="w-full min-w-0 overflow-x-auto rounded-lg pr-10">
        <SyntaxHighlighter
          key={mounted ? theme : "light"}
          showLineNumbers={showLineNumbers}
          language={language}
          style={theme === "dark" ? atomOneDark : vs}
          customStyle={{
            margin: 0,
            background: "transparent",
            minWidth: 0,
            width: "100%",
          }}
        >
          {children}
        </SyntaxHighlighter>
      </div>
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 rounded-md p-2 transition-colors hover:bg-background/70"
        aria-label="Copy code"
        type="button"
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
