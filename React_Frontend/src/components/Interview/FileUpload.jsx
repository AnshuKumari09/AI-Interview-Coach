import { Upload, FileText, CheckCircle } from "lucide-react";

export default function FileUpload({ label, accept, file, onChange }) {
  return (
    <div>
      <label className="border-2 border-dashed border-slate-700 rounded-2xl p-8 flex flex-col items-center cursor-pointer">
        <Upload size={40} className="text-slate-500" />
        <p className="mt-3 text-slate-300">{label}</p>

        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => onChange(e.target.files[0])}
        />
      </label>

      {file && (
        <div className="mt-3 flex items-center gap-3 bg-slate-800 p-3 rounded-xl">
          <FileText size={18} />
          <span className="text-sm truncate">{file.name}</span>
          <CheckCircle className="text-green-400 ml-auto" />
        </div>
      )}
    </div>
  );
}