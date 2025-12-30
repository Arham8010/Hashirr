import React, { useEffect, useMemo, useState } from "react";
import { TextileRecord } from "./types";
import Dashboard from "./components/Dashboard";
import RecordRow from "./components/RecordRow";
import RecordForm from "./components/RecordForm";
import { analyzeRecords } from "./services/geminiService";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const App: React.FC = () => {
  /* ---------------- USER SESSION ---------------- */
  const [currentUserId, setCurrentUserId] = useState<string>("");

  useEffect(() => {
    let id = localStorage.getItem("textrack_user_id");
    if (!id) {
      id = "user_" + Math.random().toString(36).substring(2, 9);
      localStorage.setItem("textrack_user_id", id);
    }
    setCurrentUserId(id);
  }, []);

  if (!currentUserId) return null; // prevent hydration issues

  /* ---------------- RECORDS ---------------- */
  const [records, setRecords] = useState<TextileRecord[]>(() => {
    const saved = localStorage.getItem("textrack_records_simplified_v2");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "textrack_records_simplified_v2",
      JSON.stringify(records)
    );
  }, [records]);

  /* ---------------- UI STATE ---------------- */
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] =
    useState<TextileRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  /* ---------------- AI ---------------- */
  const [aiInsight, setAiInsight] = useState("");
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);

  const generateAiInsight = async () => {
    try {
      setIsAiAnalyzing(true);
      const insight = await analyzeRecords(records);
      setAiInsight(insight);
    } catch (error) {
      console.error("Gemini error:", error);
      setAiInsight(
        "AI service is unavailable. Please check configuration."
      );
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  /* ---------------- CRUD ---------------- */
  const handleSaveRecord = (
    data: Omit<TextileRecord, "id" | "createdAt" | "updatedAt" | "createdBy">
  ) => {
    if (editingRecord) {
      if (editingRecord.createdBy !== currentUserId) {
        alert("Permission denied.");
        return;
      }
      setRecords((prev) =>
        prev.map((r) =>
          r.id === editingRecord.id
            ? { ...r, ...data, updatedAt: Date.now() }
            : r
        )
      );
    } else {
      setRecords((prev) => [
        {
          ...data,
          id: Math.random().toString(36).substring(2, 9),
          createdBy: currentUserId,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        ...prev,
      ]);
    }

    setIsFormOpen(false);
    setEditingRecord(null);
  };

  const handleDeleteRecord = (id: string) => {
    const rec = records.find((r) => r.id === id);
    if (rec?.createdBy !== currentUserId) {
      alert("Permission denied.");
      return;
    }
    if (window.confirm("Delete this record?")) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleEditRecord = (record: TextileRecord) => {
    if (record.createdBy !== currentUserId) {
      alert("Record locked.");
      return;
    }
    setEditingRecord(record);
    setIsFormOpen(true);
  };

  /* ---------------- FILTER ---------------- */
  const filteredRecords = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return records.filter(
      (r) =>
        r.doriDetail.toLowerCase().includes(q) ||
        r.warpinDetail.toLowerCase().includes(q) ||
        r.bheemDetail.toLowerCase().includes(q) ||
        r.deliveryDetail.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.entryDate.toLowerCase().includes(q)
    );
  }, [records, searchQuery]);

  /* ---------------- GROUP ---------------- */
  const groupedRecords = useMemo(() => {
    const groups: Record<string, TextileRecord[]> = {};
    filteredRecords.forEach((r) => {
      const label = new Date(
        r.entryDate + "T12:00:00"
      ).toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!groups[label]) groups[label] = [];
      groups[label].push(r);
    });
    return groups;
  }, [filteredRecords]);

  /* ---------------- PDF ---------------- */
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Hashir's Office Ledger", 14, 20);

    (doc as any).autoTable({
      startY: 30,
      head: [["Date", "Batch", "Dori", "Warpin", "Bheem", "Delivery"]],
      body: filteredRecords.map((r) => [
        r.entryDate,
        r.id.slice(0, 4),
        r.doriDetail,
        r.warpinDetail,
        r.bheemDetail,
        r.deliveryDetail,
      ]),
    });

    doc.save("ledger.pdf");
  };

  /* ---------------- RENDER ---------------- */
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="p-4 bg-white shadow flex justify-between">
        <h1 className="font-black text-indigo-600">HASHIR'S OFFICE</h1>
        <div className="flex gap-2">
          <button onClick={exportToPDF}>Export</button>
          <button onClick={() => setIsFormOpen(true)}>New Entry</button>
        </div>
      </header>

      <main className="p-6">
        <Dashboard records={records} />

        <button
          onClick={generateAiInsight}
          disabled={isAiAnalyzing}
          className="mt-4"
        >
          {isAiAnalyzing ? "Analyzing..." : "Analyze with AI"}
        </button>

        {aiInsight && <p className="mt-2 italic">{aiInsight}</p>}

        {Object.entries(groupedRecords).map(([date, items]) => (
          <div key={date} className="mt-6">
            <h3 className="font-bold">{date}</h3>
            <table className="w-full mt-2">
              <tbody>
                {items.map((r) => (
                  <RecordRow
                    key={r.id}
                    record={r}
                    currentUserId={currentUserId}
                    onEdit={handleEditRecord}
                    onDelete={handleDeleteRecord}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </main>

      {isFormOpen && (
        <RecordForm
          initialData={editingRecord}
          onSave={handleSaveRecord}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
