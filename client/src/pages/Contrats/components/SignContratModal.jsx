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
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 2.5;
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

  const stopDrawing = () => setIsDrawing(false);

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
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex justify-between items-center px-8 py-5 border-b border-slate-100 bg-white/95 backdrop-blur-md rounded-t-[2rem]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 rounded-xl">
              <PenTool size={18} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Signer le contrat</h2>
              <p className="text-xs font-bold text-slate-400 mt-0.5 font-mono">{contrat.reference}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-700 hover:rotate-90 transition-all"
            disabled={isSubmitting}
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Signature pad */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Zone de signature
            </p>
            <p className="text-sm text-slate-500 mb-4">
              En signant ce contrat, je certifie avoir lu et accepté toutes les conditions.
            </p>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden bg-white hover:border-emerald-300 transition-colors">
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
              <span className="text-xs text-slate-400 font-medium">
                {hasSignature ? "✅ Signature ajoutée" : "Dessinez votre signature dans la zone ci-dessus"}
              </span>
              <button
                onClick={clearSignature}
                type="button"
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-all disabled:opacity-40"
                disabled={isSubmitting || !hasSignature}
              >
                <RotateCcw size={13} />
                Effacer
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
            <button
              onClick={onClose}
              type="button"
              className="px-6 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all disabled:opacity-50"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              onClick={handleSign}
              type="button"
              className="px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center gap-2"
              disabled={isSubmitting || !hasSignature}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signature en cours...
                </>
              ) : (
                <>
                  <Check size={16} />
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
