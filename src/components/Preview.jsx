import React, { useState } from "react"; 
import "../styles/invoiceComponent.css"; 
import { useNavigate } from "react-router-dom";

const Preview = () => {
  const navigate = useNavigate();  
  const [contextMenu, setContextMenu] = useState(null); 
  const [tableData, _setTableData] = useState([
    { code: "P01", name: "منتج 1", am_n: "علبة", qun: 2, bons: 1, price: 50, dis1: 10, tot_af: 90 },
    { code: "P02", name: "منتج 2", am_n: "كرتونة", qun: 1, bons: 0, price: 150, dis1: 5, tot_af: 142.5 },
    { code: "P03", name: "منتج 3", am_n: "كيس", qun: 3, bons: 0, price: 20, dis1: 0, tot_af: 60 },
  ]);


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
              <input type="text" name="userName" />
            </div>
            
            <label>تاريخ الإذن</label>
            <div className="review-input">
              <input type="date" name="permissionDate" />
            </div>

            <label>العميل</label>
            <div className="review-input">
              <input type="text" placeholder="اسم العميل" />
              <input type="text" placeholder="كود العميل" />           
            </div>

            <label>المخزن الفرعى</label>
            <div className="review-input">
              <input type="text" placeholder="اسم المخزن" />
              <input type="text" placeholder="كود المخزن" />           
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
                        }}
                      >
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

                    {/* صف الإجماليات */}
                    <tr style={{ fontWeight: "bold", backgroundColor: "#f9f9f9" }}>
                      <td style={{ textAlign: "center", backgroundColor:" #007bff" , color:"white"}}>الإجمالي</td>
                      <td></td>
                      <td></td>
                      <td>{totalQuantity}</td>
                      <td>{totalBonus}</td>
                      <td>{totalPrice}</td>
                      <td></td>
                      <td>{totalDiscount.toFixed(2)}</td>
                      <td>{totalAfterDiscount.toFixed(2)}</td>
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
                      { label: "طباعة الباركود", action: () => console.log("طباعة الباركود") },
                      { label: "حساب معدلات", action: () => navigate("/preview") }
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
                          borderBottom: idx !== 1 ? "1px solid #eee" : "none",
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
        </div>
      </div>
    </div>
  );
};

export default Preview;
