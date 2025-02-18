import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <nav className="p-4 border-b">
      <div className="container mx-auto justify-center flex gap-4">
        <Link to="/">Team Management</Link>
        <Link to="/diagram">Diagram</Link>
        <Link to="/charts">Charts</Link>
      </div>
    </nav>
  );
}
