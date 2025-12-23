"use client";

import { type NodeProps } from "@xyflow/react";
import { GitBranch } from "lucide-react";
import { BaseNode } from "./BaseNode";

export function LogicNode(props: NodeProps) {
  return (
    <BaseNode
      {...props}
      icon={<GitBranch className="h-4 w-4" />}
      color="bg-orange-600"
    />
  );
}
