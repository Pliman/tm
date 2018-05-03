import * as React from 'react'
import {compose} from 'redux'
import Button from 'material-ui/Button'
import Dialog, {
    DialogActions,
    DialogContent,
    DialogTitle,
} from 'material-ui/Dialog'
import Slide from 'material-ui/transitions/Slide'

import TaskEditor from '../components/task-editor/TaskEditor'
import { action } from "../utils/redux-decorators";
import { connect } from "react-redux";

function Transition(props) {
    return <Slide direction="up" {...props} />
}

interface CreateTaskProps{
    createTask
}

interface CreateTaskState{}

export default class CreateTaskDialog extends React.Component<CreateTaskProps, CreateTaskState> {
    state = {
        open: false,
    }

    refs: {
        taskEditor: any
    }

    handleClickOpen = () => {
        this.setState({ open: true })
    }

    handleCancel = () => {
        this.setState({ open: false })
    }

    handleOK = () => {
        this.props.createTask(this.refs.taskEditor.getValue())

        this.setState({ open: false })
    }

    createTaskCb() {}

    render() {
        return (
            <div>
                <Dialog
                    open={this.state.open}
                    transition={Transition}
                    fullWidth={true}
                    keepMounted
                    onClose={this.handleCancel}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description">
                    <DialogTitle id="alert-dialog-slide-title">
                        Add Task
                    </DialogTitle>
                    <DialogContent>
                        <TaskEditor ref="taskEditor"/>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleOK} color="primary">
                            OK
                        </Button>
                        <Button onClick={this.handleCancel} color="primary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}
