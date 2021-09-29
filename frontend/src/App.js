import './App.scss';
import { BrowserRouter, Route } from 'react-router-dom';

import AuthAdminPage from './pages/auth/AdminAuth.page';
import AuthPatronPage from './pages/auth/PatronAuth.page';
import MainNavigation from './components/Nav/MainNav.component';
import React from 'react';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <React.Fragment>
          <MainNavigation />
          <main className="main_content">
            <Route path="/" component={null} exact />
            <Route path="/admin" component={AuthAdminPage} />
            <Route path="/patron" component={AuthPatronPage} />
            <Route path="/events" component={null} />
            <Route path="/bookings" component={null} />
          </main>
        </React.Fragment>
      </BrowserRouter>
    </div>
  );
}

export default App;
