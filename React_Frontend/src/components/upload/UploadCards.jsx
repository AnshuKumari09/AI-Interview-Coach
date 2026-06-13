import { FileText } from "lucide-react";
import { FiUploadCloud } from "react-icons/fi";

const UploadCard = ({
  title,
  description,
  acceptedFiles,
  icon,
  buttonText,
  color,
  onUpload,
  file
}) => {
  return (
    <div className="flex-1 rounded-3xl border border-white/10 bg-[#0A1025] p-8">

      <div
        className={`h-20 w-20 rounded-2xl bg-gradient-to-r ${color}
        flex items-center justify-center text-white mx-auto`}
      >
        {icon}
      </div>

      <h2 className=" text-3xl text-[#EB73DD] font-semibold mt-6 text-center">
        {title}
      </h2>

      <p className="text-gray-300 text-center mt-4">
        {description}
      </p>

      <label
        className="
        mt-8 flex flex-col items-center justify-center
        border-2 border-dashed border-blue-500/30
        rounded-2xl p-10 cursor-pointer
        hover:border-blue-500 transition-all
      "
      >
        <FiUploadCloud size={45} className="text-blue-400" />

        <p className="text-white mt-4">
          Drag & Drop file here
        </p>

        <p className="text-gray-500 text-sm mt-2">
          {acceptedFiles}
        </p>

        <input
          type="file"
          accept={acceptedFiles}
          hidden
          onChange={onUpload}
        />
        {
            file && (
                <div className="mt-4 flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl text-sm">
                    <FileText size={16} className="text-blue-400"/>
                    <span className="truncate max-w-[200px]">
                      {file.name}
                    </span>
                </div>
            )
        }
      </label>

      <button
        className={`w-full mt-6 py-4 rounded-2xl
        bg-gradient-to-r ${color}
        text-white font-semibold`}
      >
        {buttonText}
      </button>
    </div>
  );
};
export default UploadCard