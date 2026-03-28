import { Link } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>

      <nav>
        <Link to="/admin_dashboard">Dashboard</Link>
        <Link to="/users">User Management</Link>
        <Link to="/crops">Crop Listings</Link>
      </nav>
    </div>
  );
}
