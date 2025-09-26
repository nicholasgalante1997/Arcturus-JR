import React from 'react';

function FooterView() {
  return (
    <footer>
      <div className="container">
        <small style={{ fontWeight: 600 }}>
          &copy; 2025 Nick Galante{' '}
          <a href="mailto:rustycloud42@protonmail.com">&lt;rustycloud42@protonmail.com&gt;</a>
        </small>
      </div>
    </footer>
  );
}

export default React.memo(FooterView);
