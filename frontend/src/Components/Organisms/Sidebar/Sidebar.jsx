import React from 'react';
import PropTypes from 'prop-types';
import {
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import FaceIcon from '@material-ui/icons/Face';
import { grey } from '@material-ui/core/colors';
import TimerIcon from '@material-ui/icons/Timer';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const drawerWidth = '215px';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    width: '100%',
  },
  drawer: {
    width: drawerWidth,
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
  list: {
    marginLeft: '10px',
    marginTop: '10px',
  },
  bottom: {
    marginTop: 'auto',
    paddingBottom: '10px',
  },
});

export const Sidebar = (props) => {
  const classes = useStyles();
  const { children } = props;
  const user = useSelector((state) => state.user);

  // util

  const listItem = [
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
        <List className={classes.list}>
          {listItem.map((item, idx) => {
            return (
              <ListItem button component={Link} to={item.path} key={idx}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            );
          })}
        </List>
        <div className={classes.bottom}>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <FaceIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={user.name} secondary={user.email} />
          </ListItem>
        </div>
      </Drawer>
      <main className={classes.content}>{children}</main>
    </div>
  );
};

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
};
