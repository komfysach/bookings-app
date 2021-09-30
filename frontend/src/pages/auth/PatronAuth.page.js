import React, { Component } from 'react';
import AuthContext from '../../components/context/auth-context';

import './Auth.styles.scss';

class AuthPatronPage extends Component {
    state = {
        isLogin: true
    };

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.emailPatEl = React.createRef();
        this.passwordPatEl = React.createRef();
    }

    switchModeHandler = () => {
        this.setState(prevState => {
            return { isLogin: !prevState.isLogin };
        })
    }

    submitHandler = (e) => {
        e.preventDefault();
        const email = this.emailPatEl.current.value;
        const password = this.passwordPatEl.current.value;

        if (email.trim().length === 0 || password.trim().length === 0) {
            return;
        }

        let requestBody = {
            query: `
                query {
                    patronLogin(email: "${email}", password: "${password}") {
                        patronId
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
                        createPatron(patronInput: {email: "${email}", password: "${password}"}) {
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
                if (resData.data.login.token) {
                    this.context.login(resData.data.login.token, resData.data.login.patronId, resData.data.login.tokenExpiration)
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
                    <input type="email" id="email" ref={this.emailPatEl} />
                </div>
                <div className="form-control">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" ref={this.passwordPatEl} />
                </div>
                <div className="form-actions">
                    <button typer="submit">Submit</button>
                    <button typer="button" onClick={this.switchModeHandler}>Switch to {this.state.isLogin ? 'Signup' : 'Login'}</button>
                </div>
            </form>
        )
    }
}

export default AuthPatronPage;