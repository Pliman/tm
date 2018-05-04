import * as React from 'react'
import { connect } from 'react-redux'

import * as moment from 'moment'

import ExpansionPanel, {
    ExpansionPanelSummary,
    ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PlayIcon from '@material-ui/icons/PlayArrow';
import DoneIcon from '@material-ui/icons/Done';

import AddIcon from '@material-ui/icons/Add';
import Button from 'material-ui/Button';
import Tooltip from 'material-ui/Tooltip';
import CreateTaskDialog from './CreateTaskDialog'

import { action } from '../utils/redux-decorators'

import './UndoneTasksService'
import './undone-tasks.pcss'

interface UndoneTasksProps {
    user
    router
    history
    dispatch
    undoneTasks
}

interface UndoneTasksState {
    startedTasks
    tasksStatus
}

class UndoneTasks extends React.Component<UndoneTasksProps, UndoneTasksState> {
    @action()
    static GET_UNDONE_TASKS
    @action()
    static CREATE_TASK
    @action()
    static START_TASK
    @action()
    static COMPLETE_TASK

    constructor(props) {
        super(props)
        this.state = {
            startedTasks: [],
            tasksStatus: {}
        }

        this.setupTimer = this.setupTimer.bind(this)
        this.createTaskDialog = this.createTaskDialog.bind(this)
        this.createTask = this.createTask.bind(this)
    }

    refs: {
        createTaskDialog: any
    }

    componentWillReceiveProps(nextProps) {
        this.calcLastsTime(nextProps.undoneTasks)
    }

    componentDidMount() {
        if (!this.props.user) {
            return this.props.history.push('/')
        }

        this.props.dispatch({
            type: UndoneTasks.GET_UNDONE_TASKS.ACTION,
            payload: {
                user: this.props.user._id
            }
        })

        this.setupTimer()
    }

    calcLastsTime(tasks){
        let startedTasks = []

        tasks.forEach((task) => {
            if (task.status === 1 && task.starttime) {
                startedTasks.push(task)
            }
        })

        this.setState({
            startedTasks: startedTasks
        })
    }

    setupTimer() {
        let startedTask

        Object.keys(this.state.startedTasks).forEach((startedTaskId) => {
            startedTask = this.state.startedTasks[startedTaskId]

            this.setState({
                tasksStatus: {
                    ...this.state.tasksStatus,
                    [startedTask._id]: formatLastsTime(startedTask.starttime)}
            })
        })

        setTimeout(this.setupTimer, 1000)
        function formatLastsTime(starttime) {
            function formatDuration(duration) {
                let years = duration.years()
                let months = duration.months()
                let days = duration.days()
                let hours = duration.hours()
                let minutes = duration.minutes()
                let seconds = duration.seconds()

                let lastsStr = ''
                if (years) {
                    lastsStr += `${years}-`
                }
                if (lastsStr || months) {
                    lastsStr += `${months}-`
                }
                if (lastsStr || days) {
                    lastsStr += `${days}`
                }

                if (lastsStr || hours) {
                    lastsStr += ` ${hours}:`
                }

                lastsStr += `${minutes}:`
                lastsStr += `${seconds}`

                return lastsStr
            }

            return formatDuration(moment.duration(new Date().getTime() - new Date(starttime).getTime()))
        }
    }

    startTask(event, task) {
        event.stopPropagation()

        this.props.dispatch({
            type: UndoneTasks.START_TASK.ACTION,
            payload: {
                taskId: task._id,
                callback: this.startTaskCallback
            }
        })
    }

    startTaskCallback(err) {
    }


    completeTask(event, task) {
        event.stopPropagation()

        this.props.dispatch({
            type: UndoneTasks.COMPLETE_TASK.ACTION,
            payload: {
                taskId: task._id,
                callback: this.completeTaskCallback
            }
        })
    }

    completeTaskCallback(err) {
    }

    createTaskDialog() {
        this.refs.createTaskDialog.handleClickOpen()
    }

    createTask(task){
        this.props.dispatch({
            type: UndoneTasks.CREATE_TASK.ACTION,
            payload: {
                task: task,
                callback: this.createTaskCb
            }
        })
    }

    createTaskCb () {}

    render() {
        return (
            <div className="container-fluid classes.root">
                {this.props.undoneTasks && this.props.undoneTasks.map((undoneTask) => {
                    return (<ExpansionPanel key={undoneTask._id}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                            <Typography className={''}>
                                {undoneTask.name}
                            </Typography>

                            {undoneTask.status === 1 ? (<Typography className={''}>
                                &nbsp;&nbsp;&nbsp;&nbsp;<PlayIcon onClick={(event) => {
                                this.startTask(event, undoneTask)
                            }}/>
                            </Typography>) : null}

                            <Typography className={''}>
                                &nbsp;&nbsp;&nbsp;&nbsp;<DoneIcon onClick={(event) => {
                                this.completeTask(event, undoneTask)
                            }}/>
                            </Typography>
                            <Typography className={''}>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <span>{this.state.tasksStatus[undoneTask._id]}</span>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Typography>
                                {undoneTask.desc}
                            </Typography>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>)
                })}
                <div style={{position: "relative", marginTop: "10px", height: "56px"}}>
                    <Tooltip title="Add task">
                        <Button variant="fab" color="secondary" style={{position: "absolute", right: "5px", bottom: "0"}} onClick={this.createTaskDialog}>
                            <AddIcon />
                        </Button>
                    </Tooltip>
                </div>
                <CreateTaskDialog ref="createTaskDialog" createTask={this.createTask}/>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        undoneTasks: state.undoneTasks && state.undoneTasks.undoneTasks
    }
}

export default connect(mapStateToProps)(UndoneTasks)
