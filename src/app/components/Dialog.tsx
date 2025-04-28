import React from "react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export function Dialog({ isOpen, onClose, onConfirm, title, description }: DialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-gray-600">{description}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
            Cancelar
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            Deletar
          </button>
        </div>
      </div>
    </div>
  );
}
