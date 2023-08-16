import React, {useCallback, useState} from "react";
import cn from "classnames";
import styles from "./Table.module.scss";
import {TableProps} from "./Table.props";
import {CaretDownOutlined, CaretUpOutlined} from "@ant-design/icons";
import {CovidStore} from "../../core/store/covidStore";
import {P} from "../P/P";
import Loader from "../Loader/Loader";
import {CovidDataType} from "../../core/store/covidStoreType";

export const Table = React.memo(({data, columns, loading}: TableProps): JSX.Element => {
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });

    const requestSort = useCallback((key: string) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'ascend' ? 'descend' : 'ascend';
        CovidStore.service.sortData(direction, key);
        setSortConfig({ key, direction });
    },[sortConfig]);

    return (
        <div className={cn(styles.wrap)}>
            <table className={cn(styles.table)}>
                <thead>
                    <tr>
                        {
                            columns.map(column => (
                                <th key={column.id}>
                                    <span className={cn(styles.wrap)}>
                                        {column.title}
                                        {
                                            column.sorter && <button onClick={() => requestSort(column.data)} className={cn(styles.sort)}>
                                                <CaretUpOutlined />
                                                <CaretDownOutlined />
                                            </button>
                                        }
                                    </span>
                                </th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        data && data.length > 0
                        ? data.map((item, index) => (
                            <tr key={index}>
                                {columns.map(column => (
                                    <td key={column.id}>{item[column.data as keyof CovidDataType]?? '-'}</td>
                                ))}
                            </tr>
                        ))
                        : <tr><td className={cn(styles.empty)} colSpan={columns.length}><P>Нет данных</P></td></tr>
                    }
                </tbody>
            </table>

            {loading && <Loader fixed={true}/>}
        </div>
    );
});

