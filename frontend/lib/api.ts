const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const API_BASE_URL = BACKEND_URL;

export function parseApiError(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unexpected error occurred.";
}

export const api = {
  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/`, {
        cache: "no-store",
        headers: { "Accept": "application/json" },
      });
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("API checkHealth error:", error);
      throw error;
    }
  },

  async extractNarrative(text: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/extract-fir`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`Extraction failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API extractNarrative error:", error);
      throw error;
    }
  },

  async uploadDocketFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/upload-intelligence-file`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`File upload failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API uploadDocketFile error:", error);
      throw error;
    }
  },

  async getGraphData() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/graph-data`, {
        cache: "no-store",
        headers: { "Accept": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch graph data: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API getGraphData error:", error);
      return { nodes: [], edges: [] };
    }
  }
};