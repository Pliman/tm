import * as React from 'react'
import { Link } from 'react-router-dom'
import './login.pcss'

interface LoginState {
  test: string
}

export default class Login extends React.Component<{}, LoginState> {
  constructor(props) {
    super(props)
    this.state = {test: 'foo'}
  }

  render() {
    return (
      <div className="container">
        <form method="post">
          <div className="form-group">
            <label htmlFor="username">User name:</label>
            <input type="text" className="form-control" id="username"
                   placeholder="user name"/>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input type="password" className="form-control" id="password"
                   placeholder="Password"/>
          </div>
          <Link className="btn btn-default" to="home">submit</Link>
        </form>
      </div>
    )
  }
}
