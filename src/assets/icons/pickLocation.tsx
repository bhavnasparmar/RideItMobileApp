import Svg, {Path} from 'react-native-svg';
import React from 'react';
import { appColors } from '@src/themes'; 

export function PickLocation({
  height,
  width,
  colors,
}: {
  height?: number;
  width?: number;
  colors?: string;
}) {
  return (
    <Svg
      width={width || '20'}
      height={height || '20'}
      viewBox="0 0 20 20"
      fill="none">
      <Path
        d="M17.1833 7.04158C16.3083 3.19159 12.95 1.45825 10 1.45825C10 1.45825 10 1.45825 9.99167 1.45825C7.05 1.45825 3.68334 3.18325 2.80834 7.03325C1.83334 11.3333 4.46667 14.9749 6.85 17.2666C7.73334 18.1166 8.86667 18.5416 10 18.5416C11.1333 18.5416 12.2667 18.1166 13.1417 17.2666C15.525 14.9749 18.1583 11.3416 17.1833 7.04158ZM10 11.2166C8.55 11.2166 7.375 10.0416 7.375 8.59159C7.375 7.14158 8.55 5.96658 10 5.96658C11.45 5.96658 12.625 7.14158 12.625 8.59159C12.625 10.0416 11.45 11.2166 10 11.2166Z"
        fill={colors || appColors.primary}
      />
    </Svg>
  );
}
