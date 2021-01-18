import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { makeStyles } from '@material-ui/core/styles';
import { Chip, Menu, MenuItem, Checkbox } from '@material-ui/core';

// close時にtaskIdが必要になるケースが大半
const useStyles = makeStyles({});

export const TagChips = (props) => {
  const classes = useStyles();

  const { usableTags, tags, taskId } = props;

  const [checkedTagIds, setCheckedTagIds] = useState(tagIds());
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [prevCheckedTagIds, setPrevCheckedTagIds] = useState(null);

  // utils

  function tagIds() {
    return !_.isEmpty(tags)
      ? new Set(tags.map((t) => t.get('id')).toArray())
      : new Set();
  }

  const isTagged = (tagId) => {
    return checkedTagIds.has(tagId);
  };

  // handler

  const handleOpenMenu = (e) => {
    setOpen(!open);
    setAnchorEl(e.currentTarget);
    e.stopPropagation();
  };

  const handleChange = (e, tagId) => {
    const checked = e.target.checked;
    if (checked) {
      setCheckedTagIds((prev) => {
        prev.add(tagId);
        return new Set(prev);
      });
    } else {
      setCheckedTagIds((prev) => {
        prev.delete(tagId);
        return new Set(prev);
      });
    }
  };

  const handleMenuClose = (e) => {
    if (!U.eqSet(prevCheckedTagIds, checkedTagIds) && props.tagChange) {
      props.tagChange(taskId, [...checkedTagIds]);
    }
    setOpen(false);
    setAnchorEl(null);
    e.stopPropagation();
  };

  const chipMenu = () => {
    return (
      <Menu
        open={open}
        onEnter={() => {
          setPrevCheckedTagIds(new Set(checkedTagIds));
        }}
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        onClose={(e) => {
          handleMenuClose(e);
        }}
        PaperProps={{
          style: {
            height: '100px',
            width: '20ch',
          },
        }}
      >
        {usableTags.map((u) => (
          <MenuItem key={u.id} onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={isTagged(u.id)}
              onChange={(e) => handleChange(e, u.id)}
            />
            {u.name}
          </MenuItem>
        ))}
      </Menu>
    );
  };

  return (
    <>
      {props.tags.map((tag) => (
        <Chip
          key={tag.get('id')}
          label={tag.get('name')}
          onClick={handleOpenMenu}
        />
      ))}
      {chipMenu()}
    </>
  );
};

TagChips.propTypes = {
  taskId: PropTypes.number,
  tags: PropTypes.obj,
  usableTags: ImmutablePropTypes.list,
  tagChange: PropTypes.func,
};
