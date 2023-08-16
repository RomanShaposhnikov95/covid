import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

export interface PProps extends DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement> {
    size?: 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';
    color?: 'white' | 'black' | 'grey' | 'darkgrey';
    uppercase?: boolean;
    children: ReactNode;
}