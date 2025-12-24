import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Node, Edge, Connection, NodeChange, EdgeChange } from "@xyflow/react";
import { applyNodeChanges, applyEdgeChanges, addEdge } from "@xyflow/react";
import { api, type Workflow, type Execution, type ExecutionLog } from "@/lib/api";

export type NodeType = "input" | "api" | "ai" | "logic" | "output" | "webhook";

export interface WorkflowNode extends Node {
  type: NodeType;
  data: {
    label: string;
    config: Record<string, unknown>;
  };
}

export interface GeneratedNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: {
    label: string;
    config: Record<string, unknown>;
  };
}

export interface GeneratedEdge {
  id: string;
  source: string;
  target: string;
}

export interface GeneratedWorkflow {
  nodes: GeneratedNode[];
  edges: GeneratedEdge[];
}

export type WorkflowStatus = "draft" | "saved" | "modified";

interface DraftWorkflow {
  nodes: WorkflowNode[];
  edges: Edge[];
  name?: string;
  lastModified: string;
}

interface HistoryState {
  nodes: WorkflowNode[];
  edges: Edge[];
}

interface WorkflowState {
  nodes: WorkflowNode[];
  edges: Edge[];
  selectedNode: WorkflowNode | null;
  workflow: Workflow | null;
  currentWorkflowId: string | null;
  workflowStatus: WorkflowStatus;
  isExecuting: boolean;
  executionLogs: ExecutionLog[];
  lastExecution: Execution | null;
  isHydrated: boolean;

  // Draft support
  draftWorkflow: DraftWorkflow | null;

  // History for undo/redo
  history: HistoryState[];
  historyIndex: number;
  maxHistorySize: number;

