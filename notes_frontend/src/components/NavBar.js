import React from 'react';

/**
 * Top navigation bar for the Notes app.
 * PUBLIC_INTERFACE
 */
export default function NavBar() {
  /** Renders the application top navigation with branding. */
  return (
    <header className="navbar">
      <div className="navbar__brand">
        <span className="navbar__logo" aria-hidden="true">📝</span>
        <span className="navbar__title">Ocean Notes</span>
      </div>
      <div className="navbar__actions">
        <a
          href="https://vscode-internal-38679-beta.beta01.cloud.kavia.ai:3001/docs"
          className="btn btn-secondary"
          target="_blank"
          rel="noreferrer"
          aria-label="Open API Docs"
        >
          API Docs
        </a>
      </div>
    </header>
  );
}
