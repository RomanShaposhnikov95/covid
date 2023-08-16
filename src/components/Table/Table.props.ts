import {CovidDataType} from "../../core/store/covidStoreType";

export interface TableProps {
    loading?: boolean,
    columns: DataItem[],
    data: CovidDataType[]
};

export interface DataItem {
    id: number;
    title: string;
    data: string;
    sorter: boolean;
};
