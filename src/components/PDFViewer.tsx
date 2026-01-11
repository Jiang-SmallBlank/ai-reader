import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';

// Set worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  fileUrl: string;
  title: string;
  onPageChange?: (pageNumber: number) => void;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ fileUrl, title, onPageChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [pageNum, setPageNum] = useState(1);
  const [pageRendering, setPageRendering] = useState(false);
  const [pageNumPending, setPageNumPending] = useState<number | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.5);
  const [error, setError] = useState<string | null>(null);

  // Load PDF document
  useEffect(() => {
    const loadPDF = async () => {
      try {
        setError(null);
        console.log('📄 Loading PDF:', fileUrl);

        // Configure loading options
        const loadingTask = pdfjsLib.getDocument({
          url: fileUrl,
          // Enable CORS
          withCredentials: true,
          // Try to load as array buffer if URL fails
        });

        const pdf = await loadingTask.promise;

        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setPageNum(1);
        console.log(`✅ PDF loaded successfully: ${pdf.numPages} pages`);
      } catch (err: any) {
        console.error('❌ Error loading PDF:', err);
        console.error('Error details:', {
          message: err.message,
          name: err.name,
          stack: err.stack
        });
        setError(`无法加载 PDF 文件: ${err.message || '未知错误'}`);
      }
    };

    loadPDF();
  }, [fileUrl]);

  // Render page
  useEffect(() => {
    const renderPage = async (num: number) => {
      if (!pdfDoc || !canvasRef.current) return;

      setPageRendering(true);

      try {
        // Get page
        const page = await pdfDoc.getPage(num);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');

        // Calculate viewport
        const viewport = page.getViewport({ scale });

        // Set canvas dimensions
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render page
        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };

        await page.render(renderContext).promise;

        setPageRendering(false);

        // Check if there's a pending page to render
        if (pageNumPending !== null) {
          setPageNum(pageNumPending);
          setPageNumPending(null);
        }
      } catch (err) {
        console.error('❌ Error rendering page:', err);
        setPageRendering(false);
        setError('渲染页面失败');
      }
    };

    if (pdfDoc && !pageRendering) {
      renderPage(pageNum);
    } else if (pageRendering) {
      setPageNumPending(pageNum);
    }

    // Notify parent of page change
    if (onPageChange) {
      onPageChange(pageNum);
    }
  }, [pdfDoc, pageNum, pageRendering, pageNumPending, scale, onPageChange]);

  const queueRenderPage = (num: number) => {
    if (pageRendering) {
      setPageNumPending(num);
    } else {
      setPageNum(num);
    }
  };

  const onPrevPage = () => {
    if (pageNum <= 1) return;
    queueRenderPage(pageNum - 1);
  };

  const onNextPage = () => {
    if (pageNum >= numPages) return;
    queueRenderPage(pageNum + 1);
  };

  const onZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3));
  };

  const onZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-4">{error}</p>
          <p className="text-sm text-slate-500">请确保文件已正确上传</p>
        </div>
      </div>
    );
  }

  if (!pdfDoc) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <RefreshCw className="animate-spin text-primary mx-auto mb-4" size={32} />
          <p className="text-slate-600">正在加载 PDF...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-100 overflow-hidden">
      {/* Toolbar */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevPage}
            disabled={pageNum <= 1}
            className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="上一页"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="text-sm font-medium px-2">
            {pageNum} / {numPages}
          </span>
          <button
            onClick={onNextPage}
            disabled={pageNum >= numPages}
            className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="下一页"
          >
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onZoomOut}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            title="缩小"
          >
            -
          </button>
          <span className="text-sm font-medium px-2">{Math.round(scale * 100)}%</span>
          <button
            onClick={onZoomIn}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            title="放大"
          >
            +
          </button>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="flex-1 overflow-auto flex items-start justify-center p-8">
        <canvas ref={canvasRef} className="shadow-lg" />
      </div>

      {/* Page info at bottom */}
      <div className="bg-white border-t border-slate-200 px-4 py-2 text-center">
        <p className="text-xs text-slate-500">{title} - 第 {pageNum} 页</p>
      </div>
    </div>
  );
};
