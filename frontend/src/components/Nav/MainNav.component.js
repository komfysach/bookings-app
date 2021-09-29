import React from 'react';

import { ReactComponent as Logo } from '../../assets/logo.svg';
import { Link, NavLink } from 'react-router-dom';
import AuthContext from '../context/auth-context';

import './MainNav.styles.scss';

const mainNavigation = props => (
    <AuthContext.Consumer>
        {(context) => {
            return (
                <div className="main_navigation__header">
                    <Link className="main_navigation__logoContainer">
                        <Logo className="main_navigation__logo" />
                    </Link>
                    <nav className="main_navigation__items">
                        <ul>
                            {!context.token && (
                                <li><NavLink className="main_navigation__item" to="/patron">Login</NavLink></li>
                            )}
                            <li><NavLink className="main_navigation__item" to="/events">Events</NavLink></li>
                            {context.adminId && (
                                <li><NavLink className="main_navigation__item" to="/bookings">Bookings</NavLink></li>
                            )}
                        </ul>
                    </nav>
                </div>
            )
        }}

    </AuthContext.Consumer>
)

export default mainNavigation;