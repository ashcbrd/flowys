"use client";

import { type NodeProps } from "@xyflow/react";
import { Globe } from "lucide-react";
import { BaseNode } from "./BaseNode";

export function ApiNode(props: NodeProps) {
  return (
    <BaseNode
      {...props}
      icon={<Globe className="h-4 w-4" />}
      color="bg-blue-600"
    />
  );
}
