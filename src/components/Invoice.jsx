

import React, { useState } from "react";
import "../styles/invoiceComponent.css"; 
import axios from "axios";



const Invoice = () => {

  const financeTableData = [
    { debitAmount: "1500.00", debitAccount: "حساب المشتريات", creditAmount: "1500.00", creditAccount: "الصندوق" },
    { debitAmount: "2200.00", debitAccount: "المخزون", creditAmount: "2200.00", creditAccount: "البنك" },
    { debitAmount: "500.00", debitAccount: "حساب الأدوية", creditAmount: "500.00", creditAccount: "الموردين" },
    { debitAmount: "1000.00", debitAccount: "المصروفات العمومية", creditAmount: "1000.00", creditAccount: "الصندوق" },
  ];
const [contextMenu, setContextMenu] = useState(null); 
  const [itemCode, setItemCode] = useState("");
  const [itemName, setItemName] = useState("");
  const [tableData, setTableData] = useState([]);
  const [nameSuggestions, setNameSuggestions] = useState([]);
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
    },
  ]);





useState(() => {
  const fetchInitialData = async () => {
    
      const response = await axios.get(
        "https://www.istpos.somee.com/api/Stoc/stoc_items_trans"
      );

      setTableData(response.data);

  };

  fetchInitialData(); 
}, []);





  const handleCodeChange = (e) => {
    setItemCode(e.target.value);
  };
const handleNameChange = async (e) => {
  const value = e.target.value;
  setItemName(value);

  if (value.trim() === "") {
    setNameSuggestions([]);
    return;
  }

  try {
    const response = await axios.get(`https://www.istpos.somee.com/api/items/items`);
    const filteredData = response.data.filter(item =>
      item.name && item.name.startsWith(value)
    );

    setNameSuggestions(filteredData);
  } catch (error) {
    console.error("Error fetching item name suggestions:", error);
    setNameSuggestions([]);
  }
};

