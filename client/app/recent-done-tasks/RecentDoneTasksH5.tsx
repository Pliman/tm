import * as React from 'react'
import './recent-done-tasks-h5.pcss'

interface RecentDoneTasksState {
  test: string
}

export default class RecentDoneTasksH5 extends React.Component<{}, RecentDoneTasksState> {
  constructor(props) {
    super(props)
    this.state = {test: 'foo'}
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-12 content">
            RecentDoneTasks
          </div>
        </div>
      </div>
    )
  }
}
