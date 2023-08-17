import React, {useCallback, useEffect, useState} from "react";
import cn from "classnames";
import styles from "./TablePage.module.scss";
import {TablePageProps} from "./TablePage.props";
import {Button, Input, Pagination, Table} from "../../components";
import {FilterOutlined, SearchOutlined} from "@ant-design/icons";
import Select from "react-select";
import {CovidStore} from "../../core/store/covidStore";
import {CovidDataType} from "../../core/store/covidStoreType";
import {DataItem} from "../../components/Table/Table.props";


export interface OptionType {
    value: string;
    label: string;
};

export const TablePage = React.memo(({currentData, meta, loading, filterParam}: TablePageProps): JSX.Element => {
    const columns: DataItem[] = [
        {
            id: 1,
            title: "Страна",
            data: "countriesAndTerritories",
            sorter: true
        },
        {
            id: 2,
            title: "Кол-во случаев",
            data: "cases",
            sorter: true
        },
        {
            id: 3,
            title: "Кол-во смертей",
            data: "deaths",
            sorter: true
        },
        {
            id: 4,
            title: "Кол-во случаев всего",
            data: "popData2019",
            sorter: true
        },
        {
            id: 5,
            title: "Кол-во смертей всего",
            data: "totalDeath",
            sorter: true
        },
        {
            id: 6,
            title: "Кол-во случаев на 1000 жителей",
            data: "totalCasesOn1000",
            sorter: true
        },
        {
            id: 7,
            title: "Кол-во смертей на 1000 жителей",
            data: "totalDeathOn1000",
            sorter: true
        },
    ];
    const options = columns
      .filter((column: DataItem) => column.data !== "countriesAndTerritories")
      .map(column => ({
        value: column.data,
        label: column.title
    }));
    const qty = [
        { value: '5', label: '5' },
        { value: '10', label: '10' },
        { value: '20', label: '20' }
    ];
    const [show, setShow] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<OptionType | null>({value: String(meta.itemsPerPage), label: String(meta.itemsPerPage)});
    const [searchValue, setSearchValue] = useState<string>("");
    const [selectedFieldOption, setSelectedFieldOption] = useState<OptionType | null>(null);
    const [fromValue, setFromValue] = useState<string>("");
    const [toValue, setToValue] = useState<string>("");
    const [error, setError] = useState(false);

    useEffect(() => {
        setFromValue(filterParam.valueFrom);
        setToValue(filterParam.valueTo);
        setSearchValue(filterParam.searchParam);
        setSelectedFieldOption({value: filterParam.key, label: filterParam.key});
    },[filterParam]);

    const handleChangeQty = useCallback((option: OptionType | null) => {
        setSelectedOption(option);
        CovidStore.service.changePageLength(Number(option?.value||20));
    },[CovidStore.service]);
    const handleChangeField = useCallback((option: OptionType | null) => {
        setSelectedFieldOption(option);
        if (option !== null) {
            CovidStore.service.filterData(option.value as keyof CovidDataType, fromValue, toValue);
        };
    },[CovidStore.service, fromValue, toValue]);
    const handleChangeFrom = useCallback((value: string) => {
        setFromValue(value);
        validation(value);

        if (selectedFieldOption !== null) {
            CovidStore.service.filterData(selectedFieldOption.value as keyof CovidDataType, value, toValue);
        };
    },[CovidStore.service, selectedFieldOption, toValue]);
    const handleChangeTo = useCallback((value: string) => {
        setToValue(value);
        validation(value);

        if (selectedFieldOption !== null) {
            CovidStore.service.filterData(selectedFieldOption.value as keyof CovidDataType, fromValue, value);
        };
    },[CovidStore.service, selectedFieldOption, fromValue]);
    const searchSubmit = useCallback(() => {
        CovidStore.service.searchCountry(searchValue);
    },[CovidStore.service, searchValue]);
    const validation = useCallback((value: string) => {
        const containsSpecialCharacters = /[^\d]+/.test(value);
        if (containsSpecialCharacters) {
            setError(true);
        } else {
            setError(false);
        };
    },[]);
    const resetForm = useCallback(() => {
        setShow(false);
        CovidStore.service.resetFilter();
    },[CovidStore.service]);

    return (
        <div className={cn(styles.wrap)}>
            <div onClick={() => setShow(!show)} className={cn(styles.overlay, {
                [styles.show]: show,
            })}> </div>
            <Button event={() => setShow(!show)} appearance="ghost"><FilterOutlined /></Button>
            <div className={cn(styles.wrap_filter, {
                [styles.show]: show,
            })}>
                <div className={cn(styles.search)}>
                    <Input placeholder="Поиск страны" text={searchValue} getValue={setSearchValue}/>
                    <Button event={searchSubmit}><SearchOutlined /></Button>
                </div>
                <Select
                    className={cn(styles.select)}
                    placeholder={"Фильтровать по полю"}
                    theme={(theme) => ({
                        ...theme,
                        borderRadius: 0,
                        colors: {
                            ...theme.colors,
                            primary25: `var(--gold)`,
                            primary: `var(--gold)`,
                        },
                    })}
                    options={options}
                    value={selectedFieldOption}
                    onChange={handleChangeField}
                />
                <Input error={error} type="string" title="Значение от" text={fromValue} getValue={handleChangeFrom}/>
                <Input error={error} type="string" title="Значение до" text={toValue} getValue={handleChangeTo}/>
                <Button event={resetForm} size="l">Сбросить фильтры</Button>
            </div>

            <Table data={currentData} columns={columns} loading={loading}/>

            <div className={cn(styles.wrap_footer)}>
                <Select
                    className={cn(styles.select)}
                    placeholder={"10"}
                    theme={(theme) => ({
                        ...theme,
                        borderRadius: 0,
                        colors: {
                            ...theme.colors,
                            primary25: `var(--gold)`,
                            primary: `var(--gold)`,
                        },
                    })}
                    options={qty}
                    value={selectedOption}
                    onChange={handleChangeQty}
                />
                <Pagination
                    value={meta.currentPage}
                    onChange={CovidStore.service.changePage}
                    range={meta.totalPage}
                />
            </div>
        </div>
    );
});
