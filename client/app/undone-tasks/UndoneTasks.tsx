import * as React from 'react'
import { connect } from 'react-redux'

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
    static ADD_TASK
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
            return moment.utc(moment().diff(moment(task.starttime))).format("YYYY-MM-DD HH:mm:ss");
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
        undoneTasks: state.undoneTask && state.undoneTask.undoneTasks
    }
}

export default connect(mapStateToProps)(UndoneTasks)
