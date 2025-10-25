/**
 * PDF Export Service
 *
 * Generates structured PDF reports for identification history
 * Features:
 * - Map with numbered pins showing all locations
 * - Species list with photos and detailed information
 * - GPS coordinates for each entry
 * - Route data including distance, elevation, time
 * - Professional formatting for sharing
 */

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { IdentificationRecord } from '../types/identification';

export interface ExportOptions {
  title: string;
  includeMap: boolean;
  includePhotos: boolean;
  includeCoordinates: boolean;
  includeRouteData: boolean;
  selectedIds: string[]; // IDs of identifications to include
}

export interface RouteData {
  totalDistance: number; // in meters
  totalElevationGain: number; // in meters
  totalElevationLoss: number; // in meters
  totalTime: number; // in milliseconds
  startTime?: number;
  endTime?: number;
  averageSpeed?: number; // in km/h
}

class PDFExportService {
  /**
   * Generate and share a structured PDF report
   */
  async generateAndSharePDF(
    history: IdentificationRecord[],
    options: ExportOptions,
    mapImageUri?: string,
    routeData?: RouteData
  ): Promise<void> {
    try {
      // Filter to selected IDs
      const selectedHistory = history.filter(item =>
        options.selectedIds.includes(item.id)
      );

      // Generate HTML content
      const html = await this.generateHTML(
        selectedHistory,
        options,
        mapImageUri,
        routeData
      );

      // Generate PDF
      const { uri } = await Print.printToFileAsync({ html });

      // Share the PDF
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: options.title,
          UTI: 'com.adobe.pdf',
        });
      } else {
        throw new Error('Sharing is not available on this device');
      }
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      throw error;
    }
  }

  /**
   * Generate HTML content for PDF
   */
  private async generateHTML(
    history: IdentificationRecord[],
    options: ExportOptions,
    mapImageUri?: string,
    routeData?: RouteData
  ): Promise<string> {
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Convert images to base64 if needed
    const historyWithBase64 = await Promise.all(
      history.map(async (item) => {
        if (options.includePhotos && item.imageUri && !item.imageUri.startsWith('http')) {
          try {
            const base64 = await FileSystem.readAsStringAsync(item.imageUri, {
              encoding: FileSystem.EncodingType.Base64,
            });
            return { ...item, imageBase64: base64 };
          } catch (error) {
            console.error('Failed to read image:', error);
            return item;
          }
        }
        return item;
      })
    );

    // Convert map image to base64
    let mapBase64 = '';
    if (options.includeMap && mapImageUri) {
      try {
        mapBase64 = await FileSystem.readAsStringAsync(mapImageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
      } catch (error) {
        console.error('Failed to read map image:', error);
      }
    }

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${options.title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 12pt;
      line-height: 1.6;
      color: #333;
      padding: 40px;
    }

    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid #708C6A;
    }

    .header h1 {
      font-size: 28pt;
      color: #708C6A;
      margin-bottom: 10px;
    }

    .header .subtitle {
      font-size: 14pt;
      color: #666;
    }

    .metadata {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      padding: 15px;
      background: #f5f5f5;
      border-radius: 8px;
    }

    .metadata-item {
      text-align: center;
    }

    .metadata-label {
      font-size: 10pt;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .metadata-value {
      font-size: 16pt;
      font-weight: bold;
      color: #708C6A;
      margin-top: 5px;
    }

    .section {
      margin-bottom: 40px;
      page-break-inside: avoid;
    }

    .section-title {
      font-size: 18pt;
      font-weight: bold;
      color: #708C6A;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #708C6A;
    }

    .map-container {
      margin-bottom: 30px;
      text-align: center;
    }

    .map-image {
      max-width: 100%;
      height: auto;
      border: 2px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .route-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: #f9f9f9;
      padding: 15px;
      border-radius: 8px;
      border-left: 4px solid #708C6A;
    }

    .stat-label {
      font-size: 10pt;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-value {
      font-size: 20pt;
      font-weight: bold;
      color: #333;
      margin-top: 5px;
    }

    .stat-unit {
      font-size: 11pt;
      color: #666;
      margin-left: 5px;
    }

    .species-list {
      list-style: none;
    }

    .species-item {
      margin-bottom: 30px;
      padding: 20px;
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 8px;
      page-break-inside: avoid;
      display: flex;
      gap: 20px;
    }

    .species-number {
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      background: #708C6A;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 16pt;
    }

    .species-photo {
      flex-shrink: 0;
      width: 150px;
      height: 150px;
      object-fit: cover;
      border-radius: 8px;
      border: 2px solid #ddd;
    }

    .species-content {
      flex: 1;
    }

    .species-name {
      font-size: 16pt;
      font-weight: bold;
      color: #333;
      margin-bottom: 5px;
    }

    .species-scientific {
      font-size: 13pt;
      font-style: italic;
      color: #666;
      margin-bottom: 10px;
    }

    .species-details {
      margin-top: 10px;
    }

    .detail-row {
      display: flex;
      margin-bottom: 8px;
      font-size: 11pt;
    }

    .detail-label {
      font-weight: bold;
      color: #708C6A;
      min-width: 120px;
    }

    .detail-value {
      color: #333;
    }

    .coordinates {
      font-family: 'Courier New', monospace;
      background: #f5f5f5;
      padding: 8px 12px;
      border-radius: 4px;
      display: inline-block;
    }

    .confidence-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-weight: bold;
      font-size: 11pt;
    }

    .confidence-high {
      background: #d4edda;
      color: #155724;
    }

    .confidence-medium {
      background: #fff3cd;
      color: #856404;
    }

    .confidence-low {
      background: #f8d7da;
      color: #721c24;
    }

    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #ddd;
      text-align: center;
      font-size: 10pt;
      color: #666;
    }

    .footer-logo {
      font-size: 14pt;
      font-weight: bold;
      color: #708C6A;
      margin-bottom: 5px;
    }

    @media print {
      body {
        padding: 20px;
      }

      .section {
        page-break-after: auto;
      }

      .species-item {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="header">
    <h1>${this.escapeHtml(options.title)}</h1>
    <div class="subtitle">Nature Discovery Report • ${date}</div>
  </div>

  <!-- Metadata Summary -->
  <div class="metadata">
    <div class="metadata-item">
      <div class="metadata-label">Total Discoveries</div>
      <div class="metadata-value">${history.length}</div>
    </div>
    <div class="metadata-item">
      <div class="metadata-label">Species Found</div>
      <div class="metadata-value">${new Set(history.map(h => h.commonName)).size}</div>
    </div>
    <div class="metadata-item">
      <div class="metadata-label">Locations</div>
      <div class="metadata-value">${history.filter(h => h.latitude && h.longitude).length}</div>
    </div>
    <div class="metadata-item">
      <div class="metadata-label">Success Rate</div>
      <div class="metadata-value">${Math.round((history.reduce((sum, h) => sum + h.confidence, 0) / history.length) * 100)}%</div>
    </div>
  </div>

  ${options.includeMap && mapBase64 ? `
  <!-- Map Section -->
  <div class="section">
    <h2 class="section-title">📍 Discovery Map</h2>
    <div class="map-container">
      <img src="data:image/png;base64,${mapBase64}" class="map-image" alt="Discovery Map" />
      <p style="margin-top: 10px; font-size: 10pt; color: #666;">
        Map showing ${history.filter(h => h.latitude && h.longitude).length} discovery locations with numbered pins
      </p>
    </div>
  </div>
  ` : ''}

  ${options.includeRouteData && routeData ? `
  <!-- Route Data Section -->
  <div class="section">
    <h2 class="section-title">🥾 Journey Metrics</h2>
    <div class="route-stats">
      <div class="stat-card">
        <div class="stat-label">Distance</div>
        <div class="stat-value">${(routeData.totalDistance / 1000).toFixed(2)}<span class="stat-unit">km</span></div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Elevation Gain</div>
        <div class="stat-value">${routeData.totalElevationGain.toFixed(0)}<span class="stat-unit">m</span></div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Duration</div>
        <div class="stat-value">${this.formatDuration(routeData.totalTime)}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Avg Speed</div>
        <div class="stat-value">${routeData.averageSpeed?.toFixed(1) || 'N/A'}<span class="stat-unit">km/h</span></div>
      </div>
    </div>
  </div>
  ` : ''}

  <!-- Species List Section -->
  <div class="section">
    <h2 class="section-title">🌿 Discovered Species</h2>
    <ul class="species-list">
      ${historyWithBase64.map((item, index) => `
        <li class="species-item">
          <div class="species-number">${index + 1}</div>
          ${options.includePhotos && (item as any).imageBase64 ? `
            <img src="data:image/jpeg;base64,${(item as any).imageBase64}" class="species-photo" alt="${this.escapeHtml(item.commonName)}" />
          ` : ''}
          <div class="species-content">
            <div class="species-name">${this.escapeHtml(item.commonName)}</div>
            <div class="species-scientific">${this.escapeHtml(item.scientificName)}</div>

            <div class="species-details">
              <div class="detail-row">
                <span class="detail-label">Category:</span>
                <span class="detail-value">${this.getCategoryName(item.category)}</span>
              </div>

              <div class="detail-row">
                <span class="detail-label">Confidence:</span>
                <span class="detail-value">
                  <span class="confidence-badge ${this.getConfidenceClass(item.confidence)}">
                    ${Math.round(item.confidence * 100)}%
                  </span>
                </span>
              </div>

              <div class="detail-row">
                <span class="detail-label">Identified:</span>
                <span class="detail-value">${new Date(item.timestamp).toLocaleString()}</span>
              </div>

              <div class="detail-row">
                <span class="detail-label">Method:</span>
                <span class="detail-value">${item.type === 'audio' ? '🎵 Audio Recording' : '📷 Photo'}</span>
              </div>

              ${options.includeCoordinates && item.latitude && item.longitude ? `
                <div class="detail-row">
                  <span class="detail-label">GPS Location:</span>
                  <span class="detail-value">
                    <span class="coordinates">
                      ${item.latitude.toFixed(6)}°, ${item.longitude.toFixed(6)}°
                      ${item.accuracy ? ` (±${item.accuracy.toFixed(0)}m)` : ''}
                    </span>
                  </span>
                </div>
              ` : ''}
            </div>
          </div>
        </li>
      `).join('')}
    </ul>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="footer-logo">🌿 N8ture AI</div>
    <div>Wildlife, Plant & Fungi Identification • www.n8ture.ai</div>
    <div style="margin-top: 10px;">
      Generated on ${new Date().toLocaleString()} • Page 1 of 1
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Helper: Escape HTML special characters
   */
  private escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  /**
   * Helper: Get confidence class for styling
   */
  private getConfidenceClass(confidence: number): string {
    if (confidence >= 0.8) return 'confidence-high';
    if (confidence >= 0.6) return 'confidence-medium';
    return 'confidence-low';
  }

  /**
   * Helper: Get category display name
   */
  private getCategoryName(category: string): string {
    const names: { [key: string]: string } = {
      plant: '🌿 Plant',
      wildlife: '🐾 Wildlife',
      fungi: '🍄 Fungi',
      insect: '🐛 Insect',
    };
    return names[category] || category;
  }

  /**
   * Helper: Format duration in milliseconds to readable string
   */
  private formatDuration(ms: number): string {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }
}

export const pdfExportService = new PDFExportService();
