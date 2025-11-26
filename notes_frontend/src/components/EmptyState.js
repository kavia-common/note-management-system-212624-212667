import React from 'react';

/**
 * Simple empty state component.
 * PUBLIC_INTERFACE
 */
export default function EmptyState({ title = 'Nothing here yet', message = 'Create your first note to get started.' }) {
  /** Renders a friendly empty message. */
  return (
    <div className="empty-state">
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
  );
}
