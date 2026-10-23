"use client";

import { useState, useEffect, useRef } from "react";
import { 
  FileUp, FileText, Trash2, Download, Search, 
  UploadCloud, FileCheck, Eye, X, Database, CheckCircle2,
  BookOpen, Sparkles, Shield, Bookmark, Compass
} from "lucide-react";
import toast from "react-hot-toast";

export const RESOURCE_CATEGORIES = [
  "Holy Quran (30 Paras & Surahs)",
  "Duas & Supplications",
  "Ziaraat (Sacred Visitations)",
  "Hadith & Sunnah Compendiums",
  "Classical Reference Texts",
  "Wudhu & Salat Ahkam",
  "Islamic Calendar & History",
  "Tajweed & Noorani Qaida",
  "Seerat & Islamic Studies",
  "Academy Syllabus & Curriculum"
] as const;

export type ResourceCategory = typeof RESOURCE_CATEGORIES[number];

export interface UploadedDocument {
  id: string;
  title: string;
  fileName: string;
  category: string;
  sect: "universal" | "shia" | "sunni";
  fileSize: string;
  uploadDate: string;
  uploadedBy: string;
  description: string;
  fileDataUrl?: string;
  createdAt?: string;
}

const INITIAL_DOCUMENTS: UploadedDocument[] = [
  {
    id: "doc_1",
    title: "Mafatih al-Jinan — Complete Classical Duas Compendium",
    fileName: "Mafatih_al_Jinan_Full_Reader.pdf",
    category: "Duas & Supplications",
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
    category: "Tajweed & Noorani Qaida",
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
    category: "Classical Reference Texts",
    sect: "shia",
    fileSize: "18.7 MB",
    uploadDate: "18 Oct 2026",
    uploadedBy: "Super Admin",
    description: "Complete 54 supplications of Imam Ali Zayn al-Abidin (AS) with academic annotations."
  },
  {
    id: "doc_5",
    title: "Practical Ahkam & Daily Salat Manual",
    fileName: "Practical_Ahkam_Salat_Handbook.pdf",
    category: "Wudhu & Salat Ahkam",
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
  const [selectedSectFilter, setSelectedSectFilter] = useState<string>("all");
  const [dbStatus, setDbStatus] = useState<"connected" | "synced" | "loading">("loading");

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>(RESOURCE_CATEGORIES[0]);
  const [sect, setSect] = useState<UploadedDocument["sect"]>("universal");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<UploadedDocument | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load documents directly from Supabase Database API
  useEffect(() => {
    async function loadDatabaseResources() {
      try {
        const res = await fetch("/api/admin/resources");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.documents)) {
            setDocuments(json.documents);
            setDbStatus(json.source === "database" ? "connected" : "synced");
            return;
          }
        }
      } catch (err) {
        console.warn("[Admin Resources] Failed to fetch from database API, using localStorage:", err);
      }

      // Fallback: load localStorage
      try {
        const stored = localStorage.getItem("academy_admin_uploaded_pdfs");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setDocuments(parsed);
          }
        }
      } catch {}
      setDbStatus("synced");
    }

    loadDatabaseResources();
  }, []);

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

  const handleUploadSubmit = async (e: React.FormEvent) => {
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

    try {
      // 1. Read file as base64 data URL
      const fileDataUrl: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      const sizeMb = (selectedFile.size / (1024 * 1024)).toFixed(1);

      // 2. Persist directly to Supabase PostgreSQL Database via API
      const payload = {
        title: title.trim(),
        fileName: selectedFile.name,
        category,
        sect,
        fileSize: `${sizeMb} MB`,
        description: description.trim() || "Uploaded via Academy Admin Portal.",
        fileDataUrl,
        uploadedBy: "Super Admin"
      };

      const res = await fetch("/api/admin/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const resJson = await res.json();
      if (!res.ok || !resJson.success) {
        throw new Error(resJson.error || "Failed to persist to database");
      }

      const savedDoc: UploadedDocument = resJson.document;
      const updatedDocs = [savedDoc, ...documents];
      setDocuments(updatedDocs);

      try {
        localStorage.setItem("academy_admin_uploaded_pdfs", JSON.stringify(updatedDocs));
      } catch {}

      setIsUploading(false);
      setSelectedFile(null);
      setTitle("");
      setDescription("");
      if (fileInputRef.current) fileInputRef.current.value = "";

      toast.success(
        resJson.source === "database"
          ? `"${savedDoc.title}" saved directly to PostgreSQL Database!`
          : `"${savedDoc.title}" uploaded and persisted successfully!`,
        { icon: "💾" }
      );
    } catch (err) {
      setIsUploading(false);
      toast.error(err instanceof Error ? err.message : "Upload failed");
    }
  };

  const handleDelete = async (id: string, docTitle: string) => {
    if (!confirm(`Are you sure you want to remove "${docTitle}" from the database?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/resources?id=${encodeURIComponent(id)}`, {
        method: "DELETE"
      });
      const resJson = await res.json();

      if (!res.ok || !resJson.success) {
        throw new Error(resJson.error || "Delete failed");
      }

      const updated = documents.filter((d) => d.id !== id);
      setDocuments(updated);
      try {
        localStorage.setItem("academy_admin_uploaded_pdfs", JSON.stringify(updated));
      } catch {}

      toast.success("Document removed from database.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "All" || doc.category === selectedCategory;
    const matchesSect = selectedSectFilter === "all" || doc.sect === selectedSectFilter || doc.sect === "universal";
    return matchesSearch && matchesCat && matchesSect;
  });

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full text-white">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-3xl md:text-4xl font-serif text-white">Academy Database &amp; Content Desk</h1>
            <span className="flex items-center gap-1 text-[11px] font-bold bg-emerald-950/80 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
              <Database size={12} className="text-emerald-400" />
              <span>{dbStatus === "connected" ? "PostgreSQL Database Active" : "Database Synced"}</span>
            </span>
          </div>
          <p className="text-emerald-100/80 text-sm max-w-2xl">
            Upload and manage official academy PDF materials across all categories for both Shia and Sunni curricula. All submissions are saved directly to the database.
          </p>
        </div>

        <div className="text-xs font-bold text-amber-300 bg-black/40 border border-white/10 px-3.5 py-1.5 rounded-full shadow-sm">
          {documents.length} Resources Persisted in Database
        </div>
      </header>

      {/* Top Upload Section */}
      <div className="glass-container rounded-3xl p-6 md:p-8 border border-white/15 shadow-2xl mb-10">
        <h2 className="text-xl font-bold font-serif text-white mb-4 flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-amber-300" />
          <span>Upload New Resource to Database (PDF)</span>
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
                  ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to save to database`
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
                placeholder="e.g. Complete Dua Kumayl with Arabic & English Tafseer"
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
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              >
                {RESOURCE_CATEGORIES.filter((cat) => (sect === "sunni" ? !cat.toLowerCase().includes("ziar") : true)).map((cat) => (
                  <option key={cat} value={cat} className="bg-emerald-950 text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-100/80 uppercase tracking-wider mb-2">
                Sect Association
              </label>
              <select
                value={sect}
                onChange={(e) => {
                  const newSect = e.target.value as UploadedDocument["sect"];
                  setSect(newSect);
                  if (newSect === "sunni" && category.toLowerCase().includes("ziar")) {
                    setCategory(RESOURCE_CATEGORIES[0]);
                  }
                }}
                className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              >
                <option value="universal" className="bg-emerald-950 text-white">
                  Universal (All Muslims / Shia &amp; Sunni)
                </option>
                <option value="shia" className="bg-emerald-950 text-white">
                  Shia (Ja&apos;fari School of Ahlulbayt)
                </option>
                <option value="sunni" className="bg-emerald-950 text-white">
                  Sunni (Hanafi, Shafi&apos;i, Maliki, Hanbali)
                </option>
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
                placeholder="Verified source, author, edition details, or classroom instructions..."
                className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-emerald-200/70 flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span>Direct database persistence enabled</span>
            </span>

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
              <span>{isUploading ? "Persisting to Database..." : "Save Directly to Database"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-200/60" />
          <input
            type="text"
            placeholder="Search documents by title or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/20 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-black/40 border border-white/20 text-emerald-100 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="All">All Categories</option>
            {RESOURCE_CATEGORIES.filter((cat) =>
              selectedSectFilter === "sunni" ? !cat.toLowerCase().includes("ziar") : true
            ).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={selectedSectFilter}
            onChange={(e) => setSelectedSectFilter(e.target.value)}
            className="bg-black/40 border border-white/20 text-emerald-100 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="all">All Sects</option>
            <option value="universal">Universal</option>
            <option value="shia">Shia Only</option>
            <option value="sunni">Sunni Only</option>
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="glass-container rounded-3xl border border-white/15 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/40 text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                <th className="py-4 px-6">Document</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Sect</th>
                <th className="py-4 px-6">Size</th>
                <th className="py-4 px-6">Date Added</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-xs">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-emerald-100/60">
                    No matching PDF documents found in database.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0">
                          <FileText size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm line-clamp-1">{doc.title}</p>
                          <p className="text-[11px] text-emerald-100/60 font-mono">{doc.fileName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-emerald-200 bg-white/5 px-2.5 py-1 rounded-md border border-white/10 text-[11px]">
                        {doc.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          doc.sect === "shia"
                            ? "bg-amber-400/10 text-amber-300 border-amber-400/30"
                            : doc.sect === "sunni"
                            ? "bg-emerald-400/10 text-emerald-300 border-emerald-400/30"
                            : "bg-white/10 text-emerald-100 border-white/20"
                        }`}
                      >
                        {doc.sect.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-emerald-100/80 font-mono">{doc.fileSize}</td>
                    <td className="py-4 px-6 text-emerald-100/80">{doc.uploadDate}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {doc.fileDataUrl && (
                          <button
                            onClick={() => setPreviewDoc(doc)}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-100 hover:text-white transition cursor-pointer"
                            title="Preview PDF Document"
                          >
                            <Eye size={15} />
                          </button>
                        )}
                        {doc.fileDataUrl ? (
                          <a
                            href={doc.fileDataUrl}
                            download={doc.fileName}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-100 hover:text-white transition cursor-pointer inline-block"
                            title="Download PDF"
                          >
                            <Download size={15} />
                          </a>
                        ) : null}
                        <button
                          onClick={() => handleDelete(doc.id, doc.title)}
                          className="p-2 rounded-lg bg-white/10 hover:bg-red-950/80 text-emerald-100 hover:text-red-300 transition cursor-pointer"
                          title="Delete from Database"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PDF Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#031d16] border border-white/20 rounded-3xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
              <div className="flex items-center gap-3">
                <FileText className="text-red-400" size={20} />
                <div>
                  <h3 className="text-sm font-bold text-white truncate max-w-md">{previewDoc.title}</h3>
                  <p className="text-[11px] text-emerald-100/60 font-mono">{previewDoc.fileName}</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-100 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 bg-black/20 p-2 overflow-hidden">
              {previewDoc.fileDataUrl ? (
                <iframe
                  src={previewDoc.fileDataUrl}
                  className="w-full h-full rounded-2xl border border-white/10"
                  title="PDF In-App Viewer"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-emerald-100/60 text-sm">
                  Preview not available for this record.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
