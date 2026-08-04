'use client';

import { PlannerProvider } from './PlannerContext';
import { Banner } from './Banner';
import { Sidebar } from './Sidebar';
import { MainHeader } from './MainHeader';
import { Toolbar } from './Toolbar';
import { Body } from './Body';
import { ModalHost } from './ModalHost';
import { SignOutButton } from './SignOutButton';

export function PlannerApp({ userId, displayName }: { userId: string; displayName: string }) {
  return (
    <PlannerProvider userId={userId} displayName={displayName}>
      <div style={{ minHeight: '100vh', background: 'var(--rw-white)', padding: '40px 44px 72px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
            <SignOutButton />
          </div>
          <Banner />
          <div style={{ display: 'grid', gridTemplateColumns: '262px minmax(0,1fr)', gap: 44, alignItems: 'start', marginTop: 30 }}>
            <Sidebar />
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
      <ModalHost />
    </PlannerProvider>
  );
}
