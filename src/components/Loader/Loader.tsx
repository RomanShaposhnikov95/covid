import React from 'react';
import cn from "classnames";
import styles from "./Loader.module.scss";
import {LoaderProps} from "./Loader.props";

export const Loader = React.memo(({fixed = false}: LoaderProps): JSX.Element  => {
    return (
        <div className={cn(styles.loader, {
            [styles.fixed]: fixed,
        })}>
            <div className={cn(styles.ldsRoller)}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
});

export default Loader;
