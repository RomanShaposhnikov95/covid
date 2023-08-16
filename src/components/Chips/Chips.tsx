import React, {useEffect, useState} from 'react';
import cn from "classnames";
import styles from "./Chips.module.scss";
import {ChipsProps} from "./Chips.props";
import {GlobalStore} from "../../core/store/globalStore";

export const Chips = ({message, show, status = "done", className, ...props}: ChipsProps): JSX.Element => {

    const [isVisible, setIsVisible] = useState(show);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (show) {
            setIsVisible(true);

            timer = setTimeout(() => {
                setIsVisible(false);
                GlobalStore.service.errorStatus("");
            }, 3000);
        } else {
            setIsVisible(false);
        }

        return () => {
            clearTimeout(timer);
        };
    }, [show]);

    return (
        <div className={cn(styles.chips, {
            [styles.error]: status === "error",
            [styles.show]: isVisible,
        })}>
            {message}
        </div>
    );
};
