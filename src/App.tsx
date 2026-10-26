import { useState } from 'react';
import { StoreProvider, useStore } from '@/store/StoreContext';
import { Onboarding } from '@/components/Onboarding';
import { Layout, type Page } from '@/components/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { BusinessPage } from '@/pages/BusinessPage';
import { TasksPage } from '@/pages/TasksPage';
import { FinancePage } from '@/pages/FinancePage';
import { CustomersPage } from '@/pages/CustomersPage';
import { OpportunitiesPage } from '@/pages/OpportunitiesPage';
import { AdvisorPage } from '@/pages/AdvisorPage';
import { SettingsPage } from '@/pages/SettingsPage';

function AppInner() {
  const { state } = useStore();
  const [page, setPage] = useState<Page>('dashboard');

  if (!state.onboarded) {
    return <Onboarding onDone={() => setPage('dashboard')} />;
  }

  return (
    <Layout
      page={page}
      onNavigate={setPage}
      businessName={state.business.name}
      ownerName={state.user.name}
    >
      {page === 'dashboard' && <Dashboard onNavigate={setPage} />}
      {page === 'business' && <BusinessPage />}
      {page === 'tasks' && <TasksPage />}
      {page === 'finance' && <FinancePage />}
      {page === 'customers' && <CustomersPage />}
      {page === 'opportunities' && <OpportunitiesPage />}
      {page === 'advisor' && <AdvisorPage />}
      {page === 'settings' && <SettingsPage />}
    </Layout>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppInner />
    </StoreProvider>
  );
}
