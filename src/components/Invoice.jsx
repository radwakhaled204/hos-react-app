

import React, { useState, useEffect } from "react";
import "../styles/invoiceComponent.css"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { generatePreviewPdf } from "./Pdfpage";
import { generateFinancePdf } from "./generateFinancePdf";

const Invoice = () => {
  const navigate = useNavigate();

  // بيانات الجدول الرئيسية
  const [tableData, setTableData] = useState([
    { tot_af: 100 },
    { tot_af: 150 },
    { tot_af: 50 },
  ]);

  const totalQuantity = tableData.reduce((acc, item) => acc + (Number(item.qun) || 0), 0);
  const totalBonus = tableData.reduce((acc, item) => acc + (Number(item.bons) || 0), 0);
  const totalPrice = tableData.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
  const totalDiscount = tableData.reduce(
    (acc, item) => acc + ((Number(item.price) * (Number(item.dis1) || 0)) / 100),
    0
  );
  const totalAfterDiscount = tableData.reduce(
    (acc, item) => acc + (Number(item.tot_af) || 0),
    0
  );

  const [rows, setRows] = useState([
    {
      unit: "",
      quantity: 0,
      price: 0,
      discountPercent: 0,
      discountValue: 0,
      priceBeforeDiscount: 0,
      valueBeforeDiscount: 0,
      value: 0,
      afterDiscount: 0,
      finalDiscount: 0,
      bonus: 0,
      Itemname: "",
      checked: true,
      total1: 0,
      total2: 0,
      finalDiscountMain: 0,
      finalDiscountSmall1: 0,
      finalDiscountSmall2: 0,
      finalAfterDiscount: 0,
      finalTaxMain: 0,
      finalTaxSmall1: 0,
      finalInvoiceValue: 0,
      finalAdditionalTaxMain: 0,
      finalAdditionalTaxSmall: 0,
    },
  ]);
  const [sec_contextMenu, sec_setContextMenu] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [fromMainStores, setFromMainStores] = useState([]);
  const [fromSelectedMainStore, setFromSelectedMainStore] = useState("");
  const [fromSubStores, setFromSubStores] = useState([]);
  const [fromSelectedSubStore, setFromSelectedSubStore] = useState("");

  const [toMainStores, setToMainStores] = useState([]);
  const [toSelectedMainStore, setToSelectedMainStore] = useState("");
  const [toSubStores, setToSubStores] = useState([]);
  const [toSelectedSubStore, setToSelectedSubStore] = useState("");

  const [clientData, setClientData] = useState([]);
  const [SelectedClient, setSelectedClient] = useState("");

  const [itemCode, setItemCode] = useState("");
  const [itemName, setItemName] = useState("");
  const [nameSuggestions, setNameSuggestions] = useState([]);

  useEffect(() => {
    setRows((prevRows) =>
      prevRows.map((row) => ({
        ...row,
        total1: totalAfterDiscount,
      }))
    );
  }, [totalAfterDiscount]);

  useEffect(() => {
    const fetchFromStores = async () => {
      try {
        if (fromMainStores.length === 0) {
          const res1 = await axios.get("https://www.istpos.somee.com/api/Stoc/stoc1");
          setFromMainStores(res1.data);
        }
        if (fromSelectedMainStore) {
          const res = await axios.get(
            `https://www.istpos.somee.com/api/Stoc/stoc2?name1=${encodeURIComponent(fromSelectedMainStore)}`
          );
          setFromSubStores(res.data);
        } else {
          setFromSubStores([]);
        }
      } catch (e) {
        console.error("❌ خطأ في تحميل بيانات المخازن (من):", e);
      }
    };
    fetchFromStores();
  }, [fromSelectedMainStore]);

  useEffect(() => {
    const fetchToStores = async () => {
      try {
        if (toMainStores.length === 0) {
          const res1 = await axios.get("https://www.istpos.somee.com/api/Stoc/stoc1");
          setToMainStores(res1.data);
        }
        if (toSelectedMainStore) {
          const res = await axios.get(
            `https://www.istpos.somee.com/api/Stoc/stoc2?name1=${encodeURIComponent(toSelectedMainStore)}`
          );
          setToSubStores(res.data);
        } else {
          setToSubStores([]);
        }
      } catch (e) {
        console.error("❌ خطأ في تحميل بيانات المخازن (إلى):", e);
      }
    };
    fetchToStores();
  }, [toSelectedMainStore]);

useEffect(() => {
  const fetchInitialData = async () => {
    try {
      const params = {
        mang_n: "العيادات بالمركز الرئيسي",
        sav_flg: 0,
        user_n: "احمد محمد",
        stoc_lev1: fromSelectedMainStore, 
        stoc_lev2: fromSelectedSubStore,  
        type: "مبيعات"
      };

      const queryString = new URLSearchParams(params).toString();

      const res = await axios.get(`https://www.istpos.somee.com/api/Stoc/stoc_items_trans?${queryString}`);
      setTableData(res.data);
    } catch (e) {
      console.error("❌ خطأ في تحميل بيانات الأصناف:", e);
    }
  };

  fetchInitialData();
}, [fromSelectedMainStore, fromSelectedSubStore]);


  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get("https://www.istpos.somee.com/api/client/client");
        setClientData(res.data);
      } catch (e) {
        console.error("❌ خطأ في تحميل بيانات العملاء:", e);
      }
    };
    fetchClients();
  }, []);

  const handleTotalBox = (idx, field, value) => {
    const updatedRows = [...rows];
    const row = updatedRows[idx];

    row[field] = parseFloat(value) || 0;

    if (field === "finalDiscountMain" || field === "total1") {
      row.finalDiscountSmall1 = parseFloat(
        ((row.total1 * row.finalDiscountMain) / 100).toFixed(2)
      );
      row.finalAfterDiscount = parseFloat(
        (row.total1 - row.finalDiscountSmall1).toFixed(2)
      );
    }
    if (field === "finalTaxMain" || field === "total1") {
      row.finalTaxSmall1 = parseFloat(
        ((row.total1 * row.finalTaxMain) / 100).toFixed(2)
      );
      row.finalInvoiceValue = parseFloat(
        (row.finalAfterDiscount + row.finalTaxSmall1).toFixed(2)
      );
    }
    if (field === "finalAdditionalTaxMain" || field === "total1") {
      row.finalAdditionalTaxSmall = parseFloat(
        ((row.total1 * row.finalAdditionalTaxMain) / 100).toFixed(2)
      );
    }
    setRows(updatedRows);
  };

  const handleProductChange = (index, field, value) => {
    const updatedRows = [...rows];
    const row = updatedRows[index];

    row[field] = field === "unit" ? value : parseFloat(value) || 0;
    row.priceBeforeDiscount = row.price;
    row.discountValue = (row.price * row.discountPercent) / 100;
    row.afterDiscount = row.price - row.discountValue;
    row.valueBeforeDiscount = row.price * row.quantity;
    row.value = row.price * row.quantity;

    setRows(updatedRows);
  };

  const handleCodeChange = (e) => {
    setItemCode(e.target.value);
  };

  const handleNameChange = async (e) => {
    const value = e.target.value;
    setItemName(value);

    if (!value.trim()) {
      setNameSuggestions([]);
      return;
    }

    try {
      const res = await axios.get("https://www.istpos.somee.com/api/items/items");
      const filtered = res.data.filter((item) => item.name && item.name.startsWith(value));
      setNameSuggestions(filtered);
    } catch (e) {
      console.error("❌ خطأ في جلب اقتراحات الأصناف:", e);
      setNameSuggestions([]);
    }
  };

  const handleSelectSuggestion = async (item) => {
    setItemName(item.name);
    setItemCode(item.code);
    setNameSuggestions([]);
    await fetchItemData(item.code);
  };

  const fetchItemData = async (code) => {
    if (!code || code.trim() === "") {
      alert("يرجى إدخال كود الصنف أولاً");
      return;
    }
    try {
      const res = await axios.get(`https://www.istpos.somee.com/api/items/ItemPrice?code=${code}`);
      const fetched = res.data.map((item) => ({
        Itemname: item.name || "",
        unit: item.am_n || "كرتونة",
        quantity: item.qun || 0,
        price: item.sal || 0,
        discountPercent: item.dis1 || 0,
        discountValue: 0,
        priceBeforeDiscount: 0,
        valueBeforeDiscount: 0,
        value: 0,
        afterDiscount: 0,
        finalDiscount: 0,
        bonus: item.bons || 0,
        checked: true,
      }));
      setRows(fetched);
      if (res.data.length === 0) {
        setItemName('');
      } else if (res.data.length > 0) {
        setItemName(res.data[0].name || "");
      }
    } catch (e) {
      console.error("❌ خطأ في جلب بيانات الصنف:", e);
    }
  };

