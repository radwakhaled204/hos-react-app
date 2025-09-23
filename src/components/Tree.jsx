        import React, { useState } from "react";
        import Select from "react-select";
        import "../index.css";

        export default function Tree() {
            const [active, setActive] = useState("tab1");
        const [accountSelect, setAccountSelect] = useState(null);
        const [branchSelect, setBranchSelect] = useState(null);
        const [currencySelect, setCurrencySelect] = useState(null);

        const accountData = [
            { value: "account1", label: "account1" },
            { value: "account2", label: "account2" },
            { value: "account3", label: "account3" },
        ];

        const branchData = [
            { value: "company", label: "المنشئة" },
            { value: "branch1", label: "فرع القاهرة" },
            { value: "branch2", label: "فرع الجيزة" },
            { value: "branch3", label: "فرع الإسكندرية" },
        ];

        const currencyData = [
            { value: "EGP", label: "جنيه مصري" },
            { value: "USD", label: "دولار أمريكي" },
            { value: "EUR", label: "يورو" },
        ];

        const rows = [
            { label: "م اول", value: "2", text: "الترامات" },
            { label: "م ثان", value: "201", text: "الترامات قصيره الاجل" },
            { label: "م ثالث", value: "20101", text: "الداينون" },
            { label: "م رابع", value: "2010101", text: "الموردون" },
        ];

        return (
            <div className="p-4">
        
                <div className="form-row-inline container">
                    <div className="form-group-inline">
                    <label className="d-block mb-2 fw-bold">نوع الحساب</label>
                    <Select
                        options={accountData}
                        value={accountSelect}
                        onChange={setAccountSelect}
                        placeholder="اختر الحساب..."
                        isSearchable
                    />
                    </div>

                <div className="form-group-inline">
                    <label className="d-block mb-2 fw-bold">الفرع</label>
                    <Select
                        options={branchData}
                        value={branchSelect}
                        onChange={setBranchSelect}
                        placeholder="اختر الفرع..."
                        isSearchable
                    />
                    </div>

                    <div className="form-group-inline">
                    <label className="d-block mb-2 fw-bold">العملة</label>
                    <Select
                        options={currencyData}
                        value={currencySelect}
                        onChange={setCurrencySelect}
                        placeholder="اختر العملة..."
                        isSearchable
                    />
                    </div>
                </div>

                
                <div className="container p-5 bg-white mt-4">
                
                    <div className="d-flex gap-4 text-center fw-bold pb-2 mb-3">
                        <div className="ms-3">نوع</div>
                        <div className="me-4 pe-4 ms-4">مجمل ربح</div>
                        <div className="me-5 pe-5">خصم مسموح به</div>
                    </div>

                    
                    {rows.map((row, i) => (
                    <div
                        key={i}
                        className="row my-2 gap-1"
                    >
                        <div className="col-1">
                            <label>
                            <input type="checkbox" className="" />
                            {row.label}
                            </label>
                        </div>

                        <div className="col-2">
                            <input
                            type="text"
                            value={row.value}
                            readOnly
                            className="border rounded px-2 py-1 text-center form-control"
                            />
                        </div>

                        <div className="col-8">
                            <select className="border rounded px-2 py-1 form-select-row">
                            <option>{row.text}</option>
                            </select>
                        </div>
                    </div>
                    ))}

                
                    <div className="mt-4 d-flex align-items-center gap-3 w-25">
                        <span className="fw-bold ms-4 ps-2">الحساب</span>
                        <input
                            type="text"
                            placeholder="مورّد نقدي"
                            className="border rounded px-3 py-2 form-control"
                        />
                    </div>
                </div>
                
                <nav className="nav nav-pills nav-fill mb-3 mt-3 nav-">
                    <button
                        className={`nav-link ${active === "tab1" ? "active bg-info" : ""}`}
                        onClick={() => setActive("tab1")}>
                        الرئيسية
                    </button>
                    <button
                        className={`nav-link ${active === "tab2" ? "active bg-info" : ""}`}
                        onClick={() => setActive("tab2")}>
                        الاجماليات
                    </button>
                    <button
                        className={`nav-link ${active === "tab3" ? "active bg-info" : ""}`}
                        onClick={() => setActive("tab3")}>
                        التقارير
                    </button>
                </nav>
            </div>
        );
        }
