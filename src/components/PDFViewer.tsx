import { useState } from 'react';

interface PDFViewerProps {
  fileUrl: string;
  fileName: string;
  onClose: () => void;
}

export function PDFViewer({ fileUrl, fileName, onClose }: PDFViewerProps) {
  const [isLoading, setIsLoading] = useState(true);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.click();
  };

  const handlePrint = () => {
    const iframe = document.getElementById('pdf-iframe') as HTMLIFrameElement;
    iframe?.contentWindow?.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-large w-full max-w-5xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <div>
            <h2 className="text-h4 text-neutral-900">{fileName}</h2>
            <p className="text-body-sm text-neutral-600">Medical Report</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="px-4 py-2 text-body text-primary-600 hover:bg-primary-50 rounded-small"
            >
              📥 Download
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-body text-primary-600 hover:bg-primary-50 rounded-small"
            >
              🖨️ Print
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-body text-neutral-600 hover:bg-neutral-50 rounded-small"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="flex-1 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-body text-neutral-600">Loading document...</p>
              </div>
            </div>
          )}
          <iframe
            id="pdf-iframe"
            src={fileUrl}
            className="w-full h-full"
            onLoad={() => setIsLoading(false)}
            title={fileName}
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50">
          <div className="flex items-center space-x-2 text-body-sm text-neutral-600">
            <span>🔒</span>
            <span>This document is encrypted and secure. Do not share with unauthorized persons.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
