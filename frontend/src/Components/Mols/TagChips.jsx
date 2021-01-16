import React, { useState, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { makeStyles } from '@material-ui/core/styles';
import { Chip, Menu, MenuItem, Checkbox } from '@material-ui/core';

// タグの新規作成、紐づくタグの変更、削除など、タスクに紐づくタグの総数の変更の管理
// 各種タグの編集についてはTagChipのように個別のコンポーネントに切り分けたうえで、別ページで行う

const useStyles = makeStyles({});

export const TagChips = (props) => {
  const classes = useStyles();
  const { onDelete, usableTags } = props;
  const [tags, setTags] = useState(props.tags || null);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // utils

  const tagIds = tags.map((t) => t.get('id'));

  const isTagged = (tagId) => {
    return tagIds.includes(tagId);
  };

  // handler

  const handleOpenMenu = (e) => {
    setOpen(!open);
    setAnchorEl(e.currentTarget);
    e.stopPropagation();
  };

  const handleChange = () => { };

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
        onClose={(e) => {
          setOpen(false);
          setAnchorEl(null);
          e.stopPropagation();
        }}
        PaperProps={{
          style: {
            height: '100px',
            width: '20ch',
          },
        }}
      >
        {usableTags.map((u) => (
          <MenuItem key={u.id}>
            {/* menuをクローズするまでは、タグ紐付け状態を変更するのみ */}
            <Checkbox checked={isTagged(u.id)} onClick={''} />
            {u.name}
          </MenuItem>
        ))}
      </Menu>
    );
  };

  // 検索ウインドウにて検索、入力された文字列によるタグの作成を可能とさせる

  return (
    <>
      {tags.map((tag) => (
        <Chip
          key={tag.get('id')}
          label={tag.get('name')}
          onDelete={onDelete}
          onClick={handleOpenMenu}
          component="button"
        />
      ))}
      {chipMenu()}
    </>
  );
};

TagChips.propTypes = {
  tags: PropTypes.obj,
  onDelete: PropTypes.func,
  usableTags: ImmutablePropTypes.list,
};
