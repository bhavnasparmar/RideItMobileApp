import Svg, {Path} from 'react-native-svg';
import React from 'react';
import {useValues} from '../../../App';

export function Chat({color}: {color?: string}) {
  const {iconColorStyle} = useValues();
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <Path
        d="M15.3917 14.025L15.7167 16.6583C15.8 17.3499 15.0583 17.8333 14.4667 17.4749L10.975 15.3999C10.5917 15.3999 10.2167 15.375 9.85 15.325C10.4667 14.6 10.8333 13.6833 10.8333 12.6916C10.8333 10.3249 8.78333 8.40831 6.25 8.40831C5.28333 8.40831 4.39167 8.68329 3.65 9.16663C3.625 8.95829 3.61666 8.74995 3.61666 8.53328C3.61666 4.74162 6.90833 1.66663 10.975 1.66663C15.0417 1.66663 18.3333 4.74162 18.3333 8.53328C18.3333 10.7833 17.175 12.775 15.3917 14.025Z"
        stroke={color || iconColorStyle}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10.8333 12.6916C10.8333 13.6833 10.4667 14.6 9.85 15.325C9.025 16.325 7.71666 16.9666 6.25 16.9666L4.075 18.2583C3.70833 18.4833 3.24166 18.175 3.29166 17.75L3.49999 16.1083C2.38333 15.3333 1.66666 14.0916 1.66666 12.6916C1.66666 11.225 2.45 9.9333 3.65 9.16664C4.39167 8.6833 5.28333 8.40833 6.25 8.40833C8.78333 8.40833 10.8333 10.325 10.8333 12.6916Z"
        stroke={color || iconColorStyle}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
