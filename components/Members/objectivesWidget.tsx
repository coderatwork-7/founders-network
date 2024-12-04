import clsx from 'clsx';
import classes from './objectivesWidget.module.scss';
import {Button, ButtonVariants} from '@/ds/Button';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo
} from 'react';
import useAPI from '@/utils/common/useAPI';
import {useSelector} from 'react-redux';
import {
  selectApiState,
  selectFacets,
  selectObjectives,
  selectUserInfo
} from '@/store/selectors';
import {Spinner} from '@/ds/Spinner';
import {FacetState} from '@/utils/common/commonTypes';
import {MembersPageFacetsContext} from '../ContextProviders/MembersFacetsContext';
import {CONCURRENCY_CONTROL} from '@/genericApi/apiEndpoints';
import {checkLoading} from '@/genericApi/helper';
import {CONST_MEMBERS} from '@/utils/common/constants';

interface ObjectivesWidgetProps {
  setEditingObjectives: Dispatch<SetStateAction<boolean>>;
}

export function ObjectivesWidget({
  setEditingObjectives
}: ObjectivesWidgetProps) {
  const makeApiRequest = useAPI();
  const objectives: FacetState = useSelector(selectObjectives());
  const loadingGetMembers = useSelector(selectApiState('getMembersObjectives'));
  const loadingFacets = useSelector(selectFacets(CONST_MEMBERS)) == undefined;
  const loading = checkLoading(loadingGetMembers) || loadingFacets;
  const user = useSelector(selectUserInfo());
  const {setSelectedFacetValues, setApplyFacets} = useContext(
    MembersPageFacetsContext
  );
  const setPageObjectives = useCallback(
    (objectiveNumber: string) => {
      const {objectiveFacet, ...rest} = objectives?.[objectiveNumber];

      setSelectedFacetValues({
        objective_tags: rest,
        objective_lookup: {objectiveFacet}
      });
      setApplyFacets?.(true);
    },
    [objectives]
  );
  useEffect(() => {
    if (!objectives && user?.id)
      makeApiRequest('getMembersObjectives', {
        userId: user.id,
        concurrencyControl: CONCURRENCY_CONTROL.takeFirstRequest
      });
  }, [objectives, user?.id]);

  useEffect(() => {
    if (objectives && Object.keys(objectives).length === 0 && !loadingFacets)
      setEditingObjectives(true);
  }, [objectives, user?.id, loadingFacets]);

  const objectivesList = useMemo(
    () =>
      objectives
        ? Object.keys(objectives)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map((objectiveNumber, index) => (
              <div
                className={classes.objective}
                key={`objective-${objectiveNumber}`}
              >
                <div
                  className="linkText cursorPointer"
                  onClick={() => setPageObjectives(objectiveNumber)}
                >
                  {index + 1}.{' '}
                  {
                    objectives[parseInt(objectiveNumber)].objectiveFacet
                      .facetValueName
                  }
                </div>
              </div>
            ))
        : null,
    [objectives]
  );

  return (
    <div className={clsx(classes.container, 'container-border')}>
      <div className={classes.row}>
        <div className={clsx(classes.heading)}>Your Objectives</div>
      </div>
      <div className={classes.row}>
        <div className={classes.label}>
          Add your objectives, and find members who can help you.
        </div>
      </div>
      <div className={classes.row}>
        {loading === undefined || loading ? (
          <Spinner />
        ) : objectivesList?.length ? (
          objectivesList
        ) : (
          <div className={clsx(classes.objective, 'text-center')}>
            No objectives set!
          </div>
        )}
      </div>

      <div className="p-2">
        <Button
          variant={ButtonVariants.OutlineInfo}
          className={clsx('w-100', classes.colorRegent)}
          onClick={
            loading === undefined || loading
              ? undefined
              : () => setEditingObjectives(true)
          }
        >
          UPDATE
        </Button>
      </div>
    </div>
  );
}
