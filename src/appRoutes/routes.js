import React from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';

// Components
import Profile from '../components/profile';
import Home from '../components/home';
import SignIn from '../components/signIn';
import SignUp from '../components/signUp';
import { auth } from '../Auth/auth';
import Loading from '../components/loading';

export default class AppRoutes extends React.Component {
    constructor() {
        super();
        this.state = {
            isAuthenticated: false,
            loading: true
        }
    }

    componentDidMount() {

        auth.onAuthStateChanged(async (res) => {

            this.setState({ loading: true });
            if (res && res.email) {
                await this.setState({ isAuthenticated: true, loading: false })
            } else {
                await this.setState({ isAuthenticated: false, loading: false })
            }
        });
    }
    render() {

        const { isAuthenticated, loading } = this.state;
        return (
            <div>
                {loading ? <Loading /> :
                    <BrowserRouter>
                        <Switch>
                            {isAuthenticated ?
                                <Route path="/" component={Home} exact />
                                : <Route path="/" component={SignIn} exact />
                            }
                            <Route path='/profile' component={Profile} exact />
                            <Route path="/signup" component={SignUp} exact />
                        </Switch>
                    </BrowserRouter>}
            </div>
        )
    }
}