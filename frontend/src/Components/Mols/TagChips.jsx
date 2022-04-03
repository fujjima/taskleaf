import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { makeStyles } from '@material-ui/core/styles';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import { Chip, Menu, MenuItem, Checkbox, IconButton } from '@material-ui/core';

const useStyles = makeStyles({
  tagIcon: {
    '&:hover': {
      backgroundColor: 'inherit',
    },
  },
});

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
      ? new Set(tags.map(t => t.id))
      : new Set();
  }

  const isTagged = (tagId) => {
    return checkedTagIds.has(tagId);
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

  // handler

  const handleOpenMenu = (e) => {
    e.stopPropagation();
    setOpen(!open);
    setAnchorEl(e.currentTarget);
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

  // render

  const renderTagChips = () => {
    const tags = props.tags;

    return tags.size === 0 ? (
      <IconButton
        size="small"
        disableRipple
        className={classes.tagIcon}
        key={`tag-icon-${taskId}`}
        onClick={(e) => handleOpenMenu(e)}
      >
        <LocalOfferIcon fontSize="small" onClick={(e) => handleOpenMenu(e)} />
      </IconButton>
    ) : (
      props.tags.map((tag) => (
        <Chip
          key={tag.id}
          label={tag.name}
          onClick={handleOpenMenu}
        />
      ))
    );
  };

  return (
    <>
      {renderTagChips()}
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
