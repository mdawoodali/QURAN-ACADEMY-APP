"use client";

import { useState, useEffect, useRef } from "react";
import { 
  FileUp, FileText, Trash2, Download, Search, 
  UploadCloud, FileCheck, Eye, X
} from "lucide-react";
import toast from "react-hot-toast";

interface UploadedDocument {
  id: string;
  title: string;
  fileName: string;
  category: "Duas & Ziyarat" | "Classical Texts" | "Tajweed & Qaida" | "Ahkam Fiqh" | "Curriculum";
  sect: "universal" | "shia" | "sunni";
  fileSize: string;
  uploadDate: string;
  uploadedBy: string;
  description: string;
  fileDataUrl?: string;
}

const INITIAL_DOCUMENTS: UploadedDocument[] = [
  {
    id: "doc_1",
    title: "Mafatih al-Jinan — Complete Classical Duas Compendium",
    fileName: "Mafatih_al_Jinan_Full_Reader.pdf",
    category: "Duas & Ziyarat",
    sect: "shia",
    fileSize: "14.2 MB",
    uploadDate: "22 Oct 2026",
    uploadedBy: "Super Admin",
    description: "Standard verified Arabic diacritics and parallel English translation for major canonical supplications."
  },
  {
    id: "doc_2",
    title: "Noorani Qaida — Color-Coded Makhaarij Guide",
    fileName: "Noorani_Qaida_Standard_Edition.pdf",
    category: "Tajweed & Qaida",
    sect: "universal",
    fileSize: "8.5 MB",
    uploadDate: "20 Oct 2026",
    uploadedBy: "Super Admin",
    description: "Foundational phonetics and letter-articulation reference used across beginner classrooms."
  },
  {
    id: "doc_3",
    title: "Al-Sahifa al-Sajjadiyya — The Psalms of Islam",
    fileName: "Sahifa_Sajjadiyya_Manuscript.pdf",
    category: "Classical Texts",
    sect: "shia",
    fileSize: "18.7 MB",
    uploadDate: "18 Oct 2026",
    uploadedBy: "Super Admin",
    description: "Complete 54 supplications of Imam Ali Zayn al-Abidin (AS) with academic annotations."
  },
  {
    id: "doc_4",
    title: "Practical Ahkam & Daily Salat Manual",
    fileName: "Practical_Ahkam_Salat_Handbook.pdf",
    category: "Ahkam Fiqh",
    sect: "universal",
    fileSize: "4.1 MB",
    uploadDate: "15 Oct 2026",
    uploadedBy: "Super Admin",
    description: "Essential rulings on Wudhu, Tayammum, invalidating factors, and prayer posture standards."
  }
];

