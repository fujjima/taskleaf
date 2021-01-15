import React, { useState, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { Chip, Menu, MenuItem } from '@material-ui/core';

// タグのList
// タグの新規作成、紐づくタグの変更、削除など、タスクに紐づくタグの総数の変更の管理
// 各種タグの内容の変更については、一旦考えない
// やるのであれば、必ずTagChipのように個別のコンポーネントに切り分ける

// タグ自体の変更自体はそれ専用のページを用意する
export const TagChips = (props) => {
  const { onDelete } = props;
  const [tags, setTags] = useState(props.tags || null);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (e) => {
    setOpen(!open);
    setAnchorEl(e.currentTarget);
    e.stopPropagation();
  };

  const chipMenu = () => {
    return (
      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={(e) => {
          setOpen(false);
          setAnchorEl(null);
          e.stopPropagation();
        }}
      >
        <MenuItem>this is test</MenuItem>
      </Menu>
    );
  };

  // クリック時に所有しているタグを表示、複数選択可能
  // 検索ウインドウにて検索、入力された文字列によるタグの作成を可能とさせる

  return (
    <>
      {tags.map((tag) => (
        <Chip
          key={tag.get('id')}
          label={tag.get('name')}
          onDelete={onDelete}
          onClick={handleOpenMenu}
        />
      ))}
      {chipMenu()}
    </>
  );
};

TagChips.PropTypes = {
  tags: PropTypes.obj,
  onDelete: PropTypes.func,
};
