
import { useState } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  FolderKanban,
  Search,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import Brand from "../components/Brand";
import "./AppLayout.css";

const navigation = [
  {
    label: "Overview",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    path: "/projects",
    icon: FolderKanban,
  },
  {
    label: "Search",
    path: "/search",
    icon: Search,
  },
];

function getTitle(path) {
  if (path === "/dashboard") return "Dashboard";
  if (path === "/projects") return "Projects";
  if (path.startsWith("/projects/")) return "Project Details";
  if (path === "/search") return "Search";
  return "Workspace";
}

function AmbientBackground() {
  return (
    <div className="page-waves" aria-hidden="true">
      <div className="bg-ambient">
        <span className="ambient-pulse pulse-one" />
        <span className="ambient-pulse pulse-two" />
        <span className="ambient-pulse pulse-three" />

        <span className="ambient-dot dot-1" />
        <span className="ambient-dot dot-2" />
        <span className="ambient-dot dot-3" />
        <span className="ambient-dot dot-4" />
      </div>

      <div className="diag-wave diag-layer-1">
        <svg viewBox="0 0 1800 1800" preserveAspectRatio="none">
          <defs>
            <linearGradient
              id="diagOrangeSoft1"
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#ffd5b0"
                stopOpacity="0.34"
              />
              <stop
                offset="55%"
                stopColor="#ffaa70"
                stopOpacity="0.22"
              />
              <stop
                offset="100%"
                stopColor="#f78b4b"
                stopOpacity="0.16"
              />
            </linearGradient>
          </defs>

          <path
            d="M0 240 C360 140 680 360 1040 250 C1380 145 1580 310 1800 220 V680 C1480 790 1200 560 860 670 C520 780 260 560 0 640 Z"
            fill="url(#diagOrangeSoft1)"
          />

          <path
            d="M0 980 C340 870 670 1090 1030 980 C1370 875 1580 1040 1800 950 V1390 C1480 1490 1200 1270 860 1380 C520 1490 260 1270 0 1350 Z"
            fill="url(#diagOrangeSoft1)"
          />
        </svg>
      </div>

      <div className="diag-wave diag-layer-2">
        <svg viewBox="0 0 1800 1800" preserveAspectRatio="none">
          <path
            d="M0 520 C390 420 710 640 1080 530 C1410 430 1600 590 1800 500 V880 C1460 980 1180 770 840 880 C500 990 250 780 0 850 Z"
            fill="#ffb884"
            opacity="0.16"
          />

          <path
            d="M0 1260 C390 1160 710 1380 1080 1270 C1410 1170 1600 1330 1800 1240 V1620 C1460 1720 1180 1510 840 1620 C500 1730 250 1520 0 1590 Z"
            fill="#ffd9ba"
            opacity="0.22"
          />
        </svg>
      </div>

      <div className="diag-wave diag-layer-3">
        <svg viewBox="0 0 1800 1800" preserveAspectRatio="none">
          <path
            d="M0 370 C360 285 690 485 1050 385 C1390 290 1590 445 1800 360"
            fill="none"
            stroke="#fff7ef"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.45"
          />

          <path
            d="M0 1110 C360 1025 690 1225 1050 1125 C1390 1030 1590 1185 1800 1100"
            fill="none"
            stroke="#fff7ef"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.45"
          />
        </svg>
      </div>

      <div className="page-wave-veil" />
    </div>
  );
}

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const title = getTitle(location.pathname);

  const name =
    user?.name ||
    user?.fullName ||
    "Account";

  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleToggle = () => {
    if (window.innerWidth <= 760) {
      setMobileOpen((current) => !current);
    } else {
      setCollapsed((current) => !current);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <AmbientBackground />

      <div className="app-shell">
        {mobileOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <aside
          className={[
            "sidebar",
            collapsed ? "collapsed" : "",
            mobileOpen ? "sidebar-open" : "",
          ].join(" ")}
        >
          <div className="sidebar-brand">
            <Brand />
          </div>

          <div className="workspace-switcher">
            <div className="workspace-icon">T</div>

            <span className="workspace-name">
              My workspace
            </span>

            <ChevronDown
              size={14}
              className="workspace-arrow"
            />
          </div>

          <p className="sidebar-label">WORKSPACE</p>

          <nav className="sidebar-nav">
            {navigation.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "nav-link-active" : ""}`
                }
                title={collapsed ? label : undefined}
              >
                <Icon size={18} strokeWidth={1.9} />

                <span className="nav-text">{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="sidebar-bottom">
            <div className="profile">
              <div className="avatar">{initials}</div>

              <div className="profile-info">
                <strong title={name}>{name}</strong>
                <span title={user?.email}>
                  {user?.email || "Workspace member"}
                </span>
              </div>
            </div>

            <button
              className="logout-button"
              onClick={handleLogout}
              title="Logout"
              aria-label="Logout"
            >
              <LogOut size={17} />
            </button>
          </div>
        </aside>

        <main
          className={`main-area ${
            collapsed ? "main-area-collapsed" : ""
          }`}
        >
          <header className="topbar">
            <div className="topbar-left">
              <button
                className="toggle-button"
                onClick={handleToggle}
                title="Collapse or open sidebar"
                aria-label="Toggle sidebar"
              >
                {mobileOpen ? (
                  <X size={17} />
                ) : (
                  <Menu size={17} />
                )}
              </button>

              <div className="breadcrumb">
                <span>WORKSPACE</span>
                <span className="breadcrumb-separator">/</span>
                <strong>{title.toUpperCase()}</strong>
              </div>
            </div>

            <div className="topbar-right">
              <button
                className="top-search"
                onClick={() => navigate("/search")}
                aria-label="Open search"
              >
                <Search size={15} />
                <span>Search workspace...</span>
                <kbd>↵</kbd>
              </button>

              <div className="top-avatar" title={name}>
                {initials}
              </div>
            </div>
          </header>

          <div className="page-content">
            <div
              key={location.pathname}
              className="page-transition"
            >
              <Outlet />
            </div>
          </div>

          <footer className="app-footer">
            <span>
              © {new Date().getFullYear()} ThreadLine
            </span>

            <span>
              Project management, made clearer.
            </span>
          </footer>
        </main>
      </div>
    </>
  );
}
