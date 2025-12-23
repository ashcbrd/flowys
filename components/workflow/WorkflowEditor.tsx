"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { WorkflowCanvas } from "@/components/canvas/WorkflowCanvas";
import { Sidebar } from "@/components/panels/Sidebar";
import { ExecutionPanel } from "@/components/panels/ExecutionPanel";
import { Header } from "@/components/panels/Header";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { useWorkflowStore } from "@/store/workflow";
import { api } from "@/lib/api";

interface WorkflowEditorProps {
  workflowId?: string;
  versionId?: string;
}

export function WorkflowEditor({ workflowId, versionId }: WorkflowEditorProps) {
  const router = useRouter();
  const {
    loadWorkflow,
    currentWorkflowId,
    workflow,
    setNodes,
    setEdges,
    newWorkflow,
  } = useWorkflowStore();

  useEffect(() => {
    const loadFromUrl = async () => {
      if (workflowId) {
        try {
          if (versionId) {
            // Load a specific version
            const version = await api.workflows.versions.get(workflowId, versionId);
            if (version.nodes && version.edges) {
              setNodes(version.nodes as Parameters<typeof setNodes>[0]);
              setEdges(version.edges);
            }
            // Also load the workflow metadata
            await loadWorkflow(workflowId);
          } else {
            // Load the current workflow
            await loadWorkflow(workflowId);
          }
        } catch (error) {
          console.error("Failed to load workflow:", error);
          // Redirect to new workflow if not found
          router.replace("/workflow");
        }
      } else if (currentWorkflowId && !workflowId) {
        // If we have a stored workflow ID but no URL param, redirect to it
        router.replace(`/workflow/${currentWorkflowId}`);
      }
    };

    loadFromUrl();
  }, [workflowId, versionId, loadWorkflow, currentWorkflowId, router, setNodes, setEdges]);

  // Update URL when workflow is saved
  useEffect(() => {
    if (workflow?.id && !workflowId) {
      router.replace(`/workflow/${workflow.id}`);
    }
  }, [workflow?.id, workflowId, router]);

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 relative">
          <WorkflowCanvas />
        </main>
        <ExecutionPanel />
      </div>
      <ChatWidget />
    </div>
  );
}
