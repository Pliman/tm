import * as React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'

import * as moment from 'moment'

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import ExpansionPanel, {
    ExpansionPanelSummary,
    ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PlayIcon from '@material-ui/icons/PlayArrow';
import DoneIcon from '@material-ui/icons/Done';

const styles = theme => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
});
const classes = {
    root: 'root',
    heading: 'heading'
}


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
    tasksStatus: any
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
            tasksStatus: {}
        }
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
    }

    startTask(event, task) {
        event.stopPropagation()

        this.props.dispatch({
            type: UndoneTasks.START_TASK.ACTION,
            payload: {
                taskId: task._id,
                callBack: this.startTaskCallback
            }
        })
    }

    startTaskCallback(err, task) {
        this.setLastsTime(task)
    }

    setLastsTime(task){
        if (task.status !== 1) { // not started
            return
        }

        setInterval(() => {
            this.setState({
                tasksStatus: {...this.state.tasksStatus, [task._id]: getLastsTime(task)}
            })
        }, 1000)

        function getLastsTime(task) {
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

                lastsStr += ' '

                if (lastsStr || hours) {
                    lastsStr += `${hours}:`
                }
                if (lastsStr || minutes) {
                    lastsStr += `${minutes}:`
                }
                if (lastsStr || seconds) {
                    lastsStr += `${seconds}`
                }

                return lastsStr
            }

            return formatDuration(moment.duration(new Date().getTime() - new Date(task.starttime).getTime()))
        }
    }


    completeTask(event, taskId) {
        event.stopPropagation()
        console.log(taskId)
    }

    render() {
        return (
            <div className="container-fluid classes.root">
                {this.props.undoneTasks && this.props.undoneTasks.map((undoneTask) => {
                    return (<ExpansionPanel key={undoneTask._id}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                            <Typography className={classes.heading}>
                                {undoneTask.name}
                            </Typography>
                            <Typography className={classes.heading}>
                                &nbsp;&nbsp;&nbsp;&nbsp;<PlayIcon onClick={(event) => {
                                this.startTask(event, undoneTask)
                            }}/>
                            </Typography>
                            <Typography className={classes.heading}>
                                &nbsp;&nbsp;&nbsp;&nbsp;<DoneIcon onClick={(event) => {
                                this.completeTask(event, undoneTask)
                            }}/>
                            </Typography>
                            <Typography className={classes.heading}>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                {this.setLastsTime(undoneTask)}
                                <span
                                    ref="timer">{this.state.tasksStatus[undoneTask._id]}</span>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Typography>
                                {undoneTask.desc}
                            </Typography>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>)
                })}
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
