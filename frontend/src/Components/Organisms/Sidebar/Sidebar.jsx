/*
表示条件

- ログイン済みである
- http://~:port/... 以下が表示されている状態である

*/
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
  constructor(props) {
    super(props);
  }
  // util

  // 各画面へのリンクを持つアイテムを表示する
  listItem = () => {
    return [
      {
        text: 'Timer',
        icon: <TimerIcon />,
      },
      {
        text: 'Report',
        icon: <AssignmentIcon />,
      },
      {
        text: 'Calendar',
        icon: <CalendarTodayIcon />,
      },
    ];
  };

  // render

  render() {
    const { classes, node } = this.props;

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
                <ListItem button key={idx}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              );
            })}
          </List>
        </Drawer>
        <main className={classes.content}>
          {/* ここにメインコンテンツ（React.node） */}
          {node}
        </main>
      </div>
    );
  }
}

SideBar.propTypes = {
  classes: PropTypes.object.isRequired,
  node: PropTypes.object.isRequired,
};

export default withStyles(sytles)(SideBar);
