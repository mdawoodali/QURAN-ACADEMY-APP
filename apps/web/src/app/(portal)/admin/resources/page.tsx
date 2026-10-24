"use client";

import { useState, useEffect, useRef } from "react";
import { 
  FileUp, FileText, Trash2, Download, Search, 
  UploadCloud, FileCheck, Eye, X, Database, CheckCircle2,
  BookOpen, Sparkles, Shield, Bookmark, Compass,
  Wand2, Layers, Loader2, Edit3
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

const INITIAL_DOCUMENTS: UploadedDocument[] = [];

export interface ParsedHadithPreview {
  id: string;
  hadithNumber: number;
  title: string;
  narrator?: string;
  arabicText?: string;
  englishText: string;
  reference?: string;
  sect: "universal" | "shia" | "sunni";
  fileName: string;
  fileSize: string;
  category: string;
  description: string;
  fileDataUrl?: string;
}

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

  // Hadith Multi-Record Splitter states
  const [enableHadithSplitter, setEnableHadithSplitter] = useState(false);
  const [hadithInstructions, setHadithInstructions] = useState("");
  const [isSplitting, setIsSplitting] = useState(false);
  const [previewHadiths, setPreviewHadiths] = useState<ParsedHadithPreview[] | null>(null);
  const [isBatchSaving, setIsBatchSaving] = useState(false);

  useEffect(() => {
    if (category === "Hadith & Sunnah Compendiums") {
      setEnableHadithSplitter(true);
      if (!hadithInstructions) {
        setHadithInstructions("This PDF has multiple hadiths, detect and create separate hadiths for each.");
      }
    }
  }, [category, hadithInstructions]);

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

  const handleSplitHadiths = async () => {
    if (!selectedFile) {
      toast.error("Please select a PDF document first.");
      return;
    }

    setIsSplitting(true);
    const toastId = toast.loading("Analyzing PDF & extracting Hadiths...");

    try {
      // Read file as base64 data URL
      const fileDataUrl: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      const res = await fetch("/api/admin/resources/split-hadith", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileDataUrl,
          fileName: selectedFile.name,
          instructions: hadithInstructions.trim(),
          sect
        })
      });

      const data = await res.json();
      toast.dismiss(toastId);

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to split Hadith PDF");
      }

      setPreviewHadiths(data.hadiths);
      toast.success(`Success! Detected and segmented ${data.count} separate Hadiths.`, { icon: "✨" });
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err instanceof Error ? err.message : "Failed to analyze PDF");
    } finally {
      setIsSplitting(false);
    }
  };

  const handleBatchSaveHadiths = async () => {
    if (!previewHadiths || previewHadiths.length === 0) return;
    setIsBatchSaving(true);
    const toastId = toast.loading(`Persisting ${previewHadiths.length} Hadiths to database...`);

    try {
      const res = await fetch("/api/admin/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batch: true,
          documents: previewHadiths
        })
      });

      const data = await res.json();
      toast.dismiss(toastId);

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save Hadiths to database");
      }

      const savedDocs: UploadedDocument[] = data.documents;
      const updatedDocs = [...savedDocs, ...documents];
      setDocuments(updatedDocs);

      try {
        localStorage.setItem("academy_admin_uploaded_pdfs", JSON.stringify(updatedDocs));
      } catch {}

      toast.success(`Saved all ${savedDocs.length} Hadiths directly to the database!`, { icon: "💾" });
      setPreviewHadiths(null);
      setSelectedFile(null);
      setTitle("");
      setDescription("");
      setHadithInstructions("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err instanceof Error ? err.message : "Batch save failed");
    } finally {
      setIsBatchSaving(false);
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

          {/* Smart Hadith Multi-Record Splitter Section */}
          <div className="bg-emerald-950/40 border border-amber-400/30 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/40 shadow-xs">
                  <Wand2 size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Smart Hadith Multi-Record Splitter</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      AI &amp; Pattern Extraction
                    </span>
                  </h3>
                  <p className="text-xs text-emerald-100/70">
                    If your PDF contains multiple Hadiths (e.g. 10 Hadiths in 1 file), this extracts and creates separate database records for each.
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer self-start sm:self-center">
                <input
                  type="checkbox"
                  checked={enableHadithSplitter}
                  onChange={(e) => setEnableHadithSplitter(e.target.checked)}
                  className="rounded border-white/20 text-amber-400 focus:ring-amber-400 w-4 h-4 bg-black/40"
                />
                <span className="text-xs font-bold text-amber-300">Enable Splitter</span>
              </label>
            </div>

            {enableHadithSplitter && (
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
                      Admin Instructions &amp; Desired Hadith Count
                    </label>
                    <span className="text-[11px] text-amber-300/80">Instruction Guided</span>
                  </div>
                  <textarea
                    rows={2}
                    value={hadithInstructions}
                    onChange={(e) => setHadithInstructions(e.target.value)}
                    placeholder='e.g., "This PDF has 10 hadiths, create 10 separate hadiths" or "Split into 5 hadiths by narrator"'
                    className="w-full bg-black/50 border border-amber-400/40 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                {/* Quick Instruction Presets */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-emerald-200/60 font-semibold">Quick Prompts:</span>
                  {[
                    "This PDF has 10 hadiths, create 10 separate hadiths",
                    "This PDF has 5 hadiths, create 5 separate hadiths",
                    "Extract 40 Hadiths (Arba'een collection)",
                    "Detect all hadiths automatically by narrator"
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setHadithInstructions(preset)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-emerald-100 transition cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSplitHadiths}
                    disabled={isSplitting || !selectedFile}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition shadow-md cursor-pointer ${
                      isSplitting || !selectedFile
                        ? "bg-white/10 text-white/40 cursor-not-allowed"
                        : "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-extrabold"
                    }`}
                  >
                    {isSplitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Analyzing &amp; Extracting Hadiths...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        <span>Detect &amp; Create Separate Hadiths</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
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
                  : "bg-emerald-800 hover:bg-emerald-700 border border-emerald-500/30 text-white"
              }`}
            >
              <UploadCloud size={18} />
              <span>{isUploading ? "Persisting to Database..." : "Save Single PDF to Database"}</span>
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

      {/* Extracted Hadiths Preview & Batch Save Modal */}
      {previewHadiths && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-[#031d16] border border-amber-400/30 rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center justify-center shadow-sm">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-white flex items-center gap-2">
                    <span>Detected {previewHadiths.length} Separate Hadiths</span>
                    <span className="text-[11px] font-sans font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-amber-300 border border-amber-400/30">
                      Ready for Database
                    </span>
                  </h3>
                  <p className="text-xs text-emerald-100/70">
                    Review and fine-tune titles, narrators, or translations before publishing to the live academy database.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setPreviewHadiths(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-100 hover:text-white cursor-pointer transition"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Hadiths Scrollable List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {previewHadiths.map((h, idx) => (
                <div
                  key={h.id || idx}
                  className="bg-black/40 border border-white/15 hover:border-amber-400/40 rounded-2xl p-4 sm:p-5 transition space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="w-7 h-7 rounded-lg bg-amber-400/15 border border-amber-400/30 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                        #{h.hadithNumber}
                      </span>
                      <input
                        type="text"
                        value={h.title}
                        onChange={(e) => {
                          const updated = [...previewHadiths];
                          updated[idx]!.title = e.target.value;
                          setPreviewHadiths(updated);
                        }}
                        className="bg-transparent border-b border-white/20 hover:border-amber-400 focus:border-amber-400 text-white font-serif font-bold text-sm sm:text-base px-1 py-0.5 w-full focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-200 border border-emerald-500/30">
                        {h.sect.toUpperCase()}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = previewHadiths.filter((_, i) => i !== idx);
                          setPreviewHadiths(updated);
                        }}
                        className="p-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 hover:text-red-100 hover:bg-red-900/60 transition cursor-pointer"
                        title="Remove this Hadith from batch"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Narrator Input */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-emerald-200/60 font-semibold shrink-0">Narrator:</span>
                    <input
                      type="text"
                      value={h.narrator || ""}
                      placeholder="e.g. Umar ibn al-Khattab (RA) or Imam Ja'far al-Sadiq (AS)"
                      onChange={(e) => {
                        const updated = [...previewHadiths];
                        updated[idx]!.narrator = e.target.value;
                        setPreviewHadiths(updated);
                      }}
                      className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-amber-200 placeholder:text-white/30 focus:outline-none focus:border-amber-400 flex-1"
                    />
                  </div>

                  {/* Arabic Text if detected */}
                  {h.arabicText && (
                    <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-xl p-3">
                      <span className="text-[10px] text-amber-300 font-mono block mb-1">Arabic Matn:</span>
                      <p className="font-arabic text-amber-200 text-base leading-relaxed text-right" dir="rtl">
                        {h.arabicText}
                      </p>
                    </div>
                  )}

                  {/* English Translation Text */}
                  <div>
                    <span className="text-[10px] text-emerald-200/60 font-mono block mb-1">English Translation &amp; Text:</span>
                    <textarea
                      rows={3}
                      value={h.englishText}
                      onChange={(e) => {
                        const updated = [...previewHadiths];
                        updated[idx]!.englishText = e.target.value;
                        updated[idx]!.description = `${h.narrator ? `[Narrator: ${h.narrator}] ` : ""}${e.target.value.slice(0, 280)}${e.target.value.length > 280 ? "..." : ""}`;
                        setPreviewHadiths(updated);
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-emerald-100/90 leading-relaxed focus:outline-none focus:border-amber-400 resize-y"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 sm:p-5 border-t border-white/10 bg-black/50 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0">
              <span className="text-xs text-emerald-200/80 font-mono">
                {previewHadiths.length} distinct records will be saved to Supabase PostgreSQL Database.
              </span>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setPreviewHadiths(null)}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition cursor-pointer"
                >
                  Discard
                </button>

                <button
                  type="button"
                  onClick={handleBatchSaveHadiths}
                  disabled={isBatchSaving || previewHadiths.length === 0}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition shadow-lg cursor-pointer ${
                    isBatchSaving || previewHadiths.length === 0
                      ? "bg-white/10 text-white/40 cursor-not-allowed"
                      : "bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold"
                  }`}
                >
                  {isBatchSaving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Saving to PostgreSQL Database...</span>
                    </>
                  ) : (
                    <>
                      <Database size={16} />
                      <span>Confirm &amp; Save All {previewHadiths.length} Hadiths to Database</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
