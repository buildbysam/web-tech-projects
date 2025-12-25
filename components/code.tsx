"use client";

import { firacode } from "@/lib/fonts";
import { useTheme } from "next-themes";
import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark, atomOneLight } from "react-syntax-highlighter/dist/esm/styles/hljs";

interface Props {
  language: string;
  className?: string;
  children: React.ReactNode;
}

export default function Code({ language, className = "", children }: Props) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const codeString = React.Children.toArray(children).join("");

  const customStyle = {
    margin: 0,
    paddingLeft: 0,
    paddingRight: 0,
    background: "transparent",
  };

  const lineNumberStyle = {
    minWidth: "3.2em",
    paddingRight: "0.7em",
    paddingLeft: "0.7em",
    marginRight: "1em",
    color: isDark ? "#6b7280" : "#9ca3af",
    textAlign: "right" as const,
    background: isDark ? "#2125304d" : "#f3f4f64d",
    userSelect: "none" as const,
    borderRight: isDark ? "1px solid #2A2F3C" : "1px solid #E5E7EB",
  };

  return (
    <SyntaxHighlighter
      language={language}
      customStyle={customStyle}
      style={isDark ? atomOneDark : atomOneLight}
      PreTag="div"
      showLineNumbers
      lineNumberStyle={lineNumberStyle}
      className={`text-sm overflow-scroll styled-scrollbar-sm ${firacode.className} ${className}`}
    >
      {codeString}
    </SyntaxHighlighter>
  );
}
