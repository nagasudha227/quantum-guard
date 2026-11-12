/**
 * Centralized API Client for Quantum Guard
 * Configured for Python FastAPI backend (default: http://localhost:8000)
 *
 * Prepared for integration pending API_CONTRACT.md.
 * Gracefully provides offline / demo data indicators when backend is unreachable.
 */

export const DEFAULT_BACKEND_URL = 'http://localhost:8000';

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = localStorage.getItem('qg_backend_url') || DEFAULT_BACKEND_URL;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public setBaseUrl(url: string): void {
    this.baseUrl = url.trim().replace(/\/+$/, '');
    localStorage.setItem('qg_backend_url', this.baseUrl);
  }

  public async checkHealth(): Promise<{ status: 'online' | 'offline'; latencyMs?: number; message?: string }> {
    const start = performance.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(`${this.baseUrl}/api/health`, {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const latencyMs = Math.round(performance.now() - start);
      if (res.ok) {
        return { status: 'online', latencyMs, message: 'FastAPI backend connected' };
      }
      return { status: 'offline', message: `Backend responded with HTTP ${res.status}` };
    } catch (err: any) {
      return {
        status: 'offline',
        message: err.name === 'AbortError' ? 'Connection timed out' : 'FastAPI backend unreachable at ' + this.baseUrl,
      };
    }
  }

  /**
   * Generic request handler with error wrapping
   */
  public async request<T>(endpoint: string, options?: RequestInit): Promise<{ data: T | null; isLive: boolean; error?: string }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options?.headers || {}),
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        return { data: null, isLive: false, error: `HTTP ${res.status}: ${res.statusText}` };
      }
      const data = await res.json();
      return { data, isLive: true };
    } catch (err: any) {
      return { data: null, isLive: false, error: err.message || 'Network error' };
    }
  }
}

export const api = new ApiService();

