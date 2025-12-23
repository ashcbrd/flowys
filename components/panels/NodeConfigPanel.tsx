"use client";

import { useState } from "react";
import { X, Trash2, Plus, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkflowStore } from "@/store/workflow";

export function NodeConfigPanel() {
  const { selectedNode, selectNode, updateNodeConfig, updateNodeLabel, deleteNode } =
    useWorkflowStore();

  if (!selectedNode) return null;

  const config = selectedNode.data.config as Record<string, unknown>;

  const handleConfigChange = (key: string, value: unknown) => {
    updateNodeConfig(selectedNode.id, { ...config, [key]: value });
  };

  const handleDelete = () => {
    deleteNode(selectedNode.id);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold">Node Configuration</h2>
        <Button variant="ghost" size="icon" onClick={() => selectNode(null)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <Label>Label</Label>
          <Input
            value={selectedNode.data.label}
            onChange={(e) => updateNodeLabel(selectedNode.id, e.target.value)}
            className="mt-1"
          />
        </div>

        {selectedNode.type === "input" && (
          <InputNodeConfig config={config} onChange={handleConfigChange} />
        )}
        {selectedNode.type === "api" && (
          <ApiNodeConfig config={config} onChange={handleConfigChange} />
        )}
        {selectedNode.type === "ai" && (
          <AiNodeConfig config={config} onChange={handleConfigChange} />
        )}
        {selectedNode.type === "logic" && (
          <LogicNodeConfig config={config} onChange={handleConfigChange} />
        )}
        {selectedNode.type === "output" && (
          <OutputNodeConfig config={config} onChange={handleConfigChange} />
        )}

        <div className="pt-4 border-t">
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-1" />
            Delete Node
          </Button>
        </div>
      </div>
    </div>
  );
}

interface ConfigProps {
  config: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}

interface InputField {
  name: string;
  type: string;
  required?: boolean;
  default?: string | number | boolean;
}

function InputNodeConfig({ config, onChange }: ConfigProps) {
  const fields = (config.fields || []) as InputField[];

  const addField = () => {
    const newFields = [...fields, { name: "newField", type: "string", required: false }];
    onChange("fields", newFields);
  };

  const updateField = (index: number, updates: Partial<InputField>) => {
    const newFields = fields.map((f, i) => (i === index ? { ...f, ...updates } : f));
    onChange("fields", newFields);
  };

  const removeField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index);
    onChange("fields", newFields);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Input Fields</Label>
        <Button size="sm" variant="outline" onClick={addField}>
          <Plus className="h-3 w-3 mr-1" />
          Add Field
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-sm text-muted-foreground py-4 text-center border rounded-lg border-dashed">
          No fields defined. Add a field to accept user input.
        </p>
      )}

      <div className="space-y-3">
        {fields.map((field, i) => (
          <div key={i} className="p-3 border rounded-lg space-y-3 bg-muted/30">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <Input
                value={field.name}
                onChange={(e) => updateField(i, { name: e.target.value })}
                placeholder="Field name"
                className="flex-1 h-8"
              />
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-destructive"
                onClick={() => removeField(i)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Type</Label>
                <Select
                  value={field.type}
                  onValueChange={(v) => updateField(i, { type: v })}
                >
                  <SelectTrigger className="h-8 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="string">String</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="boolean">Boolean</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Default Value</Label>
                <Input
                  value={String(field.default ?? "")}
                  onChange={(e) => updateField(i, { default: e.target.value })}
                  placeholder="Optional"
                  className="h-8 mt-1"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id={`required-${i}`}
                checked={field.required ?? false}
                onCheckedChange={(checked) => updateField(i, { required: checked })}
              />
              <Label htmlFor={`required-${i}`} className="text-xs">
                Required field
              </Label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface HeaderItem {
  key: string;
  value: string;
}

function ApiNodeConfig({ config, onChange }: ConfigProps) {
  const headers = config.headers as Record<string, string> | undefined;
  const headersList: HeaderItem[] = headers
    ? Object.entries(headers).map(([key, value]) => ({ key, value }))
    : [];

  const updateHeaders = (newList: HeaderItem[]) => {
    const newHeaders: Record<string, string> = {};
    newList.forEach((h) => {
      if (h.key.trim()) {
        newHeaders[h.key] = h.value;
      }
    });
    onChange("headers", newHeaders);
  };

  const addHeader = () => {
    updateHeaders([...headersList, { key: "", value: "" }]);
  };

  const updateHeader = (index: number, updates: Partial<HeaderItem>) => {
    const newList = headersList.map((h, i) => (i === index ? { ...h, ...updates } : h));
    updateHeaders(newList);
  };

  const removeHeader = (index: number) => {
    updateHeaders(headersList.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>URL</Label>
        <Input
          value={(config.url as string) || ""}
          onChange={(e) => onChange("url", e.target.value)}
          placeholder="https://api.example.com/data"
          className="mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Use {"{{variableName}}"} for dynamic values
        </p>
      </div>

      <div>
        <Label>Method</Label>
        <Select
          value={(config.method as string) || "GET"}
          onValueChange={(v) => onChange("method", v)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="POST">POST</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
            <SelectItem value="DELETE">DELETE</SelectItem>
            <SelectItem value="PATCH">PATCH</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Headers</Label>
          <Button size="sm" variant="outline" onClick={addHeader}>
            <Plus className="h-3 w-3 mr-1" />
            Add Header
          </Button>
        </div>

        {headersList.length === 0 && (
          <p className="text-xs text-muted-foreground py-2 text-center border rounded border-dashed">
            No custom headers
          </p>
        )}

        <div className="space-y-2">
          {headersList.map((header, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={header.key}
                onChange={(e) => updateHeader(i, { key: e.target.value })}
                placeholder="Header name"
                className="h-8 flex-1"
              />
              <Input
                value={header.value}
                onChange={(e) => updateHeader(i, { value: e.target.value })}
                placeholder="Value"
                className="h-8 flex-1"
              />
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => removeHeader(i)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {["POST", "PUT", "PATCH"].includes((config.method as string) || "") && (
        <div>
          <Label>Request Body</Label>
          <Textarea
            value={(config.body as string) || ""}
            onChange={(e) => onChange("body", e.target.value)}
            placeholder='{"key": "{{value}}"}'
            className="mt-1 font-mono text-sm"
            rows={4}
          />
        </div>
      )}

      <div>
        <Label>Response Mapping (optional)</Label>
        <Textarea
          value={
            config.responseMapping
              ? JSON.stringify(config.responseMapping, null, 2)
              : ""
          }
          onChange={(e) => {
            try {
              const parsed = e.target.value ? JSON.parse(e.target.value) : undefined;
              onChange("responseMapping", parsed);
            } catch {
              // Allow invalid JSON while typing
            }
          }}
          placeholder='{"outputField": "response.data.field"}'
          className="mt-1 font-mono text-sm"
          rows={3}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Map response fields to output names (JSON format)
        </p>
      </div>
    </div>
  );
}

interface SchemaProperty {
  type: string;
  description: string;
}

function AiNodeConfig({ config, onChange }: ConfigProps) {
  const outputSchema = config.outputSchema as {
    type?: string;
    properties?: Record<string, SchemaProperty>;
    required?: string[];
  } | undefined;

  const properties = outputSchema?.properties || {};
  const propsList = Object.entries(properties).map(([name, prop]) => ({
    name,
    ...prop,
  }));

  const updateSchema = (newProps: Array<{ name: string; type: string; description: string }>) => {
    const newProperties: Record<string, SchemaProperty> = {};
    const required: string[] = [];

    newProps.forEach((p) => {
      if (p.name.trim()) {
        newProperties[p.name] = { type: p.type, description: p.description };
        required.push(p.name);
      }
    });

    onChange("outputSchema", {
      type: "object",
      properties: newProperties,
      required,
    });
  };

  const addProperty = () => {
    updateSchema([...propsList, { name: "newField", type: "string", description: "" }]);
  };

  const updateProperty = (index: number, updates: Partial<{ name: string; type: string; description: string }>) => {
    const newList = propsList.map((p, i) => (i === index ? { ...p, ...updates } : p));
    updateSchema(newList);
  };

  const removeProperty = (index: number) => {
    updateSchema(propsList.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Provider</Label>
        <Select
          value={(config.provider as string) || "openai"}
          onValueChange={(v) => onChange("provider", v)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="openai">OpenAI</SelectItem>
            <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Model</Label>
        <Input
          value={(config.model as string) || ""}
          onChange={(e) => onChange("model", e.target.value)}
          placeholder="gpt-4o or claude-sonnet-4-20250514"
          className="mt-1"
        />
      </div>

      <div>
        <Label>System Prompt</Label>
        <Textarea
          value={(config.systemPrompt as string) || ""}
          onChange={(e) => onChange("systemPrompt", e.target.value)}
          placeholder="You are a helpful assistant."
          className="mt-1"
          rows={3}
        />
      </div>

      <div>
        <Label>User Prompt Template</Label>
        <Textarea
          value={(config.userPromptTemplate as string) || ""}
          onChange={(e) => onChange("userPromptTemplate", e.target.value)}
          placeholder="Use {{variableName}} for dynamic values"
          className="mt-1"
          rows={4}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Use {"{{variableName}}"} to inject values from previous nodes
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Temperature</Label>
          <Input
            type="number"
            min="0"
            max="2"
            step="0.1"
            value={(config.temperature as number) ?? 0.7}
            onChange={(e) => onChange("temperature", parseFloat(e.target.value))}
            className="mt-1"
          />
        </div>
        <div>
          <Label>Max Tokens</Label>
          <Input
            type="number"
            min="1"
            max="100000"
            value={(config.maxTokens as number) ?? 2048}
            onChange={(e) => onChange("maxTokens", parseInt(e.target.value))}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Output Schema</Label>
          <Button size="sm" variant="outline" onClick={addProperty}>
            <Plus className="h-3 w-3 mr-1" />
            Add Field
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mb-2">
          Define the expected JSON structure for the AI response
        </p>

        {propsList.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center border rounded-lg border-dashed">
            No output fields defined. AI will return raw text.
          </p>
        )}

        <div className="space-y-2">
          {propsList.map((prop, i) => (
            <div key={i} className="p-2 border rounded space-y-2 bg-muted/30">
              <div className="flex gap-2">
                <Input
                  value={prop.name}
                  onChange={(e) => updateProperty(i, { name: e.target.value })}
                  placeholder="Field name"
                  className="h-8 flex-1"
                />
                <Select
                  value={prop.type}
                  onValueChange={(v) => updateProperty(i, { type: v })}
                >
                  <SelectTrigger className="h-8 w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="string">string</SelectItem>
                    <SelectItem value="number">number</SelectItem>
                    <SelectItem value="boolean">boolean</SelectItem>
                    <SelectItem value="array">array</SelectItem>
                    <SelectItem value="object">object</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => removeProperty(i)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <Input
                value={prop.description}
                onChange={(e) => updateProperty(i, { description: e.target.value })}
                placeholder="Description (helps the AI understand)"
                className="h-8 text-xs"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface MappingItem {
  key: string;
  value: string;
}

function LogicNodeConfig({ config, onChange }: ConfigProps) {
  const operation = (config.operation as string) || "transform";
  const mappings = config.mappings as Record<string, string> | undefined;
  const mappingsList: MappingItem[] = mappings
    ? Object.entries(mappings).map(([key, value]) => ({ key, value }))
    : [];

  const updateMappings = (newList: MappingItem[]) => {
    const newMappings: Record<string, string> = {};
    newList.forEach((m) => {
      if (m.key.trim()) {
        newMappings[m.key] = m.value;
      }
    });
    onChange("mappings", newMappings);
  };

  const addMapping = () => {
    updateMappings([...mappingsList, { key: "", value: "" }]);
  };

  const updateMapping = (index: number, updates: Partial<MappingItem>) => {
    const newList = mappingsList.map((m, i) => (i === index ? { ...m, ...updates } : m));
    updateMappings(newList);
  };

  const removeMapping = (index: number) => {
    updateMappings(mappingsList.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Operation</Label>
        <Select
          value={operation}
          onValueChange={(v) => onChange("operation", v)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="transform">Transform</SelectItem>
            <SelectItem value="filter">Filter</SelectItem>
            <SelectItem value="map">Map</SelectItem>
            <SelectItem value="reduce">Reduce</SelectItem>
            <SelectItem value="condition">Condition</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          {operation === "transform" && "Remap fields from input to output"}
          {operation === "filter" && "Filter array items by condition"}
          {operation === "map" && "Transform each item in an array"}
          {operation === "reduce" && "Aggregate array to single value"}
          {operation === "condition" && "Branch based on condition"}
        </p>
      </div>

      {(operation === "filter" || operation === "condition") && (
        <div>
          <Label>Condition</Label>
          <Input
            value={(config.condition as string) || ""}
            onChange={(e) => onChange("condition", e.target.value)}
            placeholder="e.g., item.score > 0.5 or status == 'active'"
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Operators: ==, !=, &gt;, &lt;, &gt;=, &lt;=, contains, exists
          </p>
        </div>
      )}

      {operation === "reduce" && (
        <div>
          <Label>Expression</Label>
          <Input
            value={(config.expression as string) || ""}
            onChange={(e) => onChange("expression", e.target.value)}
            placeholder="e.g., sum:amount or count or avg:score"
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Available: sum, count, avg, min, max, first, last, concat
          </p>
        </div>
      )}

      {(operation === "transform" || operation === "map") && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Field Mappings</Label>
            <Button size="sm" variant="outline" onClick={addMapping}>
              <Plus className="h-3 w-3 mr-1" />
              Add Mapping
            </Button>
          </div>

          {mappingsList.length === 0 && (
            <p className="text-xs text-muted-foreground py-2 text-center border rounded border-dashed">
              No mappings - all input passed through
            </p>
          )}

          <div className="space-y-2">
            {mappingsList.map((mapping, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input
                  value={mapping.key}
                  onChange={(e) => updateMapping(i, { key: e.target.value })}
                  placeholder="Output name"
                  className="h-8 flex-1"
                />
                <span className="text-muted-foreground">←</span>
                <Input
                  value={mapping.value}
                  onChange={(e) => updateMapping(i, { value: e.target.value })}
                  placeholder="Input path (e.g., response.data)"
                  className="h-8 flex-1"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => removeMapping(i)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function OutputNodeConfig({ config, onChange }: ConfigProps) {
  const format = (config.format as string) || "json";
  const fields = (config.fields as string[]) || [];

  const updateFields = (newFields: string[]) => {
    onChange("fields", newFields.filter((f) => f.trim()));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Format</Label>
        <Select
          value={format}
          onValueChange={(v) => onChange("format", v)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="json">JSON</SelectItem>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="markdown">Markdown</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {format === "json" && (
        <div>
          <Label>Fields to Include (optional)</Label>
          <Textarea
            value={fields.join("\n")}
            onChange={(e) => updateFields(e.target.value.split("\n"))}
            placeholder="Leave empty for all fields, or enter one field per line"
            className="mt-1 font-mono text-sm"
            rows={3}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Specify which fields to include in output (one per line)
          </p>
        </div>
      )}

      {(format === "text" || format === "markdown") && (
        <div>
          <Label>Template</Label>
          <Textarea
            value={(config.template as string) || ""}
            onChange={(e) => onChange("template", e.target.value)}
            placeholder={
              format === "markdown"
                ? "# Title\n\n{{summary}}\n\n## Details\n{{details}}"
                : "Result: {{result}}"
            }
            className="mt-1"
            rows={6}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Use {"{{variableName}}"} for dynamic values
          </p>
        </div>
      )}
    </div>
  );
}
