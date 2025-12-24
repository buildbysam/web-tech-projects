"use client";

import Code from "@/components/code";
import { TreeNode } from "@/lib/projects";
import { cx, getFullTechName, getTechStyle, isImageFile } from "@/lib/utils";
import { File, FileCode2 } from "lucide-react";
import { useState } from "react";
import FileNode from "./file-node";
import CopyContentButton from "../../_components/copy-content-button";

export default function FileExplorer({ treeData }: { treeData: TreeNode[] }) {
  const [selectedFile, setSelectedFile] = useState<(TreeNode & { name: string }) | null>(null);

  return (
    <div className="w-full card overflow-hidden">
      <div className="flex flex-col lg:flex-row min-h-125 max-h-210">
        <div className="bg-file-tree w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-border overflow-auto">
          <div className="px-4 h-12 flex items-center border-b border-border">
            <span className="text-sm font-medium">Files</span>
          </div>
          <div className="py-3 pr-4">
            {treeData.map((node) => (
              <FileNode
                activePath={selectedFile?.path || ""}
                key={node.path}
                node={node}
                onFileSelect={(node, name) => setSelectedFile({ ...node, name })}
              />
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {selectedFile ? (
            <div className="h-full flex flex-col">
              <div className="flex-between px-4 h-12 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2 overflow-hidden">
                  <File
                    className={cx("size-4", selectedFile.extension ? getTechStyle(selectedFile.extension).text : "")}
                  />
                  <span className="text-sm font-medium truncate tracking-tight text-foreground/80">
                    {selectedFile.name || selectedFile.path}
                  </span>
                </div>
                {!isImageFile(selectedFile.extension?.toLowerCase() || "") ? (
                  <CopyContentButton content={selectedFile.content || ""} className="border-0 bg-transparent" />
                ) : null}
              </div>
              <div className="flex-1 overflow-auto styled-scrollbar-sm">
                {isImageFile(selectedFile.extension?.toLowerCase() || "") ? (
                  <div className="flex-center h-full p-6">
                    <img
                      src={selectedFile.content}
                      alt={selectedFile.name}
                      className="size-full rounded-lg shadow-md object-contain"
                    />
                  </div>
                ) : (
                  <Code language={getFullTechName(selectedFile.extension || "txt")}>{selectedFile.content || ""}</Code>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground/80 space-y-3">
              <div className="p-4 rounded-full bg-muted/30 border border-dashed border-border">
                <FileCode2 className="size-10 opacity-60" />
              </div>
              <div className="text-center">
                <p className="font-medium mb-2 text-foreground/70">No file selected</p>
                <p className="text-sm">Choose a file from the tree to view its source code</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
