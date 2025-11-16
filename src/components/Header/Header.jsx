import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <>
      <header>
        <Link to="/">Home</Link> | <Link to="/login">Login</Link>
      </header>
    </>
  );
}
