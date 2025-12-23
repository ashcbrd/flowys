"use client";

import { type NodeProps } from "@xyflow/react";
import { FileOutput } from "lucide-react";
import { BaseNode } from "./BaseNode";

export function OutputNode(props: NodeProps) {
  return (
    <BaseNode
      {...props}
      icon={<FileOutput className="h-4 w-4" />}
      color="bg-red-600"
      hasOutput={false}
    />
  );
}
