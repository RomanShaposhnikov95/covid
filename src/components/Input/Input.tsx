import React, { ChangeEvent }  from 'react';
import cn from "classnames";
import styles from "./Input.module.scss";
import {InputProps} from "./Input.props";

export const Input = React.memo(({error, onFocus, type = "text", title = '', placeholder = '', className, bg = 'white', text = "", getValue}: InputProps): JSX.Element => {

    const onChangeText = (e: ChangeEvent<HTMLInputElement>): void => {
        if (getValue) {
            getValue(e.target.value)
        }
    }

    return (
        <div className={cn(styles.inputWrap, className)}>
            {title !== '' && <span className={cn(styles.title)}>{title}</span>}
            <input
                className={cn(styles.input, {
                    [styles.white]: bg === 'white',
                    [styles.error]: error,
                })}
                type={type}
                placeholder={placeholder}
                onFocus={onFocus}
                onChange={onChangeText}
                value={text}
            />

        </div>
    );
});
