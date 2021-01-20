import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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

export const CreateDialog = (props) => {
  const { createTag } = useContext(TagContext);
  const [name, setName] = useState(null);
  const classes = useStyles();

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = () => {
    createTag({ name: name });
  };

  return (
    <Dialog
      className={classes.dialog}
      open={props.open}
      onClose={props.onClose}
    >
      <DialogTitle>タグの追加</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent className={classes.dialogContent}>
          <TextField
            name="name"
            label="タグ名"
            margin="normal"
            size="small"
            variant="outlined"
            required
            value={name}
            {...(!name
              ? { error: true, helperText: 'タグ名を入力してください' }
              : { error: false })}
            onChange={(e) => handleChange(e)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            className={classes.subscribeButton}
            onClick={props.onClose}
            size="large"
          >
            キャンセル
          </Button>
          <Button
            color="primary"
            className={classes.subscribeButton}
            type="submit"
            size="large"
            disabled={!name}
          >
            作成
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

CreateDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
