import React from 'react';
import classes from '../FunctionEditPage.module.scss';
import {Button, ButtonVariants} from '@/ds/Button';
import clsx from 'clsx';
import {useSelector} from 'react-redux';
import {selectApiState} from '@/store/selectors';

export const EDIT_FUNCTION_BTNS = {
  SAVE_DRAFT: 'functions-save-draft-btn',
  PUBLISH: 'functions-preview-btn',
  PREVIEW: 'functions-publish-btn'
};

export const EditFunctionButtons: React.FC = () => {
  const publishing = useSelector(selectApiState('postNewFunction'));
  const savingDraft = useSelector(selectApiState('saveFunctionDraft'));
  const disableBtns = publishing || savingDraft;

  return (
    <div className={classes.btnContainer}>
      <Button
        type="submit"
        disabled={disableBtns}
        loadingChildren="Saving Draft"
        variant={ButtonVariants.BluePrimary}
        id={EDIT_FUNCTION_BTNS.SAVE_DRAFT}
        className={clsx(classes.btn, classes.secondary)}
        loading={savingDraft}
      >
        Save Draft
      </Button>

      {/* <Button
        type="submit"
        disabled={disableBtns}
        variant={ButtonVariants.BluePrimary}
        id={EDIT_FUNCTION_BTNS.PREVIEW}
        loadingChildren="Generating Preview"
        className={clsx(classes.btn, classes.secondary)}
        loading={generatingPrview}
      >
        Preview
      </Button> */}

      <Button
        type="submit"
        disabled={disableBtns}
        className={classes.btn}
        loadingChildren="Publishing"
        variant={ButtonVariants.BluePrimary}
        id={EDIT_FUNCTION_BTNS.PUBLISH}
        loading={publishing}
      >
        Publish
      </Button>
    </div>
  );
};

export default EditFunctionButtons;
