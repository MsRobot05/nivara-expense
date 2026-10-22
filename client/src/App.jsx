
import { useState } from "react";
import "./App.css";

const initialVouchers = [
  {
    id: "NIV-2026-001",
    title: "Client meeting travel",
    category: "Travel",
    date: "2026-10-20",
    amount: 2450,
    status: "Pending",
  },
  {
    id: "NIV-2026-002",
    title: "Office supplies",
    category: "Office",
    date: "2026-10-19",
    amount: 1280,
    status: "Approved",
  },
  {
    id: "NIV-2026-003",
    title: "Team lunch",
    category: "Meals",
    date: "2026-10-18",
    amount: 3200,
    status: "Rejected",
  },
];

function App() {
  const [vouchers, setVouchers] = useState(initialVouchers);
  const [activePage, setActivePage] = useState("Dashboard");
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [form, setForm] = useState({
    title: "",
    category: "Travel",
    date: new Date().toISOString().slice(0, 10),
    amount: "",
    department: "Finance",
  });

  const visibleVouchers = vouchers.filter((voucher) => {
    const matchesSearch =
      voucher.title.toLowerCase().includes(search.toLowerCase()) ||
      voucher.id.toLowerCase().includes(search.toLowerCase()) ||
      voucher.category.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || voucher.status === filter;

    const matchesPage =
      activePage === "Dashboard" ||
      activePage === "My Vouchers" ||
      (activePage === "Approvals" && voucher.status === "Pending") ||
      (activePage === "Accounts" &&
        ["Approved", "Rejected"].includes(voucher.status));

    return matchesSearch && matchesFilter && matchesPage;
  });

  function createVoucher(event) {
    event.preventDefault();

    const newVoucher = {
      id: `NIV-2026-${String(vouchers.length + 1).padStart(3, "0")}`,
      title: form.title,
      category: form.category,
      date: form.date,
      amount: Number(form.amount),
      status: "Pending",
      department: form.department,
    };

    setVouchers((current) => [newVoucher, ...current]);
    setShowForm(false);
    setActivePage("My Vouchers");
    setForm({
      title: "",
      category: "Travel",
      date: new Date().toISOString().slice(0, 10),
      amount: "",
      department: "Finance",
    });
  }

  function changeStatus(id, status) {
    setVouchers((current) =>
      current.map((voucher) =>
        voucher.id === id ? { ...voucher, status } : voucher
      )
    );
  }

  const totalAmount = vouchers.reduce(
    (sum, voucher) => sum + voucher.amount,
    0
  );

  const pendingCount = vouchers.filter(
    (voucher) => voucher.status === "Pending"
  ).length;

  const approvedCount = vouchers.filter(
    (voucher) => voucher.status === "Approved"
  ).length;

  const money = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">N</div>
          <div>
            <strong>NIVARA</strong>
            <span>INTELLIGENT EXPENSES</span>
          </div>
        </div>

        <div className="workspace-label">WORKSPACE</div>

        <nav className="navigation">
          {[
            ["Dashboard", "▦"],
            ["My Vouchers", "▤"],
            ["Approvals", "✓"],
            ["Accounts", "₹"],
          ].map(([page, symbol]) => (
            <button
              key={page}
              className={`nav-item ${
                activePage === page ? "active" : ""
              }`}
              onClick={() => setActivePage(page)}
            >
              <span className="nav-icon">{symbol}</span>
              {page}
              {page === "Approvals" && pendingCount > 0 && (
                <span className="nav-count">{pendingCount}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="security-icon">✓</div>
          <strong>Expense control,</strong>
          <strong>with confidence.</strong>
          <p>Every expense deserves a clear trail.</p>
          <div className="version">NIVARA • PREVIEW 1.0</div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> {activePage}
          </div>
          <div className="user-profile">
            <div className="online-dot" />
            <div className="avatar">AD</div>
            <div className="user-info">
              <strong>Demo User</strong>
              <span>Employee workspace</span>
            </div>
          </div>
        </header>

        <section className="page-content">
          <div className="welcome-row">
            <div>
              <div className="eyebrow">YOUR FINANCIAL WORKSPACE</div>
              <h1>
                {activePage === "Dashboard"
                  ? "Good to see you."
                  : activePage}
              </h1>
              <p className="subtitle">
                {activePage === "Dashboard"
                  ? "A clearer view of every rupee spent."
                  : `Track and manage your ${activePage.toLowerCase()}.`}
              </p>
            </div>

            <button
              className="primary-button"
              onClick={() => setShowForm(true)}
            >
              <span>＋</span> New voucher
            </button>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-top">
                <span>Total expenses</span>
                <span className="stat-icon purple">₹</span>
              </div>
              <strong>{money(totalAmount)}</strong>
              <div className="stat-note">Across all demo vouchers</div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>Awaiting approval</span>
                <span className="stat-icon orange">◷</span>
              </div>
              <strong>{pendingCount}</strong>
              <div className="stat-note">Require director review</div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>Approved vouchers</span>
                <span className="stat-icon green">✓</span>
              </div>
              <strong>{approvedCount}</strong>
              <div className="stat-note">Ready for accounts review</div>
            </div>
          </div>

          <section className="voucher-panel">
            <div className="panel-heading">
              <div>
                <h2>Expense vouchers</h2>
                <p>Your recent activity, all in one place.</p>
              </div>
              <span className="record-count">
                {visibleVouchers.length} records
              </span>
            </div>

            <div className="toolbar">
              <div className="search-box">
                <span>⌕</span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search vouchers..."
                />
              </div>

              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                aria-label="Filter by status"
              >
                <option value="All">All statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>VOUCHER</th>
                    <th>EXPENSE</th>
                    <th>DATE</th>
                    <th>AMOUNT</th>
                    <th>STATUS</th>
                    {activePage === "Approvals" && <th>ACTION</th>}
                  </tr>
                </thead>
                <tbody>
                  {visibleVouchers.map((voucher) => (
                    <tr key={voucher.id}>
                      <td>
                        <span className="voucher-id">{voucher.id}</span>
                      </td>
                      <td>
                        <strong className="expense-title">
                          {voucher.title}
                        </strong>
                        <span className="category">
                          {voucher.category}
                        </span>
                      </td>
                      <td>{voucher.date}</td>
                      <td className="amount">
                        {money(voucher.amount)}
                      </td>
                      <td>
                        <span
                          className={`status status-${voucher.status.toLowerCase()}`}
                        >
                          <span className="status-dot" />
                          {voucher.status}
                        </span>
                      </td>
                      {activePage === "Approvals" && (
                        <td>
                          {voucher.status === "Pending" ? (
                            <div className="action-buttons">
                              <button
                                className="approve-button"
                                onClick={() =>
                                  changeStatus(voucher.id, "Approved")
                                }
                              >
                                Approve
                              </button>
                              <button
                                className="reject-button"
                                onClick={() =>
                                  changeStatus(voucher.id, "Rejected")
                                }
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            "—"
                          )}
                        </td>
                      )}
                    </tr>
                  ))}

                  {visibleVouchers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="empty-state">
                        No vouchers found. Try another search or create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="panel-footer">
              <span>Showing {visibleVouchers.length} vouchers</span>
              <span>INR · Indian Rupee</span>
            </div>
          </section>

          <div className="insight-banner">
            <div className="insight-symbol">✳</div>
            <div>
              <strong>Your expense intelligence</strong>
              <p>
                Next up: receipt scanning, duplicate detection and a
                transparent approval timeline.
              </p>
            </div>
            <span className="coming-soon">COMING NEXT</span>
          </div>

          <footer className="page-footer">
            <span>NIVARA EXPENSE CONTROL</span>
            <span>Built for clarity. Designed for accountability.</span>
          </footer>
        </section>
      </main>

      {showForm && (
        <div className="modal-backdrop">
          <section className="voucher-modal">
            <div className="modal-heading">
              <div>
                <div className="eyebrow">EXPENSE MANAGEMENT</div>
                <h2>Create a voucher</h2>
                <p>Enter the details of your business expense.</p>
              </div>
              <button
                className="close-button"
                onClick={() => setShowForm(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form onSubmit={createVoucher}>
              <label>
                Expense title *
                <input
                  required
                  maxLength={100}
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                  placeholder="e.g. Client meeting travel"
                />
              </label>

              <label>
                Department *
                <select
                  value={form.department}
                  onChange={(event) =>
                    setForm({ ...form, department: event.target.value })
                  }
                >
                  <option>Finance</option>
                  <option>Technology</option>
                  <option>Sales</option>
                  <option>Human Resources</option>
                  <option>Operations</option>
                </select>
              </label>

              <div className="form-row">
                <label>
                  Category *
                  <select
                    value={form.category}
                    onChange={(event) =>
                      setForm({ ...form, category: event.target.value })
                    }
                  >
                    <option>Travel</option>
                    <option>Office</option>
                    <option>Meals</option>
                    <option>Accommodation</option>
                    <option>Other</option>
                  </select>
                </label>

                <label>
                  Amount (₹) *
                  <input
                    required
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.amount}
                    onChange={(event) =>
                      setForm({ ...form, amount: event.target.value })
                    }
                    placeholder="0.00"
                  />
                </label>
              </div>

              <label>
                Expense date *
                <input
                  required
                  type="date"
                  value={form.date}
                  onChange={(event) =>
                    setForm({ ...form, date: event.target.value })
                  }
                />
              </label>

              <div className="form-note">
                <span>ⓘ</span>
                This prototype stores vouchers in temporary page state.
                Database storage and signature verification come later.
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  Create voucher →
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
