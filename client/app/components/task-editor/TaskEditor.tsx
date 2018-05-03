import * as React from 'react'
import TextField from 'material-ui/TextField'
import CreateTaskDialog from "../../undone-tasks/CreateTaskDialog";

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    menu: {
        width: 200,
    },
})

interface TaskEditorProps {
}

interface TaskEditorState {
    task
}

class TaskEditor extends React.Component<TaskEditorProps, TaskEditorState> {
    constructor(props) {
        super(props)
        this.state = {
            task: {}
        }

        this.handleChange = this.handleChange.bind(this)
    }

    handleChange (event) {
        this.setState({
            task: {
                ...this.state.task,
                [event.target.id]: event.target.value
            }
        })
    }

    setValue(){}

    getValue(){
        return this.state.task
    }

    render() {
        return (
            <form className={''} noValidate autoComplete="off">
                <div>
                    <TextField
                        id="name"
                        label="Name"
                        placeholder=""
                        className={''}
                        margin="normal"
                        onChange={this.handleChange}
                    />
                </div>
                <div>
                    <TextField
                        id="desc"
                        label="Description"
                        placeholder=""
                        className={''}
                        margin="normal"
                        onChange={this.handleChange}
                    />
                </div>
                <div>
                    <TextField
                        id="estimatedtime"
                        label="Estimated Time"
                        placeholder=""
                        className={''}
                        margin="normal"
                        onChange={this.handleChange}
                    />
                </div>
            </form>
        )
    }
}

export default TaskEditor