const handleAddItems = async () => {
  try {
    for (const row of rows) {
      if (!row.checked) {
        console.log(`✏️ الصف ${row.Itemname || row.code} غير محدد`);
        continue;
      }
      const payload = {
        stoc_lev1: fromSelectedMainStore,
        stoc_lev2: fromSelectedSubStore,
        mang_n: "العيادات بالمركز الرئيسي",
        type: "المبيعات",
        move_type: "string",
        stoc_lev1_t: "string",
        stoc_lev2_t: "string",
        req_noo: "string",
        pers1: "string",
        pers2: "string",
        cust_n: "string",
        code: row.code ? parseInt(row.code) : 0,
        name: row.Itemname || "string",
        cust_code: "string",
        fat_no: "string",
        sup_n: "string",
        sup_c: 0,
        sup_acc_code: "string",
        sup_acc_name: "string",
        user_acc_flg: 0,
        unit_price_cost: 0,
        total_price_cost: 0,
        move_no: 0,
        qun: row.quantity || 0,
        arj: 0,
        am_n: row.unit || "string",
        price: row.price || 0,
        qun1: 0,
        tot: row.priceBeforeDiscount || 0,
        sick_flg: 0,
        qun_tot: row.quantity || 0,
        bons: row.bonus || 0,
        num_type: "string",
        req_no: 0,
        sat_num: 0,
        esl_gr: "string",
        user_n: "احمد محمد",
        qun_flg: 0,
        type_no: 0,
        cost_tot: 0,
        dis1: row.discountPercent || 0,
        price_af: row.afterDiscount || 0,
        vis_flg: 0,
        tot_af: row.value || 0,
        add_per: 0,
        add_per_flg: 0,
        p_bar_code: row.p_bar_code || "string",
        stoc_cash_per: 0,
        stoc_crd_per: 0,
        mon_no: new Date().getMonth() + 1,
        year_no: new Date().getFullYear(),
        exp_date_flg: 0,
        mins_flg: 0,
        dis_price: row.discountValue || 0,  // ✅ مضاف مسبقاً

        // ✅ إضافة dis لحل الخطأ الحالي
        dis: row.discountValue || 0,       // أرسل القيمة نفسها أو 0
      };

      console.log("📡 Sending payload:", payload);
      await axios.post(
        "https://www.istpos.somee.com/api/Stoc/insert_stoc_items_trans",
        payload
      );
      console.log("✅ تم إضافة الصنف بنجاح");
    }

  const params = {
    mang_n: "العيادات بالمركز الرئيسي",
    sav_flg: 0,
    user_n: "احمد محمد",
    stoc_lev1: fromSelectedMainStore, 
    stoc_lev2: fromSelectedSubStore,  
    type: "مبيعات"
  };

  const queryString = new URLSearchParams(params).toString();

  const res = await axios.get(`https://www.istpos.somee.com/api/Stoc/stoc_items_trans?${queryString}`);
  setTableData(res.data);
  alert("✅ تم ترحيل الأصناف بنجاح");
} catch (e) {
  console.error("❌ خطأ أثناء الترحيل:", e.response?.data || e);
  alert(JSON.stringify(e.response?.data?.errors || e.response?.data || e));
}
};


  const financeTableData = [
    { debitAmount: "1500.00", debitAccount: "حساب المشتريات", creditAmount: "1500.00", creditAccount: "الصندوق" },
    { debitAmount: "2200.00", debitAccount: "المخزون", creditAmount: "2200.00", creditAccount: "البنك" },
    { debitAmount: "500.00", debitAccount: "حساب الأدوية", creditAmount: "500.00", creditAccount: "الموردين" },
    { debitAmount: "1000.00", debitAccount: "المصروفات العمومية", creditAmount: "1000.00", creditAccount: "الصندوق" },
  ];



  return (
    <div className="header">
     <div className="four-sections-container"> 
      <div className="section">
        <div className="form-grid">
          <label>رقم الفاتورة</label>
          <input type="text" name="invoiceNumber" />



          <label>رقم الإذن</label>
          <input type="text" name="permissionNumber" />


          <label>الكود</label>
          <input type="text" name="client" />
          <label>رقم دفترى</label>
          <input type="text" name="dafterNumber" />
          <label>من</label> 
             <input type="date" name="permissionDate1" />
        </div>
      </div>
      <div className="section">
        <div className="form-grid-2">
          <label>تاريخ الفاتورة</label>
          <input type="date" name="invoiceDate" />    
          <label>تاريخ الإذن</label>
          <input type="date" name="permissionDate" />                

          <label>العميل</label>
          <select  name="client"  value={SelectedClient}
      onChange={(e) => setSelectedClient(e.target.value)}>
            
      {clientData.map((store, idx) => (
        <option key={idx} value={store.name}>{store.name}</option>
      ))} 
          </select>   
          <label>المستلم</label>
          <select name="receiver">
            <option>اختر</option>
            <option value="sub1">1</option>
          </select>   
           <label>الى</label>    
      <input type="date" name="permissionDate2" />
        </div>
      </div>   
<div className="section card-section-dropdown">
  <div className="form-grid-vertical">
<div className="box-container full-span">
  <label style={{ textAlign: 'center' }}>من</label>
  <div className="select-row">
    <label>المخزن الرئيسي</label>
    <select
      name="mainStoreFrom"
      value={fromSelectedMainStore}
      onChange={(e) => setFromSelectedMainStore(e.target.value)}
    >
      <option value="">اختر</option>
      {fromMainStores.map((store, idx) => (
        <option key={idx} value={store.name}>{store.name}</option>
      ))}
    </select>
  </div>
  <div className="select-row">
    <label>المخزن الفرعي</label>
    <select name="subStoreFrom"
    value={fromSelectedSubStore}
     onChange={(e) => setFromSelectedSubStore(e.target.value)}>
      <option value="">اختر</option>
      {fromSubStores.map((store, idx) => (
        <option key={idx} value={store.name}>{store.name}</option>
      ))}
    </select>
  </div>
</div>

<div className="box-container full-span">
  <label style={{ textAlign: 'center' }}>إلى</label>
  <div className="select-row">
    <label>المخزن الرئيسي</label>
    <select
      name="mainStoreTo"
      value={toSelectedMainStore}
      onChange={(e) => setToSelectedMainStore(e.target.value)}
    >
      <option value="">اختر</option>
      {toMainStores.map((store, idx) => (
        <option key={idx} value={store.name}>{store.name}</option>
      ))}
    </select>
  </div>
  <div className="select-row">
    <label>المخزن الفرعي</label>
    <select name="subStoreTo">
      <option value="">اختر</option>
      {toSubStores.map((store, idx) => (
        <option key={idx} value={store.name}>{store.name}</option>
      ))}
    </select>
  </div>
</div>


  </div>
</div>
<div className="section table-section">
  <div className="date-grid-container">
       <div className="radio-group">
      <input type="text" name="type-text" value="المبيعات"/>
      <label className="radio-option">
        <input type="radio" name="status" value="registered" />
        مسجل
      </label>
      <label className="radio-option">
        <input type="radio" name="status" value="canceled" defaultChecked />
        ملغى
      </label>
      <label className="radio-option">
        <input type="radio" name="status" value="all" />
        الكل
      </label>
    </div> 
<div className="table-scroll-wrapper">
  <table className="data-grid">
    <thead>
      <tr>
        <th style={{ width: "150px" }}>الصنف</th>
        <th style={{ width: "100px" }}>الوحدة</th>    
        <th style={{ width: "100px" }}>الكمية</th>
        <th style={{ width: "100px" }}>بونص</th>           
        <th style={{ width: "100px" }}>القيمة بعد الخصم</th>
        <th>الكود</th> 
        <th>السعر</th>
        <th>نسبة الخصم</th>
        <th>قيمة الخصم</th>
        <th>سعر قبل الخصم</th>
        <th>قيمة قبل الخصم</th>
        <th>القيمة</th>
        <th>بعد الخصم</th>
        <th>خصم نهائي</th>
        <th>id</th>
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
              rowId: item.id, 
            });
          }}
        >
          <td>{item.name || "-"}</td>
          <td>{item.am_n || "-"}</td>
          <td>{item.qun || 0}</td>
          <td>{item.bons || 0}</td>
          <td>{item.tot_af || 0}</td>
          <td>{item.code || "-"}</td>
          <td>{item.price || 0}</td>
          <td>{item.dis1 || 0}%</td>
          <td>{((item.price * (item.dis1 || 0)) / 100).toFixed(2)}</td>
          <td>{item.price || 0}</td>
          <td>{(item.price * item.qun).toFixed(2)}</td>
          <td>{item.tot || 0}</td>
          <td>{item.price_af || 0}</td>
          <td>{item.finalDiscount || 0}</td>
          <td>{item.id || 0}</td>
        </tr>
      ))}
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
        { 
          label: " حذف الصف", 
          action: async () => {
            const id = contextMenu.rowId;
            if (!id) {
              alert("لا يوجد معرف للصف لحذفه.");
              return;
            }
            if (!window.confirm(`هل أنت متأكد من حذف id رقم ${id}؟`)) {
              return;
            }
            try {
              await axios.delete(`https://www.istpos.somee.com/api/Stoc/delete-item/${id}`);
              setTableData(prev =>
                prev.filter(row => row.id !== id)
              );
              alert("✅ تم حذف الصف بنجاح.");
            } catch (error) {
              console.error("خطأ أثناء حذف الصف:", error);
              alert("❌ حدث خطأ أثناء محاولة الحذف.");
            }
          } 
        },
        { 
          label: " معاينة", 
          action: () => {
generatePreviewPdf(tableData, {
  totalQuantity,
  totalBonus,
  totalPrice,
  totalDiscount,
  totalAfterDiscount,
  user: "أحمد محمد",
  permissionDate: "2025-07-02",
  client: "صيدلية النور",
  subStore: "المخزن الفرعي 1"
});

          } 
        },
        { 
          label: " طباعة الباركود", 
          action: () => {
            alert("ميزة طباعة الباركود لم تُفعّل بعد.");
          } 
        },
        { 
          label: " حذف الكل", 
          action: async () => {
            if (!window.confirm("هل أنت متأكد من حذف جميع الصفوف؟")) {
              return;
            }
            try {
            
              setTableData([]);
              alert("✅ تم حذف جميع الصفوف بنجاح.");
            } catch (error) {
              console.error("خطأ أثناء حذف الكل:", error);
              alert("❌ حدث خطأ أثناء محاولة حذف الكل.");
            }
          } 
        },
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
</div>
<div className="section-divider"></div>
      <div className="form-row-inline">
        <div className="form-group-inline">
          <label htmlFor="itemCode">كود الصنف</label>
