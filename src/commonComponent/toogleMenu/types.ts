import {ReactNode} from 'react';

export interface toggleMenuProp {
  title: string;
  options: []any: any;
  onSelect: any;
  initialPlaceholder: string;
  position: boolean;
  iconShow: boolean;
  icon: ReactNode;
  titleShow: boolean;
}
