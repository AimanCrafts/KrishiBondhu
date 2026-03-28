import { Link } from "react-router-dom";

export default function FarmerSidebar() {
  return (
    <div className="sidebar">
      <h2>KrishiBondhu</h2>

      <nav>
        <Link to="/farmer_dashboard">Dashboard</Link>
        <Link to="/upload_crop">Upload Crop</Link>
        <Link to="/disease_detection">Disease Detection</Link>
        <Link to="/weather">Weather</Link>
      </nav>
    </div>
  );
}
