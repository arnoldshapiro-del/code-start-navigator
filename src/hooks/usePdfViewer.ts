import { useState, useEffect, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PdfPage {
  canvas: HTMLCanvasElement;
  pageNumber: number;
}

export const usePdfViewer = (pdfUrl: string | null) => {
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [renderedPages, setRenderedPages] = useState<Map<number, PdfPage>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load PDF document
  useEffect(() => {
    if (!pdfUrl) {
      setPdfDoc(null);
      setNumPages(0);
      setRenderedPages(new Map());
      return;
    }

    setIsLoading(true);
    setError(null);

    pdfjsLib.getDocument(pdfUrl)
      .promise
      .then((doc) => {
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error loading PDF:', err);
        setError('Failed to load PDF');
        setIsLoading(false);
      });
  }, [pdfUrl]);

  // Render a specific page
  const renderPage = useCallback(async (pageNumber: number): Promise<HTMLCanvasElement | null> => {
    if (!pdfDoc || pageNumber < 1 || pageNumber > numPages) return null;

    // Return cached page if already rendered
    const cached = renderedPages.get(pageNumber);
    if (cached) return cached.canvas;

    try {
      const page = await pdfDoc.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1.5 }); // 1.5x scale for better quality
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return null;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
        canvas: canvas,
      };

      await page.render(renderContext).promise;

      // Cache the rendered page
      setRenderedPages(prev => new Map(prev.set(pageNumber, { canvas, pageNumber })));
      
      return canvas;
    } catch (err) {
      console.error(`Error rendering page ${pageNumber}:`, err);
      return null;
    }
  }, [pdfDoc, numPages, renderedPages]);

  // Get page as data URL for immediate display
  const getPageDataUrl = useCallback(async (pageNumber: number): Promise<string | null> => {
    const canvas = await renderPage(pageNumber);
    return canvas ? canvas.toDataURL('image/webp', 0.8) : null;
  }, [renderPage]);

  // Preload first page immediately
  useEffect(() => {
    if (pdfDoc && numPages > 0) {
      renderPage(1); // Preload page 1
    }
  }, [pdfDoc, numPages, renderPage]);

  return {
    pdfDoc,
    numPages,
    isLoading,
    error,
    renderPage,
    getPageDataUrl,
    renderedPages: Array.from(renderedPages.values()),
  };
};