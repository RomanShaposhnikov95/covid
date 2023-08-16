import {CountryType, CovidDataType} from "../../core/store/covidStoreType";


export interface ChartPageProps {
    country: CountryType[],
    data: CovidDataType[],
    chartCountry: string
}
