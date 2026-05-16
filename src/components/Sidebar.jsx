import * as React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar({ children }) {
  const [collapsed, setCollapsed] = React.useState(false);

  const widthExpanded = 280;
  const widthCollapsed = 72;

  const navItems = [
    { key: "home", label: "الرئيسية", icon: "fa-solid fa-house", to: "/invoice/home" },
    { key: "dashboard", label: "لوحة التحكم", icon: "fa-solid fa-gauge-high", to: "/invoice/dashboard" },
    { key: "orders", label: "الطلبات", icon: "fa-solid fa-table", to: "/invoice/orders" },
    { key: "products", label: "المنتجات", icon: "fa-solid fa-boxes-stacked", to: "/invoice/products" },
    { key: "customers", label: "العملاء", icon: "fa-solid fa-users", to: "/invoice/customers" }
  ];

  return (
    <div className="d-flex" dir="rtl" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        className="d-flex flex-column flex-shrink-0 text-white bg-dark"
        style={{
          width: collapsed ? `${widthCollapsed}px` : `${widthExpanded}px`,
          transition: "width 0.2s ease-in-out",
          overflow: "hidden",
          position: "sticky",   
          top: 0,    
          right: 0,       
          height: "100vh"
        }}
      >
        {/* Brand + Collapse toggle */}
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
          <a href="/" className="d-flex align-items-center text-white text-decoration-none">
            {/* <i className="fa-solid fa-layer-group fa-lg"></i> */}
            {!collapsed && <span className="fs-5 fw-bold ms-2">IST System</span>}
          </a>
          <button
            className="btn btn-sm btn-outline-light"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "توسيع" : "طي"}
          >
            <i className={`fa-solid ${collapsed ? "fa-chevron-left" : "fa-chevron-right"}`}></i>
          </button>
        </div>

        {/* Navigation */}
        <ul className="nav nav-pills flex-column mb-auto mt-2 p-0">
          {navItems.map((item) => (
            <li key={item.key} className="nav-item">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  "nav-link text-white d-flex align-items-center" +
                  (isActive ? " active" : " text-opacity-75") +
                  (collapsed ? " justify-content-center" : "")
                }
                title={collapsed ? item.label : ""}
                style={{ padding: "10px 16px" }}
              >
                <i
                  className={item.icon}
                  style={{
                    fontSize: 18,
                    marginInlineEnd: collapsed ? 0 : "8px"
                  }}
                />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>

      {/* Page content */}
      <main className="flex-grow-1 p-3 bg-light" style={{overflow:"hidden"}}>{children}</main>
    </div>
  );
}
