const API_URL = "http://localhost:5000/api";

// ─────────────────────────────────────────────────────────────
// Token expiry check — decodes JWT payload without a library
// ─────────────────────────────────────────────────────────────
export function isTokenExpired() {
  const token = localStorage.getItem("kb_token");
  if (!token) return true;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1]));
    if (!payload.exp) return true;
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

// ─────────────────────────────────────────────────────────────
// Session helpers — store user object and JWT in localStorage
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// REGISTER
// ─────────────────────────────────────────────────────────────
export async function registerUser(role, formData) {
  try {
    const endpoint =
      role === "farmer"
        ? `${API_URL}/auth/farmer/signup`
        : `${API_URL}/auth/buyer/signup`;

    // Farmer sends JSON, Buyer sends FormData (has files)
    if (role === "farmer") {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName || "",
          phone: formData.phone || "",
          password: formData.password || "",
          district: formData.district || "",
          division: formData.division || "",
        }),
      });
      const data = await res.json();
      if (!res.ok)
        return { success: false, error: data.message || "Signup failed" };
      return { success: true, user: data.user };
    }

    // Buyer — do NOT set Content-Type; browser sets it with boundary for FormData
    const res = await fetch(endpoint, { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok)
      return { success: false, error: data.message || "Signup failed" };
    return { success: true, user: data.user };
  } catch {
    return { success: false, error: "Cannot connect to server." };
  }
}

// ─────────────────────────────────────────────────────────────
// LOGIN
// Returns { success, user, redirectTo }
//   redirectTo is "/onboarding" for first-time farmers,
//   otherwise the normal dashboard path.
// ─────────────────────────────────────────────────────────────
export async function loginUser(identifier, password) {
  try {
    const isFarmer = !identifier.includes("@");
    const endpoint = isFarmer
      ? `${API_URL}/auth/farmer/login`
      : `${API_URL}/auth/buyer/login`;

    const body = isFarmer
      ? { phone: identifier, password }
      : { email: identifier, password };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();

    if (!res.ok)
      return { success: false, error: data.message || "Login failed" };

    saveSession(data.user, data.token);

    // ── Decide where to redirect after login ───────────────
    // If farmer has never done onboarding, send to /onboarding first.
    // data.user.farmData comes from the backend login response.
    let redirectTo = "/buyer_dashboard"; // default for business role
    if (data.user.role === "farmer") {
      const onboardingDone = data.user.farmData?.onboardingDone;
      redirectTo = onboardingDone ? "/farmer_dashboard" : "/onboarding";
    }

    return { success: true, user: data.user, redirectTo };
  } catch {
    return { success: false, error: "Cannot connect to server." };
  }
}

// ─────────────────────────────────────────────────────────────
// OTP LOGIN — not yet implemented
// ─────────────────────────────────────────────────────────────
export async function loginWithOtp(phone, otp) {
  if (!otp || otp.length !== 5) {
    return { success: false, error: "OTP must be exactly 5 digits." };
  }
  return { success: false, error: "OTP login coming soon!" };
}

// ─────────────────────────────────────────────────────────────
// ADMIN LOGIN
// ─────────────────────────────────────────────────────────────
export async function loginAdmin(email, password) {
  try {
    const res = await fetch(`${API_URL}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok)
      return { success: false, error: data.message || "Invalid credentials." };

    saveSession(data.user, data.token);
    return { success: true, user: data.user };
  } catch {
    return { success: false, error: "Cannot connect to server." };
  }
}

// Unused stubs kept so nothing breaks if imported elsewhere
export function getAllUsers() {
  return [];
}
export function approveUser() {
  return true;
}
