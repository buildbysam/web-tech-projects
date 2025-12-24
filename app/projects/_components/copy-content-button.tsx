"use client";

import Button from "@/components/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  content: string;
  className?: string;
}

export default function CopyContentButton({ content, className = "" }: Props) {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        setCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((error) => {
        if (error instanceof Error) {
          toast.error(error.message);
        }
        console.error(error);
      });
  };

  return (
    <Button onClick={handleClick} variant="outline" className={className}>
      {copied ? (
        <span className="text-green-500 flex-center">
          <Check className="size-4 mr-2" />
          Copied
        </span>
      ) : (
        <span className="flex-center">
          <Copy className="size-4 mr-2" />
          Copy
        </span>
      )}
    </Button>
  );
}
