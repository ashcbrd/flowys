import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { connectToDatabase, Workflow, Execution } from "@/lib/db";
import { createExecutor } from "@/lib/engine";

type RouteParams = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const workflow = await Workflow.findById(id).lean();

    if (!workflow) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const executionId = uuid();
    const now = new Date();

    await Execution.create({
      _id: executionId,
      workflowId: workflow._id,
      status: "running",
      input: body?.input || {},
      startedAt: now,
    });

    const executor = createExecutor(workflow.nodes, workflow.edges);
    const result = await executor.execute(body?.input || {});

    const execution = await Execution.findByIdAndUpdate(
      executionId,
      {
        status: result.success ? "completed" : "failed",
        output: result.output,
        logs: result.logs,
        error: result.error,
        completedAt: new Date(),
      },
      { new: true }
    ).lean();

    return NextResponse.json({
      id: execution!._id,
      workflowId: execution!.workflowId,
      status: execution!.status,
      input: execution!.input,
      output: execution!.output,
      logs: execution!.logs,
      error: execution!.error,
      errorAnalysis: result.errorAnalysis,
      startedAt: execution!.startedAt,
      completedAt: execution!.completedAt,
      createdAt: execution!.createdAt,
      duration: result.duration,
    });
  } catch (error) {
    console.error("Error executing workflow:", error);
    return NextResponse.json(
      { error: "Failed to execute workflow" },
      { status: 500 }
    );
  }
}
