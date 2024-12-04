// TODO: Refactor this component later
import clsx from 'clsx';
import classes from './objectivesEditor.module.scss';
import {Divider} from '@/ds/Divider';
import {KeywordInputFacet} from '@/ds/KeywordInputFacet';
import {useFacetState} from '../Common/Facets/useFacetState';
import {IconWrapper} from '@/ds/Icons';
import {
  fa1,
  fa2,
  fa3,
  faCircleMinus,
  faCirclePlus
} from '@fortawesome/free-solid-svg-icons';
import {Radios} from '@/ds/Radios';
import {Button, ButtonVariants} from '@/ds/Button';
import useAPI from '@/utils/common/useAPI';
import {
  selectApiState,
  selectFacets,
  selectHelpingMembers,
  selectObjectives,
  selectUserExpertise,
  selectUserInfo
} from '@/store/selectors';
import {useSelector} from 'react-redux';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {CONST_MEMBERS} from '@/utils/common/constants';
import {Spinner} from '@/ds/Spinner';
import useIsMobile from '@/utils/common/useIsMobile';
import {CONCURRENCY_CONTROL} from '@/genericApi/apiEndpoints';
import {toast} from 'react-toastify';

const icons = [
  <IconWrapper icon={fa1} key="one-icon" />,
  <IconWrapper icon={fa2} key="two-icon" />,
  <IconWrapper icon={fa3} key="three-icon" />
];
const pageMessage = [
  'Your Objectives',
  'Did somebody help ?',
  'Update your expertise',
  'Your objectives have been updated!'
];
interface ObjectivesEditorProps {
  setEditingObjectives: Dispatch<SetStateAction<boolean>>;
}
export function ObjectivesEditor({
  setEditingObjectives
}: ObjectivesEditorProps) {
  const makeApiRequest = useAPI();
  const isMobile = useIsMobile();
  const objectives = useSelector(selectObjectives());
  const facets = useSelector(selectFacets(CONST_MEMBERS));
  const [loading, setLoading] = useState(!objectives || !facets);
  const user = useSelector(selectUserInfo());
  const [pageNumber, setPageNumber] = useState(0);
  const [error, setError] = useState(false);
  const members = useSelector(selectHelpingMembers());
  const [fetchMembersLoading, setFetchMembersLoading] = useState(!members);
  const {selectedFacetValues, updateFacetValue, setSelectedFacetValues} =
    useFacetState(objectives);
  const [showMembersFacet, setShowMembersFacet] = useState([true, true, true]);
  const userExpertise = useSelector(selectUserExpertise());
  const [loadingUserExpertise, setLoadingUserExpertise] = useState(
    !userExpertise
  );
  const endRequestLoading = useSelector(selectApiState('putObjectives'));
  const {
    selectedFacetValues: selectedExpertise,
    updateFacetValue: updateExpertiseFn,
    setSelectedFacetValues: setExpertise
  } = useFacetState();

  const displayOrder = useRef(3);
  const refMapping = Array.from({length: 3}, () =>
    useRef<HTMLInputElement>(null)
  );
  const radioRefMapping = Array.from({length: 3}, () =>
    useRef<{selectedIndex: number}>(null)
  );
  const helpingRadioRefs = Array.from({length: 3}, () =>
    useRef<{selectedIndex: number}>(null)
  );
  const membersKeywords = Array.from({length: 3}, () => useFacetState());

  useEffect(() => {
    const fetchObjectivesAndFacets = async () => {
      try {
        const [{data: facetState}, _] = await Promise.all([
          objectives
            ? Promise.resolve({data: null})
            : makeApiRequest('getMembersObjectives', {
                userId: user.id,
                concurrencyControl: CONCURRENCY_CONTROL.takeFirstRequest
              }),
          facets
            ? Promise.resolve()
            : makeApiRequest('getFacets', {
                page: CONST_MEMBERS,
                userId: user.id,
                concurrencyControl: CONCURRENCY_CONTROL.takeFirstRequest
              })
        ]);
        if (facetState) setSelectedFacetValues(facetState);
      } catch (err) {
        toast.error('Something went wrong', {theme: 'dark'});
      } finally {
        setLoading(false);
      }
    };
    if ((!objectives || !facets) && user?.id) {
      setLoading(true);
      fetchObjectivesAndFacets();
    }
  }, [objectives, user?.id, facets]);

  const fetchHelpingMembers = useCallback(async () => {
    await makeApiRequest('getAllMembers', {userId: user?.id});
    setFetchMembersLoading(false);
  }, [user?.id, makeApiRequest]);

  const fetchUserExpertise = useCallback(async () => {
    const {data: userExpertise} = await makeApiRequest('getMemberExpertise', {
      userId: user?.id
    });
    setLoadingUserExpertise(false);
    setExpertise(
      userExpertise.reduce(
        (acc: any, expertise: any) => {
          Object.assign(acc.expertiseFacet, {
            [expertise.key]: {
              facetValueKey: expertise.key,
              facetValueName: expertise.name
            }
          });
          return acc;
        },
        {expertiseFacet: {}}
      )
    );
  }, [user?.id, makeApiRequest]);
  useEffect(() => {
    if (user?.id) {
      if (!members && pageNumber === 1) {
        fetchHelpingMembers();
      }
      if (!userExpertise && pageNumber === 2) {
        fetchUserExpertise();
      }
    }
  }, [pageNumber, user?.id]);

  const removeObjectiveHandler = (objectiveNumber: string) => {
    const {[objectiveNumber]: _, ...rest} = selectedFacetValues;
    setSelectedFacetValues(rest);
  };
  const invalidData = () => {
    if (
      Object.keys(selectedFacetValues)
        .map((objectiveNumber, index) => {
          if (Object.keys(selectedFacetValues[objectiveNumber]).length === 1)
            return true;
          if ((refMapping[index]?.current?.value?.trim().length ?? 0) < 6)
            return true;
          return false;
        })
        .includes(true)
    )
      return true;

    return false;
  };

  const onSubmitHandler = async () => {
    if (pageNumber === 0 && invalidData()) {
      setError(true);
      return;
    } else {
      setError(false);
    }
    if (radioRefMapping.some(element => element.current?.selectedIndex)) {
      if (pageNumber <= 1) {
        setPageNumber(pageNumber + 1);
        return;
      } else {
        await makeApiRequest(
          'putObjectives',
          {userId: user?.id},
          {
            method: 'POST',
            data: {
              objectives: Object.keys(selectedFacetValues)
                .sort((a, b) => parseInt(a) - parseInt(b))
                .map((objectiveNumber: any, index: number) => ({
                  objective:
                    refMapping[index].current?.value || 'Empty Objective',
                  isCompleted: !!radioRefMapping[index].current?.selectedIndex,
                  tags: Object.keys(selectedFacetValues[objectiveNumber])
                    .filter(key => key !== 'objectiveFacet')
                    .map(
                      tagFacetKey =>
                        selectedFacetValues[objectiveNumber][tagFacetKey]
                          .facetValueKey
                    ),
                  members: helpingRadioRefs[index].current?.selectedIndex
                    ? []
                    : Object.values(
                        membersKeywords[index]?.selectedFacetValues
                          ?.helpingMembers ?? {}
                      ).map(obj => obj.facetValueKey),
                  key: selectedFacetValues[objectiveNumber].objectiveFacet
                    .facetValueKey
                })),
              expertise: Object.values(
                selectedExpertise.expertiseFacet ?? {}
              ).map(obj => obj.facetValueKey)
            }
          }
        );

        setPageNumber(3);
        return;
      }
    } else {
      await makeApiRequest(
        'putObjectives',
        {userId: user?.id},
        {
          method: 'POST',
          data: {
            objectives: Object.keys(selectedFacetValues)
              .sort((a, b) => parseInt(a) - parseInt(b))
              .map((objectiveNumber: any, index: number) => ({
                objective:
                  refMapping[index].current?.value || 'Empty Objective',
                isCompleted: false,
                tags: Object.keys(selectedFacetValues[objectiveNumber])
                  .filter(key => key !== 'objectiveFacet')
                  .map(
                    tagFacetKey =>
                      selectedFacetValues[objectiveNumber][tagFacetKey]
                        .facetValueKey
                  ),
                members: [],
                key: selectedFacetValues[objectiveNumber].objectiveFacet
                  .facetValueKey
              })),
            expertise: []
          }
        }
      );
      setPageNumber(3);
    }
  };

  const dropdownValues = useMemo(() => {
    if (facets)
      return facets
        .find((facetObj: any) => facetObj.facet.key === 'objective_tags')
        .facetValues.reduce(
          (acc: any, facetObj: any) =>
            Object.assign(acc, {
              [facetObj.key]: {id: facetObj.key, name: facetObj.name}
            }),
          {}
        );
    else return {};
  }, [facets]);

  const objectiveEditorList = useMemo(() => {
    const objectiveKeys = Object.keys(selectedFacetValues).slice();
    return !loading
      ? objectiveKeys
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map((objectiveNumber, index) => (
            <div
              className={classes.objective}
              key={`objective-${objectiveNumber}`}
            >
              <div
                className={clsx(
                  'd-flex bg-white p-1 d-flex align-items-center'
                )}
              >
                <span
                  className={clsx(
                    classes.smallText,
                    'ms-2 d-flex align-items-center gap-2'
                  )}
                >
                  {icons[index]}Objective:
                </span>
                <input
                  defaultValue={
                    selectedFacetValues[objectiveNumber].objectiveFacet
                      .facetValueName
                  }
                  className={classes.input}
                  ref={refMapping[index]}
                  id={`objective-editor-${index}`}
                />
              </div>
              <KeywordInputFacet
                facetKey={objectiveNumber}
                facetName="Objective-Tags"
                facetValueOnClick={updateFacetValue}
                ignoredFacetValueKeys={{
                  [selectedFacetValues[objectiveNumber].objectiveFacet
                    .facetValueKey]: true
                }}
                ignoredFacetKeys={{}}
                selectedItems={{
                  [objectiveNumber]: selectedFacetValues[objectiveNumber]
                }}
                placeholderText="Enter a tag"
                dropdownOnly
                dropdownItems={dropdownValues}
                maxDropdownSize={Infinity}
                facetDropdown
              />
              <div className={clsx(classes.buttonContainer, 'ps-2 pt-1')}>
                {selectedFacetValues[objectiveNumber].objectiveFacet
                  .facetValueKey !== 'new_objective' && (
                  <Radios
                    labels={['In Progress', 'Complete']}
                    selectedIndex={0}
                    ref={radioRefMapping[index]}
                  />
                )}
                {objectiveKeys.length > 1 && (
                  <IconWrapper
                    icon={faCircleMinus}
                    className={classes.button}
                    onClick={() => removeObjectiveHandler(objectiveNumber)}
                  />
                )}
              </div>
            </div>
          ))
      : null;
  }, [objectives, selectedFacetValues, loading]);
  const FooterBar = useMemo(
    () => (
      <div className="d-flex px-3 py-1 align-items-center">
        {(objectiveEditorList?.length ?? 4) < 3 && (
          <div
            onClick={() =>
              updateFacetValue(
                {
                  [displayOrder.current++]: {
                    objectiveFacet: {
                      facetValueKey: 'new_objective',
                      facetValueName: ''
                    }
                  }
                },
                false
              )
            }
            className={clsx('cursorPointer', pageNumber && 'invisible')}
          >
            <IconWrapper icon={faCirclePlus} className="cursorPointer me-1 " />
            Add More Objectives
          </div>
        )}
        <div className="ms-auto">
          <Button
            variant={ButtonVariants.Primary}
            subVariant="verySmall"
            onClick={onSubmitHandler}
            className={clsx(
              'me-1',
              objectiveEditorList?.length === 0 && 'invisible'
            )}
          >
            Save
          </Button>
          <Button
            variant={ButtonVariants.OutlineSecondary}
            subVariant="verySmall"
            onClick={() => setPageNumber(currentPage => currentPage - 1)}
            className={clsx(pageNumber === 0 && 'd-none')}
          >
            Back
          </Button>
        </div>
      </div>
    ),
    [onSubmitHandler, pageNumber]
  );
  const firstScreen = useMemo(
    () => (
      <>
        <Divider className="m-0" />
        {loading || endRequestLoading ? (
          <Spinner />
        ) : (
          <>
            {objectiveEditorList}
            {FooterBar}
          </>
        )}
      </>
    ),
    [
      loading,
      objectiveEditorList,
      displayOrder,
      endRequestLoading,
      onSubmitHandler,
      endRequestLoading
    ]
  );
  const membersDropdown = useMemo(
    () =>
      members?.reduce(
        (acc: any, member: any) =>
          Object.assign(acc, {
            [member.profileId]: {id: member.profileId, name: member.name}
          }),
        {}
      ),
    [members]
  );

  const memberHelpedPage = useMemo(
    () =>
      !fetchMembersLoading ? (
        <>
          {radioRefMapping.map((radioRef, index) =>
            radioRef?.current?.selectedIndex ? (
              <div
                className={classes.objective}
                key={`helping-members-${index}`}
              >
                <div className="text-start ms-3">
                  Objective: {refMapping[index]?.current?.value}
                </div>
                {showMembersFacet[index] && (
                  <KeywordInputFacet
                    facetKey="helpingMembers"
                    facetName="members that helped"
                    facetValueOnClick={membersKeywords[index].updateFacetValue}
                    ignoredFacetKeys={{}}
                    ignoredFacetValueKeys={{}}
                    selectedItems={membersKeywords[index].selectedFacetValues}
                    dropdownItems={membersDropdown}
                    placeholderText="Enter member"
                    facetDropdown
                    maxDropdownSize={Infinity}
                  />
                )}
                <Radios
                  labels={[
                    'Yes FN member(s) helped me with this goal',
                    'No FN member helped me with this goal'
                  ]}
                  selectedIndex={0}
                  radioOnClick={(selectedIndex: number) =>
                    setShowMembersFacet(prev => {
                      const newArray = prev.slice();
                      newArray.splice(index, 1, !selectedIndex);
                      return newArray;
                    })
                  }
                  ref={helpingRadioRefs[index]}
                  containerClassName={clsx(
                    classes.ignoreNoPadding,
                    'px-3',
                    isMobile
                      ? 'd-flex flex-column align-items-start gap-2'
                      : 'd-flex align-items-center gap-3'
                  )}
                />
              </div>
            ) : null
          )}
          {FooterBar}
        </>
      ) : (
        <Spinner />
      ),
    [
      pageNumber !== 1,
      fetchMembersLoading,
      radioRefMapping,
      ...showMembersFacet,
      ...membersKeywords.map(state => state.selectedFacetValues)
    ]
  );

  const expertiseDropdown = useMemo(() => {
    if (facets)
      return facets
        .find((facetObj: any) => facetObj.facet.key === 'expertise')
        .facetValues.reduce(
          (acc: any, facetObj: any) =>
            Object.assign(acc, {
              [facetObj.key]: {id: facetObj.key, name: facetObj.name}
            }),
          {}
        );
    else return {};
  }, [facets]);
  const updateExpertise = useMemo(
    () => (
      <>
        {!endRequestLoading ? (
          <>
            <div className={classes.objective}>
              {!loadingUserExpertise ? (
                <>
                  <div className="text-start ps-3">Update Your Expertise:</div>
                  <KeywordInputFacet
                    facetKey="expertiseFacet"
                    facetName="expertise selector"
                    facetValueOnClick={updateExpertiseFn}
                    ignoredFacetKeys={{}}
                    ignoredFacetValueKeys={{}}
                    selectedItems={selectedExpertise}
                    dropdownOnly
                    dropdownItems={expertiseDropdown}
                    placeholderText="Enter an expertise"
                    facetDropdown
                    maxDropdownSize={Infinity}
                  />
                </>
              ) : (
                <Spinner />
              )}
            </div>
            {FooterBar}
          </>
        ) : (
          <Spinner />
        )}
      </>
    ),
    [
      pageNumber !== 2,
      loadingUserExpertise,
      selectedExpertise,
      endRequestLoading
    ]
  );
  const endingScreen = <></>;
  return (
    <div
      className={clsx(
        classes.container,
        'container-box-shadow mb-3',
        isMobile && 'mt-3'
      )}
    >
      <div
        className={clsx(
          classes.heading,
          'd-flex justify-content-center align-items-center'
        )}
      >
        <div className="w-100">{pageMessage[pageNumber]}</div>
        <span
          className={clsx('btn-close cursorPointer ms-auto', classes.crossBtn)}
          onClick={() => setEditingObjectives(false)}
        ></span>
      </div>
      {error && (
        <div className={classes.error}>
          Error:There should be atleast one tag for each objective and objective
          length must be atleast 6 letters
        </div>
      )}
      <div className={clsx(pageNumber !== 0 && 'd-none')}>{firstScreen}</div>
      <div className={clsx(pageNumber !== 1 && 'd-none')}>
        {memberHelpedPage}
      </div>
      <div className={clsx(pageNumber !== 2 && 'd-none')}>
        {updateExpertise}
      </div>
      <div className={clsx(pageNumber !== 3 && 'd-none')}>{endingScreen}</div>
    </div>
  );
}
