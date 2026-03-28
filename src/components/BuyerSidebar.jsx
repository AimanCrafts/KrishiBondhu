import { Link } from "react-router-dom";

export default function BuyerSidebar() {
  return (
    <div className="sidebar">
      <h2>KrishiBondhu</h2>

      <nav>
        <Link to="/buyer_dashboard">Dashboard</Link>
        <Link to="/marketplace">Marketplace</Link>
        <Link to="/orders">Orders</Link>
      </nav>
    </div>
  );
}
