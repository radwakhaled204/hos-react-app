import React, { useState, useEffect, useMemo } from "react";
import "../styles/invoiceComponent.css";
import axios from "axios";
import { generatePreviewPdf } from "./Pdfpage";
import { generateFinancePdf } from "./generateFinancePdf";
import { toast } from "react-toastify";
import ReusableDataGrid from "./DataTable";

const Invoice = () => {
  // بيانات الجدول الرئيسية
  const [tableData, setTableData] = useState([{ tot_af: 100 }, { tot_af: 150 }, { tot_af: 50 }]);

  const totalQuantity = tableData.reduce((acc, item) => acc + (Number(item.qun) || 0), 0);
  const totalBonus = tableData.reduce((acc, item) => acc + (Number(item.bons) || 0), 0);
  const totalPrice = tableData.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
  const totalDiscount = tableData.reduce((acc, item) => acc + (Number(item.price) * (Number(item.dis1) || 0)) / 100, 0);
  const totalAfterDiscount = tableData.reduce((acc, item) => acc + (Number(item.tot_af) || 0), 0);

  const [rows, setRows] = useState([
    {
      unit: "كرتونة",
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
      Itemname: "الاسم",
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
    {
      unit: "علبة",
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
      Itemname: "الاسم",
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
    {
      unit: "شريط",
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
      Itemname: "الاسم",
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

  // build selected keys from your `checked` flag (index-based if no id)
  const selectedKeys = useMemo(() => {
    const s = new Set();
    rows.forEach((r, i) => {
      if (r.checked) s.add(r.id ?? i);
    });
    return s;
  }, [rows]);;

  // columns (editable where your inputs were)
  const columnsTable2 = useMemo(
    () => [
      { key: "Itemname", header: "الصنف" },
      { key: "unit", header: "الوحدة" },
      { key: "quantity", header: "الكمية", editable: true, inputType: "number" },
      { key: "bonus", header: "بونص", editable: true, inputType: "number" },
      { key: "price", header: "السعر", editable: true, inputType: "number" },
      {
        key: "discountPercent",
        header: "نسبة الخصم",
        editable: true,
        inputType: "number",
      },
      {
        key: "discountValue",
        header: "قيمة الخصم",
        compute: (r) => ((+r.price || 0) * (+r.discountPercent || 0)) / 100,
        format: (v) => (v ?? 0).toFixed(2),
      },
      {
        key: "priceBeforeDiscount",
        header: "سعر قبل الخصم",
        format: (v) => (v ?? 0).toFixed(2),
      },
      {
        key: "valueBeforeDiscount",
        header: "قيمة قبل الخصم",
        format: (v) => (v ?? 0).toFixed(2),
      },
      { key: "value", header: "القيمة", format: (v) => (v ?? 0).toFixed(2) },
      {
        key: "afterDiscount",
        header: "بعد الخصم",
        format: (v) => (v ?? 0).toFixed(2),
      },
      {
        key: "finalDiscount",
        header: "خصم نهائي",
        format: (v) => (v ?? 0).toFixed(2),
      },
    ],
    []
  );

  // mirrors your handleProductChange + keeps derived fields in sync
  const handleEdit = (rowIndex , key, next) => {
    const updated = rows.slice();
    const cur = { ...updated[rowIndex] };

    // coerce numerics for these keys
    const numericKeys = new Set(["quantity", "bonus", "price", "discountPercent"]);
    cur[key] = numericKeys.has(key) ? Number(next) : next;

    const quantity = +cur.quantity || 0;
    const price = +cur.price || 0;
    const discountPercent = +cur.discountPercent || 0;

    const priceBeforeDiscount = price;
    const discountValue = (priceBeforeDiscount * discountPercent) / 100;
    const valueBeforeDiscount = priceBeforeDiscount * quantity;
    const afterDiscount = priceBeforeDiscount - discountValue;
    const value = quantity * afterDiscount;
    const finalDiscount = discountValue; // adjust if you have extra rules

    cur.priceBeforeDiscount = priceBeforeDiscount;
    cur.discountValue = discountValue;
    cur.valueBeforeDiscount = valueBeforeDiscount;
    cur.afterDiscount = afterDiscount;
    cur.value = value;
    cur.finalDiscount = finalDiscount;

    updated[rowIndex] = cur;
    setRows(updated);
  };


  // per-row checkbox
  const onToggleRow = (row, checked, idx) => {
    const updated = rows.slice();
    updated[idx] = { ...updated[idx], checked };
    setRows(updated);
  };

  const columns = useMemo(() => [
    { key: "name", header: "الصنف", width: 150 },
    { key: "am_n", header: "الوحدة", width: 100 },
    { key: "qun", header: "الكمية", width: 100, format: (v) => v ?? 0 },
    { key: "bons", header: "بونص", width: 100, format: (v) => v ?? 0 },
    { key: "tot_af", header: "القيمة بعد الخصم", width: 100, format: (v) => v ?? 0 },
    { key: "code", header: "الكود" },
    { key: "price", header: "السعر" },
    { key: "dis1", header: "نسبة الخصم", format: (v) => `${v || 0}%` },
    {
      key: "discountValue",
      header: "قيمة الخصم",
      compute: (r) => ((r.price || 0) * (r.dis1 || 0)) / 100,
      format: (v) => (v ?? 0).toFixed(2),
    },
    { key: "price", header: "سعر قبل الخصم" },
    {
      key: "valueBeforeDiscount",
      header: "قيمة قبل الخصم",
      compute: (r) => (r.price || 0) * (r.qun || 0),
      format: (v) => (v ?? 0).toFixed(2),
    },
    { key: "tot", header: "القيمة" },
    { key: "price_af", header: "بعد الخصم" },
    { key: "finalDiscount", header: "خصم نهائي" },
    { key: "id", header: "id" },
  ], []);
  const [sec_contextMenu, sec_setContextMenu] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [fromMainStores, setFromMainStores] = useState([]);
  const [fromSelectedMainStore, setFromSelectedMainStore] = useState("");
  const [fromSubStores, setFromSubStores] = useState([]);
  const [fromSelectedSubStore, setFromSelectedSubStore] = useState("");

  const [toMainStores, setToMainStores] = useState([]);
  const [toSelectedMainStore, setToSelectedMainStore] = useState("");
  const [toSubStores, setToSubStores] = useState([]);

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
          const res = await axios.get(`https://www.istpos.somee.com/api/Stoc/stoc2?name1=${encodeURIComponent(fromSelectedMainStore)}`);
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
          const res = await axios.get(`https://www.istpos.somee.com/api/Stoc/stoc2?name1=${encodeURIComponent(toSelectedMainStore)}`);
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
          type: "مبيعات",
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
      row.finalDiscountSmall1 = parseFloat(((row.total1 * row.finalDiscountMain) / 100).toFixed(2));
      row.finalAfterDiscount = parseFloat((row.total1 - row.finalDiscountSmall1).toFixed(2));
    }
    if (field === "finalTaxMain" || field === "total1") {
      row.finalTaxSmall1 = parseFloat(((row.total1 * row.finalTaxMain) / 100).toFixed(2));
      row.finalInvoiceValue = parseFloat((row.finalAfterDiscount + row.finalTaxSmall1).toFixed(2));
    }
    if (field === "finalAdditionalTaxMain" || field === "total1") {
      row.finalAdditionalTaxSmall = parseFloat(((row.total1 * row.finalAdditionalTaxMain) / 100).toFixed(2));
    }
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
        setItemName("");
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
          dis_price: row.discountValue || 0, // ✅ مضاف مسبقاً

          // ✅ إضافة dis لحل الخطأ الحالي
          dis: row.discountValue || 0, // أرسل القيمة نفسها أو 0
        };

        console.log("📡 Sending payload:", payload);
        await axios.post("https://www.istpos.somee.com/api/Stoc/insert_stoc_items_trans", payload);
        console.log("✅ تم إضافة الصنف بنجاح");
      }

      const params = {
        mang_n: "العيادات بالمركز الرئيسي",
        sav_flg: 0,
        user_n: "احمد محمد",
        stoc_lev1: fromSelectedMainStore,
        stoc_lev2: fromSelectedSubStore,
        type: "مبيعات",
      };

      const queryString = new URLSearchParams(params).toString();

      const res = await axios.get(`https://www.istpos.somee.com/api/Stoc/stoc_items_trans?${queryString}`);
      setTableData(res.data);
      toast.success("✅ تم ترحيل الأصناف بنجاح");
    } catch (e) {
      console.error("❌ خطأ أثناء الترحيل:", e.response?.data || e);
      const msg = e?.response?.data?.errors ?? e?.response?.data?.message ?? e?.message ?? "حدث خطأ غير متوقع";
      toast.error(typeof msg === "string" ? msg : JSON.stringify(msg, null, 2));
    }
  };

  const financeTableData = [
    { debitAmount: "1500.00", debitAccount: "حساب المشتريات", creditAmount: "1500.00", creditAccount: "الصندوق" },
    { debitAmount: "2200.00", debitAccount: "المخزون", creditAmount: "2200.00", creditAccount: "البنك" },
    { debitAmount: "500.00", debitAccount: "حساب الأدوية", creditAmount: "500.00", creditAccount: "الموردين" },
    { debitAmount: "1000.00", debitAccount: "المصروفات العمومية", creditAmount: "1000.00", creditAccount: "الصندوق" },
  ];
  const columnsTable3 = useMemo(
    () => [
      { key: "debitAmount",  header: "المبلغ", format: (v) => Number(v ?? 0).toFixed(2) },
      { key: "debitAccount", header: "الطرف المدين" },
      { key: "creditAmount", header: "المبلغ", format: (v) => Number(v ?? 0).toFixed(2) },
      { key: "creditAccount",header: "الطرف الدائن" },
    ],
    []
  );

  return (
    <div className="header">
      <div className="four-sections-container">
        <div className="section">
          <div className="form-grid">
            <label>رقم الفاتورة</label>
            <input
              type="text"
              name="invoiceNumber"
            />

            <label>رقم الإذن</label>
            <input
              type="text"
              name="permissionNumber"
            />

            <label>الكود</label>
            <input
              type="text"
              name="client"
            />
            <label>رقم دفترى</label>
            <input
              type="text"
              name="dafterNumber"
            />
            <label>من</label>
            <input
              type="date"
              name="permissionDate1"
            />
          </div>
        </div>
        <div className="section">
          <div className="form-grid-2">
            <label>تاريخ الفاتورة</label>
            <input
              type="date"
              name="invoiceDate"
            />
            <label>تاريخ الإذن</label>
            <input
              type="date"
              name="permissionDate"
            />

            <label>العميل</label>
            <select
              name="client"
              value={SelectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}>
              {clientData.map((store, idx) => (
                <option
                  key={idx}
                  value={store.name}>
                  {store.name}
                </option>
              ))}
            </select>
            <label>المستلم</label>
            <select name="receiver">
              <option>اختر</option>
              <option value="sub1">1</option>
            </select>
            <label>الى</label>
            <input
              type="date"
              name="permissionDate2"
            />
          </div>
        </div>
        <div className="section card-section-dropdown">
          <div className="form-grid-vertical">
            <div className="box-container full-span">
              <label style={{ textAlign: "center" }}>من</label>
              <div className="select-row">
                <label>المخزن الرئيسي</label>
                <select
                  name="mainStoreFrom"
                  value={fromSelectedMainStore}
                  onChange={(e) => setFromSelectedMainStore(e.target.value)}>
                  <option value="">اختر</option>
                  {fromMainStores.map((store, idx) => (
                    <option
                      key={idx}
                      value={store.name}>
                      {store.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="select-row">
                <label>المخزن الفرعي</label>
                <select
                  name="subStoreFrom"
                  value={fromSelectedSubStore}
                  onChange={(e) => setFromSelectedSubStore(e.target.value)}>
                  <option value="">اختر</option>
                  {fromSubStores.map((store, idx) => (
                    <option
                      key={idx}
                      value={store.name}>
                      {store.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="box-container full-span">
              <label style={{ textAlign: "center" }}>إلى</label>
              <div className="select-row">
                <label>المخزن الرئيسي</label>
                <select
                  name="mainStoreTo"
                  value={toSelectedMainStore}
                  onChange={(e) => setToSelectedMainStore(e.target.value)}>
                  <option value="">اختر</option>
                  {toMainStores.map((store, idx) => (
                    <option
                      key={idx}
                      value={store.name}>
                      {store.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="select-row">
                <label>المخزن الفرعي</label>
                <select name="subStoreTo">
                  <option value="">اختر</option>
                  {toSubStores.map((store, idx) => (
                    <option
                      key={idx}
                      value={store.name}>
                      {store.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="section table-section">
          <div className="date-grid-container">
            <div className="radio-group">
              <input
                type="text"
                name="type-text"
                value="المبيعات"
              />
              <label className="radio-option">
                <input
                  type="radio"
                  name="status"
                  value="registered"
                />
                مسجل
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="status"
                  value="canceled"
                  defaultChecked
                />
                ملغى
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="status"
                  value="all"
                />
                الكل
              </label>
            </div>
            <div className="table-scroll-wrapper">
              <ReusableDataGrid
                columns={columns}
                rows={tableData}
                rtl
                stickyHeader
                tableClassName="data-grid"
                scrollWrapperClassName="table-scroll-wrapper"
                onRowContextMenu={(e, row, index) => {
                  e.preventDefault();
                  setContextMenu({
                    mouseX: e.clientX,
                    mouseY: e.clientY,
                    rowIndex: index,
                    rowId: row?.id,
                  });
                }}
              />

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
                    overflow: "hidden",
                  }}
                  onMouseLeave={() => setContextMenu(null)}>
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
                          setTableData((prev) => prev.filter((row) => row.id !== id));
                          alert("✅ تم حذف الصف بنجاح.");
                        } catch (error) {
                          console.error("خطأ أثناء حذف الصف:", error);
                          alert("❌ حدث خطأ أثناء محاولة الحذف.");
                        }
                      },
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
                          subStore: "المخزن الفرعي 1",
                        });
                      },
                    },
                    {
                      label: " طباعة الباركود",
                      action: () => {
                        alert("ميزة طباعة الباركود لم تُفعّل بعد.");
                      },
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
                      },
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
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f4ff")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}>
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
          {nameSuggestions.length > 0 && (
            <ul className="suggestions-list">
              {nameSuggestions.map((item, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectSuggestion(item)}>
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
        <ReusableDataGrid
          columns={columnsTable2}
          rows={rows}
          rtl
          stickyHeader
          tableClassName="data-grid-2"
          scrollWrapperClassName="table-scroll-wrapper-2"
          selectionColumn={{ show: true, headerLabel: "اختيار" }}
          selectedKeys={selectedKeys}
          onToggleRow={onToggleRow}
          onEdit={handleEdit}
        />
      
      <div className="section-divider"></div>
      <div className="four-sections-container">
        <div className="section-2">
          {rows.slice(0,1).map((row, idx) => (
            <div
              key={idx}
              className="double-form-grid">
              <label>الاجمالى</label>
              <div className="double-input">
                <input
                  type="text"
                  name="total1"
                  value={row.total1}
                  onChange={(e) => handleTotalBox(idx, "total1", e.target.value)}
                />
                <input
                  type="text"
                  name="total2"
                  value={row.total2}
                  onChange={(e) => handleTotalBox(idx, "total2", e.target.value)}
                />
              </div>

              <label>خصم</label>
              <div className="double-input">
                <input
                  type="text"
                  name="finalDiscountMain"
                  value={row.finalDiscountMain}
                  onChange={(e) => handleTotalBox(idx, "finalDiscountMain", e.target.value)}
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
                  onChange={(e) => handleTotalBox(idx, "finalDiscountSmall2", e.target.value)}
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
                  onChange={(e) => handleTotalBox(idx, "finalTaxMain", e.target.value)}
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
                  onChange={(e) => handleTotalBox(idx, "finalAdditionalTaxMain", e.target.value)}
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
              <ReusableDataGrid
                columns={columnsTable3}
                rows={financeTableData}
                rtl
                stickyHeader
                tableClassName="data-grid-3"
                scrollWrapperClassName="table-scroll-wrapper-3"
                onRowContextMenu={(e, row, index) => {
                  e.preventDefault();
                  sec_setContextMenu({
                    mouseX: e.clientX,
                    mouseY: e.clientY,
                    rowIndex: index,
                    data: row,
                  });
                }}
              />

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
                  onMouseLeave={() => sec_setContextMenu(null)}>
                  {[
                    {
                      label: "طباعة",
                      action: () => {
                        // ✅ استدعاء الطباعة مباشرة للقيد المحدد
                        generateFinancePdf(
                          [sec_contextMenu.data], // يتم الطباعة للصف المحدد فقط
                          {
                            user: JSON.parse(localStorage.getItem("userData"))?.username || "مستخدم",
                            date: new Date().toLocaleDateString("ar-EG"),
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
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}>
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
