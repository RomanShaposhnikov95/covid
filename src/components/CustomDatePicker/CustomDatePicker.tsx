import React, {ForwardedRef, forwardRef, useEffect, useState} from "react";
import cn from "classnames";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./CustomDatePicker.module.scss";
import "./CustomDatePicker.scss";
import {CustomDatePickerProps} from "./CustomDatePicker.props";
import DatePicker from "react-datepicker";
import {Button} from "../Button/Button";
import {P} from "../P/P";
import {CovidStore} from "../../core/store/covidStore";


export const CustomDatePicker = React.memo(({filterParam}: CustomDatePickerProps): JSX.Element => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    useEffect(() => {
        setStartDate(filterParam.startDate)
        setEndDate(filterParam.endDate)
    },[filterParam.startDate, filterParam.endDate]);

    const CustomInput = forwardRef(
        ({ value, onClick } : { value?: string, onClick?: () => void }, ref: ForwardedRef<HTMLButtonElement>) => (
          <Button size="s" event={onClick} appearance="ghost" ref={ref}>
              {value}
          </Button>
        )
    );


    const getStartDate = (date: Date) => {
        setStartDate(date as Date)
        if (endDate !== null) {
            CovidStore.service.filterDataByDate(date, endDate)
        }

    };
    const getEndDate = (date: Date) => {
        setEndDate(date as Date)
        if (startDate !== null) {
            CovidStore.service.filterDataByDate(startDate, date)
        }
    };

    return (
    <div className={cn(styles.datePicker)}>
        <P>Период от</P>
        <DatePicker
            dateFormat="dd/MM/yyyy"
            customInput={<CustomInput />}
            selected={startDate}
            onChange={getStartDate}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            withPortal
            showYearDropdown
            yearDropdownItemNumber={4}
            calendarClassName="calendar"
        />
        <P>до</P>
        <DatePicker
            dateFormat="dd/MM/yyyy"
            customInput={<CustomInput />}
            selected={endDate}
            onChange={getEndDate}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            withPortal
            showYearDropdown
            yearDropdownItemNumber={4}
            calendarClassName="calendar"
        />
    </div>
    );
});

