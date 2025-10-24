/**
 * Walk Icon Component
 *
 * Custom icon showing boot footprints for the Walks tab.
 * Displays two boot prints side by side to represent walking/hiking.
 */

import React from 'react';
import Svg, { Path, G } from 'react-native-svg';

interface WalkIconProps {
  size?: number;
  color?: string;
}

export const WalkIcon: React.FC<WalkIconProps> = ({
  size = 26,
  color = '#000000'
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Left boot print */}
      <G>
        {/* Boot sole */}
        <Path
          d="M4 9C4 8.5 4.2 8 4.5 7.5C5 7 5.5 6.5 6 6.5C6.5 6.5 7 7 7 7.5C7 8 7 8.5 7.5 9C8 9.5 8 10 8 10.5C8 11 7.5 11.5 7 12C6.5 12.5 6 13 5.5 13.5C5 14 4.5 14 4 14C3.5 14 3 13.5 3 13C3 12.5 3 12 3.5 11.5C3.5 11 4 10.5 4 10C4 9.5 4 9 4 9Z"
          fill={color}
        />
        {/* Toes */}
        <Path
          d="M5 5C5 4.5 5.2 4 5.5 4C6 4 6 4.5 6 5C6 5.5 5.8 6 5.5 6C5.2 6 5 5.5 5 5Z"
          fill={color}
        />
        <Path
          d="M6.5 4.5C6.5 4 6.7 3.5 7 3.5C7.3 3.5 7.5 4 7.5 4.5C7.5 5 7.3 5.5 7 5.5C6.7 5.5 6.5 5 6.5 4.5Z"
          fill={color}
        />
      </G>

      {/* Right boot print (offset) */}
      <G>
        {/* Boot sole */}
        <Path
          d="M14 14C14 13.5 14.2 13 14.5 12.5C15 12 15.5 11.5 16 11.5C16.5 11.5 17 12 17 12.5C17 13 17 13.5 17.5 14C18 14.5 18 15 18 15.5C18 16 17.5 16.5 17 17C16.5 17.5 16 18 15.5 18.5C15 19 14.5 19 14 19C13.5 19 13 18.5 13 18C13 17.5 13 17 13.5 16.5C13.5 16 14 15.5 14 15C14 14.5 14 14 14 14Z"
          fill={color}
        />
        {/* Toes */}
        <Path
          d="M15 10C15 9.5 15.2 9 15.5 9C16 9 16 9.5 16 10C16 10.5 15.8 11 15.5 11C15.2 11 15 10.5 15 10Z"
          fill={color}
        />
        <Path
          d="M16.5 9.5C16.5 9 16.7 8.5 17 8.5C17.3 8.5 17.5 9 17.5 9.5C17.5 10 17.3 10.5 17 10.5C16.7 10.5 16.5 10 16.5 9.5Z"
          fill={color}
        />
      </G>
    </Svg>
  );
};