  setNodes: (nodes: WorkflowNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (type: NodeType, position: { x: number; y: number }) => void;
  updateNodeConfig: (nodeId: string, config: Record<string, unknown>) => void;
  updateNodeLabel: (nodeId: string, label: string) => void;
  deleteNode: (nodeId: string) => void;
  selectNode: (node: WorkflowNode | null) => void;
  loadWorkflow: (id: string) => Promise<void>;
  saveWorkflow: (name: string, description?: string) => Promise<void>;
  executeWorkflow: (input?: Record<string, unknown>) => Promise<void>;
  clearCanvas: () => void;
  newWorkflow: () => void;
  createWorkflow: (workflow: GeneratedWorkflow) => void;
  hydrateFromStorage: () => Promise<void>;
  saveDraft: () => void;
  loadDraft: () => boolean;
  clearDraft: () => void;
  hasDraft: () => boolean;
  getWorkflowStatus: () => WorkflowStatus;

  // Undo/Redo
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

const generateId = () => `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const defaultConfigs: Record<NodeType, Record<string, unknown>> = {
  input: {
    fields: [
      { name: "text", type: "string", required: true },
    ],
  },
  api: {
    url: "",
    method: "GET",
    headers: {},
  },
  ai: {
    provider: "openai",
    model: "gpt-4o-mini",
    systemPrompt: "You are a helpful assistant. Provide concise, accurate responses.",
    userPromptTemplate: "{{text}}",
    temperature: 0.7,
    maxTokens: 4096,
    outputSchema: {
      type: "object",
      properties: {
        response: { type: "string", description: "The AI response" },
      },
      required: ["response"],
    },
  },
  logic: {
    operation: "passthrough",
  },
  output: {
    format: "json",
  },
  webhook: {
    url: "",
    method: "POST",
    headers: {},
    timeout: 30000,
    continueOnError: false,
  },
};

const nodeLabels: Record<NodeType, string> = {
  input: "Input",
  api: "API Fetch",
  ai: "AI / LLM",
  logic: "Logic",
  output: "Output",
  webhook: "Webhook",
};

export const useWorkflowStore = create<WorkflowState>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      selectedNode: null,
      workflow: null,
      currentWorkflowId: null,
      workflowStatus: "draft" as WorkflowStatus,
      isExecuting: false,
      executionLogs: [],
      lastExecution: null,
      isHydrated: false,

      // Draft support
      draftWorkflow: null,

      // History state
      history: [],
      historyIndex: -1,
      maxHistorySize: 50,

      setNodes: (nodes) => set({ nodes }),
      setEdges: (edges) => set({ edges }),

      pushHistory: () => {
        const { nodes, edges, history, historyIndex, maxHistorySize } = get();
        // Slice history to current index (discard any redo states)
        const newHistory = history.slice(0, historyIndex + 1);
        // Add current state
        newHistory.push({
          nodes: JSON.parse(JSON.stringify(nodes)),
          edges: JSON.parse(JSON.stringify(edges)),
        });
        // Limit history size
        if (newHistory.length > maxHistorySize) {
          newHistory.shift();
        }
        set({
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      undo: () => {
        const { history, historyIndex, nodes, edges } = get();
        if (historyIndex < 0) return;

        // If at the end, save current state first
        if (historyIndex === history.length - 1) {
          const newHistory = [...history];
          newHistory.push({
            nodes: JSON.parse(JSON.stringify(nodes)),
            edges: JSON.parse(JSON.stringify(edges)),
          });
          set({ history: newHistory });
        }

        const prevState = history[historyIndex];
        if (prevState) {
          set({
            nodes: prevState.nodes,
            edges: prevState.edges,
            historyIndex: historyIndex - 1,
            selectedNode: null,
          });
        }
      },

      redo: () => {
        const { history, historyIndex } = get();
        const nextIndex = historyIndex + 2;
        if (nextIndex >= history.length) return;

        const nextState = history[nextIndex];
        if (nextState) {
          set({
            nodes: nextState.nodes,
            edges: nextState.edges,
            historyIndex: historyIndex + 1,
            selectedNode: null,
          });
        }
      },

      canUndo: () => {
        const { historyIndex } = get();
        return historyIndex >= 0;
      },

      canRedo: () => {
        const { history, historyIndex } = get();
        return historyIndex + 2 < history.length;
      },

      onNodesChange: (changes) => {
        // Check if this is a structural change (not just position/selection)
        const isStructuralChange = changes.some(
          (c) => c.type === "remove" || c.type === "add"
        );
        if (isStructuralChange) {
          get().pushHistory();
        }
        const newNodes = applyNodeChanges(changes, get().nodes) as WorkflowNode[];
        const { workflow, workflowStatus } = get();
        set({
          nodes: newNodes,
          workflowStatus: workflow ? "modified" : workflowStatus,
        });
        // Auto-save draft on structural changes
        if (isStructuralChange) {
          get().saveDraft();
        }
      },

      onEdgesChange: (changes) => {
        const isStructuralChange = changes.some(
          (c) => c.type === "remove" || c.type === "add"
        );
        if (isStructuralChange) {
          get().pushHistory();
        }
        const newEdges = applyEdgeChanges(changes, get().edges);
        const { workflow, workflowStatus } = get();
        set({
          edges: newEdges,
          workflowStatus: workflow ? "modified" : workflowStatus,
        });
        // Auto-save draft on structural changes
        if (isStructuralChange) {
          get().saveDraft();
        }
      },

      onConnect: (connection) => {
        get().pushHistory();
        const { workflow, workflowStatus } = get();
        set({
          edges: addEdge(
            { ...connection, id: `edge_${Date.now()}` },
            get().edges
          ),
          workflowStatus: workflow ? "modified" : workflowStatus,
        });
        get().saveDraft();
      },

      addNode: (type, position) => {
        get().pushHistory();
        const id = generateId();
        const newNode: WorkflowNode = {
          id,
          type,
          position,
          data: {
            label: nodeLabels[type],
            config: { ...defaultConfigs[type] },
          },
        };
        const { workflow, workflowStatus } = get();
        set({
          nodes: [...get().nodes, newNode],
          workflowStatus: workflow ? "modified" : workflowStatus,
        });
        get().saveDraft();
      },

      updateNodeConfig: (nodeId, config) => {
        set({
          nodes: get().nodes.map((node) =>
            node.id === nodeId
              ? { ...node, data: { ...node.data, config } }
              : node
          ),
        });

        const selectedNode = get().selectedNode;
        if (selectedNode?.id === nodeId) {
          set({
            selectedNode: {
              ...selectedNode,
              data: { ...selectedNode.data, config },
            },
          });
        }
      },

      updateNodeLabel: (nodeId, label) => {
        set({
          nodes: get().nodes.map((node) =>
            node.id === nodeId
              ? { ...node, data: { ...node.data, label } }
              : node
          ),
        });
      },

      deleteNode: (nodeId) => {
        get().pushHistory();
        set({
          nodes: get().nodes.filter((node) => node.id !== nodeId),
          edges: get().edges.filter(
            (edge) => edge.source !== nodeId && edge.target !== nodeId
          ),
          selectedNode:
            get().selectedNode?.id === nodeId ? null : get().selectedNode,
        });
      },

      selectNode: (node) => set({ selectedNode: node }),

      loadWorkflow: async (id) => {
        const workflow = await api.workflows.get(id);
        set({
          workflow,
          currentWorkflowId: workflow.id,
          nodes: workflow.nodes as WorkflowNode[],
          edges: workflow.edges,
          selectedNode: null,
          workflowStatus: "saved",
          history: [],
          historyIndex: -1,
          draftWorkflow: null,
        });
      },

      saveWorkflow: async (name, description) => {
        const { nodes, edges, workflow } = get();

        const data = {
          name,
          description,
          nodes: nodes.map((n) => ({
            id: n.id,
            type: n.type as "input" | "api" | "ai" | "logic" | "output",
            position: n.position,
            data: n.data,
          })),
          edges: edges.map((e) => ({
            id: e.id,
            source: e.source,
            target: e.target,
            sourceHandle: e.sourceHandle ?? undefined,
            targetHandle: e.targetHandle ?? undefined,
          })),
        };

        if (workflow) {
          const updated = await api.workflows.update(workflow.id, data);
          set({
            workflow: updated,
            currentWorkflowId: updated.id,
            workflowStatus: "saved",
            draftWorkflow: null,
          });
        } else {
          const created = await api.workflows.create(data);
          set({
            workflow: created,
            currentWorkflowId: created.id,
            workflowStatus: "saved",
            draftWorkflow: null,
          });
        }
      },

      executeWorkflow: async (input) => {
        const { workflow, nodes, edges } = get();
        set({ isExecuting: true, executionLogs: [] });

        try {
          let workflowId = workflow?.id;

          if (!workflowId) {
            const tempWorkflow = await api.workflows.create({
              name: "Untitled Workflow",
              nodes: nodes.map((n) => ({
                id: n.id,
                type: n.type as "input" | "api" | "ai" | "logic" | "output",
                position: n.position,
                data: n.data,
              })),
              edges: edges.map((e) => ({
                id: e.id,
                source: e.source,
                target: e.target,
                sourceHandle: e.sourceHandle ?? undefined,
                targetHandle: e.targetHandle ?? undefined,
              })),
            });
            workflowId = tempWorkflow.id;
            set({ workflow: tempWorkflow, currentWorkflowId: tempWorkflow.id });
          }

          // Send current nodes/edges to ensure we use the latest state, not the saved version
          const execution = await api.workflows.execute(workflowId, {
            input,
            nodes: nodes.map((n) => ({
              id: n.id,
              type: n.type as "input" | "api" | "ai" | "logic" | "output" | "webhook",
              position: n.position,
              data: n.data,
            })),
            edges: edges.map((e) => ({
              id: e.id,
              source: e.source,
              target: e.target,
              sourceHandle: e.sourceHandle ?? undefined,
              targetHandle: e.targetHandle ?? undefined,
            })),
          });
          set({
            lastExecution: execution,
            executionLogs: execution.logs || [],
            isExecuting: false,
          });
        } catch (error) {
          set({ isExecuting: false });
          throw error;
        }
      },

      clearCanvas: () => {
        get().pushHistory();
        set({
          nodes: [],
          edges: [],
          selectedNode: null,
          executionLogs: [],
          lastExecution: null,
        });
      },

      newWorkflow: () => {
        set({
          nodes: [],
          edges: [],
          selectedNode: null,
          workflow: null,
          currentWorkflowId: null,
          workflowStatus: "draft",
          executionLogs: [],
          lastExecution: null,
          history: [],
          historyIndex: -1,
          draftWorkflow: null,
        });
      },

      createWorkflow: (workflow: GeneratedWorkflow) => {
        const newNodes: WorkflowNode[] = workflow.nodes.map((node) => ({
          id: node.id,
          type: node.type,
          position: node.position,
          data: {
            label: node.data.label,
            config: node.data.config,
          },
        }));

        const newEdges: Edge[] = workflow.edges.map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
        }));

        set({
          nodes: newNodes,
          edges: newEdges,
          selectedNode: null,
          workflow: null,
          currentWorkflowId: null,
          executionLogs: [],
          lastExecution: null,
        });
      },

      saveDraft: () => {
        const { nodes, edges, workflow } = get();
        // Only save draft if there are nodes and it's not a saved workflow
        if (nodes.length > 0 && !workflow) {
          set({
            draftWorkflow: {
              nodes: JSON.parse(JSON.stringify(nodes)),
              edges: JSON.parse(JSON.stringify(edges)),
              lastModified: new Date().toISOString(),
            },
          });
        }
      },

      loadDraft: () => {
        const { draftWorkflow } = get();
        if (draftWorkflow && draftWorkflow.nodes.length > 0) {
          set({
            nodes: draftWorkflow.nodes,
            edges: draftWorkflow.edges,
            workflowStatus: "draft",
            workflow: null,
            currentWorkflowId: null,
          });
          return true;
        }
        return false;
      },

      clearDraft: () => {
        set({ draftWorkflow: null });
      },

      hasDraft: () => {
        const { draftWorkflow } = get();
        return !!(draftWorkflow && draftWorkflow.nodes.length > 0);
      },

      getWorkflowStatus: () => {
        return get().workflowStatus;
      },

      hydrateFromStorage: async () => {
        const { currentWorkflowId, draftWorkflow, isHydrated } = get();
        if (isHydrated) return;

        set({ isHydrated: true });

        // Priority: Load saved workflow if exists, otherwise load draft
        if (currentWorkflowId) {
          try {
            const workflow = await api.workflows.get(currentWorkflowId);
            set({
              workflow,
              nodes: workflow.nodes as WorkflowNode[],
              edges: workflow.edges,
              workflowStatus: "saved",
            });
          } catch {
            // Workflow might have been deleted, try loading draft
            set({ currentWorkflowId: null });
            if (draftWorkflow && draftWorkflow.nodes.length > 0) {
              set({
                nodes: draftWorkflow.nodes,
                edges: draftWorkflow.edges,
                workflowStatus: "draft",
              });
            }
          }
        } else if (draftWorkflow && draftWorkflow.nodes.length > 0) {
          // No saved workflow, load draft if exists
          set({
            nodes: draftWorkflow.nodes,
            edges: draftWorkflow.edges,
            workflowStatus: "draft",
          });
        }
      },
    }),
    {
      name: "flowys-workflow-storage",
      partialize: (state) => ({
        currentWorkflowId: state.currentWorkflowId,
        draftWorkflow: state.draftWorkflow,
      }),
    }
  )
);
