"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { RESERVATIONS, type ReservationStatus } from "@/lib/reservations";
import { UI } from "@/lib/itinerary";
import { useLanguage } from "@/components/itinerary/language-provider";

const STATUS_COLOR: Record<ReservationStatus, string> = {
  confirmed: "#1f6b3a",
  pending: "#b08534",
  cancelled: "#c0392b",
};

export function DownloadReservationsButton() {
  const { t, lang } = useLanguage();
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (loading) return;
    setLoading(true);
    try {
      // Code-split @react-pdf/renderer out of the initial bundle — only load on demand.
      const { renderReservationsPdf } = await import("./reservations-pdf");

      const generatedAt = new Date().toLocaleDateString(
        lang === "zh" ? "zh-TW" : "en-US",
        { year: "numeric", month: "long", day: "numeric" }
      );

      const blob = await renderReservationsPdf({
        heading: t(UI.reservationsTitle),
        brand: t(UI.brand),
        dates: t(UI.dates),
        generatedText: `${t(UI.pdfGenerated)} · ${generatedAt}`,
        labels: {
          confirmation: t(UI.confirmationNumber),
          phone: t(UI.phone),
          address: t(UI.address),
        },
        reservations: RESERVATIONS.map((r) => ({
          type: t(UI.resType[r.type]),
          status: t(UI.resStatus[r.status]),
          statusColor: STATUS_COLOR[r.status],
          title: t(r.title),
          dateLabel: t(r.dateLabel),
          confirmationNumbers: r.confirmationNumbers,
          phone: r.phone,
          address: r.address,
        })),
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "kyushu-reservations.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to generate reservations PDF", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-full bg-washi text-ink px-4 py-2.5 text-[0.78rem] tracking-wide font-medium transition-colors hover:bg-vermillion hover:text-washi disabled:cursor-wait disabled:opacity-70"
    >
      {loading ? (
        <Loader2 className="h-[15px] w-[15px] animate-spin" strokeWidth={1.9} />
      ) : (
        <Download className="h-[15px] w-[15px]" strokeWidth={1.9} />
      )}
      {loading ? t(UI.preparingDownload) : t(UI.downloadReservations)}
    </button>
  );
}
