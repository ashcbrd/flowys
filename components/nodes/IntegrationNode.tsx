"use client";

import { type NodeProps } from "@xyflow/react";
import { Plug } from "lucide-react";
import { BaseNode } from "./BaseNode";

export function IntegrationNode(props: NodeProps) {
  return (
    <BaseNode
      {...props}
      icon={<Plug className="h-4 w-4" />}
      color="bg-purple-600"
    />
  );
}
