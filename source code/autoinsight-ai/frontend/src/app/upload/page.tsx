"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import Layout from "@/components/Layout";
import { uploadApi, pipelineApi } from "@/lib/api";
import { formatBytes, cn } from "@/lib/utils";
import { useUploadConfig } from "@/store";
import type { UploadProgress, PipelineState } from "@/types";
import toast from "react-hot-toast";

// ── Upload Progress Component ────────────────────────────────────────────

function UploadProgressCard({
  filename,
  progress,
  status,
}: {
  filename: string;
  progress: number;
  status: string;
}) {
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-medium text-gray-900">{filename}</p>
          <p className="text-sm text-gray-500 capitalize">{status}</p>
        </div>
        <span className="text-sm font-bold text-blue-600">{progress}%</span>
      </div>
      <div className="progress-bar">
        <div
          className={cn(
            "progress-bar-fill",
            status === "completed"
              ? "bg-green-500"
              : status === "failed"
              ? "bg-red-500"
              : "bg-blue-500"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// ── Pipeline Progress Component ──────────────────────────────────────────

function PipelineProgressCard({ state }: { state: PipelineState }) {
  const stages = [
    { key: "stage1", label: "CSV → Schema Inference" },
    { key: "stage2", label: "Data Cleaning" },
    { key: "stage3", label: "LangGraph Analysis" },
    { key: "stage4", label: "Column Engineering" },
  ];

  return (
    <div className="card p-6">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Pipeline Running — {Math.round(state.global_progress)}%
      </h3>
      <div className="space-y-3">
        <div className="progress-bar">
          <div
            className="progress-bar-fill bg-gradient-to-r from-blue-500 to-purple-500"
            style={{ width: `${state.global_progress}%` }}
          />
        </div>
        {stages.map((stage, i) => {
          const s = state.stages?.[stage.key] || {};
          const status = s.status || "pending";
          return (
            <div key={stage.key} className="flex items-center gap-3">
              <span
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                  status === "completed" && "bg-green-100 text-green-600",
                  status === "running" && "bg-blue-100 text-blue-600 animate-pulse",
                  status === "failed" && "bg-red-100 text-red-600",
                  status === "pending" && "bg-gray-100 text-gray-400"
                )}
              >
                {status === "completed" ? "✓" : status === "failed" ? "✗" : i + 1}
              </span>
              <span
                className={cn(
                  "text-sm flex-1",
                  status === "completed" && "text-green-700",
                  status === "running" && "text-blue-700",
                  status === "failed" && "text-red-700",
                  status === "pending" && "text-gray-400"
                )}
              >
                {stage.label}
              </span>
              <span className="text-xs text-gray-400 capitalize">{status}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Upload Page ──────────────────────────────────────────────────────────

export default function UploadPage() {
  const router = useRouter();
  const {
    llmProvider,
    skipCleaning,
    chunkSizeMB,
    setLlmProvider,
    setSkipCleaning,
    setChunkSizeMB,
  } = useUploadConfig();
  const [uploadState, setUploadState] = useState<{
    status: "idle" | "uploading" | "pipeline" | "completed" | "failed";
    progress: number;
    filename: string;
    uploadId?: string;
    pipelineId?: string;
  }>({ status: "idle", progress: 0, filename: "" });

  const pipelineEventSource = useRef<EventSource | null>(null);

  // Cleanup SSE on unmount
  useEffect(() => {
    return () => {
      pipelineEventSource.current?.close();
    };
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      toast.error("Only CSV files are supported");
      return;
    }

    setUploadState({
      status: "uploading",
      progress: 0,
      filename: file.name,
    });

    try {
      // 1. Initiate upload
      const session = await uploadApi.initiate({
        filename: file.name,
        file_size: file.size,
        content_type: "text/csv",
      });

      // 2. Upload in chunks
      const chunkSize = 1024 * 1024;
      const chunks = Math.ceil(file.size / chunkSize);

      for (let i = 0; i < chunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);
        await uploadApi.uploadChunk(session.upload_id, chunk, i, i === chunks - 1);
        setUploadState((prev) => ({
          ...prev,
          progress: Math.round(((i + 1) / chunks) * 40),
        }));
      }

      // 3. Complete upload
      const complete = await uploadApi.complete(session.upload_id);
      setUploadState((prev) => ({ ...prev, progress: 50, uploadId: session.upload_id }));
      toast.success("File uploaded!");

      // 4. Start pipeline
      const pipeline = await pipelineApi.run({
        upload_id: session.upload_id,
      });

      setUploadState((prev) => ({
        ...prev,
        status: "pipeline",
        progress: 55,
        pipelineId: pipeline.pipeline_id,
      }));

      // 5. Subscribe to pipeline SSE events
      pipelineEventSource.current = pipelineApi.subscribeToEvents(
        pipeline.pipeline_id,
        (state) => {
          setUploadState((prev) => ({
            ...prev,
            progress: Math.min(100, Math.max(55, Math.round(state.global_progress / 100 * 45) + 55)),
          }));
        },
        (state) => {
          setUploadState((prev) => ({
            ...prev,
            status: "completed",
            progress: 100,
          }));
          toast.success("Pipeline completed!");
        },
        (error) => {
          setUploadState((prev) => ({ ...prev, status: "failed" }));
          toast.error("Pipeline failed");
        }
      );
    } catch (err: any) {
      setUploadState((prev) => ({ ...prev, status: "failed" }));
      toast.error(err?.message || "Upload failed");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    maxFiles: 1,
    disabled: uploadState.status !== "idle",
  });

  const handleReset = () => {
    pipelineEventSource.current?.close();
    setUploadState({ status: "idle", progress: 0, filename: "" });
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Upload Data</h1>
          <p className="text-sm text-gray-500 mt-1">
            Upload CSV files for automated analysis
          </p>
        </div>

        {/* Upload Zone */}
        <div
          {...getRootProps()}
          className={cn(
            "card p-12 text-center cursor-pointer transition-all duration-200 border-2 border-dashed",
            isDragActive && "border-blue-500 bg-blue-50",
            uploadState.status === "idle" && "hover:border-blue-300 hover:bg-gray-50",
            uploadState.status !== "idle" && "cursor-not-allowed opacity-75"
          )}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <div
              className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto transition-all",
                uploadState.status === "idle" && "bg-blue-100",
                uploadState.status === "uploading" && "bg-blue-100 animate-pulse",
                uploadState.status === "pipeline" && "bg-purple-100 animate-pulse",
                uploadState.status === "completed" && "bg-green-100",
                uploadState.status === "failed" && "bg-red-100"
              )}
            >
              {uploadState.status === "idle" && (
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              )}
              {uploadState.status === "uploading" && (
                <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              {uploadState.status === "pipeline" && (
                <svg className="w-8 h-8 text-purple-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              )}
              {uploadState.status === "completed" && (
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {uploadState.status === "failed" && (
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              )}
            </div>

            {uploadState.status === "idle" && (
              <>
                <p className="text-lg font-medium text-gray-700">
                  {isDragActive ? "Drop your CSV file here" : "Upload CSV File"}
                </p>
                <p className="text-sm text-gray-400">
                  Drag & drop or click to browse — CSV files only, up to 100MB
                </p>
              </>
            )}
            {uploadState.status !== "idle" && (
              <p className="text-sm font-medium text-gray-600">
                {uploadState.filename}
              </p>
            )}
          </div>
        </div>

        {/* Upload Progress */}
        {uploadState.status === "uploading" && (
          <UploadProgressCard
            filename={uploadState.filename}
            progress={uploadState.progress}
            status="uploading"
          />
        )}

        {/* Pipeline Progress */}
        {uploadState.status === "pipeline" && uploadState.pipelineId && (
          <PipelineProgressCard
            state={{
              pipeline_id: uploadState.pipelineId,
              status: "running",
              global_progress: ((uploadState.progress - 55) / 45) * 100,
              current_stage: 2,
              stages: {
                stage1: { status: "completed" },
                stage2: { status: uploadState.progress > 70 ? "completed" : "running" },
                stage3: { status: "pending" },
                stage4: { status: "pending" },
              },
            }}
          />
        )}

        {/* Completed State */}
        {uploadState.status === "completed" && (
          <div className="card p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Pipeline Complete!</h3>
              <p className="text-sm text-gray-500 mt-1">
                Your data has been processed. View the report now.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button onClick={handleReset} className="btn-secondary">
                Upload Another
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="btn-primary"
              >
                View Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Failed State */}
        {uploadState.status === "failed" && (
          <div className="card p-6 text-center space-y-4 border-red-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Upload Failed</h3>
              <p className="text-sm text-gray-500 mt-1">
                Something went wrong. Please try again.
              </p>
            </div>
            <button onClick={handleReset} className="btn-primary">
              Try Again
            </button>
          </div>
        )}

        {/* Config Panel */}
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Upload Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">LLM Provider</label>
              <select
                value={llmProvider}
                onChange={(e) => setLlmProvider(e.target.value as "groq" | "ollama")}
                className="input-field text-sm"
                disabled={uploadState.status !== "idle"}
              >
                <option value="groq">Groq (Qwen 2.5 72B) — Free</option>
                <option value="ollama">Ollama (Llama 3.1 8B) — Local</option>
              </select>
            </div>
            <div>
              <label className="label">Chunk Size</label>
              <select
                value={chunkSizeMB}
                onChange={(e) => setChunkSizeMB(Number(e.target.value))}
                className="input-field text-sm"
                disabled={uploadState.status !== "idle"}
              >
                <option value={0.5}>512 KB</option>
                <option value={1}>1 MB</option>
                <option value={5}>5 MB</option>
                <option value={10}>10 MB</option>
              </select>
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={skipCleaning}
                  onChange={(e) => setSkipCleaning(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={uploadState.status !== "idle"}
                />
                <span className="text-sm text-gray-600">Skip cleaning (data is clean)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-4">
            <h4 className="font-medium text-gray-900 text-sm">Stage 1: CSV Parsing</h4>
            <p className="text-xs text-gray-500 mt-1">chardet encoding + Polars parsing + Qwen schema inference</p>
          </div>
          <div className="card p-4">
            <h4 className="font-medium text-gray-900 text-sm">Stage 2: Cleaning</h4>
            <p className="text-xs text-gray-500 mt-1">Quality profiling + AI cleaning plan + transformations</p>
          </div>
          <div className="card p-4">
            <h4 className="font-medium text-gray-900 text-sm">Stage 3-4: Analysis</h4>
            <p className="text-xs text-gray-500 mt-1">LangGraph relationships + column engineering + UDM assembly</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
