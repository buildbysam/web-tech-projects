"use client";

import { TreeNode } from "@/lib/projects";
import { cx, getTechStyle } from "@/lib/utils";
import { ChevronDown, ChevronRight, File, Folder, FolderOpen } from "lucide-react";
import { useState } from "react";

interface Props {
  node: TreeNode;
  onFileSelect: (node: TreeNode, name: string) => void;
  activePath: string;
}

export default function FileNode({ node, onFileSelect, activePath }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const name = node.path.split(/[/\\]/).pop() || "";

  if (node.type === "dir") {
    return (
      <div className="select-none">
        <button onClick={() => setIsOpen(!isOpen)} className="file-tree-item w-full text-left pl-3 ml-2 mb-0.5">
          {isOpen ? (
            <>
              <ChevronDown className="size-4 text-muted-foreground" />
              <FolderOpen className="size-4 text-primary" />
            </>
          ) : (
            <>
              <ChevronRight className="size-4 text-muted-foreground" />
              <Folder className="size-4 text-primary" />
            </>
          )}
          <span className="truncate text-sm">{name}</span>
        </button>

        {isOpen && (
          <div className="ml-2 pl-3 mb-0.5">
            {node.children.map((child) => (
              <FileNode activePath={activePath} key={child.path} node={child} onFileSelect={onFileSelect} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={() => onFileSelect(node, name)}
      className={cx(
        "file-tree-item w-full text-left ml-2 pl-3 mb-0.5",
        activePath === node.path ? "file-tree-item-active" : ""
      )}
    >
      <File className={cx("size-4", node.extension ? getTechStyle(node.extension).text : "")} />
      <span className="truncate text-sm">{name}</span>
    </div>
  );
}
