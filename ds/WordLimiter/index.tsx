import {ChangeEvent, Dispatch, SetStateAction, useMemo} from 'react';
import classes from './wordLimiter.module.scss';
export function WordLimiter({
  setText,
  text,
  wordLimit
}: Readonly<{
  text: string;
  setText: Dispatch<SetStateAction<string>>;
  wordLimit: number;
}>) {
  if (text.length > wordLimit) setText(text.slice(0, wordLimit));
  const onChange = useMemo(
    () => (e: ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value),
    [setText]
  );
  return (
    <>
      <div className="position-relative">
        <textarea rows={4} value={text} onChange={onChange}></textarea>
        <div className={classes.absolutePos}>
          {Math.max(wordLimit - text.length, 0)}
        </div>
      </div>
      <p className="mt-1 text-start">
        {`This field will be used in your introduction to the community. No more
        than ${wordLimit} characters.`}
      </p>
    </>
  );
}
