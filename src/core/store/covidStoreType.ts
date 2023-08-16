export interface MetaDataType {
    itemsPerPage: number;
    currentPage: number;
    totalPage: number
}

export interface CovidDataType {
    dateRep: string;
    day: string;
    month: string;
    year: string;
    cases: number;
    deaths: number;
    countriesAndTerritories: string;
    geoId: string;
    countryterritoryCode: string;
    popData2019: number;
    continentExp: string;
    Cumulative_number_for_14_days_of_COVID19_cases_per_100000: string;
    totalDeath: number;
    totalDeathOn1000: number;
    totalCasesOn1000: number;
}

export interface GroupedData {
    dateRep: string;
    cases: number;
    deaths: number;
}

export interface CountryType {
    value: string,
    label: string
}

export interface filterParamType {
    startDate: Date | null;
    endDate: Date | null;
    searchParam: string;
    key: keyof CovidDataType;
    valueFrom: string;
    valueTo: string;
    field: string;
    sortConfig: "ascend" | "descend";
}

export interface FilteredCovidData extends CovidDataType {
    parsedDate: Date;
}

export interface CovidStoreTypes {
    data: CovidDataType[],
    chartData: any,
    currentData: CovidDataType[],
    meta: MetaDataType,
    filterParam: filterParamType,
    country: CountryType[],
    chartCountry: string
}
