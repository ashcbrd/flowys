"use client";

import { type NodeProps } from "@xyflow/react";
import { Sparkles } from "lucide-react";
import { BaseNode } from "./BaseNode";

export function AiNode(props: NodeProps) {
  return (
    <BaseNode
      {...props}
      icon={<Sparkles className="h-4 w-4" />}
      color="bg-purple-600"
    />
  );
}