<input
  type="text"
  name="itemCode"
  id="itemCode"
  value={itemCode}
  onChange={handleCodeChange}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      fetchItemData(itemCode);
    }
  }}
/>

        </div>

        <div className="form-group-inline">
          <label htmlFor="itemName">اسم الصنف</label>
<input
  type="text"
  name="Itemname"
  id="Itemname"
  value={itemName}
  onChange={handleNameChange}
  autoComplete="off"
/>
{ nameSuggestions.length > 0 && (
  <ul className="suggestions-list">
    {nameSuggestions.map((item, index) => (
      <li
        key={index}
        onClick={() => handleSelectSuggestion(item)}
      >
        {item.name}
      </li>
    ))}
  </ul>
)}

        </div>
        <button className="action-button">جديد</button>
       <button
  type="button"
  onClick={handleAddItems}
  className="action-button">
  إضافة
</button>
      </div>
      <div className="table-scroll-wrapper-2">
        <table className="data-grid-2">
          <thead>
            <tr>
              <th>اختيار</th>  
              <th>الصنف</th>
              <th>الوحدة</th> 
              <th>الكمية</th>
              <th>بونص</th>
              <th>السعر</th>
              <th>نسبة الخصم</th>
              <th>قيمة الخصم</th>
              <th>سعر قبل الخصم</th>
              <th>قيمة قبل الخصم</th>
              <th>القيمة</th>
              <th>بعد الخصم</th>
              <th>خصم نهائي</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