const totalAfterDiscount = tableData.reduce(
  (acc, item) => acc + (Number(item.tot_af) || 0),
  0
);
const fetchItemData = async (code) => {
  if (!code || code.trim() === "") {
    alert("يرجى إدخال كود الصنف أولاً");
    return;
  }
  try {
    const response = await axios.get(
      `https://www.istpos.somee.com/api/items/ItemPrice?code=${code}`
    );

    const fetchedData = response.data.map((item) => ({
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

    setRows(fetchedData);

    if (response.data.length > 0) {
      setItemName(response.data[0].name || "");
    }
  } catch (error) {
    console.error("Error fetching item data after selecting suggestion:", error);
  }
};

// عند اختيار عنصر من لوحة الاقتراحات
const handleSelectSuggestion = async (selectedItem) => {
  setItemName(selectedItem.name);
  setItemCode(selectedItem.code);
  setNameSuggestions([]); // إخفاء الـ panel بعد الاختيار

  // استدعاء جلب بيانات الصنف مباشرة بعد اختيار الاسم
  await fetchItemData(selectedItem.code);
};



  const handleProductChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index] = {
      ...updatedRows[index],
      [field]: field === "unit" ? value : parseFloat(value) || 0,
    };

    const row = updatedRows[index];
    row.priceBeforeDiscount = row.price;
    row.discountValue = (row.price * row.discountPercent) / 100;
    row.afterDiscount = row.price - row.discountValue;
    row.valueBeforeDiscount = row.price * row.quantity;
    row.value = row.afterDiscount * row.quantity;

    setRows(updatedRows);
  };

const handleAddItems = async () => {
  try {
    for (const row of rows) {
    
      if (!row.checked) {
        console.log(`🚫 الصف ${row.Itemname || row.code} غير محدد - لن تتم إضافته`);
        continue;
      }

      const payload = {
        stoc_lev1: "string",
        stoc_lev2: "string",
        mang_n: "string",
        type: "string",
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
        user_n: "string",
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
      };

      console.log("🚩 Sending payload:", payload);

      await axios.post(
        "https://www.istpos.somee.com/api/Stoc/insert_stoc_items_trans",
        payload
      );

      console.log("✅ تم إضافة الصنف بنجاح");
    }

    const response = await axios.get(
      "https://www.istpos.somee.com/api/Stoc/stoc_items_trans"
    );

    console.log("✅ تم جلب بيانات الأصناف:", response.data);
    setTableData(response.data);

    alert("✅ تم ترحيل الأصناف وجلب البيانات بنجاح");
  } catch (error) {
    console.error("❌ خطأ أثناء إضافة البيانات أو الجلب:", error.response?.data || error);
    alert(JSON.stringify(error.response?.data?.errors || error.response?.data || error));
  }
};






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
          <input type="text" name="client" />

          <label>المستلم</label>
          <select name="receiver">
            <option>اختر</option>
            <option value="sub1">1</option>
          </select>   
           <label>الى</label>    
      <input type="date" name="permissionDate2" />
        </div>
      </div>   
<div className="section">
  <div className="form-grid-vertical">
<div className="box-container full-span">
  <div className="section-label-center">من</div>
  <div className="select-row">
    <label>المخزن الرئيسي</label>
    <select name="mainStore">
      <option>المخزن الرئيسي</option>
    </select>
  </div>
  <div className="select-row">
    <label> المخزن الفرعى </label>
    <select name="subStore">
      <option>المخزن الفرعى</option>
    </select>
  </div>
</div>

<div className="box-container full-span">
  <div className="section-label-center">إلى</div>
  <div className="select-row">
    <label>المخزن الرئيسي</label>
    <select name="mainStore">
      <option>المخزن الرئيسي</option>
    </select>
  </div>
  <div className="select-row">
    <label>  المخزن الفرعى   </label>
    <select name="subStore">
      <option>المخزن الفرعى</option>
    </select>
  </div>
</div>






  </div>
</div>


<div className="section table-section">
  <div className="date-grid-container">
       <div className="radio-group">
      <input type="text" name="dafterNumber" placeholder="المبيعات"/>
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
      padding: "8px",
      zIndex: 9999,
      cursor: "pointer"
    }}
    onClick={() => {
    
      alert(` تم الضغط على حذف للصف رقم ${contextMenu.rowIndex + 1}`);
      setContextMenu(null);
    }}
    onMouseLeave={() => setContextMenu(null)}
  >
    حذف الصف
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
  className="action-button"
>
  إضافة
</button>
{/* <button
  type="button"
  onClick={() => fetchItemData(itemCode)}
  className="action-button"
>
  بحث
</button> */}

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
  <div className="double-form-grid">
    <label>الإجمالي</label>
    <div className="double-input">
      <input type="text" name="total1" value={totalAfterDiscount} />
      <input type="text" name="total2" />
    </div>

    <label>خصم</label>
    <div className="double-input">
      <input type="text" name="discountMain" />
      <span className="symbol-outside">%</span>
      <input type="text" name="discountSmall1" />
      <input type="text" name="discountSmall2" />
    </div>

    <label>بعد الخصم</label>
    <div className="double-input">
      <input type="text" name="afterDiscount1" />
     
    </div>

    <label>ضريبة</label>
    <div className="double-input">
      <input type="text" name="taxMain" />
      <span className="symbol-outside">%</span>
      <input type="text" name="taxSmall1" />
    </div>

    <label>قيمة الفاتورة</label>
    <div className="double-input">
      <input type="text" name="invoiceValue1" />
      
    </div>

    <label>ض.خ. الإضافية</label>
    <div className="double-input">
      <input type="text" name="additionalTaxMain" />
      <span className="symbol-outside">%</span>
      <input type="text" name="additionalTaxSmall1" />
    </div>
  </div>

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
            <tr key={index}>
              <td>{item.debitAmount}</td>
              <td>{item.debitAccount}</td>
              <td>{item.creditAmount}</td>
              <td>{item.creditAccount}</td>
            </tr>
          ))}
        </tbody>
      </table>


    </div>
    </div>
 </div>  
  </div> 
 </div>        
  );
};

export default Invoice;
