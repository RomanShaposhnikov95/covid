import styles from './Button.module.scss';
import { ButtonProps } from './Button.props';
import cn from 'classnames';
import React, {ForwardedRef, forwardRef} from "react";

export const Button = React.memo(forwardRef(({event, size = "s", appearance = "default", arrow = 'none', children, className, disabled = false, ...props }: ButtonProps, ref: ForwardedRef<HTMLButtonElement>): JSX.Element => {
    return (
        <button
            ref={ref}
            type="submit"
            disabled={disabled}
            onClick={event}
            className={cn(styles.button, className, {
                [styles.default]: !disabled && appearance === 'default',
                [styles.ghost]: !disabled && appearance === 'ghost',
                [styles.disabled]: disabled,
                [styles.small]: size === 's',
                [styles.middle]: size === 'm',
                [styles.big]: size === 'l',
            })}
            {...props}
        >
            {arrow !== 'none' && <span className={cn(styles.arrow, {
                [styles.left]: arrow === 'left'
            })}>
			</span>}
            {children}
        </button>
    );
}));
