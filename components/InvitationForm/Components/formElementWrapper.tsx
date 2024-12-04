import clsx from 'clsx';
import classes from '../invitationForm.module.scss';
import {IconWrapper} from '@/ds/Icons';
import {
  faCheck,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';
import {State, change} from '../helper';
import {
  ChangeEvent,
  ComponentType,
  Dispatch,
  MouseEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {Spinner} from '@/ds/Spinner';
export function FormElement({
  element: Element,
  label,
  field,
  page,
  state,
  setState,
  setOnChange = true,
  activeElement,
  props,
  className
}: Readonly<{
  element: ComponentType<any>;
  page: keyof State;
  field: string;
  state: State;
  label: string;
  setState: Dispatch<SetStateAction<State>>;
  setOnChange?: boolean;
  activeElement: Element | null;
  props?: any;
  className?: string;
}>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const allInputs = [
      ...(containerRef.current?.getElementsByTagName('input') ?? []),
      ...(containerRef.current?.getElementsByTagName('textarea') ?? [])
    ];
    allInputs.find(e => e === document.activeElement)
      ? setFocused(true)
      : setFocused(false);
  }, [activeElement]);
  const setSelectedItem = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    let unfocused = null;
    const allInputs = [
      ...(containerRef.current?.getElementsByTagName('input') ?? []),
      ...(containerRef.current?.getElementsByTagName('textarea') ?? [])
    ];

    for (const element of allInputs.slice().reverse()) {
      if (document.activeElement === element) {
        unfocused = null;
        break;
      }
      unfocused = element;
    }

    unfocused?.focus();
  }, []);

  const status = field && (state as any)[page][field].status;
  const loading = (state as any)[page][field].loading;
  const onChangeProps = setOnChange
    ? {
        onChange: (e: ChangeEvent<HTMLInputElement>) =>
          change(e.target.value, setState, page, field),
        value: (state as any)[page][field].value
      }
    : null;
  const element = useMemo(
    () => <Element {...onChangeProps} {...props} />,
    [setOnChange, props, (state as any)[page][field]]
  );
  const labelJSX = (
    <div className="text-start">
      <span>{label.slice(0, label.endsWith('*') ? -1 : Infinity)}</span>
      <span className="text-danger">{label.endsWith('*') ? '*' : ''}</span>
      <p className="text-danger textXSmall m-0 p-0">
        {(state as any)[page][field].errorMessage ?? ''}
      </p>
    </div>
  );

  return (
    <div
      className={clsx('cursorPointer', className)}
      onClick={setSelectedItem}
      ref={containerRef}
      onKeyDown={() => {}}
    >
      <div className="d-flex justify-content-between">
        <div className={clsx('mb-2', classes.grayColor)}>{labelJSX}</div>
        {status === 'wrong' && (
          <IconWrapper
            icon={faTriangleExclamation}
            className={classes.errorSVG}
          />
        )}
        {status === 'ok' && (
          <IconWrapper icon={faCheck} className={classes.greenSVG} />
        )}
      </div>
      {loading ? <Spinner size="sm" /> : element}
    </div>
  );
}
