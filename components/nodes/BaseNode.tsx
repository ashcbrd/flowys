"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface BaseNodeProps extends NodeProps {
  icon: ReactNode;
  color: string;
  hasInput?: boolean;
  hasOutput?: boolean;
}

export function BaseNode({
  data,
  selected,
  icon,
  color,
  hasInput = true,
  hasOutput = true,
}: BaseNodeProps) {
  return (
    <div
      className={cn(
        "min-w-[180px] rounded-lg border-2 bg-card shadow-md transition-all",
        selected ? "border-primary ring-2 ring-primary/20" : "border-border"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 rounded-t-md px-3 py-2 text-white",
          color
        )}
      >
        {icon}
        <span className="font-medium text-sm">{data.label as string}</span>
      </div>
      <div className="p-3 text-xs text-muted-foreground">
        {getNodeDescription(data.config as Record<string, unknown>)}
      </div>
      {hasInput && (
        <Handle
          type="target"
          position={Position.Left}
          className="!bg-primary !w-3 !h-3"
        />
      )}
      {hasOutput && (
        <Handle
          type="source"
          position={Position.Right}
          className="!bg-primary !w-3 !h-3"
        />
      )}
    </div>
  );
}

function getNodeDescription(config: Record<string, unknown>): string {
  if (config.provider && config.model) {
    return `${config.provider} / ${config.model}`;
  }
  if (config.url) {
    const url = config.url as string;
    try {
      return new URL(url).hostname;
    } catch {
      return url.slice(0, 30);
    }
  }
  if (config.operation) {
    return config.operation as string;
  }
  if (config.format) {
    return `Format: ${config.format}`;
  }
  if (config.fields && Array.isArray(config.fields)) {
    return `${config.fields.length} field(s)`;
  }
  // Integration node description
  if (config.integrationId && config.actionId) {
    return `${config.integrationName || config.integrationId}: ${config.actionName || config.actionId}`;
  }
  if (config.integrationId) {
    return config.integrationName as string || config.integrationId as string;
  }
  if (config.connectionId) {
    return config.connectionName as string || "Connected";
  }
  return "Click to configure";
}
