const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const API_BASE_URL = BACKEND_URL.endsWith('/') ? BACKEND_URL.slice(0, -1) : BACKEND_URL;

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
      if (!response.ok) throw new Error(`Health check failed: ${response.statusText}`);
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
        console.error(`[API ERROR] Failed URL: ${response.url} | Status: ${response.status}`);
        throw new Error(`Extraction failed: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("API extractNarrative error:", error);
      throw error;
    }
  },

  async extractMergedNarrative(existingDataJson: string, newText: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/extract-merged`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ existing_data_json: existingDataJson, new_text: newText }),
      });

      if (!response.ok) throw new Error(`Merge extraction failed: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error("API extractMergedNarrative error:", error);
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

      if (!response.ok) throw new Error(`File upload failed: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error("API uploadDocketFile error:", error);
      throw error;
    }
  },

  async uploadMergedIntelligenceFile(existingDataJson: string, newText: string, file: File) {
    const formData = new FormData();
    formData.append("existing_data_json", existingDataJson);
    formData.append("new_text", newText);
    formData.append("file", file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/upload-merged-intelligence-file`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`Merged file upload failed: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error("API uploadMergedIntelligenceFile error:", error);
      throw error;
    }
  },

  async getGraphData() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/graph-data`, {
        cache: "no-store",
        headers: { "Accept": "application/json" },
      });

      if (!response.ok) throw new Error(`Failed to fetch graph data: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error("API getGraphData error:", error);
      return { nodes: [], edges: [] };
    }
  }
};