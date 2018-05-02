import * as React from 'react'

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import BottomNavigation, { BottomNavigationAction } from 'material-ui/BottomNavigation';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';

interface UndoneTasksProps {
    task
}

interface UndoneTasksState {
    currentTask
}

export default class TaskEditor extends React.Component<UndoneTasksProps, UndoneTasksState> {
        constructor(props) {
        super(props)
    }

    componentDidMount() {

    }

    render() {
        return (
            <div className="">

            </div>
        )
    }
}
