import classes from './mention.module.scss';
import React, {
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState
} from 'react';
import {
  isVisible,
  selectWordAtPosition,
  setEllipsisLength
} from '@/utils/common/helper';
import {debounce} from 'throttle-debounce';
import useAPI from '@/utils/common/useAPI';
import {REQUEST_DEBOUNCE_TIME} from '@/utils/common/constants';
import {CONCURRENCY_CONTROL} from '@/genericApi/apiEndpoints';
import {useSelector} from 'react-redux';
import {selectApiState, selectUserInfo} from '@/store/selectors';
import {Spinner} from '@/ds/Spinner';
import Image from 'next/image';
import {Divider} from '@/ds/Divider';
import clsx from 'clsx';
import {CanceledError} from 'axios';
import {BADGE_IMAGE} from '@/ds/FunctionCard/components/cardBadges';

export interface MentionProps {
  mentionString: string;
  editor: any;
  setEditorData: React.Dispatch<React.SetStateAction<string>>;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  pluginPosition: React.MutableRefObject<{
    x: number;
    y: number;
  } | null>;
}
export interface MentionData {
  id: string | number;
  detailUrl: string;
  name: string;
  imageUrl: string;
  badge: string;
  type: string;
}

export const Mention: React.FC<MentionProps> = ({
  mentionString,
  editor,
  setEditorData,
  setShow,
  pluginPosition
}) => {
  const [data, setData] = useState<MentionData[] | undefined>();
  const {id: userId} = useSelector(selectUserInfo());
  const [error, setError] = useState(false);
  const loading = useSelector(selectApiState('getMentionData'));
  const [selectedIndex, setSelectedIndex] = useState(0);
  const makeApiCall = useAPI();
  const itemOnClick = useCallback(
    (item: MentionData) => {
      const cursorPos =
        editor?.contentDocument?.getSelection()?.getRangeAt(0)?.endOffset - 1;
      const {start, inclusiveEnd} = selectWordAtPosition(
        editor?.contentDocument?.getSelection()?.anchorNode?.textContent,
        editor?.contentDocument?.getSelection()?.getRangeAt(0)?.endOffset - 1
      );

      if (start !== -1 && inclusiveEnd !== -1) {
        let i;
        for (i = cursorPos + 1; i <= inclusiveEnd; i++)
          editor?.execCommand('ForwardDelete');
        for (i = start; i <= cursorPos; i++) editor?.execCommand('Delete');
      }
      editor?.execCommand(
        'mceInsertContent',
        false,
        `<a href="${window.location.origin}/profile/${item.id}">${item.name}</a>&nbsp;`
      );
      setEditorData(editor?.getContent());
    },
    [editor, mentionString]
  );

  const debounceCall = useCallback(
    debounce(REQUEST_DEBOUNCE_TIME, async (mention: string) => {
      try {
        setError(false);
        const response = await makeApiCall('getMentionData', {
          userId,
          name: mention.includes(':') ? mention : `member:${mention}`,
          concurrencyControl: CONCURRENCY_CONTROL.takeLastRequest
        });
        setData(response?.data?.slice(0, 12));
      } catch (err: any) {
        setData(undefined);
        if (!(err.errorObj instanceof CanceledError)) {
          setError(true);
        }
      }
    }),
    [makeApiCall]
  );
  useEffect(() => {
    if (mentionString.length > 1) debounceCall(mentionString.slice(1));
  }, [mentionString]);

  const setFocus = (index: number) => {
    const e = document.getElementById(
      `__mention-plugin-data-${data?.[index]?.type}-${data?.[index]?.id}-${data?.[index]?.name}-${index}`
    );
    const {visible} = isVisible(
      e,
      document?.getElementById('__mention-container')
    );
    !visible &&
      e?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
  };
  const onKeyDownHandler: KeyboardEventHandler<HTMLDivElement> = e => {
    if (data?.length && !loading && mentionString.length > 1) {
      e.stopPropagation();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % data.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + data.length) % data.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        itemOnClick(data[selectedIndex]);
      }
    }
  };
  useEffect(() => setSelectedIndex(0), [mentionString]);

  useLayoutEffect(() => {
    editor?.on('keydown', onKeyDownHandler, true);
    return () => editor?.off('keydown', onKeyDownHandler, true);
  }, [onKeyDownHandler]);

  data && setFocus(selectedIndex);
  if (!error && userId == null) setError(true);
  return (
    <div className={classes.container} id="__mention-container">
      {loading || !data || data.length == 0 ? (
        <div className={classes.fullscreenCentered}>
          {mentionString.length === 1 && <p>Type a keyword</p>}
          {mentionString.length !== 1 && !error && !!loading && <Spinner />}
          {mentionString.length !== 1 &&
            !error &&
            !loading &&
            data?.length === 0 && <p>No results</p>}
          {error && <p className={classes.error}>Some Error Occured</p>}
        </div>
      ) : (
        data?.map((item, index) => (
          <React.Fragment
            key={`${item?.type}-${item?.id}-${item?.name}-${index}`}
          >
            <div
              className={clsx(
                classes.item,
                selectedIndex === index && classes.selected,
                'cursorPointer'
              )}
              onClick={() => itemOnClick(item)}
              onMouseEnter={() => setSelectedIndex(index)}
              id={`__mention-plugin-data-${item?.type}-${item?.id}-${item?.name}-${index}`}
            >
              <span className={classes.avatarContainer}>
                <img
                  alt="user"
                  src={item?.imageUrl}
                  className={classes.avatar}
                  width={32}
                  height={32}
                ></img>
                {BADGE_IMAGE[item?.badge] && (
                  <Image
                    src={BADGE_IMAGE[item?.badge]}
                    height={12}
                    width={12}
                    alt={`${item?.badge} badge`}
                    className={classes.badge}
                  ></Image>
                )}
              </span>
              <div className={classes.name}>
                {setEllipsisLength(item.name, 30)}
              </div>
              {/* uncomment to show role as well */}
              {/* <div className={classes.tag}>
                {setEllipsisLength(item.role, 16)}
              </div> */}
            </div>
            <Divider className="m-0" />
          </React.Fragment>
        ))
      )}
    </div>
  );
};
