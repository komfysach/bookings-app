import './App.scss';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import AuthContext from './components/context/auth-context';
import AuthAdminPage from './pages/auth/AdminAuth.page';
import AuthPatronPage from './pages/auth/PatronAuth.page';
import MainNavigation from './components/nav/MainNav.component';
import EventsPage from './pages/events/Events.page';
import React from 'react';

class App extends React.Component {

  state = {
    token: null,
    adminId: null
  }
  adminLogin = (token, adminId, tokenExpiration) => {
    this.setState({ token: token, adminId: adminId })
  }

  adminLogout = () => {
    this.setState({ token: null, adminId: null })
  }

  // patronLogin = (token, patronId, tokenExpiration) => {
  //   this.setState({ token: token, patronId: patronId })
  // }

  // patronLogout = () => {
  //   this.setState({ token: null, patronId: null })
  // }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <React.Fragment>
            <AuthContext.Provider value={{ token: this.state.token, adminId: this.state.adminId, adminLogin: this.adminLogin, adminLogout: this.adminLogout }}>
              <MainNavigation />
              <main className="main_content">
                <Switch>
                  <Route path="/" component={null} exact />
                  {this.state.token && <Redirect from="/admin" to="/bookings" exact />}
                    {/* {!this.state.token && <Route path="/patron" component={AuthPatronPage} />}*/}
                    {this.state.token && <Route path="/events" component={EventsPage} />}
                  {!this.state.token && <Route path="/admin" component={AuthAdminPage} />}
                    <Route path="/events" component={null} />
                    {!this.state.token && <Redirect from="/bookings" to="/admin" />}
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
