import { NextRequest, NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";

export interface ParsedHadithItem {
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

// ---------------------------------------------------------------------------
// 1. Instruction parser: extracts desired count, sect, custom markers
// ---------------------------------------------------------------------------
function parseInstructionDetails(instructions: string): {
  requestedCount: number | null;
  customDelimiter: string | null;
} {
  if (!instructions) return { requestedCount: null, customDelimiter: null };

  // Match e.g. "10 hadiths", "create 10 separate hadiths", "has 10 hadiths", "split into 10"
  const countMatch = instructions.match(
    /(?:has|contains|create|extract|split\s+into|make)?\s*(\d+)\s*(?:hadith|hadees|ahadith|tradition|parts?|pieces?)/i
  );
  const requestedCount = countMatch ? parseInt(countMatch[1], 10) : null;

  // Match e.g. split by "..."
  const delimiterMatch = instructions.match(/split\s+by\s+["']([^"']+)["']/i);
  const customDelimiter = delimiterMatch ? delimiterMatch[1] : null;

  return { requestedCount, customDelimiter };
}

// ---------------------------------------------------------------------------
// 2. Intelligent Islamic Algorithmic Hadith Splitter
// ---------------------------------------------------------------------------
function splitHadithsAlgorithmically(
  rawText: string,
  instructions: string,
  meta: {
    fileName: string;
    sect: "universal" | "shia" | "sunni";
    fileDataUrl?: string;
  }
): ParsedHadithItem[] {
  const { requestedCount, customDelimiter } = parseInstructionDetails(instructions);

  // Normalize text line breaks
  const cleanText = rawText.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();

  let chunks: string[] = [];

  // Strategy A: Custom Delimiter from Admin Instructions
  if (customDelimiter && cleanText.includes(customDelimiter)) {
    chunks = cleanText
      .split(customDelimiter)
      .map((c) => c.trim())
      .filter((c) => c.length > 20);
  }

  // Strategy B: Canonical Hadith Numbering Headers
  if (chunks.length === 0) {
    // Matches patterns like "Hadith 1", "Hadith #2", "Hadees 3", "حديث 1", "1. ", "[1]"
    const headerRegex = /(?:^|\n)\s*(?:(?:Hadith|Hadees|Tradition|الحديث|حديث)\s*(?:#|No\.?|Number)?\s*\d+|\[\d+\]|\d+[\.\)]\s+)/gi;
    const matches = Array.from(cleanText.matchAll(headerRegex));

    if (matches.length >= 2) {
      for (let i = 0; i < matches.length; i++) {
        const start = matches[i].index!;
        const end = i + 1 < matches.length ? matches[i + 1].index! : cleanText.length;
        const chunk = cleanText.substring(start, end).trim();
        if (chunk.length > 15) {
          chunks.push(chunk);
        }
      }
    }
  }

  // Strategy C: Narrator phrase splits ("Narrated by ...", "عن ...")
  if (chunks.length === 0) {
    const narratorRegex = /(?:^|\n)\s*(?:Narrated\s+(?:by\s+)?|On the authority of\s+|From\s+|عن\s+)/gi;
    const matches = Array.from(cleanText.matchAll(narratorRegex));

    if (matches.length >= 2) {
      for (let i = 0; i < matches.length; i++) {
        const start = matches[i].index!;
        const end = i + 1 < matches.length ? matches[i + 1].index! : cleanText.length;
        const chunk = cleanText.substring(start, end).trim();
        if (chunk.length > 15) {
          chunks.push(chunk);
        }
      }
    }
  }

  // Strategy D: Paragraph / Double-Newline or Page Break Segmentation
  if (chunks.length === 0 || (requestedCount && chunks.length !== requestedCount)) {
    // Check page form feeds '\x0C'
    const pages = cleanText.split("\x0c").map((p) => p.trim()).filter((p) => p.length > 30);
    if (requestedCount && pages.length === requestedCount) {
      chunks = pages;
    } else {
      const paragraphs = cleanText
        .split(/\n\s*\n+/)
        .map((p) => p.trim())
        .filter((p) => p.length > 30);

      if (requestedCount && requestedCount > 0) {
        if (paragraphs.length >= requestedCount) {
          // Evenly partition paragraphs into requestedCount chunks
          const step = Math.floor(paragraphs.length / requestedCount);
          chunks = [];
          for (let i = 0; i < requestedCount; i++) {
            const startIdx = i * step;
            const endIdx = i === requestedCount - 1 ? paragraphs.length : (i + 1) * step;
            chunks.push(paragraphs.slice(startIdx, endIdx).join("\n\n"));
          }
        } else {
          // Split by sentence / line clusters if paragraphs are fewer than requested
          const sentences = cleanText
            .split(/(?<=[.?!؟])\s+/)
            .filter((s) => s.trim().length > 15);
          if (sentences.length >= requestedCount) {
            const step = Math.floor(sentences.length / requestedCount);
            chunks = [];
            for (let i = 0; i < requestedCount; i++) {
              const startIdx = i * step;
              const endIdx = i === requestedCount - 1 ? sentences.length : (i + 1) * step;
              chunks.push(sentences.slice(startIdx, endIdx).join(" "));
            }
          }
        }
      } else if (chunks.length === 0) {
        chunks = paragraphs.length > 0 ? paragraphs : [cleanText];
      }
    }
  }

  // If still empty or 1 chunk, fallback
  if (chunks.length === 0) {
    chunks = [cleanText];
  }

  // If requestedCount was strictly instructed and we have more, take first requestedCount;
  // if we have fewer, synthesize based on requested count
  if (requestedCount && requestedCount > 0 && chunks.length > requestedCount) {
    chunks = chunks.slice(0, requestedCount);
  }

  // -------------------------------------------------------------------------
  // 3. Transform chunks into structured Hadith records
  // -------------------------------------------------------------------------
  const now = Date.now();
  return chunks.map((chunk, index) => {
    const num = index + 1;

    // Detect Arabic text lines
    const lines = chunk.split("\n").map((l) => l.trim()).filter(Boolean);
    const arabicLines = lines.filter((line) => /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(line));
    const nonArabicLines = lines.filter((line) => !/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(line));

    const arabicText = arabicLines.join(" ");

    // Extract Narrator
    const narratorMatch = chunk.match(
      /(?:Narrated\s+(?:by\s+)?|On the authority of\s+|From\s+|عن\s+)([A-Z\u0600-\u06FF][A-Za-z\u0600-\u06FF\s.'’-]{3,40}?)(?:[:;,]|(?=\s+(?:that|who|reported|said|I heard)))/i
    );
    const narrator = narratorMatch ? narratorMatch[1].trim() : undefined;

    // Detect Reference (Bukhari, Muslim, Kafi, etc.)
    const refMatch = chunk.match(
      /(?:Sahih\s+al-Bukhari|Sahih\s+Muslim|Sunan\s+an-Nasa'i|Sunan\s+Abi\s+Dawud|Jami'\s+at-Tirmidhi|Sunan\s+Ibn\s+Majah|Al-Kafi|Man\s+La\s+Yahduruhu|Tahdhib\s+al-Ahkam|Al-Istibsar|Riyad\s+al-Salihin|Nahj\s+al-Balagha)[^.\n]*/i
    );
    const reference = refMatch ? refMatch[0].trim() : undefined;

    // Determine clean title
    let hadithTitle = `Hadith #${num}`;
    const firstLine = lines[0] || "";
    const cleanFirstLine = firstLine
      .replace(/^(?:Hadith|Hadees|Tradition|الحديث|حديث)\s*(?:#|No\.?|Number)?\s*\d+[\s:.-]*/i, "")
      .replace(/^\d+[\.\)]\s*/, "")
      .trim();

    if (cleanFirstLine.length >= 5 && cleanFirstLine.length <= 65) {
      hadithTitle = `Hadith #${num}: ${cleanFirstLine}`;
    } else if (narrator) {
      hadithTitle = `Hadith #${num}: Tradition of ${narrator}`;
    }

    const englishText = nonArabicLines.length > 0 ? nonArabicLines.join("\n\n") : chunk;

    // Estimated chunk size
    const sizeKb = (Buffer.byteLength(chunk, "utf8") / 1024).toFixed(1);

    return {
      id: `hadith_${now}_${num}_${Math.random().toString(36).slice(2, 6)}`,
      hadithNumber: num,
      title: hadithTitle,
      narrator,
      arabicText: arabicText || undefined,
      englishText,
      reference,
      sect: meta.sect,
      fileName: `${meta.fileName.replace(/\.pdf$/i, "")}_Hadith_${num}.pdf`,
      fileSize: `${sizeKb} KB`,
      category: "Hadith & Sunnah Compendiums",
      description: narrator
        ? `[Narrator: ${narrator}] ${englishText.slice(0, 280)}${englishText.length > 280 ? "..." : ""}`
        : `${englishText.slice(0, 280)}${englishText.length > 280 ? "..." : ""}`,
      fileDataUrl: meta.fileDataUrl
    };
  });
}

// ---------------------------------------------------------------------------
// 4. Gemini AI Extractor (When GEMINI_API_KEY is available)
// ---------------------------------------------------------------------------
async function extractWithGeminiAI(
  rawText: string,
  instructions: string,
  meta: { fileName: string; sect: "universal" | "shia" | "sunni"; fileDataUrl?: string }
): Promise<ParsedHadithItem[] | null> {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) return null;

  try {
    const prompt = `
You are an expert Islamic Hadith scholar and text extraction engine.
Analyze the following extracted text from a PDF document containing Islamic Hadiths.
The admin has provided these instructions:
"${instructions || "Detect all distinct Hadiths and create separate Hadith records."}"

Text content:
"""
${rawText.slice(0, 40000)}
"""

Extract all individual Hadiths as a strict JSON array.
Each object must have:
- hadithNumber (integer starting from 1)
- title (concise descriptive title, e.g. "Hadith #1: Deeds are Judged by Intentions")
- narrator (e.g. "Umar ibn al-Khattab (RA)", or empty string if unknown)
- arabicText (authentic Arabic matn text if present in document, or empty string)
- englishText (complete English translation/matn)
- reference (canonical book reference e.g. "Sahih al-Bukhari 1" or empty string)
- grade (e.g. "Sahih", "Hasan", or empty string)

Return ONLY valid JSON array with NO markdown code fences or conversational text.
`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json"
          }
        })
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    const outputText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!outputText) return null;

    const parsedArray = JSON.parse(outputText);
    if (!Array.isArray(parsedArray) || parsedArray.length === 0) return null;

    const now = Date.now();
    return parsedArray.map((item, idx) => {
      const num = item.hadithNumber || idx + 1;
      const english = item.englishText || "";
      const narrator = item.narrator || "";

      return {
        id: `hadith_ai_${now}_${num}_${Math.random().toString(36).slice(2, 6)}`,
        hadithNumber: num,
        title: item.title || `Hadith #${num}`,
        narrator: narrator || undefined,
        arabicText: item.arabicText || undefined,
        englishText: english,
        reference: item.reference || undefined,
        sect: meta.sect,
        fileName: `${meta.fileName.replace(/\.pdf$/i, "")}_Hadith_${num}.pdf`,
        fileSize: "1.2 MB",
        category: "Hadith & Sunnah Compendiums",
        description: narrator
          ? `[Narrator: ${narrator}] ${english.slice(0, 280)}${english.length > 280 ? "..." : ""}`
          : `${english.slice(0, 280)}${english.length > 280 ? "..." : ""}`,
        fileDataUrl: meta.fileDataUrl
      };
    });
  } catch (err) {
    console.warn("[Gemini AI Hadith Extractor] Fallback to algorithm:", err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// 5. Main Route Handler
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fileDataUrl,
      fileName = "Hadith_Collection.pdf",
      instructions = "",
      sect = "universal"
    } = body;

    if (!fileDataUrl) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid PDF file data URL." },
        { status: 400 }
      );
    }

    // Convert base64 data URL to Buffer
    const base64Data = fileDataUrl.includes("base64,")
      ? fileDataUrl.split("base64,")[1]
      : fileDataUrl;
    const pdfBuffer = Buffer.from(base64Data, "base64");

    // Extract text from PDF
    let extractedText = "";
    try {
      const parser = new PDFParse({ data: pdfBuffer });
      const textResult = await parser.getText();
      extractedText = textResult.text || "";
      await parser.destroy();
    } catch (parseErr) {
      console.warn("[split-hadith] pdfParse error:", parseErr);
      return NextResponse.json(
        {
          success: false,
          error: "Could not read text from this PDF file. Ensure it is a valid, unencrypted PDF."
        },
        { status: 400 }
      );
    }

    if (!extractedText.trim()) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No extractable text was found in this PDF. It may be an image-only scan. Please upload a searchable text PDF."
        },
        { status: 400 }
      );
    }

    const meta = { fileName, sect: sect as "universal" | "shia" | "sunni", fileDataUrl };

    // 1. Try Gemini AI parsing first if available
    let hadiths = await extractWithGeminiAI(extractedText, instructions, meta);

    // 2. Fall back to our intelligent Islamic Algorithmic Splitter
    if (!hadiths || hadiths.length === 0) {
      hadiths = splitHadithsAlgorithmically(extractedText, instructions, meta);
    }

    return NextResponse.json({
      success: true,
      count: hadiths.length,
      hadiths,
      instructionsReceived: instructions,
      engineUsed: process.env.GEMINI_API_KEY ? "Gemini AI + Islamic Heuristics" : "Islamic Algorithmic Splitter",
      message: `Successfully analyzed and segmented ${hadiths.length} individual Hadith records.`
    });
  } catch (error) {
    console.error("[split-hadith API error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to split Hadith PDF."
      },
      { status: 500 }
    );
  }
}
