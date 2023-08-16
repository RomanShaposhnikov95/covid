import {CovidDataType, filterParamType, MetaDataType} from "../../core/store/covidStoreType";


export interface TablePageProps {
    loading: boolean;
    currentData: CovidDataType[],
    meta: MetaDataType,
    filterParam: filterParamType,
}
