import './App.scss';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import AuthContext from './components/context/auth-context';
import AuthAdminPage from './pages/auth/AdminAuth.page';
import AuthPatronPage from './pages/auth/PatronAuth.page';
import MainNavigation from './components/Nav/MainNav.component';
import React from 'react';

class App extends React.Component {

  state = {
    token: null,
    adminId: null,
    patronId: null
  }
  adminLogin = (token, adminId, tokenExpiration) => {
    this.setState({ token: token, adminId: adminId })
  }

  adminLogout = () => {
    this.setState({ token: null, adminId: null })
  }

  patronLogin = (token, patronId, tokenExpiration) => {
    this.setState({ token: token, patronId: patronId })
  }

  patronLogout = () => {
    this.setState({ token: null, patronId: null })
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <React.Fragment>
            <AuthContext.Provider value={{ token: null, adminId: null, adminLogin: this.adminLogin }}>
              <MainNavigation />
              <main className="main_content">
                <Switch>
                  <Route path="/" component={null} exact />
                  {!this.state.token && <Route path="/admin" component={AuthAdminPage} />}
                  {this.state.token && <Redirect from="/admin" to="/bookings" exact />}
                  <AuthContext.Provider value={{ token: null, patronId: null, patronLogin: this.patronLogin }}>
                    {!this.state.token && <Route path="/patron" component={AuthPatronPage} />}
                    {this.state.token && <Redirect from="/patron" to="/events" exact />}
                    <Route path="/events" component={null} />
                    {!this.state.token && <Route path="/bookings" component={null} />}
                  </AuthContext.Provider>
                </Switch>
              </main>
            </AuthContext.Provider>
          </React.Fragment>
        </BrowserRouter>
      </div>
    );
  }

}

export default App;
