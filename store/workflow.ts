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
  isExecuting: boolean;
  executionLogs: ExecutionLog[];
  lastExecution: Execution | null;
  isHydrated: boolean;

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
      isExecuting: false,
      executionLogs: [],
      lastExecution: null,
      isHydrated: false,

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
        set({
          nodes: applyNodeChanges(changes, get().nodes) as WorkflowNode[],
        });
      },

      onEdgesChange: (changes) => {
        const isStructuralChange = changes.some(
          (c) => c.type === "remove" || c.type === "add"
        );
        if (isStructuralChange) {
          get().pushHistory();
        }
        set({
          edges: applyEdgeChanges(changes, get().edges),
        });
      },

      onConnect: (connection) => {
        get().pushHistory();
        set({
          edges: addEdge(
            { ...connection, id: `edge_${Date.now()}` },
            get().edges
          ),
        });
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
        set({ nodes: [...get().nodes, newNode] });
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
          history: [],
          historyIndex: -1,
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
          set({ workflow: updated, currentWorkflowId: updated.id });
        } else {
          const created = await api.workflows.create(data);
          set({ workflow: created, currentWorkflowId: created.id });
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

          const execution = await api.workflows.execute(workflowId, input);
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
          executionLogs: [],
          lastExecution: null,
          history: [],
          historyIndex: -1,
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

      hydrateFromStorage: async () => {
        const { currentWorkflowId, isHydrated } = get();
        if (isHydrated) return;

        set({ isHydrated: true });

        if (currentWorkflowId) {
          try {
            const workflow = await api.workflows.get(currentWorkflowId);
            set({
              workflow,
              nodes: workflow.nodes as WorkflowNode[],
              edges: workflow.edges,
            });
          } catch (error) {
            // Workflow might have been deleted, clear the stored ID
            set({ currentWorkflowId: null });
          }
        }
      },
    }),
    {
      name: "flowys-workflow-storage",
      partialize: (state) => ({
        currentWorkflowId: state.currentWorkflowId,
      }),
    }
  )
);
