import React, { useState, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { Chip } from '@material-ui/core';

export const TagChip = (props) => {
  // tag: { id, name }
  const [tag, setTag] = useState(props.tag || null);

  //
  return <Chip key={tag.get('id')} label={tag.get('name')} />;
};

TagChip.PropTypes = {
  tag: PropTypes.obj,
};
