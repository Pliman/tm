import * as React from 'react'
import { Provider } from 'react-redux'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import { render } from 'react-dom'

import Login from '../login/Login'
import UndoneTasks from '../undone-tasks/UndoneTasks'
import RecentDoneTasks from '../recent-done-tasks/RecentDoneTasks'

import store from './Store'

import './app.pcss'

interface AppProps {
    children
}

interface AppState {
    app: object
}

class App extends React.Component<AppProps, AppState> {
    constructor(props) {
        super(props)

        this.state = {
            app: {
                platform: 'browser'
            }
        }
    }

    render() {
        return (
            <div>
                {this.props.children}
            </div>
        )
    }
}

render((
    <Provider store={store}>
        <Router>
            <Switch>
                <Route exact path="/" component={Login}/>
                <Route path="/undone-tasks" component={UndoneTasks}/>
                <Route path="/recent-done-tasks" component={RecentDoneTasks}/>
            </Switch>
        </Router>
    </Provider>
), document.getElementById('root'))
