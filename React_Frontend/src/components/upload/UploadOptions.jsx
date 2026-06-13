import { FiUploadCloud } from "react-icons/fi";
import { FaFilePdf } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";

const UploadOptions = [
  {
    id: "resume",
    title: "Upload Resume",
    description:
      "AI will analyze your resume and generate role-specific interview questions.",
    acceptedFiles: ".pdf,.doc,.docx",
    icon: <FiFileText size={40} />,
    buttonText: "Upload Resume",
    color: "from-blue-600 to-cyan-500",
  },
  {
    id: "pdf",
    title: "Upload PDF",
    description:
      "Upload your own question bank and practice interviews your way.",
    acceptedFiles: ".pdf",
    icon: <FaFilePdf size={40} />,
    buttonText: "Upload PDF",
    color: "from-purple-800 to-violet-900",
  },
];

export default UploadOptions