export default function AdminResourcesPage() {
  const [documents, setDocuments] = useState<UploadedDocument[]>(INITIAL_DOCUMENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<UploadedDocument["category"]>("Duas & Ziyarat");
  const [sect, setSect] = useState<UploadedDocument["sect"]>("universal");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<UploadedDocument | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load persisted uploads from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("academy_admin_uploaded_pdfs");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          queueMicrotask(() => setDocuments(parsed));
        }
      }
    } catch {}
  }, []);

  const saveDocuments = (docs: UploadedDocument[]) => {
    setDocuments(docs);
    try {
      localStorage.setItem("academy_admin_uploaded_pdfs", JSON.stringify(docs));
    } catch {}
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        toast.error("Only PDF files (.pdf) are acceptable for upload.");
        return;
      }
      setSelectedFile(file);
      if (!title.trim()) {
        setTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        toast.error("Only PDF files (.pdf) are acceptable for upload.");
        return;
      }
      setSelectedFile(file);
      if (!title.trim()) {
        setTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
      }
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select a PDF document to upload.");
      return;
    }
    if (!title.trim()) {
      toast.error("Please enter a title for this resource.");
      return;
    }

    setIsUploading(true);

    // Read PDF file as Data URL for local preview capability
    const reader = new FileReader();
    reader.onload = () => {
      const sizeMb = (selectedFile.size / (1024 * 1024)).toFixed(1);
      const newDoc: UploadedDocument = {
        id: `pdf_${Date.now()}`,
        title: title.trim(),
        fileName: selectedFile.name,
        category,
        sect,
        fileSize: `${sizeMb} MB`,
        uploadDate: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
        uploadedBy: "Super Admin",
        description: description.trim() || "Uploaded via Academy Admin Portal.",
        fileDataUrl: typeof reader.result === "string" ? reader.result : undefined
      };

      const updated = [newDoc, ...documents];
      saveDocuments(updated);
      setIsUploading(false);
      setSelectedFile(null);
      setTitle("");
      setDescription("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success(`"${newDoc.title}" uploaded successfully in PDF format!`);
    };

    reader.onerror = () => {
      setIsUploading(false);
      toast.error("Failed to read file.");
    };

    reader.readAsDataURL(selectedFile);
  };

  const handleDelete = (id: string, docTitle: string) => {
    if (confirm(`Are you sure you want to remove "${docTitle}"?`)) {
      const updated = documents.filter((d) => d.id !== id);
      saveDocuments(updated);
      toast.success("Document removed.");
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "All" || doc.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full text-white">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl md:text-4xl font-serif text-white">Academy PDF &amp; Content Desk</h1>
            <span className="flex items-center gap-1 text-[11px] font-bold bg-emerald-950/80 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
              <FileCheck size={12} />
              <span>PDF Ingestion Active</span>
            </span>
          </div>
          <p className="text-emerald-100/80 text-sm max-w-2xl">
            Upload and manage official academy PDF materials: Classical manuscripts, comprehensive Duas, Tajweed guides, and syllabus texts.
          </p>
        </div>

        <div className="text-xs font-bold text-amber-300 bg-black/40 border border-white/10 px-3.5 py-1.5 rounded-full shadow-sm">
          {documents.length} PDF Documents Available
        </div>
      </header>

      {/* Top Upload Section */}
      <div className="glass-container rounded-3xl p-6 md:p-8 border border-white/15 shadow-2xl mb-10">
        <h2 className="text-xl font-bold font-serif text-white mb-4 flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-amber-300" />
          <span>Upload New Academy Resource (PDF)</span>
        </h2>

        <form onSubmit={handleUploadSubmit} className="space-y-6">
          {/* Drag & Drop Box */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 md:p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? "border-amber-400 bg-amber-400/10 scale-[1.01]"
                : "border-white/20 bg-black/30 hover:border-amber-400/50 hover:bg-black/40"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-14 h-14 rounded-2xl bg-amber-400/15 border border-amber-400/30 text-amber-300 flex items-center justify-center shadow-inner">
                <FileUp size={28} />
              </div>
              <p className="font-bold text-white text-base">
                {selectedFile ? selectedFile.name : "Click to browse or drag and drop your PDF here"}
              </p>
              <p className="text-xs text-emerald-100/70">
                {selectedFile
                  ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for upload`
                  : "Acceptable format: PDF (.pdf up to 50MB)"}
              </p>
            </div>
          </div>

          {/* Metadata Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-emerald-100/80 uppercase tracking-wider mb-2">
                Document Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Dua Kumayl Complete Arabic & English Reader"
                className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-100/80 uppercase tracking-wider mb-2">
                Curriculum Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as UploadedDocument["category"])}
                className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Duas & Ziyarat" className="bg-emerald-950">Duas &amp; Ziyarat</option>
                <option value="Classical Texts" className="bg-emerald-950">Classical Reference Texts</option>
                <option value="Tajweed & Qaida" className="bg-emerald-950">Tajweed &amp; Noorani Qaida</option>
                <option value="Ahkam Fiqh" className="bg-emerald-950">Wudhu &amp; Salat Ahkam</option>
                <option value="Curriculum" className="bg-emerald-950">Academy Syllabus</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-100/80 uppercase tracking-wider mb-2">
                Sect Association
              </label>
              <select
                value={sect}
                onChange={(e) => setSect(e.target.value as UploadedDocument["sect"])}
                className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              >
                <option value="universal" className="bg-emerald-950">Universal (Sunni &amp; Shia)</option>
                <option value="shia" className="bg-emerald-950">Shia Curriculum</option>
                <option value="sunni" className="bg-emerald-950">Sunni Curriculum</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-emerald-100/80 uppercase tracking-wider mb-2">
                Summary / Notes for Students &amp; Teachers
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of content, verified source, or edition details..."
                className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isUploading || !selectedFile}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md cursor-pointer ${
                isUploading || !selectedFile
                  ? "bg-white/10 text-white/40 cursor-not-allowed"
                  : "bg-amber-400 hover:bg-amber-300 text-emerald-950"
              }`}
            >
              <UploadCloud size={18} />
              <span>{isUploading ? "Uploading & Processing..." : "Save & Publish PDF Document"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {["All", "Duas & Ziyarat", "Classical Texts", "Tajweed & Qaida", "Ahkam Fiqh", "Curriculum"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
                selectedCategory === cat
                  ? "bg-amber-400 text-emerald-950 shadow-sm"
                  : "bg-black/35 text-emerald-100/70 hover:text-white border border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-200/50" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search uploaded PDFs..."
            className="w-full bg-black/40 border border-white/20 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Uploaded Documents List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="glass-container rounded-2xl p-5 border border-white/15 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/30 text-amber-300 flex items-center justify-center shrink-0 shadow-sm">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm sm:text-base leading-tight">{doc.title}</h3>
                    <p className="text-xs text-emerald-200/60 font-mono mt-0.5">{doc.fileName}</p>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-amber-300 border border-white/10 shrink-0">
                  {doc.fileSize}
                </span>
              </div>

              <p className="text-xs text-emerald-100/75 line-clamp-2 my-2.5 leading-relaxed">
                {doc.description}
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-[11px] text-emerald-100/60">
                <span className="bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-700/40 text-emerald-200">
                  {doc.category}
                </span>
                <span>•</span>
                <span>{doc.uploadDate}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {doc.fileDataUrl && (
                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                    title="Preview PDF"
                  >
                    <Eye size={14} />
                  </button>
                )}
                <a
                  href={doc.fileDataUrl || "#"}
                  download={doc.fileName}
                  onClick={(e) => {
                    if (!doc.fileDataUrl) {
                      e.preventDefault();
                      toast.success(`Downloading ${doc.fileName}...`);
                    }
                  }}
                  className="p-2 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-amber-300 border border-amber-400/30 transition shadow-sm cursor-pointer"
                  title="Download PDF"
                >
                  <Download size={14} />
                </a>
                <button
                  onClick={() => handleDelete(doc.id, doc.title)}
                  className="p-2 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-500/30 transition cursor-pointer"
                  title="Delete Document"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredDocs.length === 0 && (
          <div className="col-span-full py-12 text-center text-emerald-100/60 text-sm glass-container rounded-2xl border border-white/10">
            No uploaded PDF documents matching your filter.
          </div>
        )}
      </div>

      {/* PDF Quick Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl h-[85vh] bg-emerald-950 border border-white/20 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 bg-black/40 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">{previewDoc.title}</h3>
                <span className="text-xs text-emerald-200/70 font-mono">{previewDoc.fileName}</span>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 bg-black/60 p-2">
              <iframe
                src={previewDoc.fileDataUrl}
                title={previewDoc.title}
                className="w-full h-full rounded-2xl border border-white/10"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
