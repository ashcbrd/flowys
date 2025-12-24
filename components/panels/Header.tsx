"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Play,
  Save,
  Trash2,
  Settings,
  Undo2,
  Redo2,
  FilePlus,
  History,
  Menu,
  BookOpen,
  FolderOpen,
  Clock,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useWorkflowStore, type WorkflowStatus } from "@/store/workflow";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { WorkflowsDialog } from "./WorkflowsDialog";
import { IntegrationsPanel } from "./IntegrationsPanel";
import { VersionsModal } from "./VersionsModal";
import { ExecutionHistory } from "./ExecutionHistory";
import { SchedulesPanel } from "./SchedulesPanel";

export function Header() {
  const router = useRouter();
  const {
    workflow,
    currentWorkflowId,
    workflowStatus,
    isExecuting,
    executeWorkflow,
    saveWorkflow,
    loadWorkflow,
    clearCanvas,
    newWorkflow,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useWorkflowStore();
  const { toast } = useToast();

  const getStatusBadge = (status: WorkflowStatus) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="secondary" className="text-xs">
            Draft
          </Badge>
        );
      case "saved":
        return (
          <Badge variant="outline" className="text-xs text-green-600 border-green-600">
            Saved
          </Badge>
        );
      case "modified":
        return (
          <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-600">
            Modified
          </Badge>
        );
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [runDialogOpen, setRunDialogOpen] = useState(false);
  const [integrationsOpen, setIntegrationsOpen] = useState(false);
  const [workflowsOpen, setWorkflowsOpen] = useState(false);
  const [versionsOpen, setVersionsOpen] = useState(false);
  const [executionHistoryOpen, setExecutionHistoryOpen] = useState(false);
  const [schedulesOpen, setSchedulesOpen] = useState(false);
  const [workflowName, setWorkflowName] = useState(workflow?.name || "");
  const [runInput, setRunInput] = useState("{}");

  const handleSave = async () => {
    if (!workflowName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a workflow name",
        variant: "destructive",
      });
      return;
    }

    try {
      await saveWorkflow(workflowName);
      setSaveDialogOpen(false);
      // Navigate to the workflow URL after saving
      const savedWorkflowId = useWorkflowStore.getState().currentWorkflowId;
      if (savedWorkflowId) {
        router.push(`/workflow/${savedWorkflowId}`);
      }
      toast({
        title: "Success",
        description: "Workflow saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save workflow",
        variant: "destructive",
      });
    }
  };

  const handleRun = async () => {
    try {
      const input = JSON.parse(runInput);
      setRunDialogOpen(false);
      await executeWorkflow(input);
      toast({
        title: "Success",
        description: "Workflow executed successfully",
      });
    } catch (error) {
      if (error instanceof SyntaxError) {
        toast({
          title: "Error",
          description: "Invalid JSON input",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to execute workflow",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <header className="h-14 border-b bg-card flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-primary">Flowys</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {workflow?.name || "Untitled Workflow"}
            </span>
            {getStatusBadge(workflowStatus)}
            {workflow?.updatedAt && (
              <span className="text-xs text-muted-foreground/70" title={new Date(workflow.updatedAt).toLocaleString()}>
                · Modified {formatRelativeTime(workflow.updatedAt)}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Undo/Redo buttons */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={undo}
              disabled={!canUndo()}
              title="Undo"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={redo}
              disabled={!canRedo()}
              title="Redo"
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={clearCanvas}
            title="Clear Canvas"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear
          </Button>

          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Workflow</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <Input
                  placeholder="Workflow name"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setSaveDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Version History - Only show when workflow is saved */}
          {currentWorkflowId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setVersionsOpen(true)}
              title="Version History"
            >
              <History className="h-4 w-4 mr-1" />
              Versions
            </Button>
          )}

          {/* Execution History - Only show when workflow is saved */}
          {currentWorkflowId && (
            <Button
              variant={executionHistoryOpen ? "default" : "outline"}
              size="sm"
              onClick={() => setExecutionHistoryOpen(!executionHistoryOpen)}
              title="Execution History"
            >
              <Clock className="h-4 w-4 mr-1" />
              Executions
            </Button>
          )}

          <Dialog open={runDialogOpen} onOpenChange={setRunDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" disabled={isExecuting}>
                <Play className="h-4 w-4 mr-1" />
                {isExecuting ? "Running..." : "Run"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Run Workflow</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <label className="text-sm font-medium mb-2 block">
                  Input (JSON)
                </label>
                <textarea
                  className="w-full h-32 p-2 border rounded-md font-mono text-sm bg-background"
                  value={runInput}
                  onChange={(e) => setRunInput(e.target.value)}
                  placeholder='{"text": "Hello, world!"}'
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setRunDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleRun} disabled={isExecuting}>
                  {isExecuting ? "Running..." : "Execute"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Hamburger menu for additional options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => { newWorkflow(); router.replace("/workflow"); }}>
                <FilePlus className="h-4 w-4" />
                New Workflow
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setWorkflowsOpen(true)}>
                <FolderOpen className="h-4 w-4" />
                Workflows
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSchedulesOpen(true)}>
                <Calendar className="h-4 w-4" />
                Scheduled Runs
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIntegrationsOpen(true)}>
                <Settings className="h-4 w-4" />
                Integrations
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link href="/docs" target="_blank">
                <DropdownMenuItem>
                  <BookOpen className="h-4 w-4" />
                  Documentation
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Execution History - Collapsible section below header */}
      {currentWorkflowId && executionHistoryOpen && (
        <div className="border-b bg-card px-4 py-3">
          <ExecutionHistory
            workflowId={currentWorkflowId}
            defaultExpanded={true}
            maxItems={10}
          />
        </div>
      )}
      </div>

      {/* Workflows Dialog */}
      <WorkflowsDialog open={workflowsOpen} onOpenChange={setWorkflowsOpen} />

      {/* Integrations Panel */}
      <IntegrationsPanel
        open={integrationsOpen}
        onOpenChange={setIntegrationsOpen}
      />

      {/* Version History Modal */}
      {currentWorkflowId && (
        <VersionsModal
          open={versionsOpen}
          onOpenChange={setVersionsOpen}
          workflowId={currentWorkflowId}
          workflowName={workflow?.name || ""}
          onVersionRestored={() => loadWorkflow(currentWorkflowId)}
        />
      )}

      {/* Schedules Panel */}
      <SchedulesPanel
        open={schedulesOpen}
        onOpenChange={setSchedulesOpen}
        workflowId={currentWorkflowId || undefined}
        workflowName={workflow?.name}
      />
    </>
  );
}
