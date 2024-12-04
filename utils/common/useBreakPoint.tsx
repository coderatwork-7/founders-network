import useWindowDimensions from './useWindowDimensions';
import {BREAKPOINTS} from './constants';

export enum Breakpoint {
  mobile = 'mobile',
  tablet = 'tablet',
  desktop = 'desktop'
}

export const useBreakpoint = (): Breakpoint => {
  const {width} = useWindowDimensions();
  let breakpoint = Breakpoint.mobile;
  Object.entries(BREAKPOINTS).forEach(([key, value]) => {
    if ((width || 0) > value) breakpoint = Breakpoint[key as Breakpoint];
  });

  return breakpoint;
};
