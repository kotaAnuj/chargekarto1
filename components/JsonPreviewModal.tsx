
import React from 'react';

interface JsonPreviewModalProps {
  jsonData: string;
  onClose: () => void;
}

const JsonPreviewModal: React.FC<JsonPreviewModalProps> = ({ jsonData, onClose }) => {
  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Form JSON Output</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
        </div>
        <div className="p-4 overflow-y-auto">
          <pre className="bg-gray-800 text-white p-4 rounded-md text-sm whitespace-pre-wrap break-all">
            <code>{jsonData}</code>
          </pre>
        </div>
         <div className="p-4 border-t text-right">
             <button
                onClick={() => navigator.clipboard.writeText(jsonData)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Copy to Clipboard
            </button>
         </div>
      </div>
    </div>
  );
};

export default JsonPreviewModal;
