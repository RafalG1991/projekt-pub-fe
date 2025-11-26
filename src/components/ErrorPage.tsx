import { useRouteError } from "react-router-dom";
import "./ErrorPage.css";

type RouteError = {
  statusText?: string;
  message?: string;
};

export default function ErrorPage() {
  const error = useRouteError() as RouteError;
  console.error(error);

  return (
    <div className="error-page">
      <div className="error-card">
        <div className="error-icon">⚠️</div>

        <h1 className="error-title">Something went wrong</h1>

        <p className="error-text">
          Sorry, an unexpected error has occurred.
        </p>

        {(error?.message || error?.statusText) && (
          <p className="error-details">
            {error.message || error.statusText}
          </p>
        )}

        <a href="/" className="error-btn">
          Back to homepage
        </a>
      </div>
    </div>
  );
}
