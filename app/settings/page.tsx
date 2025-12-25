"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Webhook,
  Key,
  Plus,
  Trash2,
  Copy,
  Check,
  RefreshCw,
  AlertTriangle,
  Play,
  ArrowLeft,
  Settings,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  api,
  type Webhook as WebhookType,
  type ApiKey,
  type WebhookEvent,
  type ApiKeyScope,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

const WEBHOOK_EVENTS: { value: WebhookEvent; label: string }[] = [
  { value: "workflow.started", label: "Workflow Started" },
  { value: "workflow.completed", label: "Workflow Completed" },
  { value: "workflow.failed", label: "Workflow Failed" },
  { value: "node.started", label: "Node Started" },
  { value: "node.completed", label: "Node Completed" },
  { value: "node.failed", label: "Node Failed" },
];

const API_SCOPES: { value: ApiKeyScope; label: string; description: string }[] = [
  { value: "workflows:read", label: "Read Workflows", description: "View workflow details" },
  { value: "workflows:write", label: "Write Workflows", description: "Create and update workflows" },
  { value: "workflows:execute", label: "Execute Workflows", description: "Run workflows via API" },
  { value: "executions:read", label: "Read Executions", description: "View execution history" },
  { value: "webhooks:read", label: "Read Webhooks", description: "View webhook configurations" },
  { value: "webhooks:write", label: "Write Webhooks", description: "Manage webhooks" },
  { value: "full_access", label: "Full Access", description: "All permissions" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("webhooks");
  const [webhooks, setWebhooks] = useState<WebhookType[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Create webhook modal
  const [createWebhookOpen, setCreateWebhookOpen] = useState(false);
  const [creatingWebhook, setCreatingWebhook] = useState(false);
  const [webhookForm, setWebhookForm] = useState({
    name: "",
    type: "outgoing" as "incoming" | "outgoing",
    url: "",
    method: "POST",
    events: [] as WebhookEvent[],
  });

  // Create API key modal
  const [createApiKeyOpen, setCreateApiKeyOpen] = useState(false);
  const [creatingApiKey, setCreatingApiKey] = useState(false);
  const [apiKeyForm, setApiKeyForm] = useState({
    name: "",
    description: "",
    scopes: ["workflows:read", "executions:read"] as ApiKeyScope[],
  });
  const [newApiKey, setNewApiKey] = useState<string | null>(null);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "webhook" | "apiKey";
    id: string;
    name: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Testing
  const [testingWebhook, setTestingWebhook] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "webhooks") {
        const data = await api.webhooks.list();
        setWebhooks(data);
      } else {
        const data = await api.apiKeys.list();
        setApiKeys(data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({ title: "Copied to clipboard" });
  };

  const handleCreateWebhook = async () => {
    setCreatingWebhook(true);
    try {
      const webhook = await api.webhooks.create({
        name: webhookForm.name,
        type: webhookForm.type,
        url: webhookForm.type === "outgoing" ? webhookForm.url : undefined,
        method: webhookForm.type === "outgoing" ? webhookForm.method : undefined,
        events: webhookForm.type === "outgoing" ? webhookForm.events : undefined,
      });

      setWebhooks((prev) => [webhook, ...prev]);
      setCreateWebhookOpen(false);
      setWebhookForm({ name: "", type: "outgoing", url: "", method: "POST", events: [] });

      if (webhook.type === "incoming" && webhook.secret) {
        toast({
          title: "Webhook Created",
          description: `Secret: ${webhook.secret} (save this now!)`,
        });
      } else {
        toast({ title: "Webhook Created" });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create webhook",
        variant: "destructive",
      });
    } finally {
      setCreatingWebhook(false);
    }
  };

  const handleCreateApiKey = async () => {
    setCreatingApiKey(true);
    try {
      const result = await api.apiKeys.create({
        name: apiKeyForm.name,
        description: apiKeyForm.description,
        scopes: apiKeyForm.scopes,
      });

      setApiKeys((prev) => [result, ...prev]);
      setNewApiKey(result.key);
      setApiKeyForm({ name: "", description: "", scopes: ["workflows:read", "executions:read"] });

      toast({
        title: "API Key Created",
        description: "Make sure to copy the key now. It won't be shown again!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create API key",
        variant: "destructive",
      });
    } finally {
      setCreatingApiKey(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      if (deleteTarget.type === "webhook") {
        await api.webhooks.delete(deleteTarget.id);
        setWebhooks((prev) => prev.filter((w) => w.id !== deleteTarget.id));
      } else {
        await api.apiKeys.delete(deleteTarget.id);
        setApiKeys((prev) => prev.filter((k) => k.id !== deleteTarget.id));
      }

      toast({ title: "Deleted successfully" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleTestWebhook = async (webhookId: string) => {
    setTestingWebhook(webhookId);
    try {
      const result = await api.webhooks.test(webhookId);
      if (result.success) {
        toast({ title: "Test Successful", description: `Response: ${result.statusCode}` });
      } else {
        toast({
          title: "Test Failed",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to test webhook",
        variant: "destructive",
      });
    } finally {
      setTestingWebhook(null);
    }
  };

  const toggleWebhookEnabled = async (webhook: WebhookType) => {
    try {
      const updated = await api.webhooks.update(webhook.id, { enabled: !webhook.enabled });
      setWebhooks((prev) => prev.map((w) => (w.id === webhook.id ? updated : w)));
      toast({
        title: webhook.enabled ? "Webhook Disabled" : "Webhook Enabled",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update webhook",
        variant: "destructive",
      });
    }
  };

  const toggleApiKeyEnabled = async (apiKey: ApiKey) => {
    try {
      const updated = await api.apiKeys.update(apiKey.id, { enabled: !apiKey.enabled });
      setApiKeys((prev) => prev.map((k) => (k.id === apiKey.id ? updated : k)));
      toast({
        title: apiKey.enabled ? "API Key Disabled" : "API Key Enabled",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update API key",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-14 border-b bg-card flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href="/workflow">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Workflows
            </Button>
          </Link>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold">Settings</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <p className="text-muted-foreground">
            Manage webhooks and API keys for external integrations
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="webhooks" className="flex items-center gap-2">
              <Webhook className="h-4 w-4" />
              Webhooks ({webhooks.length})
            </TabsTrigger>
            <TabsTrigger value="apikeys" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              API Keys ({apiKeys.length})
            </TabsTrigger>
          </TabsList>

          {/* Webhooks Tab */}
          <TabsContent value="webhooks" className="mt-0">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-muted-foreground">
                Configure incoming and outgoing webhooks for workflow automation
              </p>
              <Button onClick={() => setCreateWebhookOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Webhook
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : webhooks.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Webhook className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="font-medium text-lg">No webhooks configured</p>
                <p className="text-sm mb-4">Create your first webhook to get started</p>
                <Button onClick={() => setCreateWebhookOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Webhook
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {webhooks.map((webhook) => (
                  <div
                    key={webhook.id}
                    className={cn(
                      "border rounded-lg p-5 bg-card",
                      !webhook.enabled && "opacity-60"
                    )}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{webhook.name}</h4>
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-xs font-medium",
                              webhook.type === "incoming"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            )}
                          >
                            {webhook.type}
                          </span>
                          {!webhook.enabled && (
                            <span className="px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground">
                              Disabled
                            </span>
                          )}
                        </div>

                        {webhook.type === "incoming" && webhook.triggerUrl && (
                          <div className="flex items-center gap-2 mb-2">
                            <code className="text-xs bg-muted px-3 py-1.5 rounded font-mono truncate max-w-lg">
                              {webhook.triggerUrl}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(webhook.triggerUrl!, `webhook-${webhook.id}`)}
                              className="flex-shrink-0"
                            >
                              {copiedId === `webhook-${webhook.id}` ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        )}

                        {webhook.type === "outgoing" && webhook.url && (
                          <p className="text-sm text-muted-foreground mb-2 truncate max-w-lg">
                            {webhook.method} {webhook.url}
                          </p>
                        )}

                        {webhook.events && webhook.events.length > 0 && (
                          <div className="flex gap-1 mb-2 flex-wrap">
                            {webhook.events.map((event) => (
                              <span
                                key={event}
                                className="text-xs bg-muted px-2 py-0.5 rounded"
                              >
                                {event}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span>Success: {webhook.successCount}</span>
                          <span>Failed: {webhook.failureCount}</span>
                          {webhook.lastTriggeredAt && (
                            <span>
                              Last: {new Date(webhook.lastTriggeredAt).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {webhook.type === "outgoing" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTestWebhook(webhook.id)}
                            disabled={testingWebhook === webhook.id}
                            title="Test Webhook"
                          >
                            {testingWebhook === webhook.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleWebhookEnabled(webhook)}
                        >
                          {webhook.enabled ? "Disable" : "Enable"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setDeleteTarget({
                              type: "webhook",
                              id: webhook.id,
                              name: webhook.name,
                            })
                          }
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="apikeys" className="mt-0">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-muted-foreground">
                Create API keys to access workflows programmatically
              </p>
              <Button onClick={() => setCreateApiKeyOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create API Key
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : apiKeys.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Key className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="font-medium text-lg">No API keys created</p>
                <p className="text-sm mb-4">Create your first API key to get started</p>
                <Button onClick={() => setCreateApiKeyOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create API Key
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {apiKeys.map((key) => (
                  <div
                    key={key.id}
                    className={cn(
                      "border rounded-lg p-5 bg-card",
                      !key.enabled && "opacity-60"
                    )}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{key.name}</h4>
                          {!key.enabled && (
                            <span className="px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground">
                              Disabled
                            </span>
                          )}
                        </div>

                        {key.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {key.description}
                          </p>
                        )}

                        <div className="flex items-center gap-2 mb-2">
                          <code className="text-xs bg-muted px-3 py-1.5 rounded font-mono">
                            {key.keyPrefix}...
                          </code>
                        </div>

                        <div className="flex gap-1 mb-2 flex-wrap">
                          {key.scopes.map((scope) => (
                            <span
                              key={scope}
                              className="text-xs bg-muted px-2 py-0.5 rounded"
                            >
                              {scope}
                            </span>
                          ))}
                        </div>

                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span>Used: {key.usageCount} times</span>
                          {key.lastUsedAt && (
                            <span>
                              Last: {new Date(key.lastUsedAt).toLocaleString()}
                            </span>
                          )}
                          {key.expiresAt && (
                            <span>Expires: {new Date(key.expiresAt).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleApiKeyEnabled(key)}
                        >
                          {key.enabled ? "Disable" : "Enable"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setDeleteTarget({
                              type: "apiKey",
                              id: key.id,
                              name: key.name,
                            })
                          }
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Create Webhook Modal */}
      <Dialog open={createWebhookOpen} onOpenChange={setCreateWebhookOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Webhook</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                value={webhookForm.name}
                onChange={(e) => setWebhookForm({ ...webhookForm, name: e.target.value })}
                placeholder="My Webhook"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Type</label>
              <Select
                value={webhookForm.type}
                onValueChange={(v) =>
                  setWebhookForm({ ...webhookForm, type: v as "incoming" | "outgoing" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="incoming">Incoming (trigger workflow)</SelectItem>
                  <SelectItem value="outgoing">Outgoing (send data)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {webhookForm.type === "outgoing" && (
              <>
                <div>
                  <label className="text-sm font-medium">URL</label>
                  <Input
                    value={webhookForm.url}
                    onChange={(e) => setWebhookForm({ ...webhookForm, url: e.target.value })}
                    placeholder="https://example.com/webhook"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Method</label>
                  <Select
                    value={webhookForm.method}
                    onValueChange={(v) => setWebhookForm({ ...webhookForm, method: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Events</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {WEBHOOK_EVENTS.map((event) => (
                      <label key={event.value} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={webhookForm.events.includes(event.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setWebhookForm({
                                ...webhookForm,
                                events: [...webhookForm.events, event.value],
                              });
                            } else {
                              setWebhookForm({
                                ...webhookForm,
                                events: webhookForm.events.filter((ev) => ev !== event.value),
                              });
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{event.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateWebhookOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateWebhook}
              disabled={
                creatingWebhook ||
                !webhookForm.name ||
                (webhookForm.type === "outgoing" &&
                  (!webhookForm.url || webhookForm.events.length === 0))
              }
            >
              {creatingWebhook ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create API Key Modal */}
      <Dialog
        open={createApiKeyOpen}
        onOpenChange={(open) => {
          setCreateApiKeyOpen(open);
          if (!open) setNewApiKey(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {newApiKey ? "API Key Created" : "Create API Key"}
            </DialogTitle>
          </DialogHeader>

          {newApiKey ? (
            <div className="space-y-4 py-4">
              <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                      Save this key now!
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                      This is the only time you'll see this key. Store it securely.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <code className="text-sm break-all font-mono">{newApiKey}</code>
              </div>

              <Button
                className="w-full"
                onClick={() => handleCopy(newApiKey, "new-key")}
              >
                {copiedId === "new-key" ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy to Clipboard
                  </>
                )}
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={apiKeyForm.name}
                    onChange={(e) => setApiKeyForm({ ...apiKeyForm, name: e.target.value })}
                    placeholder="My API Key"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Description (optional)</label>
                  <Input
                    value={apiKeyForm.description}
                    onChange={(e) =>
                      setApiKeyForm({ ...apiKeyForm, description: e.target.value })
                    }
                    placeholder="Used for production integration"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Permissions</label>
                  <div className="space-y-2 mt-2">
                    {API_SCOPES.map((scope) => (
                      <label key={scope.value} className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          checked={apiKeyForm.scopes.includes(scope.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setApiKeyForm({
                                ...apiKeyForm,
                                scopes: [...apiKeyForm.scopes, scope.value],
                              });
                            } else {
                              setApiKeyForm({
                                ...apiKeyForm,
                                scopes: apiKeyForm.scopes.filter((s) => s !== scope.value),
                              });
                            }
                          }}
                          className="rounded mt-1"
                        />
                        <div>
                          <span className="text-sm font-medium">{scope.label}</span>
                          <p className="text-xs text-muted-foreground">{scope.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateApiKeyOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateApiKey}
                  disabled={creatingApiKey || !apiKeyForm.name || apiKeyForm.scopes.length === 0}
                >
                  {creatingApiKey ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create"
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete {deleteTarget?.type === "webhook" ? "Webhook" : "API Key"}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
