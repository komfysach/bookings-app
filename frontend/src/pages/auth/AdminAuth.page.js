import React, { Component } from 'react';
import AuthContext from '../../components/context/auth-context';

import './Auth.styles.scss';

class AuthAdminPage extends Component {
    state = {
        isLogin: true
    };

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.emailAdminEl = React.createRef();
        this.passwordAdminEl = React.createRef();
    }

    switchModeHandler = () => {
        this.setState(prevState => {
            return { isLogin: !prevState.isLogin };
        })
    }

    submitHandler = (e) => {
        e.preventDefault();
        const email = this.emailAdminEl.current.value;
        const password = this.passwordAdminEl.current.value;

        if (email.trim().length === 0 || password.trim().length === 0) {
            return;
        }

        let requestBody = {
            query: `
                query {
                    adminLogin(email: "${email}", password: "${password}") {
                        adminId
                        token
                        tokenExpiration
                    }
                }
            `
        };

        if (!this.state.isLogin) {
            requestBody = {
                query: `
                    mutation {
                        createAdmin(AdminInput: {email: "${email}", password: "${password}"}) {
                            _id
                            email
                        }
                    }
                `
            };
        }

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        })
            .then(resData => {
                if (resData.data.adminLogin.token) {
                    this.context.adminLogin(resData.data.adminLogin.token, resData.data.adminLogin.adminId, resData.data.adminLogin.tokenExpiration)

                }
            })
            .catch(err => {
                console.log(err);
            });
    };
    render() {
        return (
            <form className="auth-form" onSubmit={this.submitHandler}>
                <div className="form-control">
                    <label htmlFor="email">E-Mail</label>
                    <input type="email" id="email" ref={this.emailAdminEl} />
                </div>
                <div className="form-control">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" ref={this.passwordAdminEl} />
                </div>
                <div className="form-actions">
                    <button typer="submit">Submit</button>
                    <button typer="button" onClick={this.switchModeHandler}>Switch to {this.state.isLogin ? 'Signup' : 'Login'}</button>
                </div>
            </form>
        )
    }
}

export default AuthAdminPage;