<td>
  <input
    type="checkbox"
    checked={row.checked} // مربوط بالحالة
    onChange={(e) => {
      const updatedRows = [...rows];
      updatedRows[index].checked = e.target.checked;
      setRows(updatedRows);
    }}
  />
</td>

                 <td>{row.Itemname|| "الاسم"}</td>
                <td>{row.unit || "كرتونة"}</td>
                <td>
                  <input
                    type="number"
                    value={row.quantity}
                    onChange={(e) =>
                      handleProductChange(index, "quantity", e.target.value)
                    }
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.bonus}
                    onChange={(e) =>
                      handleProductChange(index, "bonus", e.target.value)
                    }
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.price}
                    onChange={(e) =>
                      handleProductChange(index, "price", e.target.value)
                    }
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.discountPercent}
                    onChange={(e) =>
                      handleProductChange(index, "discountPercent", e.target.value)
                    }
                    className="table-input"
                  />
                </td>
                <td>{row.discountValue.toFixed(2)}</td>
                <td>{row.priceBeforeDiscount.toFixed(2)}</td>
                <td>{row.valueBeforeDiscount.toFixed(2)}</td>
                <td>{row.value.toFixed(2)}</td>
                <td>{row.afterDiscount.toFixed(2)}</td>
                <td>{row.finalDiscount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
<div className="section-divider"></div>
     <div className="four-sections-container">
<div className="section-2">
  
{rows.map((row, idx) => (
  <div key={idx} className="double-form-grid">
   
    <label>الاجمالى</label>
    <div className="double-input">
      <input
        type="text"
        name="total1"
        value={row.total1}
        onChange={(e) =>
          handleTotalBox(idx, "total1", e.target.value)
        }
      />
      <input
        type="text"
        name="total2"
        value={row.total2}
        onChange={(e) =>
          handleTotalBox(idx, "total2", e.target.value)
        }
      />
    </div>

   
    <label>خصم</label>
    <div className="double-input">
      <input
        type="text"
        name="finalDiscountMain"
        value={row.finalDiscountMain}
        onChange={(e) =>
          handleTotalBox(idx, "finalDiscountMain", e.target.value)
        }
      />
      <span className="symbol-outside">%</span>
      <input
        type="text"
        name="finalDiscountSmall1"
        value={row.finalDiscountSmall1}
        readOnly
      />
      <input
        type="text"
        name="finalDiscountSmall2"
        value={row.finalDiscountSmall2}
        onChange={(e) =>
          handleTotalBox(idx, "finalDiscountSmall2", e.target.value)
        }
      />
    </div>

   
    <label>بعد الخصم</label>
    <div className="double-input">
      <input
        type="text"
        name="finalAfterDiscount"
        value={row.finalAfterDiscount}
        readOnly
      />
          </div>

          <label>ضريبة</label>
          <div className="double-input">
            <input
              type="text"
              name="finalTaxMain"
              value={row.finalTaxMain}
              onChange={(e) =>
                handleTotalBox(idx, "finalTaxMain", e.target.value)
              }
            />
            <span className="symbol-outside">%</span>
            <input
              type="text"
              name="finalTaxSmall1"
              value={row.finalTaxSmall1}
              readOnly
            />
          </div>

          <label>قيمة الفاتورة</label>
          <div className="double-input">
            <input
              type="text"
              name="finalInvoiceValue"
              value={row.finalInvoiceValue}
              readOnly
            />
          </div>

          <label>ض.خ. الإضافية</label>
          <div className="double-input">
            <input
              type="text"
              name="finalAdditionalTaxMain"
              value={row.finalAdditionalTaxMain}
              onChange={(e) =>
                handleTotalBox(idx, "finalAdditionalTaxMain", e.target.value)
              }
            />
            <span className="symbol-outside">%</span>
            <input
              type="text"
              name="finalAdditionalTaxSmall"
              value={row.finalAdditionalTaxSmall}
               readOnly
              
            />
    </div>
  </div>
))}


  <button className="action-button-2">ترحيل</button>
</div>



<div className="section table-section">
  <div className="date-grid-container-3">
    <div className="table-scroll-wrapper-3">
      <table className="data-grid-3">
        <thead>
          <tr>
            <th>المبلغ</th>
            <th>الطرف المدين</th>
            <th>المبلغ</th>
            <th>الطرف الدائن</th>
          </tr>
        </thead>
        <tbody>
          {financeTableData.map((item, index) => (
            <tr
              key={index}
              onContextMenu={(e) => {
                e.preventDefault();
                sec_setContextMenu({
                  mouseX: e.clientX,
                  mouseY: e.clientY,
                  rowIndex: index,
                  data: item,
                });
              }}
            >
              <td>{item.debitAmount}</td>
              <td>{item.debitAccount}</td>
              <td>{item.creditAmount}</td>
              <td>{item.creditAccount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {sec_contextMenu && (
        <div
          style={{
            position: "fixed",
            top: sec_contextMenu.mouseY,
            left: sec_contextMenu.mouseX,
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "6px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            zIndex: 9999,
            minWidth: "140px",
            overflow: "hidden",
          }}
          onMouseLeave={() => sec_setContextMenu(null)}
        >
          {[
            {
              label: "طباعة",
              action: () => {
                // ✅ استدعاء الطباعة مباشرة للقيد المحدد
                generateFinancePdf(
                  [sec_contextMenu.data], // يتم الطباعة للصف المحدد فقط
                  {
                    user: JSON.parse(localStorage.getItem("userData"))?.username || "مستخدم",
                    date: new Date().toLocaleDateString("ar-EG")
                  }
                );
              },
            },
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                item.action();
                sec_setContextMenu(null);
              }}
              style={{
                padding: "8px 12px",
                cursor: "pointer",
                fontSize: "14px",
                borderBottom: idx !== 2 ? "1px solid #eee" : "none",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f4ff")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
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
  );
};

export default Invoice;
