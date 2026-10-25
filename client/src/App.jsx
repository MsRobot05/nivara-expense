
import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import Login from "./Login";
import {
  getMyVouchers,
  getAllVouchers,
  createDraftVoucher,
  submitVoucher,
  approveVoucher,
  rejectVoucher,
   uploadDirectorSignature,
    getSignatureUrl,
    updateDraftVoucher,
  deleteDraftVoucher,
} from "./voucherService";
import "./App.css";


const API_URL = "http://localhost:5000";
const MAX_SIGNATURE_SIZE = 2 * 1024 * 1024;

async function uploadEmployeeSignature(file) {
  if (!file) {
    throw new Error("Please select your employee signature.");
  }

  if (!["image/png", "image/jpeg"].includes(file.type)) {
    throw new Error("Signature must be a PNG or JPEG image.");
  }

  if (file.size > MAX_SIGNATURE_SIZE) {
    throw new Error("Signature image must be 2 MB or smaller.");
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("Please sign in again.");

  const extension = file.type === "image/png" ? "png" : "jpg";
  const filePath = `${user.id}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from("voucher-signatures")
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) throw error;

  return filePath;
}

async function testAuthenticatedApi() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) throw error;

  if (!session?.access_token) {
    throw new Error("Please sign in first.");
  }

  const response = await fetch(`${API_URL}/api/me`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "API request failed.");
  }

  return result;
}


function mapVoucher(row) {
  return {
    id: row.id,
    employee_id: row.employee_id,
    employeeName:
      row.employee_name ??
      row.profiles?.full_name ??
      null,

    voucherNumber: row.voucher_number,
    title: row.description || "(Untitled expense)",
    category: row.category || "Other",
    date: row.expense_date,
    amount: Number(row.amount ?? 0),

    status:
      {
        draft: "Draft",
        pending_approval: "Pending",
        approved: "Approved",
        rejected: "Rejected",
      }[row.status] ?? row.status,

    department: row.department || "",
    employee_signature: row.employee_signature ?? null,
    director_signature: row.director_signature ?? null,
    rejection_reason: row.rejection_reason ?? null,

    createdAt: row.created_at ?? null,
    updatedAt: row.updated_at ?? null,
    approvedAt: row.approved_at ?? null,
    rejectedAt: row.rejected_at ?? null,
  };
}

function formatAuditDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}



function App() {
  const [session, setSession] = useState(null);
    const [processingVoucherId, setProcessingVoucherId] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profile, setProfile] = useState(null);
const [profileLoading, setProfileLoading] = useState(true);

  const [vouchers, setVouchers] = useState([]);
  const [signatureUrls, setSignatureUrls] = useState({});
  const [signaturePreviewUrl, setSignaturePreviewUrl] = useState("");
  const [vouchersLoading, setVouchersLoading] = useState(false);
  const [submittingVoucherId, setSubmittingVoucherId] = useState(null);
const [directorSignaturePath, setDirectorSignaturePath] = useState("");

  const [savingVoucher, setSavingVoucher] = useState(false);
  const [apiTestMessage, setApiTestMessage] = useState("");
  const [apiTesting, setApiTesting] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  const [signatureFile, setSignatureFile] = useState(null);
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
  const [editingVoucher, setEditingVoucher] = useState(null);
  function findDuplicateExpense() {
  const amount = Number(form.amount);

  if (!form.date || !Number.isFinite(amount) || amount <= 0) {
    return null;
  }

  return vouchers.find((voucher) => {
    const sameEmployee = voucher.employee_id === profile?.id;
    const sameDate = voucher.date === form.date;
    const sameAmount = Number(voucher.amount) === amount;
  const sameCategory =
  String(voucher.category ?? "").toLowerCase() ===
  String(form.category ?? "").toLowerCase();
    const notCurrentVoucher = voucher.id !== editingVoucher?.id;
    const notRejected = voucher.status !== "Rejected";

    return (
      sameEmployee &&
      sameDate &&
      sameAmount &&
      sameCategory &&
      notCurrentVoucher &&
      notRejected
    );
  });
}
const duplicateExpense = findDuplicateExpense();
async function showDirectorSignature(voucher) {
  try {
    if (!voucher.director_signature) {
      setActionMessage("This voucher has no saved director signature.");
      return;
    }

    const url = await getSignatureUrl(voucher.director_signature);
    setSignaturePreviewUrl(url);
    setActionMessage("Director signature loaded securely.");
  } catch (error) {
    setActionMessage("Could not load signature: " + error.message);
  }
}
  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (mounted) {
          setSession(data?.session ?? null);
        }
      } catch (error) {
        if (mounted) {
          setActionMessage(
            "Could not check login status: " + error.message
          );
        }
      } finally {
        if (mounted) setAuthLoading(false);
      }
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);
  
  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      if (!session) {
        setProfile(null);
        setProfileLoading(false);
        return;
      }

      setProfileLoading(true);

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name, role")
          .eq("id", session.user.id)
          .single();

        if (error) throw error;

        if (!cancelled) {
 const role = String(data.role ?? "").trim().toLowerCase();

setProfile({ ...data, role });

setActivePage(
  role === "director"
    ? "Approvals"
    : role === "accounts"
      ? "Accounts"
      : "Dashboard"
);

setVouchers([]);
setSearch("");
setFilter("All");
}
      } catch (error) {
        if (!cancelled) {
          setProfile(null);
          setActionMessage(
            "Could not load your user role: " + error.message
          );
        }
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [session]);


 
  useEffect(() => {
    let cancelled = false;

    async function loadVouchers() {
      if (!session) {
        setVouchers([]);
        setVouchersLoading(false);
        return;
      }

      if (profileLoading || !profile) {
        setVouchers([]);
        setVouchersLoading(false);
        return;
      }

      setVouchersLoading(true);

      try {
        const rows =
          profile.role === "director" || profile.role === "accounts"
            ? await getAllVouchers()
            : await getMyVouchers();

        if (!cancelled) {
          console.table(
  rows
    .filter((row) => String(row.voucher_number) === "38")
    .map((row) => ({
      voucherNumber: row.voucher_number,
      description: row.description,
      category: row.category,
      databaseAmount: row.amount,
      amountType: typeof row.amount,
    }))
);
          setVouchers(rows.map(mapVoucher));
          


console.log(
  "Loaded voucher statuses:",
  rows.map((row) => ({
    id: row.id,
    voucherNumber: row.voucher_number,
    status: row.status,
    rejectionReason: row.rejection_reason,
  }))
);



        }
      } catch (error) {
        if (!cancelled) {
          setActionMessage(
            "Could not load vouchers: " + error.message
          );
        }
      } finally {
        if (!cancelled) setVouchersLoading(false);
      }
    }

    loadVouchers();

    return () => {
      cancelled = true;
    };
  }, [session, profile, profileLoading]);

useEffect(() => {
  if (!session || !profile) return;

  const channel = supabase
    .channel("voucher-changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "vouchers",
      },
      async () => {
        try {
          await refreshVouchers();
        } catch (error) {
          console.error("Could not refresh vouchers:", error);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [session, profile]);
  async function handleLogout() {
    setActionMessage("");

    const { error } = await supabase.auth.signOut();

    if (error) {
      setActionMessage("Could not sign out: " + error.message);
    }
  }

  async function handleApiTest() {
    setApiTesting(true);
    setApiTestMessage("");

    try {
      const result = await testAuthenticatedApi();

      setApiTestMessage(
        `Connected! Authenticated as ${
          result.user?.email || session?.user?.email || "user"
        }`
      );
    } catch (error) {
      setApiTestMessage(`API test failed: ${error.message}`);
    } finally {
      setApiTesting(false);
    }
  }

async function refreshVouchers() {
  const rows =
    profile?.role === "director" || profile?.role === "accounts"
      ? await getAllVouchers()
      : await getMyVouchers();

  console.log("Voucher loading role:", profile?.role);
  console.log("Raw rejected rows:", rows.filter(
    (row) => row.status === "rejected"
  ));

  const mappedRows = rows.map(mapVoucher);

  console.log("Mapped rejected rows:", mappedRows.filter(
    (voucher) => voucher.status === "Rejected"
  ));

  setVouchers(mappedRows);
}

  

  async function createVoucher(event) {
  event.preventDefault();

  console.log("Saving form:", {
    editingVoucherId: editingVoucher?.id,
    editingVoucherStatus: editingVoucher?.status,
  });

  const amount = Number(form.amount);
  const today = new Date().toLocaleDateString("en-CA");

  if (
    !form.title.trim() ||
    !form.department ||
    !form.date ||
    form.date > today ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    setActionMessage(
      "Enter a title, department, valid date, and positive amount. The expense date cannot be in the future."
    );
    return;
  }

  

    

    setSavingVoucher(true);
    setActionMessage("");

try {
  let uploadedSignaturePath = null;

if (signatureFile) {
  uploadedSignaturePath =
    await uploadEmployeeSignature(signatureFile);

  console.log("Uploaded signature path:", uploadedSignaturePath);
}

  const { data: authData, error: authError } =
    await supabase.auth.getUser();

  console.log("Current user:", authData?.user?.id);
  console.log("Current email:", authData?.user?.email);
  console.log("Auth error:", authError?.message);

  console.log("Amount entered:", form.amount);
console.log("Amount being saved:", amount);
const voucherData = {
  description: form.title.trim(),
  category: form.category,
  expense_date: form.date,
  amount,
  department: form.department,
  job_title: "Employee",
  employee_signature:
    uploadedSignaturePath ??
    (editingVoucher ? editingVoucher.employee_signature : null),
};

if (editingVoucher) {
  await updateDraftVoucher(editingVoucher.id, voucherData);
} else {
  await createDraftVoucher(voucherData);
}

      await refreshVouchers();

      setShowForm(false);
      setActivePage("My Vouchers");
      setActionMessage(
  editingVoucher
    ? "Draft voucher updated successfully."
    : "Draft voucher created successfully."
);
      setForm({
        title: "",
        category: "Travel",
        date: new Date().toISOString().slice(0, 10),
        amount: "",
        department: "Finance",
      });

      setSignatureFile(null);
    

} catch (error) {
  console.error("Voucher save failed:", error);

  const errorMessage = String(error?.message ?? "");
  const isDuplicate =
    error?.code === "23505" ||
    errorMessage.includes("Duplicate expense:");

  setActionMessage(
    isDuplicate
      ? "Possible duplicate expense: a voucher already exists with the same date, amount, and category. Please review your vouchers."
      : "Could not save voucher: " +
          (errorMessage || "An unexpected error occurred.")
  );
} finally {
  setSavingVoucher(false);
}

  }
  
function startEditingVoucher(voucher) {
 if (
  profile?.role !== "employee" ||
  voucher.status !== "Draft" ||
  voucher.employee_id !== profile.id ||
  submittingVoucherId !== null
) {
  return;
}

if (duplicateExpense) {
  setActionMessage(
    "Possible duplicate expense: another voucher has the same date, amount, and category. Please review it before saving."
  );
  return;
}

  if (
    !voucher ||
    voucher.status?.toLowerCase() !== "draft" ||
    voucher.employee_id !== profile.id
  ) {
    setActionMessage("Only your own draft vouchers can be edited.");
    return;
  }

  setActionMessage("");
  setEditingVoucher(voucher);

  setForm({
   title: voucher.title ?? "",
date: voucher.date ?? new Date().toISOString().slice(0, 10),
amount: String(voucher.amount ?? ""),
    department: voucher.department ?? "Finance",
  });

  setSignatureFile(null);
  setShowForm(true);
}

async function changeStatus(voucher) {
  if (voucher.status !== "Draft" || submittingVoucherId !== null) {
    return;
  }

  setSubmittingVoucherId(voucher.id);
  setActionMessage("Submitting voucher for approval...");

  try {
    await submitVoucher(voucher.id);
    await refreshVouchers();
    setActionMessage("Voucher submitted successfully for approval.");
  } catch (error) {
    console.error("Voucher submission failed:", error);

    setActionMessage(
      error.message?.includes("Duplicate expense:")
        ? "This expense matches another submitted or approved voucher."
        : "Could not submit voucher: " + (error.message || "Unknown error")
    );
  } finally {
    setSubmittingVoucherId(null);
  }
}


 
  



const searchText = String(search ?? "").trim().toLowerCase();

const visibleVouchers = vouchers.filter((voucher) => {
  const matchesSearch = [
    voucher.title,
    voucher.id,
    voucher.voucherNumber,
    voucher.category,
    voucher.department,
  ].some((value) =>
    String(value ?? "").toLowerCase().includes(searchText)
  );

  const matchesFilter =
    filter === "All" || voucher.status === filter;

  const matchesPage =
    activePage === "Dashboard" ||
    activePage === "All Vouchers" ||
    activePage === "My Vouchers" ||
    (activePage === "Approvals" &&
      voucher.status === "Pending") ||
    activePage === "Accounts";

  return matchesSearch && matchesFilter && matchesPage;
});

const totalAmount = vouchers.reduce(
  (sum, voucher) => sum + (Number(voucher.amount) || 0),
  0
);


  const totalVoucherCount = vouchers.length;

  const draftCount = vouchers.filter(
    (voucher) => voucher.status === "Draft"
  ).length;

  const pendingCount = vouchers.filter(
    (voucher) => voucher.status === "Pending"
  ).length;

  const approvedCount = vouchers.filter(
    (voucher) => voucher.status === "Approved"
  ).length;

  const rejectedCount = vouchers.filter(
    (voucher) => voucher.status === "Rejected"
  ).length;

  const pendingAmount = vouchers
    .filter((voucher) => voucher.status === "Pending")
    .reduce(
      (sum, voucher) => sum + Number(voucher.amount || 0),
      0
    );

  const approvedAmount = vouchers
    .filter((voucher) => voucher.status === "Approved")
    .reduce(
      (sum, voucher) => sum + Number(voucher.amount || 0),
      0
    );

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

  if (authLoading) {
    return (
      <main className="login-page">
        <div className="login-card">
          <h1>NIVARA</h1>
          <p>Checking your sign-in status...</p>
        </div>
      </main>
    );
  }

  if (!session) return <Login />

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
  {(
    profile?.role === "employee"
      ? [
          ["Dashboard", "▦"],
          ["My Vouchers", "▤"],
        ]
      : profile?.role === "director"
      ? [
          ["Dashboard", "▦"],
          ["Approvals", "✓"],
           ["All Vouchers", "▤"],
        ]
      : profile?.role === "accounts"
      ? [
          ["Dashboard", "▦"],
          ["Accounts", "₹"],
        ]
      : [["Dashboard", "▦"]]
  ).map(([page, symbol]) => (
    <button
      key={page}
      type="button"
      className={`nav-item ${
        activePage === page ? "active" : ""
      }`}
      onClick={() => {
  setActivePage(page);
  setFilter("All");
  setSearch("");
}}
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
            <div className="avatar">
              {(session.user.email || "U").charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <strong>{session.user.email}</strong>
              <span>Signed-in user</span>
            </div>
            <button
              type="button"
              className="secondary-button"
              onClick={handleLogout}
            >
              Sign out
            </button>
          </div>
        </header>
        


        <section className="page-content">
          {actionMessage && (
            <p role="status" className="form-note">
              {actionMessage}
            </p>
          )}

          <div className="welcome-row">
            <div>
              <div className="eyebrow">EXPENSE MANAGEMENT</div>
              <h1>{activePage}</h1>
              <p>
                Manage your expense vouchers and track their status.
              </p>
            </div>

            <div className="welcome-actions">
              <button
                type="button"
                className="secondary-button"
                disabled={apiTesting}
                onClick={handleApiTest}
              >
                {apiTesting
                  ? "Testing..."
                  : "Test API connection"}
              </button>

             

{profile?.role === "employee" && (
  <button
    type="button"
    className="primary-button"
    onClick={() => {
      setActionMessage("");
      setShowForm(true);
    }}
  >
    <span>＋</span> New voucher
  </button>
)}


            </div>
          </div>

          {apiTestMessage && (
            <p role="status" className="form-note">
              {apiTestMessage}
            </p>
          )}

         
<div className="stats-grid">
  {profile?.role === "employee" && (
    <>
      <div className="stat-card">
        <div className="stat-top">
          <span>Total Vouchers</span>
          <span className="stat-icon purple">▤</span>
        </div>
        <strong>{totalVoucherCount}</strong>
        <div className="stat-note">Your vouchers</div>
      </div>

      <div className="stat-card">
        <div className="stat-top">
          <span>Draft Vouchers</span>
          <span className="stat-icon purple">✎</span>
        </div>
        <strong>{draftCount}</strong>
        <div className="stat-note">Not yet submitted</div>
      </div>

      <div className="stat-card">
        <div className="stat-top">
          <span>Pending Approval</span>
          <span className="stat-icon orange">◷</span>
        </div>
        <strong>{pendingCount}</strong>
        <div className="stat-note">Awaiting review</div>
      </div>

      <div className="stat-card">
        <div className="stat-top">
          <span>Approved Vouchers</span>
          <span className="stat-icon green">✓</span>
        </div>
        <strong>{approvedCount}</strong>
        <div className="stat-note">Approved expenses</div>
      </div>

      <div className="stat-card">
        <div className="stat-top">
          <span>Rejected Vouchers</span>
          <span className="stat-icon orange">!</span>
        </div>
        <strong>{rejectedCount}</strong>
        <div className="stat-note">Review rejection reasons</div>
      </div>

      <div className="stat-card">
        <div className="stat-top">
          <span>Total Amount Claimed</span>
          <span className="stat-icon purple">₹</span>
        </div>
        <strong>{money(totalAmount)}</strong>
        <div className="stat-note">Your submitted and draft expenses</div>
      </div>
    </>
  )}

  {profile?.role === "director" && (
    <>
      <div className="stat-card">
        <div className="stat-top">
          <span>Pending Approval</span>
          <span className="stat-icon orange">◷</span>
        </div>
        <strong>{pendingCount}</strong>
        <div className="stat-note">Awaiting your decision</div>
      </div>

      <div className="stat-card">
        <div className="stat-top">
          <span>Approved Today</span>
          <span className="stat-icon green">✓</span>
        </div>
        <strong>
          {vouchers.filter((v) => {
            if (!v.approvedAt) return false;
            const d = new Date(v.approvedAt);
            const now = new Date();
            return d.toDateString() === now.toDateString();
          }).length}
        </strong>
        <div className="stat-note">Approval decisions today</div>
      </div>

      <div className="stat-card">
        <div className="stat-top">
          <span>Rejected Today</span>
          <span className="stat-icon orange">!</span>
        </div>
        <strong>
          {vouchers.filter((v) => {
            if (!v.rejectedAt) return false;
            const d = new Date(v.rejectedAt);
            const now = new Date();
            return d.toDateString() === now.toDateString();
          }).length}
        </strong>
        <div className="stat-note">Rejection decisions today</div>
      </div>

      <div className="stat-card">
        <div className="stat-top">
          <span>Total Pending Amount</span>
          <span className="stat-icon purple">₹</span>
        </div>
        <strong>{money(pendingAmount)}</strong>
        <div className="stat-note">Awaiting approval</div>
      </div>

      <div className="stat-card">
        <div className="stat-top">
          <span>Total Vouchers</span>
          <span className="stat-icon purple">▤</span>
        </div>
        <strong>{totalVoucherCount}</strong>
        <div className="stat-note">Organization-wide records</div>
      </div>
    </>
  )}

  {profile?.role === "accounts" && (
    <>
      <div className="stat-card">
        <div className="stat-top">
          <span>Total Vouchers</span>
          <span className="stat-icon purple">▤</span>
        </div>
        <strong>{totalVoucherCount}</strong>
        <div className="stat-note">Organization-wide records</div>
      </div>

      <div className="stat-card">
        <div className="stat-top">
          <span>Pending Approval</span>
          <span className="stat-icon orange">◷</span>
        </div>
        <strong>{pendingCount}</strong>
        <div className="stat-note">Awaiting Director review</div>
      </div>

      <div className="stat-card">
        <div className="stat-top">
          <span>Approved Vouchers</span>
          <span className="stat-icon green">✓</span>
        </div>
        <strong>{approvedCount}</strong>
        <div className="stat-note">Approved for processing</div>
      </div>

      <div className="stat-card">
        <div className="stat-top">
          <span>Rejected Vouchers</span>
          <span className="stat-icon orange">!</span>
        </div>
        <strong>{rejectedCount}</strong>
        <div className="stat-note">Rejected requests</div>
      </div>

      <div className="stat-card">
        <div className="stat-top">
          <span>Total Approved Expense Amount</span>
          <span className="stat-icon purple">₹</span>
        </div>
        <strong>{money(approvedAmount)}</strong>
        <div className="stat-note">Total approved voucher value</div>
      </div>
    </>
  )}
</div>
{profile?.role === "director" && (
  <section
    className="voucher-panel"
    style={{ padding: "20px", marginBottom: "20px" }}
  >
    <h2>Director Signature</h2>
    <p>Upload your signature before approving vouchers.</p>

    <input
      type="file"
      accept="image/png,image/jpeg"
      onChange={async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
          const path = await uploadDirectorSignature(file);
          setDirectorSignaturePath(path);
          setActionMessage("Director signature uploaded successfully.");
        } catch (error) {
          setActionMessage("Signature upload failed: " + error.message);
        }
      }}
    />

    {directorSignaturePath && <p>Signature ready for approval.</p>}
  </section>
)}

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
                  aria-label="Search vouchers"
                />
              </div>

              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                aria-label="Filter by status"
              >
                <option value="All">All statuses</option>
                <option value="Draft">Draft</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="table-scroll">
              {vouchersLoading && (
                <p role="status" className="form-note">
                  Loading your vouchers from Supabase...
                </p>
              )}

              <table>
                <thead>
                  <tr>
                    <th>VOUCHER</th>
                    <th>EXPENSE</th>
                    <th>DATE</th>
                    <th>AMOUNT</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>

                <tbody>
                  {visibleVouchers.map((voucher) => (
                    <tr key={voucher.id}>
                      <td>
                        <span className="voucher-id">
                          {voucher.voucherNumber
                            ? `NIV-${String(
                                voucher.voucherNumber
                              ).padStart(4, "0")}`
                            : voucher.id}
                        </span>
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
  <div>{voucher.status}</div>

  {voucher.status === "Rejected" && voucher.rejection_reason && (
    <div className="rejection-reason">
      <strong>Rejection reason:</strong>{" "}
      {voucher.rejection_reason}
    </div>
  )}

  {(profile?.role === "accounts" ||
    profile?.role === "director") && (
    <div className="signature-previews">
      {[
        ["Employee", voucher.employee_signature],
        ["Director", voucher.director_signature],
      ].map(([label, path]) => (
        <div key={label} className="signature-item">
          <strong>{label} signature</strong>

          {path ? (
            signatureUrls[`${voucher.id}-${label}`] ? (
              <img
                src={signatureUrls[`${voucher.id}-${label}`]}
                alt={`${label} signature`}
                style={{
                  display: "block",
                  maxWidth: "150px",
                  maxHeight: "65px",
                  objectFit: "contain",
                  marginTop: "6px",
                }}
              />
            ) : (
              <button
                type="button"
                className="secondary-button"
                onClick={async () => {
                  try {
                    const url = await getSignatureUrl(path);
                    setSignatureUrls((previous) => ({
                      ...previous,
                      [`${voucher.id}-${label}`]: url,
                    }));
                    setActionMessage(`${label} signature loaded.`);
                  } catch (error) {
                    setActionMessage(
                      `Could not load ${label.toLowerCase()} signature: ${error.message}`
                    );
                  }
                }}
              >
                View signature
              </button>
            )
          ) : (
            <span>Not uploaded</span>
          )}
        </div>
      ))}
    </div>
  )}
</td>


<td>
  {/* Employee actions: drafts only */}
  {profile?.role === "employee" && voucher.status === "Draft" && (
    <div className="action-buttons">
      <button
        type="button"
        className="secondary-button"
        onClick={() => startEditingVoucher(voucher)}
      >
        Edit
      </button>

      <button
        type="button"
        className="primary-button"
        disabled={submittingVoucherId === voucher.id}
        onClick={() => changeStatus(voucher)}
      >
        {submittingVoucherId === voucher.id
          ? "Submitting..."
          : "Submit for Approval"}
      </button>
    </div>
  )}

  {/* Director actions: pending vouchers only */}
  {profile?.role === "director" && voucher.status === "Pending" && (
    <div className="action-buttons">
      <button
        type="button"
        className="primary-button"
        disabled={!directorSignaturePath || processingVoucherId === voucher.id}
        onClick={async () => {
          try {
            setProcessingVoucherId(voucher.id);
            setActionMessage("");

            await approveVoucher(voucher.id, directorSignaturePath);
            await refreshVouchers();

            setActionMessage("Voucher approved successfully.");
          } catch (error) {
            setActionMessage("Approval failed: " + error.message);
          } finally {
            setProcessingVoucherId(null);
          }
        }}
      >
        {processingVoucherId === voucher.id ? "Processing..." : "Approve"}
      </button>

      <button
        type="button"
        className="secondary-button"
        disabled={processingVoucherId === voucher.id}
        onClick={async () => {
          const reason = window.prompt("Enter the rejection reason:");
          if (!reason?.trim()) return;

          try {
            setProcessingVoucherId(voucher.id);
            setActionMessage("");

            await rejectVoucher(voucher.id, reason.trim());
            await refreshVouchers();

            setActionMessage("Voucher rejected successfully.");
          } catch (error) {
            setActionMessage("Rejection failed: " + error.message);
          } finally {
            setProcessingVoucherId(null);
          }
        }}
      >
        Reject
      </button>
    </div>
  )}
</td>
```

                    </tr>
                  ))}

                  {!vouchersLoading &&
                    visibleVouchers.length === 0 && (
                      <tr>
                        <td colSpan={6} className="empty-state">
                          {actionMessage
                            ? "No vouchers to display. Check the message above."
                            : "No vouchers found. Try another search or create one."}
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>

            <div className="panel-footer">
              <span>
                Showing {visibleVouchers.length} vouchers
              </span>
              <span>INR · Indian Rupee</span>
            </div>
          </section>

    
{profile?.role === "accounts" && (
  <section
    className="voucher-panel"
    style={{ padding: "20px", marginTop: "20px" }}
  >
    <div className="panel-heading">
      <div>
        <h2>Recent Approved Vouchers</h2>
        <p>Latest approved expenses for reimbursement processing.</p>
      </div>
      <span className="record-count">
        {
          vouchers.filter(
            (voucher) => voucher.status === "Approved"
          ).length
        } approved
      </span>
    </div>

    {(() => {
      const recentApproved = vouchers
        .filter((voucher) => voucher.status === "Approved")
        .slice()
        .sort((a, b) => {
          const dateA = new Date(a.date || 0).getTime();
          const dateB = new Date(b.date || 0).getTime();
          return dateB - dateA;
        })
        .slice(0, 5);

      if (recentApproved.length === 0) {
        return (
          <p className="empty-state">
            No approved vouchers to display yet.
          </p>
        );
      }

      return (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>VOUCHER</th>
                <th>EXPENSE</th>
                <th>DATE</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {recentApproved.map((voucher) => (
                <tr key={voucher.id}>
                  <td>
                    <span className="voucher-id">
                      {voucher.voucherNumber
                        ? `NIV-${String(
                            voucher.voucherNumber
                          ).padStart(4, "0")}`
                        : voucher.id}
                    </span>
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
                    <span className="status-badge approved">
                      Approved
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    })()}
  </section>
)}

{profile?.role === "director" && (
  <section className="voucher-panel" style={{ padding: "20px", marginTop: "20px" }}>
    <h2>Director Signature Preview</h2>
    <p>View the signature saved on an approved voucher.</p>

    <select
      defaultValue=""
      onChange={(event) => {
        const voucher = vouchers.find(
          (item) => item.id === event.target.value
        );
        if (voucher) showDirectorSignature(voucher);
      }}
    >
      <option value="">Select a voucher</option>
      {vouchers
        .filter(
          (voucher) =>
            voucher.status === "Approved" &&
            voucher.director_signature
        )
        .map((voucher) => (
          <option key={voucher.id} value={voucher.id}>
            NIV-{String(voucher.voucherNumber).padStart(4, "0")} — {voucher.title}
          </option>
        ))}
    </select>

    {signaturePreviewUrl && (
      <div style={{ marginTop: "16px" }}>
        <img
          src={signaturePreviewUrl}
          alt="Saved director signature"
          style={{
            maxWidth: "240px",
            maxHeight: "100px",
            objectFit: "contain",
            border: "1px solid #ddd",
            padding: "8px",
            borderRadius: "8px"
          }}
        />
      </div>
    )}
  </section>
)}
     
<div className="insight-banner">
  <div className="insight-symbol">✳</div>
  <div>
    <strong>Your expense intelligence</strong>
    <p>
      Planned enhancements: receipt scanning, duplicate
      detection and an approval timeline.
    </p>
  </div>
  <span className="coming-soon">COMING NEXT</span>
</div>


          <footer className="page-footer">
            <span>NIVARA EXPENSE CONTROL</span>
            <span>
              Built for clarity. Designed for accountability.
            </span>
          </footer>
        </section>
      </main>

      {showForm && (
        <div className="modal-backdrop">
          <section
            className="voucher-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="voucher-modal-title"
          >
            <div className="modal-heading">
              <div>
                <div className="eyebrow">EXPENSE MANAGEMENT</div>
                <h2 id="voucher-modal-title">
  {editingVoucher ? "Edit draft voucher" : "Create a voucher"}
</h2>
                <p>Enter the details of your business expense.</p>
              </div>

              <button
                type="button"
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
                    setForm({
                      ...form,
                      title: event.target.value,
                    })
                  }
                  placeholder="e.g. Client meeting travel"
                />
              </label>

              <label>
                Department *
                <select
                  required
                  value={form.department}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      department: event.target.value,
                    })
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
                    required
                    value={form.category}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        category: event.target.value,
                      })
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
                    step="any"
                    value={form.amount}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        amount: event.target.value,
                      })
                    }
                    placeholder="Enter amount (e.g. 5000)"
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
                    setForm({
                      ...form,
                      date: event.target.value,
                    })
                  }
                />
              </label>

              <label>
  Employee signature (optional for drafts; required before submission)
  <input
    type="file"
                  accept="image/png,image/jpeg"
                  onChange={(event) => {
                    const file =
                      event.target.files?.[0] ?? null;

                    if (
                      file &&
                      !["image/png", "image/jpeg"].includes(file.type)
                    ) {
                      setActionMessage(
                        "Signature must be a PNG or JPEG image."
                      );
                      setSignatureFile(null);
                      event.target.value = "";
                      return;
                    }

                    if (
                      file &&
                      file.size > MAX_SIGNATURE_SIZE
                    ) {
                      setActionMessage(
                        "Signature image must be 2 MB or smaller."
                      );
                      setSignatureFile(null);
                      event.target.value = "";
                      return;
                    }

                    setActionMessage("");
                    setSignatureFile(file);
                  }}
                />
              </label>
