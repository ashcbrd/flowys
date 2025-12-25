"use client";

import { DragEvent, useState } from "react";
import {
  FileInput,
  Globe,
  Sparkles,
  GitBranch,
  FileOutput,
  Plug,
  Webhook,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface NodeType {
  type: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

const nodeTypes: NodeType[] = [
  {
    type: "input",
    label: "Input",
    description: "Start your workflow with user input",
    icon: <FileInput className="h-5 w-5" />,
    color: "bg-emerald-500",
    gradient: "from-emerald-400 to-emerald-600",
  },
  {
    type: "api",
    label: "API",
    description: "Fetch data from external services",
    icon: <Globe className="h-5 w-5" />,
    color: "bg-sky-500",
    gradient: "from-sky-400 to-sky-600",
  },
  {
    type: "ai",
    label: "AI",
    description: "Process with artificial intelligence",
    icon: <Sparkles className="h-5 w-5" />,
    color: "bg-violet-500",
    gradient: "from-violet-400 to-violet-600",
  },
  {
    type: "logic",
    label: "Logic",
    description: "Transform, filter, or route data",
    icon: <GitBranch className="h-5 w-5" />,
    color: "bg-amber-500",
    gradient: "from-amber-400 to-amber-600",
  },
  {
    type: "integration",
    label: "Apps",
    description: "Connect to Slack, GitHub, and more",
    icon: <Plug className="h-5 w-5" />,
    color: "bg-indigo-500",
    gradient: "from-indigo-400 to-indigo-600",
  },
  {
    type: "webhook",
    label: "Webhook",
    description: "Send data to external endpoints",
    icon: <Webhook className="h-5 w-5" />,
    color: "bg-cyan-500",
    gradient: "from-cyan-400 to-cyan-600",
  },
  {
    type: "output",
    label: "Output",
    description: "Return the final result",
    icon: <FileOutput className="h-5 w-5" />,
    color: "bg-rose-500",
    gradient: "from-rose-400 to-rose-600",
  },
];

export function NodeDock() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const onDragStart = (event: DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  // Calculate scale for dock magnification effect
  const getScale = (index: number) => {
    if (hoveredIndex === null) return 1;
    const distance = Math.abs(index - hoveredIndex);
    if (distance === 0) return 1.25;
    if (distance === 1) return 1.1;
    return 1;
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40">
        {/* Floating dock container */}
        <div
          className={cn(
            "flex items-end gap-1 px-3 py-2.5 rounded-2xl",
            // Glassmorphism effect
            "bg-white/70 dark:bg-gray-900/70",
            "backdrop-blur-xl backdrop-saturate-150",
            "border border-white/20 dark:border-white/10",
            "shadow-[0_8px_32px_rgba(0,0,0,0.12),0_0_0_1px_rgba(255,255,255,0.1)_inset]",
            "dark:shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.05)_inset]"
          )}
        >
          {nodeTypes.map((node, index) => (
            <Tooltip key={node.type}>
              <TooltipTrigger asChild>
                <div
                  draggable
                  onDragStart={(e) => onDragStart(e, node.type)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    transform: `scale(${getScale(index)})`,
                    transformOrigin: "bottom center",
                  }}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 p-2 rounded-xl cursor-grab",
                    "transition-all duration-200 ease-out",
                    "hover:bg-white/50 dark:hover:bg-white/10",
                    "active:cursor-grabbing active:scale-95",
                    "select-none"
                  )}
                >
                  {/* Icon container with gradient */}
                  <div
                    className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center text-white",
                      "bg-gradient-to-br shadow-lg",
                      "transition-shadow duration-200",
                      hoveredIndex === index && "shadow-xl",
                      node.gradient
                    )}
                  >
                    {node.icon}
                  </div>
                  {/* Label */}
                  <span
                    className={cn(
                      "text-[10px] font-medium text-foreground/70",
                      "transition-colors duration-200",
                      hoveredIndex === index && "text-foreground"
                    )}
                  >
                    {node.label}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                sideOffset={8}
                className="bg-background/95 backdrop-blur-sm"
              >
                <p className="font-medium">{node.label}</p>
                <p className="text-xs text-muted-foreground">{node.description}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Subtle reflection effect */}
        <div
          className={cn(
            "absolute -bottom-3 left-1/2 -translate-x-1/2 w-[80%] h-4",
            "bg-gradient-to-b from-black/5 to-transparent dark:from-white/5",
            "rounded-full blur-sm opacity-50"
          )}
        />
      </div>
    </TooltipProvider>
  );
}
