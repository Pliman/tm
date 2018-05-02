import * as React from 'react'
import { Link } from 'react-router-dom'
import './recent-done-tasks.pcss'
import { connect } from "react-redux";

import { action } from '../utils/redux-decorators'

import './recent-done-tasks.pcss'

interface RecentDoneTasksState {
    test: string
}

interface RecentDoneTasksProps {
    user
    router
    history
    dispatch
}

class RecentDoneTasks extends React.Component<RecentDoneTasksProps, RecentDoneTasksState> {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-4">
                        <ul className="nav nav-pills nav-stacked">
                            <li role="presentation" className="active"><Link
                                to={'/undone-tasks'}>Undone tasks</Link></li>
                            <li role="presentation"><Link
                                to={'/recent-done-tasks'}>Recent done
                                tasks</Link></li>
                        </ul>
                    </div>
                    <div className="col-sm-8 home-content sea">
                        {this.props.user && this.props.user.name} Recent done
                        tasks
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(RecentDoneTasks)

