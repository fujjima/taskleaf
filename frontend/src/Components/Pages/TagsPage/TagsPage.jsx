import React, { useState, useContext } from 'react';
import {
  TableContainer,
  TableBody,
  TableHead,
  Table,
  Menu,
  MenuItem,
  Chip,
  TextField,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddIcon from '@material-ui/icons/Add';
import { TagContext } from 'Containers/TagsContainer';
import { DeleteDialog } from 'Components/Organisms/Dialog/DeleteDialog';
import { CreateDialog } from './CreateDialog';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: '30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  container: {
    marginLeft: '30px',
  },
  menuItem: {
    color: 'red',
  },
  addButton: {
    marginLeft: '30px',
    marginBottom: '30px',
  },
}));

export const TagsPage = () => {
  const { tags, updateTag, deleteTag } = useContext(TagContext);
  const [open, setOpen] = useState(false);
  const [editingTagId, setEditingTagId] = useState(null);
  const [editing, setEditing] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const classes = useStyles();

  // utils

  const isEditing = (id) => {
    return editingTagId === id;
  };

  const chipMenu = () => {
    return (
      <Menu
        open={open}
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            setEditing(!editing);
            setOpen(false);
            setAnchorEl(null);
          }}
        >
          編集
        </MenuItem>
        <MenuItem
          className={classes.menuItem}
          onClick={() => {
            setOpenDeleteDialog(!openDeleteDialog);
            setOpen(false);
            setAnchorEl(null);
          }}
        >
          削除
        </MenuItem>
      </Menu>
    );
  };

  // handler

  const handleClick = (tag) => {
    setEditingTagId(tag.get('id'));
    setOpen(!open);
    setAnchorEl(event.target);
  };

  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  const handleBlur = () => {
    updateTag({ id: editingTagId, name: event.target.value });
    setEditing(false);
    setEditingTagId(null);
  };

  const handleDelete = () => {
    deleteTag(editingTagId);
    setEditingTagId(null);
  };

  const closeDeleteDialog = () => {
    return setOpenDeleteDialog(false);
  };

  const closeCreateDialog = () => {
    return setOpenCreateDialog(false);
  };

  // render

  const renderTableHead = () => {
    return <TableHead></TableHead>;
  };

  const renderTableBody = () => {
    return (
      <TableBody>
        {tags.map((t) =>
          editing && isEditing(t.get('id')) ? (
            <TextField
              // TODO: autofocusできない
              variant="outlined"
              defaultValue={t.get('name')}
              onBlur={() => handleBlur()}
            />
          ) : (
              <Chip
                onClick={() => handleClick(t)}
                style={{ maxWidth: 200 }}
                key={t.get('id')}
                label={t.get('name')}
                // TODO: 面倒なのでDeleteにアクションを追加しているが、CSSでメニューボタンは位置の調整をするようにしたい
                // あと、何故かdeleteicon側に異なるanchorELが設定されるみたいなので、onDeleteの運用はしたくない
                deleteIcon={<MoreVertIcon />}
                onDelete={() => handleClick(t)}
              />
            )
        )}
        {chipMenu()}
      </TableBody>
    );
  };

  return (
    <div className={classes.root}>
      <TableContainer className={classes.container}>
        <Button
          className={classes.addButton}
          onClick={() => setOpenCreateDialog(!openCreateDialog)}
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
        >
          タグの追加
        </Button>
        <Table>
          {renderTableHead()}
          {renderTableBody()}
        </Table>
      </TableContainer>
      <DeleteDialog
        open={openDeleteDialog}
        onClose={closeDeleteDialog}
        targetIds={editingTagId}
        onDelete={handleDelete}
        label="タグ"
      />
      <CreateDialog open={openCreateDialog} onClose={closeCreateDialog} />
    </div>
  );
};
