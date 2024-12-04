import {faPencil} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React, {Dispatch, SetStateAction} from 'react';

interface EditIconPropsType {
  editState: boolean;
  setEditState: Dispatch<SetStateAction<boolean>>;
}

export const EditIcon: React.FC<EditIconPropsType> = ({
  editState,
  setEditState
}) => {
  const handleEditState = () => {
    setEditState(!editState);
  };
  return (
    <FontAwesomeIcon
      onClick={handleEditState}
      icon={faPencil}
      size="1x"
      title="Edit General Account Settings"
    />
  );
};
