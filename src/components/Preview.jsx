import React, { useState, useEffect } from "react";
import "../styles/invoiceComponent.css"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { generatePreviewPdf } from "./Pdfpage";


const Preview = () => {
  const [contextMenu, setContextMenu] = useState(null); 
  const [tableData, setTableData] = useState([
    { tot_af: 100 },
    { tot_af: 150 },
    { tot_af: 50 },
  ]);
// حساب الإجماليات
const totalQuantity = tableData.reduce((acc, item) => acc + (Number(item.qun) || 0), 0);
const totalBonus = tableData.reduce((acc, item) => acc + (Number(item.bons) || 0), 0);
const totalPrice = tableData.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
const totalDiscount = tableData.reduce(
  (acc, item) => acc + ((Number(item.price) * (Number(item.dis1) || 0)) / 100),
  0
);
const totalAfterDiscount = tableData.reduce((acc, item) => acc + (Number(item.tot_af) || 0), 0);

  return (
    <div className="header">
     <div className="review-container"> 
      <div className="review-section">
        <div className="review-form-grid">
          <label>المستخدم</label>
          <div className="review-input">
            <input type="text" name="permissionNumber" />
          </div>
          
          <label>تاريخ الإذن</label>
          <div className="review-input">
            <input type="text" name="permissionNumber" />
          </div>
          <label>العميل</label>
          <div className="review-input">
            <input type="text" name="permissionNumber" />
             <input type="text" name="permissionNumber" />           
          </div>
          <label>المخزن الفرعى</label>
          <div className="review-input">
            <input type="text" name="permissionNumber" />
             <input type="text" name="permissionNumber" />           
          </div>
        <div className="section table-section">

     <div className="review-table-scroll-wrapper">
  <table className="data-grid">
    <thead>
        <tr>
        <th>الكود</th> 
        <th style={{ width: "150px" }}>الصنف</th>
        <th style={{ width: "100px" }}>الوحدة</th>    
        <th style={{ width: "100px" }}>الكمية</th>
        <th style={{ width: "100px" }}>بونص</th>
        <th>السعر</th>
        <th>نسبة الخصم</th>
        <th>قيمة الخصم</th>           
        <th style={{ width: "100px" }}>القيمة بعد الخصم</th>
      </tr>
    </thead>
    <tbody>
      {tableData.map((item, index) => (
        <tr 
  key={index}
  onContextMenu={(e) => {
    e.preventDefault();
    setContextMenu({
      mouseX: e.clientX,
      mouseY: e.clientY,
      rowIndex: index,
    });
  }}>

          <td>{item.code || "-"}</td>
          <td>{item.name || "-"}</td>
          <td>{item.am_n || "-"}</td>
          <td>{item.qun || 0}</td>
          <td>{item.bons || 0}</td>
          <td>{item.price || 0}</td>
           <td>{item.dis1 || 0}%</td>
          <td>{((item.price * (item.dis1 || 0)) / 100).toFixed(2)}</td>
          <td>{item.tot_af || 0}</td>
        </tr>
      ))}
<tr style={{ fontWeight: "bold", backgroundColor: "#f9f9f9" }}>
  <td style={{ textAlign: "center", backgroundColor:" #007bff" , color:"white"}}>الإجمالي</td>
  <td colSpan="8"></td> 
</tr>

    </tbody>
  </table>
{contextMenu && (
  <div
    style={{
      position: "fixed",
      top: contextMenu.mouseY,
      left: contextMenu.mouseX,
      backgroundColor: "white",
      border: "1px solid #ccc",
      borderRadius: "6px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      zIndex: 9999,
      minWidth: "140px",
      overflow: "hidden"
    }}
    onMouseLeave={() => setContextMenu(null)}
  >
    {[

      { label: " طباعة الباركود", action: () => console.log("طباعة الباركود") },
      { label: " حساب معدلات", action: () => navigate("/preview") }
    ].map((item, idx) => (
      <div
        key={idx}
        onClick={() => {
          item.action();
          setContextMenu(null);
        }}
        style={{
          padding: "8px 12px",
          cursor: "pointer",
          fontSize: "14px",
          borderBottom: idx !== 3 ? "1px solid #eee" : "none",
          transition: "background 0.2s"
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0f4ff"}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
      >
        {item.label}
      </div>
    ))}
  </div>
)}
        </div> 
</div> 
        </div>
{/* <button
  onClick={() => {
    generatePreviewPdf(tableData, {
      totalQuantity,
      totalBonus,
      totalPrice,
      totalDiscount,
      totalAfterDiscount
    });
  }}
>
  طباعة PDF
</button> */}
      </div>
     </div>

 </div>
  );
};

export default Preview;
