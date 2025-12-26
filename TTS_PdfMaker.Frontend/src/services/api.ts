/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-catch */
import axios from 'axios';

// Configure your backend API URL here
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5047';

export interface GeneratePDFRequest {
  title: string;
  content: string;
  contentType: 'text' | 'html';
}

export interface GeneratePDFResponse {
  blob: Blob;
  pdfId?: string;
  createdAt?: string;
}

export const generatePDF = async (data: GeneratePDFRequest): Promise<GeneratePDFResponse> => {
  // Map frontend contentType to backend expected format
  const backendContentType = data.contentType === 'text' ? 'plain' : 'html';
  
  try {
    const response = await axios.post(
      `${API_BASE_URL}/pdf`,
      {
        title: data.title,
        content: data.content,
        contentType: backendContentType,
      },
      {
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    // Check if the response is actually an error (some APIs return error as blob)
    if (response.data.type && response.data.type.includes('application/json')) {
      const text = await response.data.text();
      const errorData = JSON.parse(text);
      throw new Error(errorData.message || 'Failed to generate PDF');
    }
    
    // Extract PDF ID and creation date from response headers
    // Note: Headers are case-insensitive, but axios normalizes them to lowercase
    const pdfId = response.headers['x-pdf-id'] || response.headers['X-PDF-Id'];
    const createdAt = response.headers['x-pdf-created-at'] || response.headers['X-PDF-Created-At'];
    
    // Log for debugging (can be removed in production)
    console.log('Response headers:', response.headers);
    console.log('PDF ID from headers:', pdfId);
    
    return {
      blob: response.data,
      pdfId: pdfId || undefined,
      createdAt: createdAt || undefined,
    };
  } catch (error) {
    // Re-throw axios errors to be handled by the component
    throw error;
  }
};

export interface PdfMetadata {
  id: string;
  title: string;
  contentType: string;
  createdAt: string;
}

export const getPdfById = async (id: string): Promise<Blob> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/pdf/${id}`,
      {
        responseType: 'blob',
      }
    );
    
    // Check if the response is actually an error
    if (response.data.type && response.data.type.includes('application/json')) {
      const text = await response.data.text();
      const errorData = JSON.parse(text);
      throw new Error(errorData.message || 'Failed to retrieve PDF');
    }
    
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error('PDF not found');
    }
    throw error;
  }
};

export const getPdfMetadata = async (id: string): Promise<PdfMetadata> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/pdf/${id}/metadata`
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error('PDF not found');
    }
    throw error;
  }
};

