

import React, { useState } from "react";
import "../styles/invoiceComponent.css"; 

const Invoice = () => {

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
      finalDiscount: 0         
    }
  ]);

 
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

  const tableData = [
  { name: "باراسيتامول", quantity: 50, unit: "علبة", priceAfterDiscount: "12.50" },
  { name: "إيبوبروفين", quantity: 30, unit: "علبة", priceAfterDiscount: "18.00" },
  { name: "أموكسيسيلين", quantity: 20, unit: "علبة", priceAfterDiscount: "25.00" },
  { name: "فيتامين سي", quantity: 40, unit: "علبة", priceAfterDiscount: "10.00" },
  { name: "كالسيوم", quantity: 60, unit: "علبة", priceAfterDiscount: "22.50" },
  { name: "حديد", quantity: 15, unit: "علبة", priceAfterDiscount: "16.75" },
];

const financeTableData = [
  { debitAmount: "1500.00", debitAccount: "حساب المشتريات", creditAmount: "1500.00", creditAccount: "الصندوق" },
  { debitAmount: "2200.00", debitAccount: "المخزون", creditAmount: "2200.00", creditAccount: "البنك" },
  { debitAmount: "500.00", debitAccount: "حساب الأدوية", creditAmount: "500.00", creditAccount: "الموردين" },
  { debitAmount: "1000.00", debitAccount: "المصروفات العمومية", creditAmount: "1000.00", creditAccount: "الصندوق" },
  { debitAmount: "1000.00", debitAccount: "المصروفات العمومية", creditAmount: "1000.00", creditAccount: "الصندوق" },
  { debitAmount: "1000.00", debitAccount: "المصروفات العمومية", creditAmount: "1000.00", creditAccount: "الصندوق" },
  { debitAmount: "1000.00", debitAccount: "المصروفات العمومية", creditAmount: "1000.00", creditAccount: "الصندوق" },
  { debitAmount: "1000.00", debitAccount: "المصروفات العمومية", creditAmount: "1000.00", creditAccount: "الصندوق" },
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
     <label>المخزن الرئيسي</label>
          <select name="mainStore">
      <option>المخزن الرئيسى</option>
      <option value="1">1</option>
    </select>          
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
   <label>المخزن الفرعي</label>
    <select name="subStore">
      <option>المخزن الفرعى</option>
      <option value="1">1</option>
    </select>              
        </div>
      </div>   
<div className="section">
  <div className="form-grid-vertical">

    {/* Radio Buttons */}
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

    {/* Date Range */}
    <div className="date-container">
      <input type="date" name="permissionDate1" />
      <input type="date" name="permissionDate2" />
    </div>

 <div className="box-container full-span">
    <div className="select-row">
      <label className="section-label">من</label>
      <label>المخزن الرئيسي</label>
      <select name="mainStore">
        <option>المخزن الرئيسي</option>
      </select>
    </div>
    <div className="select-row">
      <label className="section-label">إلى</label>
      <label>المخزن الفرعي</label>
      <select name="subStore">
        <option>المخزن الفرعي</option>
      </select>
    </div>
  </div>






  </div>
</div>


<div className="section table-section">
  <div className="date-grid-container">
    <div className="table-scroll-wrapper">
      <table className="data-grid">
        <thead>
          <tr>          
            <th>الاسم</th>
            <th>الكمية</th>
            <th>الوحدة</th>
            <th>السعر بعد الخصم</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.unit}</td>
              <td>{item.priceAfterDiscount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>
</div>
<div className="section-divider"></div>
<div className="form-row-inline">
  <div className="form-group-inline">
    <label htmlFor="itemCode">كود الصنف</label>
    <input type="text" name="itemCode" id="itemCode" />
  </div>

  <div className="form-group-inline">
    <label htmlFor="itemName">اسم الصنف</label>
    <input type="text" name="itemName" id="itemName" />
  </div>

  <button className="action-button">جديد</button>
  <button className="action-button">إضافة</button>
</div>   

<div className="table-scroll-wrapper-2">
  <table className="data-grid-2">
    <thead>
      <tr>
        <th>وحدة</th>
        <th>كمية</th>
        <th>سعر</th>
        <th>ن خصم</th>
        <th>خصم</th>
        <th>س.ب.خصم</th>
        <th>قيمة ب خصم</th>
        <th>قيمة</th>
        <th>بعد خصم</th>
        <th>خصم</th>
      </tr>
    </thead>
 <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  value={row.unit}
                  onChange={(e) => handleProductChange(index, "unit", e.target.value)}
                  className="table-input"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.quantity}
                  onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
                  className="table-input"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.price}
                  onChange={(e) => handleProductChange(index, "price", e.target.value)}
                  className="table-input"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.discountPercent}
                  onChange={(e) => handleProductChange(index, "discountPercent", e.target.value)}
                  className="table-input"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.discountValue}
                  className="table-input"
                  readOnly
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.priceBeforeDiscount}
                  className="table-input"
                  readOnly
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.valueBeforeDiscount}
                  className="table-input"
                  readOnly
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.value}
                  className="table-input"
                  readOnly
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.afterDiscount}
                  className="table-input"
                  readOnly
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.finalDiscount}
                  onChange={(e) => handleProductChange(index, "finalDiscount", e.target.value)}
                  className="table-input"
                />
              </td>
            </tr>
            
          ))}
      <tr>
        <td>كرتونة</td>
        <td>5</td>
        <td>100</td>
        <td>15%</td>
        <td>15</td>
        <td>85</td>
        <td>425</td>
        <td>500</td>
        <td>425</td>
        <td>3</td>
      </tr>
      <tr>
        <td>كرتونة</td>
        <td>5</td>
        <td>100</td>
        <td>15%</td>
        <td>15</td>
        <td>85</td>
        <td>425</td>
        <td>500</td>
        <td>425</td>
        <td>3</td>
      </tr>
      <tr>
        <td>كرتونة</td>
        <td>5</td>
        <td>100</td>
        <td>15%</td>
        <td>15</td>
        <td>85</td>
        <td>425</td>
        <td>500</td>
        <td>425</td>
        <td>3</td>
      </tr>   
      <tr>
        <td>كرتونة</td>
        <td>5</td>
        <td>100</td>
        <td>15%</td>
        <td>15</td>
        <td>85</td>
        <td>425</td>
        <td>500</td>
        <td>425</td>
        <td>3</td>
      </tr>  
      <tr>
        <td>كرتونة</td>
        <td>5</td>
        <td>100</td>
        <td>15%</td>
        <td>15</td>
        <td>85</td>
        <td>425</td>
        <td>500</td>
        <td>425</td>
        <td>3</td>
      </tr>                                 
        </tbody>

  </table>
</div>
<div className="section-divider"></div>
     <div className="four-sections-container">
<div className="section-2">
  <div className="double-form-grid">
    <label>الإجمالي</label>
    <div className="double-input">
      <input type="text" name="total1" />
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
 <div className="date-grid-container">
    <div className="table-scroll-wrapper-down">
      <table className="data-grid">
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
