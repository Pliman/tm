import * as React from 'react'
import { connect } from 'react-redux'

import { action } from '../utils/redux-decorators'
import './LoginService'
import './login.pcss'

interface LoginProps {
    user
    router
    history
    dispatch
}

interface LoginState {
    loginErr: string
}

const USER = {name: 'Pliman', pass: 'reserved'}

class Login extends React.Component<LoginProps, LoginState> {
    @action()
    static LOGIN

    constructor(props) {
        super(props)
        this.state = {
            loginErr: ''
        }

        this.loginCallback = this.loginCallback.bind(this)
    }

    componentDidMount() {
        this.props.user && this.jumpToUndoneTasks()

        this.props.dispatch({
            type: Login.LOGIN.ACTION,
            payload: {
                user: USER,
                callback: this.loginCallback
            }
        })
    }

    loginCallback(err) {
        if (err) {
            return this.setState({
                loginErr: err
            })
        }

        this.jumpToUndoneTasks()
    }

    jumpToUndoneTasks() {
        this.props.history.push('/undone-tasks')
    }

    render() {
        return (<div>{this.state && this.state.loginErr}</div>)
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(Login)
