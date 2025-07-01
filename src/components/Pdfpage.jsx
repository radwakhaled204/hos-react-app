import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import amiriFont from "./amiriFont";

jsPDF.API.events.push(['addFonts', function () {
    this.addFileToVFS("Amiri-Regular.ttf", amiriFont);
    this.addFont("Amiri-Regular.ttf", "Amiri-Regular", "normal");
}]);

export function generatePreviewPdf(tableData) {
    const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
    doc.setFont("Amiri-Regular", "normal");
    doc.setFontSize(16);

    const pageWidth = doc.internal.pageSize.getWidth();
    doc.text("معاينة حركة المبيعات", pageWidth / 2, 20, { align: "center" });

    const tableBody = tableData.map(item => [
        
        item.tot_af || 0,
        ((item.price * (item.dis1 || 0)) / 100).toFixed(2),
        `${item.dis1 || 0}%`,
        item.price || 0,
        item.bons || 0,
        item.qun || 0,
        item.am_n || "-",
         item.name || "-",
        item.code || "-",
    ]);

    const totalQuantity = tableData.reduce((acc, item) => acc + (Number(item.qun) || 0), 0);
    const totalBonus = tableData.reduce((acc, item) => acc + (Number(item.bons) || 0), 0);
    const totalPrice = tableData.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
    const totalDiscount = tableData.reduce((acc, item) => acc + ((Number(item.price) * (Number(item.dis1) || 0)) / 100), 0);
    const totalAfterDiscount = tableData.reduce((acc, item) => acc + (Number(item.tot_af) || 0), 0);

    tableBody.push([
    
        totalAfterDiscount,
         totalDiscount.toFixed(2),
        "",
        totalPrice,
         totalBonus,
         totalQuantity,
        "",
        "",
        "الإجمالي",
    ]);

    autoTable(doc, {
        head: [[
        
            "القيمة بعد الخصم",
            "قيمة الخصم",
            "نسبة الخصم",
            "السعر",
            "بونص",
            "الكمية",
            "الوحدة",
            "الصنف",
            "الكود",
        ]],
        body: tableBody,
        startY: 30,
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

    doc.save("معاينة_حركة_المبيعات.pdf");
}
