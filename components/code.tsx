"use client";

import { firacode } from "@/lib/fonts";
import { useTheme } from "next-themes";
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
  const customStyle = {
    margin: 0,
    paddingLeft: 0,
    paddingRight: 0,
    background: "transparent",
  };

  return (
    <SyntaxHighlighter
      language={language}
      customStyle={customStyle}
      style={isDark ? atomOneDark : atomOneLight}
      PreTag="div"
      showLineNumbers
      lineNumberStyle={{
        minWidth: "3.2em",
        paddingRight: "0.7em",
        paddingLeft: "0.7em",
        marginRight: "1em",
        color: isDark ? "#6b7280" : "#9ca3af",
        textAlign: "right",
        background: isDark ? "#2125304d" : "#f3f4f64d",
        userSelect: "none",
        borderRight: isDark ? "1px solid #2A2F3C" : "1px solid #E5E7EB",
      }}
      className={`text-sm overflow-auto ${firacode.className} ${className}`}
    >
      {children}
    </SyntaxHighlighter>
  );
}
