import cn from "classnames";
import styles from "./Pagination.module.scss";
import React, {useCallback} from "react";
import {PaginationProps} from "./Pagination.props";
import {ArrowLeftOutlined, ArrowRightOutlined} from "@ant-design/icons";



export const Pagination = React.memo(({className, value, onChange, range, path,  ...props }: PaginationProps): JSX.Element => {
    const pattern: Array<number | string> = React.useMemo(() => {
        if (range < 7) {
            return [...new Array(range)].map((_, i) => i + 1);
        } else if (value < 4) {
            return [1, 2, 3, 4, 5, '...', range];
        } else if (value > range - 4) {
            return [1, '...', range - 4, range - 3, range - 2, range - 1, range];
        } else {
            return [1, '...', value - 1, value, value + 1, '...', range];
        }
    }, [range, value]);

    const changeNumber = useCallback((n: number) => {
        if (n > 0 && n <= range) {
            onChange(n);
        }
    }, [onChange, range]);

    return (
        <div className={cn(className, styles.pagination)}>
            <button
                disabled={value <= 1}
                onClick={() => changeNumber(value - 1)}
                className={cn(styles.pageNum, {
                    [styles.disabled]: value <= 1,
                })}
            >
                <ArrowLeftOutlined />
            </button>
            {pattern.map((label, index) => (
                <React.Fragment key={index}>
                    {label === '...' ? (
                        <span className={cn(styles.dots)}>{label}</span>
                    ) : (
                        <button
                            className={cn(styles.pageNum, {
                                [styles.pageNumActive]: value === label,
                            })}
                            onClick={() => changeNumber(label as number)}
                        >
                            {label}
                        </button>
                    )}
                </React.Fragment>
            ))}
            <button
                disabled={value >= range}
                onClick={() => changeNumber(value + 1)}
                className={cn(styles.pageNum, {
                    [styles.disabled]: value >= range,
                })}
            >
                <ArrowRightOutlined />
            </button>
        </div>
    );
})
