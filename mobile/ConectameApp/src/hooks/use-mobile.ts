import { useWindowDimensions } from 'react-native';
import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(): boolean {
  const { width } = useWindowDimensions();
  const isMobile = width < MOBILE_BREAKPOINT;
  return isMobile;
}
