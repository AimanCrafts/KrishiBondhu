const API_URL = "http://localhost:5000/api/auth";

/* ── Session Management ──────────────────────────────────────────────────── */

function saveSession(userObj, token) {
  localStorage.setItem("kb_session", JSON.stringify(userObj));
  localStorage.setItem("kb_token", token);
}

export function getSession() {
  try {
    const raw = localStorage.getItem("kb_session");
    if (!raw) return null;
    const user = JSON.parse(raw);
    if (!user || !user.id || !user.role) return null;
    return user;
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem("kb_session");
  localStorage.removeItem("kb_token");
}

/* ══════════════════════════════════════════════════════════════════════════
   REGISTER
══════════════════════════════════════════════════════════════════════════ */

export async function registerUser(role, formData) {
  try {
    const endpoint =
      role === "farmer"
        ? `${API_URL}/farmer/signup`
        : `${API_URL}/buyer/signup`;

    const body =
      role === "farmer"
        ? {
            name: formData.fullName || "",
            phone: formData.phone || "",
            password: formData.password || "",
          }
        : {
            name: formData.companyName || formData.contactPerson || "",
            email: formData.email || "",
            password: formData.password || "",
          };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.message || "Signup failed" };
    }

    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: "Server এ connect করা যাচ্ছে না" };
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   LOGIN — password
══════════════════════════════════════════════════════════════════════════ */

export async function loginUser(identifier, password) {
  try {
    const isFarmer = !identifier.includes("@");

    const endpoint = isFarmer
      ? `${API_URL}/farmer/login`
      : `${API_URL}/buyer/login`;

    const body = isFarmer
      ? { phone: identifier, password }
      : { email: identifier, password };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.message || "Login failed" };
    }

    saveSession(data.user, data.token);
    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: "Server এ connect করা যাচ্ছে না" };
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   LOGIN — OTP
══════════════════════════════════════════════════════════════════════════ */

export async function loginWithOtp(phone, otp) {
  if (!otp || otp.length !== 5) {
    return { success: false, error: "OTP must be exactly 5 digits." };
  }
  return { success: false, error: "OTP login coming soon!" };
}

/* ── Admin login ─────────────────────────────────────────────────────────── */

export function loginAdmin(email, password) {
  const ADMIN_EMAIL = "admin@krishibondhu.com";
  const ADMIN_PASSWORD = "Admin@KB2026";

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return { success: false, error: "Invalid admin credentials." };
  }

  const adminUser = {
    id: "KB-A-ADMIN",
    role: "admin",
    name: "Admin",
    email: ADMIN_EMAIL,
  };

  saveSession(adminUser, "admin-token");
  return { success: true, user: adminUser };
}

/* ── Admin Helpers ───────────────────────────────────────────────────────── */

export function getAllUsers() {
  return [];
}
export function approveUser() {
  return true;
}
