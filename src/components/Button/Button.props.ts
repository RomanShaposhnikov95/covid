import {ButtonHTMLAttributes, DetailedHTMLProps, ForwardedRef, ReactNode} from 'react';

export interface ButtonProps extends
    Omit<DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
        'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag' | 'ref'> {
    children: ReactNode;
    appearance?: 'default' | 'ghost';
    arrow?: 'right' | 'left' | 'none';
    size?: 's' | 'm' | 'l';
    disabled?: boolean;
    event?: () => void;
    ref?: ForwardedRef<HTMLButtonElement>
}
