'use client';

import { useState } from 'react';
import { PlannerProvider } from './PlannerContext';
import { Banner } from './Banner';
import { Sidebar } from './Sidebar';
import { MainHeader } from './MainHeader';
import { Toolbar } from './Toolbar';
import { Body } from './Body';
import { ModalHost } from './ModalHost';
import { TopBar } from './TopBar';

export function PlannerApp({ userId, displayName }: { userId: string; displayName: string }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <PlannerProvider userId={userId} displayName={displayName}>
      <div className="rw-shell">
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <TopBar onOpenMenu={() => setMenuOpen(true)} />
          <Banner />
          <div className="rw-content-grid">
            <div className={`rw-sidebar-wrap${menuOpen ? ' rw-open' : ''}`}>
              <Sidebar onNavigate={() => setMenuOpen(false)} />
            </div>
            <div style={{ minWidth: 0 }}>
              <MainHeader />
              <Toolbar />
              <div style={{ marginTop: 22 }}>
                <Body />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`rw-sidebar-backdrop${menuOpen ? ' rw-open' : ''}`} onClick={() => setMenuOpen(false)} />
      <ModalHost />
    </PlannerProvider>
  );
}
