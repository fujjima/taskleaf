import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { TagContext } from 'Containers/TagsContainer';

const useStyles = makeStyles((theme) => ({
  dialog: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogContent: {
    width: '500px',
    display: 'flex',
    flexDirection: 'column',
  },
}));

export const DeleteDialog = (props) => {
  const { deleteTag } = useContext(TagContext);
  const classes = useStyles();

  const handleSubmit = () => {
    deleteTag(props.tagId);
  };

  return (
    <Dialog
      className={classes.dialog}
      open={props.open}
      onClose={props.onClose}
    >
      <DialogTitle>タグ削除</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent className={classes.dialogContent}>
          <DialogContentText id="alert-dialog-description">
            一度消したタグは復活できません。削除しますか？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            className={classes.subscribeButton}
            onClick={props.onClose}
            size="large"
          >
            キャンセル
          </Button>
          <Button
            color="secondary"
            className={classes.subscribeButton}
            type="submit"
            size="large"
          >
            削除
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

DeleteDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  tagId: PropTypes.number.isRequired,
};
