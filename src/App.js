import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';

import { firebaseApp } from './Firebase';

import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'

import './App.css'

class App extends Component {

    constructor() {
        super();
        this.state = {
            authed: false,
            userid: null,
            email: null
        }
    }


    componentDidMount() {
        this.removeFirebaseEvent = firebaseApp.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({ authed: true, userid: user.uid, email: user.email })
            } else {
                this.setState({
                    authed: false,
                })
            }
        })
    }

    logout = () => {
        firebaseApp.auth().signOut();
    }

    componentWillUnmount() {
        this.removeFirebaseEvent()
    }

    render() {
        return (
            <Router>
                <div className="App">
                    <div className="App-header">
                        <h2>Todo App </h2>
                        <nav className="navbar navbar-default navbar-static-top">
                            <div className="container">
                                <ul className="nav navbar-nav pull-right">
                                    <li>
                                        {this.state.authed
                                            ? (<button
                                                style={{ border: 'none', color: 'blue' }}
                                                className="navbar-brand" onClick={this.logout}> <span>{this.state.email}</span> Logout</button>
                                            )
                                            : (<span>
                                                <Link to="/login" className="navbar-brand">Login</Link>
                                                <Link to="/register" className="navbar-brand">Register</Link>
                                            </span>
                                            )}
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </div>

                    <div>
                        <Route path='/' render={() => this.state.authed ? <Redirect to='/dashboard' /> : <div></div>} />
                        <Route path='/login' render={() => this.state.authed ? <Redirect to='/dashboard' /> : <Login />} />
                        <Route path='/dashboard'
                            render={() => this.state.authed ?
                                <Dashboard userid={this.state.userid} email={this.state.email} /> :
                                <Redirect to='/login' />} />
                        <Route path='/register' component={Register} />
                    </div>

                </div>
            </Router>
        );
    }
}

export default App;
