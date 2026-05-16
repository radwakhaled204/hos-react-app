import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import '../styles/NavbarComponent.css';

const menuItems = [
    {
    title: "الحسابات العامة",
    items: [
      { label: " الشجره المحاسبية", path: "/Tree/home" },
      { label: "عبوات صنف", path: "#" },

    ]
  },
  {
    title: "بناء النظام",
    items: [
      { label: "تسجيل صنف جديد", path: "#" },
      { label: "عبوات صنف", path: "#" },
      { label: "سعر البيع", path: "#" },
      { label: "تسجيل الحد الأدنى", path: "#" },
      { label: "مجموعات الأصناف", path: "#" },
      { label: "تاريخ الصلاحية", path: "#" },
      { label: "منع الصرف بالسالب", path: "#" }
    ]
  },
  {
    title: "حركة داخلية",
    items: [
      { label: "رصيد أول مدة", path: "#" },
      { label: "مشتريات", path: "#" },
      { label: "مردودات مشتريات", path: "#" },
      { label: "صرف من مخزن لمخزن", path: "#" },
      { label: "إذن تسوية", path: "#" }
    ]
  },
  {
    title: "حركة خارجية",
    items: [
      { label: "مبيعات", path: "#" },
      { label: "مردودات مبيعات", path: "#" },
      { label: "بيان أسعار", path: "#" },
      { label: "أمر توريد لعميل", path: "#" }
    ]
  },
  {
    title: "مندوب البيع",
    items: [
      { label: "مبيعات", path: "/invoice/home" },
      { label: "مردودات مبيعات", path: "#" },
      { label: "بيان أسعار", path: "#" },
      { label: "أمر توريد لعميل", path: "#" }
    ]
  },
  {
    title: "حركة إضافية",
    items: [
      { label: "طلب شراء", path: "#" },
      { label: "أمر شراء من مورد", path: "#" }
    ]
  }
];

const NavbarComponent = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleDropdown = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <nav className="navbar" dir="rtl">
      <div className="navbar-links">
        {menuItems.map((menu, index) => (
          <div
            key={index}
            className={`dropdown ${openIndex === index ? 'open' : ''}`}
            onClick={() => toggleDropdown(index)}
          >
            <div className="dropdown-title">{menu.title}</div>
            <div className="dropdown-content">
              {menu.items.map((item, idx) => (
                <Link to={item.path} className="dropdown-item" key={idx}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="navbar-brand">نظام المبيعات</div>
    </nav>
  );
};

export default NavbarComponent;
