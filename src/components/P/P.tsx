import { PProps } from './P.props';
import styles from './P.module.scss';
import cn from 'classnames';
import React from "react";

export const P = React.memo(({ size = 'm', children, className, color = 'black', uppercase = false, ...props }: PProps): JSX.Element => {
    return (
        <p
            className={cn(styles.p, className, {
                [styles.xs]: size == 'xs',
                [styles.s]: size == 's',
                [styles.m]: size == 'm',
                [styles.l]: size == 'l',
                [styles.xl]: size == 'xl',
                [styles.xxl]: size == 'xxl',
                [styles.white]: color === "white",
                [styles.black]: color === "black",
                [styles.darkgrey]: color === "darkgrey",
                [styles.grey]: color === "grey",
                [styles.uppercase]: uppercase,
            })}
            {...props}
        >
            {children}
        </p>
    );
});
