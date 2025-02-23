import { Link } from "react-router-dom";
import "../styles/NotFound.css";

function NotFound() {
  return (
    <div className="not-found-container">
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you are looking for doesn't exist.</p>
      <Link to="/" className="home-button">Go to Homepage</Link>
    </div>
  );
}

export default NotFound;
