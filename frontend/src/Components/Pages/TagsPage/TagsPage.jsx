import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  TableContainer,
  TableBody,
  TableHead,
  Table,
  Menu,
  MenuItem,
  Chip,
  TextField,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { TagContext } from 'Containers/TagsContainer';

export const TagsPage = () => {
  const { tags, updateTag, deleteTag } = useContext(TagContext);
  const [open, setOpen] = useState(false);
  const [editingTagId, setEditingTagId] = useState(null);
  const [editing, setEditing] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

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
          onClick={() => {
            setEditing(!editing);
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
    setEditingTagId(null);
    setOpen(false);
    setAnchorEl(null);
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
            <TextField variant="outlined" />
          ) : (
              <Chip
                onClick={() => handleClick(t)}
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
    <TableContainer>
      <Table>
        {renderTableHead()}
        {renderTableBody()}
      </Table>
    </TableContainer>
  );
};
