import * as React from 'react'
import './undone-tasks-h5.pcss'

interface UndoneTasksState {
  test: string
}

export default class UndoneTasksH5 extends React.Component<{}, UndoneTasksState> {
  constructor(props) {
    super(props)
    this.state = {test: 'foo'}
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-12 content">
            UndoneTasks
          </div>
        </div>
      </div>
    )
  }
}
