import React from 'react';
import {useSelector} from 'react-redux';
export default function withData(
  id: number | string,
  selector: Function,
  Component: Function,
  props?: Object
): Function {
  return function () {
    const data = useSelector(selector(id));
    return <Component data={data} {...props} />;
  };
}
