import React, {useCallback, useEffect, useState} from "react";
import cn from "classnames";
import styles from "./ChartPage.module.scss";
import {ChartPageProps} from "./ChartPage.props";
import {Line, LineChart, ResponsiveContainer, XAxis, YAxis} from "recharts";
import Select from "react-select";
import {OptionType} from "../TablePage/TablePage";
import {CovidStore} from "../../core/store/covidStore";


export const ChartPage = React.memo(({ data, country, chartCountry }: ChartPageProps): JSX.Element => {
    const [selectedOption, setSelectedOption] = useState<OptionType | null>();

    useEffect(() => {
      setSelectedOption({value: chartCountry, label: chartCountry});
    },[chartCountry]);

    const handleChangeQty = useCallback((option: OptionType | null) => {
        setSelectedOption(option);

        CovidStore.service.filterChartByCountry(option?.value||"all");
    },[CovidStore.service]);

    return (
        <div className={cn(styles.wrap)}>
            <Select
                className={cn(styles.select)}
                placeholder={"Выбрать страну"}
                theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                        ...theme.colors,
                        primary25: `var(--gold)`,
                        primary: `var(--gold)`,
                    },
                })}
                options={country}
                value={selectedOption}
                onChange={handleChangeQty}
            />
            <ResponsiveContainer className={cn(styles.responsiveContainer)}>
                <LineChart data={data}>
                    <XAxis dataKey="dateRep"/>
                    <YAxis/>
                    <Line type="monotone" dataKey="cases" stroke="yellow" />
                    <Line type="monotone" dataKey="deaths" stroke="red" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
});