<div className="form-note">
  New vouchers are saved as drafts. An employee signature is
  required before submission for approval.
</div>

<section className="expense-intelligence" aria-live="polite">
  <div className="intelligence-heading">
    <span className="intelligence-icon">✳</span>
    <div>
      <strong>Nivara Expense Intelligence</strong>
      <p>Review your expense before saving it.</p>
    </div>
  </div>

  <div className="readiness-list">
    <div>
      <span>{form.title.trim() ? "✓" : "○"}</span>
      Expense title provided
    </div>

    <div>
      <span>{form.department ? "✓" : "○"}</span>
      Department selected
    </div>

    <div>
      <span>
        {Number.isFinite(Number(form.amount)) &&
        Number(form.amount) > 0
          ? "✓"
          : "○"}
      </span>
      Positive expense amount
    </div>

    <div>
      <span>{form.date ? "✓" : "○"}</span>
      Expense date provided
    </div>

    <div>
      <span>
        {signatureFile || editingVoucher?.employee_signature
          ? "✓"
          : "○"}
      </span>
      Employee signature attached
    </div>
  </div>

  {duplicateExpense && (
    <div className="intelligence-warning">
      <strong>Possible duplicate expense</strong>
      <p>
        Another voucher has the same date, amount and category.
        Check it before saving.
      </p>
    </div>
  )}

  {!duplicateExpense &&
    form.date &&
    form.date > new Date().toLocaleDateString("en-CA") && (
      <div className="intelligence-warning">
        <strong>Check the expense date</strong>
        <p>The selected date is in the future.</p>
      </div>
    )}
</section>
       

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  disabled={savingVoucher}
                  onClick={() => {
                    setShowForm(false);
                    setEditingVoucher(null);
                    setSignatureFile(null);
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={savingVoucher}
                >
                 {savingVoucher
  ? "Saving..."
  : editingVoucher
    ? "Save Changes"
    : "Save Draft"}
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
