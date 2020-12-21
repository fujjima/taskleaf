import React from 'react';
import PropTypes from 'prop-types';
import {
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import { grey } from '@material-ui/core/colors';
import TimerIcon from '@material-ui/icons/Timer';
import { Link } from 'react-router-dom';

const drawerWidth = '250px';

const sytles = {
  root: { display: 'flex', width: '100%' },
  drawer: {
    width: drawerWidth,
    // flexコンテナ内のflexアイテムが残りのアイテムと比較してどのぐらいの比率で縮小されるか
    // defaultは1
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: grey[200],
  },
  content: {
    flexGrow: 1,
  },
};

class SideBar extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
  }
  // util

  listItem = () => {
    return [
      {
        text: 'Timer',
        icon: <TimerIcon />,
        path: '/tasks',
      },
      {
        text: 'Report',
        icon: <AssignmentIcon />,
        path: '/tasks',
      },
      {
        text: 'Calendar',
        icon: <CalendarTodayIcon />,
        path: '/tasks',
      },
    ];
  };

  // render

  render() {
    // XXX: childrenが機能しているか確認
    const { classes, children } = this.props;

    return (
      <div className={classes.root}>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
          anchor="left"
        >
          <Divider />
          <List>
            {this.listItem().map((item, idx) => {
              return (
                <ListItem button component={Link} to={item.path} key={idx}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              );
            })}
          </List>
        </Drawer>
        <main className={classes.content}>{children}</main>
      </div>
    );
  }
}

export default withStyles(sytles)(SideBar);
