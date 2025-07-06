// 📂 generateFinancePdf.jsx

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import amiriFont from "./amiriFont";

// إضافة الخط العربي للاحتياط في الجدول
jsPDF.API.events.push(['addFonts', function () {
    this.addFileToVFS("Amiri-Regular.ttf", amiriFont);
    this.addFont("Amiri-Regular.ttf", "Amiri-Regular", "normal");
}]);

export function generateFinancePdf(financeTableData, headerData = {}) {
    const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
    doc.setFont("Amiri-Regular", "normal");
    doc.setFontSize(16);

    const pageWidth = doc.internal.pageSize.getWidth();
    const startY = 20;
    const lineHeight = 8;

    // العنوان
    doc.text("معاينة قيد اليومية", pageWidth / 2, startY, { align: "center" });
    doc.setFontSize(14);

    // المستخدم
    const userText = headerData.user || "-";
    doc.text("المستخدم:", pageWidth - 20, startY + lineHeight, { align: "right" });
    doc.text(userText, pageWidth - 60, startY + lineHeight, { align: "right" });

    // التاريخ والوقت
    const now = new Date();
    const dateText = headerData.date || now.toLocaleDateString("en-GB"); // "06/07/2025"
    const timeText = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }); // "14:32:11"

    // LTR Isolation للتاريخ
    const ltrDate = `\u202A${dateText}\u202C`;

    doc.text("تاريخ القيد:", pageWidth - 20, startY + lineHeight * 2, { align: "right" });
    doc.text(ltrDate, pageWidth - 60, startY + lineHeight * 2, { align: "right" });

    doc.text(`وقت الطباعة: ${timeText}`, pageWidth - 20, startY + lineHeight * 3, { align: "right" });

    // بيانات الجدول
    const tableBody = financeTableData.map(item => [
        (Number(item.debitAmount) || 0).toFixed(2),
        item.debitAccount || "-",
        (Number(item.creditAmount) || 0).toFixed(2),
        item.creditAccount || "-"
    ]);

    const totalDebit = financeTableData.reduce((acc, item) => acc + (Number(item.debitAmount) || 0), 0);
    const totalCredit = financeTableData.reduce((acc, item) => acc + (Number(item.creditAmount) || 0), 0);

    tableBody.push([
        totalDebit.toFixed(2),
        "إجمالي مدين",
        totalCredit.toFixed(2),
        "إجمالي دائن"
    ]);

    autoTable(doc, {
        head: [[
            "المبلغ",
            "الطرف المدين",
            "المبلغ",
            "الطرف الدائن"
        ]],
        body: tableBody,
        startY: startY + lineHeight * 5,
        rtl: true,
        styles: {
            font: "Amiri-Regular",
            fontStyle: "normal",
            fontSize: 12,
            halign: "right"
        },
        headStyles: {
            fillColor: [41, 128, 185],
            textColor: "#fff",
            fontStyle: "normal",
            halign: "right"
        },
        margin: { left: 10, right: 10 }
    });

    doc.save("معاينة_قيد_يومية.pdf");
}