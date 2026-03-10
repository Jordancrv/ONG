import axios from 'axios';

const IA_API_URL = import.meta.env.VITE_IA_API_URL || 'http://localhost:5001';

export interface ChatMessage {
  message: string;
}

export interface ChatResponse {
  success: boolean;
  response: string;
  source: string;
  error?: string;
}

export const chatService = {
  /**
   * Send a message to the AI assistant
   */
  async sendMessage(message: string): Promise<ChatResponse> {
    try {
      const response = await axios.post<ChatResponse>(
        `${IA_API_URL}/api/chat`,
        { message },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 seconds timeout
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return {
          success: false,
          response: '',
          source: 'Error',
          error: error.response.data.error || 'Error al comunicarse con el asistente',
        };
      }
      return {
        success: false,
        response: '',
        source: 'Error',
        error: 'No se pudo conectar con el servicio de IA. Por favor, intenta más tarde.',
      };
    }
  },

  /**
   * Check if the IA service is available
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(`${IA_API_URL}/api/health`, {
        timeout: 5000,
      });
      return response.data.status === 'healthy' && response.data.assistant_initialized;
    } catch (error) {
      console.error('IA service health check failed:', error);
      return false;
    }
  },
};
