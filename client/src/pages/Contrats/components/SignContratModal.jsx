import React, { useRef, useState, useEffect } from "react";
import { X, PenTool, RotateCcw, Check } from "lucide-react";
import { toast } from "react-toastify";

const SignContratModal = ({ isOpen, onClose, contrat, onSign }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [isOpen]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    
    const ctx = canvas.getContext("2d");
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleSign = async () => {
    if (!hasSignature) {
      toast.error("Veuillez signer avant de continuer");
      return;
    }
    
    try {
      setIsSubmitting(true);
      const canvas = canvasRef.current;
      const signatureData = canvas.toDataURL("image/png");
      await onSign(signatureData);
      clearSignature();
    } catch (error) {
      toast.error(error.message || "Erreur lors de la signature");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !contrat) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <PenTool size={24} className="text-emerald-600" />
            <div>
              <h2 className="text-xl font-bold text-slate-900">Signer le contrat</h2>
              <p className="text-sm text-slate-500">{contrat.reference}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors" disabled={isSubmitting}>
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-sm text-slate-700 mb-4">
              En signant ce contrat, je certifie avoir lu et accepté toutes les conditions.
            </p>
            <div className="border-2 border-slate-300 rounded-lg overflow-hidden bg-white">
              <canvas
                ref={canvasRef}
                width={600}
                height={200}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full cursor-crosshair touch-none"
              />
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-slate-500">Signez dans la zone ci-dessus</span>
              <button
                onClick={clearSignature}
                type="button"
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                <RotateCcw size={16} />
                Effacer
              </button>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
            <button
              onClick={onClose}
              type="button"
              className="px-6 py-3 border border-slate-200 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              onClick={handleSign}
              type="button"
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              disabled={isSubmitting || !hasSignature}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signature en cours...
                </>
              ) : (
                <>
                  <Check size={18} />
                  Confirmer la signature
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignContratModal;
