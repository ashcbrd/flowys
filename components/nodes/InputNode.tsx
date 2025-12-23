"use client";

import { type NodeProps } from "@xyflow/react";
import { FileInput } from "lucide-react";
import { BaseNode } from "./BaseNode";

export function InputNode(props: NodeProps) {
  return (
    <BaseNode
      {...props}
      icon={<FileInput className="h-4 w-4" />}
      color="bg-green-600"
      hasInput={false}
    />
  );
}
