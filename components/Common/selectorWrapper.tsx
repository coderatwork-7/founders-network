import {convertObjectUsingReverseMapping} from '@/utils/common/helper';
import React from 'react';
import {useSelector} from 'react-redux';
export default function SelectorWrapper({
  Component,
  id,
  selector,
  props,
  dataMap
}: {
  id: number | string;
  selector: Function;
  Component: Function;
  props?: Object;
  dataMap?: any;
}): JSX.Element {
  const data = useSelector(selector(id));
  return (
    <Component
      data={
        dataMap ? convertObjectUsingReverseMapping(data ?? {}, dataMap) : data
      }
      {...props}
    />
  );
}
