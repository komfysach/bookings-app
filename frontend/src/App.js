import './App.scss';
import { BrowserRouter, Route } from 'react-router-dom';

import AuthAdminPage from './components/AdminAuth';
import AuthPatronPage from './components/PatronAuth';

function App() {
  return (
    <BrowserRouter>
      <Route path="/" component={null} exact />
      <Route path="/admin" component={AuthAdminPage} />
      <Route path="/patron" component={AuthPatronPage} />
      <Route path="/events" component={null} />
      <Route path="/bookings" component={null} />
    </BrowserRouter>
  );
}

export default App;
