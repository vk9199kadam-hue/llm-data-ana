// =============================================================================
// AutoInsight AI — API Client (lib/api.ts)
// Phase 4: Axios HTTP Client with Auth Interceptors
// =============================================================================

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import type {
  ApiResponse,
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  UploadSession,
  UploadProgress,
  UploadComplete,
  PipelineRun,
  PipelineState,
  CleaningDiff,
  Report,
  NLQResponse,
  ChatMessage,
  Dashboard,
  UserListResponse,
  SystemInfo,
} from "@/types";

// =============================================================================
// API Client Configuration
// =============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// =============================================================================
// Auth Interceptors
// =============================================================================

// Request interceptor — attach JWT access token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 with token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`, {
            refresh_token: refreshToken,
          });
          const tokens: AuthTokens = response.data.data;
          localStorage.setItem("access_token", tokens.access_token);
          localStorage.setItem("refresh_token", tokens.refresh_token);
          originalRequest.headers.Authorization = `Bearer ${tokens.access_token}`;
          return apiClient(originalRequest);
        }
      } catch {
        // Refresh failed — force logout
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

// =============================================================================
// Helper: Extract data from API response envelope
// =============================================================================

function extractData<T>(response: { data: ApiResponse<T> }): T {
  if (response.data.status === "error") {
    throw new Error(response.data.errors?.join(", ") || "Unknown error");
  }
  return response.data.data as T;
}

// =============================================================================
// Auth API
// =============================================================================

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthTokens> => {
    const formData = new URLSearchParams();
    formData.append("email", credentials.email);
    formData.append("password", credentials.password);
    const response = await apiClient.post<ApiResponse<AuthTokens>>(
      "/api/v1/auth/login",
      formData.toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    return extractData(response);
  },

  register: async (data: RegisterRequest): Promise<UserListResponse> => {
    const formData = new URLSearchParams();
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("name", data.name);
    const response = await apiClient.post<ApiResponse<UserListResponse>>(
      "/api/v1/auth/register",
      formData.toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    return extractData(response);
  },

  refresh: async (refreshToken: string): Promise<AuthTokens> => {
    const formData = new URLSearchParams();
    formData.append("refresh_token", refreshToken);
    const response = await apiClient.post<ApiResponse<AuthTokens>>(
      "/api/v1/auth/refresh",
      formData.toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    return extractData(response);
  },
};

// =============================================================================
// Upload API
// =============================================================================

export const uploadApi = {
  initiate: async (data: {
    filename: string;
    file_size: number;
    content_type?: string;
  }): Promise<UploadSession> => {
    const response = await apiClient.post<ApiResponse<UploadSession>>(
      "/api/v1/upload/initiate",
      data
    );
    return extractData(response);
  },

  uploadChunk: async (
    uploadId: string,
    chunk: Blob,
    chunkIndex: number,
    isFinal: boolean
  ): Promise<any> => {
    const formData = new FormData();
    formData.append("upload_id", uploadId);
    formData.append("chunk_index", String(chunkIndex));
    formData.append("is_final", String(isFinal));
    formData.append("file", chunk);
    const response = await apiClient.post<ApiResponse<any>>(
      "/api/v1/upload/chunk",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return extractData(response);
  },

  complete: async (uploadId: string): Promise<UploadComplete> => {
    const response = await apiClient.post<ApiResponse<UploadComplete>>(
      `/api/v1/upload/complete/${uploadId}`
    );
    return extractData(response);
  },

  cancel: async (uploadId: string): Promise<void> => {
    await apiClient.delete(`/api/v1/upload/${uploadId}`);
  },

  // SSE-based upload progress stream
  subscribeToProgress: (
    uploadId: string,
    onProgress: (progress: UploadProgress) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ): EventSource => {
    const eventSource = new EventSource(
      `${API_BASE_URL}/api/v1/upload/progress/${uploadId}`
    );

    eventSource.addEventListener("upload_progress", (event) => {
      const data = JSON.parse(event.data) as UploadProgress;
      onProgress(data);
    });

    eventSource.addEventListener("upload_complete", () => {
      onComplete();
      eventSource.close();
    });

    eventSource.onerror = (err) => {
      onError(new Error("SSE connection error"));
      eventSource.close();
    };

    return eventSource;
  },
};

// =============================================================================
// Pipeline API
// =============================================================================

export const pipelineApi = {
  run: async (data: {
    upload_id: string;
    llm_provider?: string;
    skip_cleaning?: boolean;
  }): Promise<PipelineRun> => {
    const response = await apiClient.post<ApiResponse<PipelineRun>>(
      "/api/v1/pipeline/run",
      data
    );
    return extractData(response);
  },

  getStatus: async (pipelineId: string): Promise<PipelineState> => {
    const response = await apiClient.get<ApiResponse<PipelineState>>(
      `/api/v1/pipeline/status/${pipelineId}`
    );
    return extractData(response);
  },

  getDiff: async (pipelineId: string): Promise<CleaningDiff> => {
    const response = await apiClient.get<ApiResponse<CleaningDiff>>(
      `/api/v1/pipeline/diff/${pipelineId}`
    );
    return extractData(response);
  },

  approveCleaning: async (
    pipelineId: string,
    operations: any[]
  ): Promise<void> => {
    await apiClient.post("/api/v1/pipeline/cleaning/approve", {
      pipeline_id: pipelineId,
      operations,
    });
  },

  // SSE-based pipeline progress stream
  subscribeToEvents: (
    pipelineId: string,
    onProgress: (state: PipelineState) => void,
    onComplete: (state: PipelineState) => void,
    onError: (error: Error) => void
  ): EventSource => {
    const eventSource = new EventSource(
      `${API_BASE_URL}/api/v1/pipeline/events/${pipelineId}`
    );

    eventSource.addEventListener("pipeline_progress", (event) => {
      const data = JSON.parse(event.data) as PipelineState;
      onProgress(data);
    });

    eventSource.addEventListener("pipeline_complete", (event) => {
      const data = JSON.parse(event.data) as PipelineState;
      onComplete(data);
      eventSource.close();
    });

    eventSource.onerror = (err) => {
      onError(new Error("SSE pipeline connection error"));
      eventSource.close();
    };

    return eventSource;
  },
};

// =============================================================================
// Report API
// =============================================================================

export const reportApi = {
  generate: async (data: {
    data_model_id: string;
    title?: string;
  }): Promise<{ report_id: string; status: string }> => {
    const params = new URLSearchParams();
    params.append("data_model_id", data.data_model_id);
    if (data.title) params.append("title", data.title);
    const response = await apiClient.post<ApiResponse<any>>(
      "/api/v1/reports/generate",
      params.toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    return extractData(response);
  },

  get: async (reportId: string): Promise<Report> => {
    const response = await apiClient.get<ApiResponse<Report>>(
      `/api/v1/reports/${reportId}`
    );
    return extractData(response);
  },

  getExportUrl: (reportId: string, format: string): string => {
    return `${API_BASE_URL}/api/v1/reports/${reportId}/export/${format}`;
  },
};

// =============================================================================
// NLQ API
// =============================================================================

export const nlqApi = {
  query: async (data: {
    query: string;
    dataset_id: string;
    conversation_id?: string;
  }): Promise<NLQResponse> => {
    const params = new URLSearchParams();
    params.append("query", data.query);
    params.append("dataset_id", data.dataset_id);
    if (data.conversation_id)
      params.append("conversation_id", data.conversation_id);
    const response = await apiClient.post<ApiResponse<NLQResponse>>(
      "/api/v1/nlq/query",
      params.toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    return extractData(response);
  },
};

// =============================================================================
// Dashboard & System API
// =============================================================================

export const dashboardApi = {
  get: async (dashboardId: string): Promise<Dashboard> => {
    const response = await apiClient.get<ApiResponse<Dashboard>>(
      `/api/v1/dashboard/${dashboardId}`
    );
    return extractData(response);
  },
};

export const systemApi = {
  getInfo: async (): Promise<SystemInfo> => {
    const response = await apiClient.get<ApiResponse<SystemInfo>>(
      "/api/v1/system/info"
    );
    return extractData(response);
  },

  healthCheck: async (): Promise<any> => {
    const response = await apiClient.get("/health");
    return response.data;
  },
};

export const adminApi = {
  listUsers: async (): Promise<UserListResponse> => {
    const response = await apiClient.get<ApiResponse<UserListResponse>>(
      "/api/v1/admin/users"
    );
    return extractData(response);
  },
};
