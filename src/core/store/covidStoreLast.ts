import {createStore} from "../state";
import {GlobalStore} from "./globalStore";
import {covidApi} from "../api/covidApi";


export interface MetaDataType {
    itemsPerPage: number;
    currentPage: number;
    totalPage: number
}

interface CovidDataType {
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

interface GroupedData {
    dateRep: string;
    cases: number;
    deaths: number;
}

interface CountryType {
    value: string,
    label: string
}

interface filterParamType {
    startDate: Date | null;
    endDate: Date | null;
    searchParam: string;
    key: keyof CovidDataType;
    valueFrom: number;
    valueTo: number;
    field: string;
    sortConfig: "ascend" | "descend";
}

interface FilteredCovidData extends CovidDataType {
    parsedDate: Date;
}

export interface CovidStoreTypes {
    data: CovidDataType[],
    chartData: any,
    currentData: CovidDataType[],
    meta: MetaDataType,
    filterParam: any, //filterParamType
    country: CountryType[],
    chartCountry: string
}

const initialState: CovidStoreTypes = {
    data: [],
    chartData: null,
    currentData: [],
    meta: {
        itemsPerPage: 20,
        currentPage: 1,
        totalPage: 1
    },
    filterParam: {
        startDate: null,
        endDate: null,
        searchParam: "",
        key: "cases",
        valueFrom: 0,
        valueTo: 0,
        field: "countriesAndTerritories",
        sortConfig: "ascend"
    },
    country: [],
    chartCountry: "all"
}



export const CovidStore = {
    store: createStore<CovidStoreTypes>(initialState),
    service: {
        getChartData: (arr: CovidDataType[]): GroupedData[] => {
            const arrTotal: GroupedData[] = [];
            const dateQtyMap: { [dateRep: string]: GroupedData } = {};

            for (const item of arr) {
                const { dateRep, cases, deaths } = item;
                if (dateQtyMap[dateRep]) {
                    dateQtyMap[dateRep].cases += cases;
                    dateQtyMap[dateRep].deaths += deaths;
                } else {
                    dateQtyMap[dateRep] = {
                        dateRep: item.dateRep,
                        cases: item.cases,
                        deaths: item.deaths
                    };
                }
            }

            for (const key in dateQtyMap) {
                arrTotal.push(dateQtyMap[key]);
            }

            return arrTotal.sort((a: GroupedData, b: GroupedData) => {
                const datePartsA = a.dateRep.split("/");
                const datePartsB = b.dateRep.split("/");

                const dateA = new Date(parseInt(datePartsA[2]), parseInt(datePartsA[1]) - 1, parseInt(datePartsA[0]));
                const dateB = new Date(parseInt(datePartsB[2]), parseInt(datePartsB[1]) - 1, parseInt(datePartsB[0]));

                return dateA.getTime() - dateB.getTime();
            });
        },

        displayData: (page: number, qty: number, arrData: CovidDataType[]) => {
            const startIndex = (page - 1) * qty;
            const endIndex = Math.min(startIndex + qty, arrData.length);
            return arrData.slice(startIndex, endIndex);
        },

        filterAllData: (keyVal: keyof CovidDataType, from: number, to: number, startDateData: Date, endDateData: Date, country: string, sortConfig: string, field: string): CovidDataType[] => {
            const rawData: CovidDataType[] = CovidStore.store.getState().data;

            const minCases = Math.min(...rawData.map(item => Number(item[keyVal])));
            const maxCases = Math.max(...rawData.map(item => Number(item[keyVal])));
            const valueFrom = from === 0 ? minCases : from;
            const valueTo = to === 0 ? maxCases : to;

            return CovidStore.service.filterChartData(country, startDateData, endDateData)
              .filter((item: CovidDataType) => Number(item[keyVal]) >= valueFrom && Number(item[keyVal]) <= valueTo)
              .sort((a: CovidDataType, b: CovidDataType) => {
                  const comparison = sortConfig === 'ascend' ? 1 : -1;
                  return a[field as keyof CovidDataType] < b[field as keyof CovidDataType] ? -comparison : comparison;
              });
        },

        filterChartData: (country: string, startDateData: Date, endDateData: Date) => {
            const rawData: CovidDataType[] = CovidStore.store.getState().data;
            const filteredArr: FilteredCovidData[] = [];

            const parsedStartDate = new Date(startDateData);
            const parsedEndDate = new Date(endDateData);
            parsedEndDate.setDate(parsedEndDate.getDate() + 1);

            rawData.forEach(item => {
                const parsedDate = new Date(item.dateRep.split('/').reverse().join('-'));

                if (item.countriesAndTerritories.includes(country)) {
                    filteredArr.push({
                        ...item,
                        parsedDate: parsedDate
                    });
                }
            });

            return filteredArr
              .filter(item => item.parsedDate >= parsedStartDate && item.parsedDate < parsedEndDate)
        },

        getInitialParam: (arr: CovidDataType[]): void => {
            const parseDate = (dateStr: string) => {
                return new Date(dateStr.split('/').reverse().join('-'));
            };
            const dates = arr.map(item => parseDate(item.dateRep));

            const dateToSting = (date: Date) => {
                const day = date.getDate();
                const month = date.getMonth() + 1;
                const year = date.getFullYear();

                return `${year}/${month}/${day}`
            }

            CovidStore.store.setState({
                ...CovidStore.store.getState(),
                currentData: CovidStore.service.displayData(1, CovidStore.store.getState().meta.itemsPerPage, arr),
                filterParam: {
                    ...CovidStore.store.getState().filterParam,
                    startDate: dateToSting(new Date(Math.min(...dates.map(date => date.getTime())))),
                    endDate: dateToSting(new Date(Math.max(...dates.map(date => date.getTime())))),
                },
                chartData: CovidStore.service.getChartData(arr),
                meta: {
                    ...CovidStore.store.getState().meta,
                    totalPage: Math.ceil(arr.length / CovidStore.store.getState().meta.itemsPerPage)
                }
            })
        },

        getCovidData: async (): Promise<void>  => {
            try {
                GlobalStore.service.loading(true);
                const response = await covidApi.getCovidData();
                const newRecord = (records: CovidDataType[]) => {
                    const totalDeathsByCountry: { [key: string]: number } = {};

                    for (const record of records) {
                        const country = record.countriesAndTerritories;
                        const deaths = record.deaths;
                        totalDeathsByCountry[country] = (totalDeathsByCountry[country] || 0) + deaths;
                    }

                    return records.map((record: CovidDataType) => ({
                        ...record,
                        totalDeath: totalDeathsByCountry[record.countriesAndTerritories],
                        totalDeathOn1000: totalDeathsByCountry[record.countriesAndTerritories] / 1000,
                        totalCasesOn1000: record.popData2019 / 1000
                    }))
                }

                if (response) {
                    await CovidStore.store.setState({
                        ...CovidStore.store.getState(),
                        data: newRecord(response.data.records),
                        country: response.data.records.reduce((acc: CountryType[], curr: CovidDataType) => {
                            const existingItem = acc.find(item => item.value === curr.countriesAndTerritories);
                            if (!existingItem) {
                                acc.push({ value: curr.countriesAndTerritories, label: curr.countriesAndTerritories });
                            }
                            return acc;
                        }, [{ value: "all", label: "all" }]),
                    })

                    await CovidStore.service.getInitialParam(newRecord(response.data.records))

                    await GlobalStore.service.loading(false);
                }

            } catch (error: any) {
                GlobalStore.service.errorStatus(error.response.data.error.message);
            }
        },

        changePage: (page: number) => {
            const state = CovidStore.store.getState().filterParam
            CovidStore.store.setState({
                ...CovidStore.store.getState(),
                currentData: CovidStore.service.displayData(
                    page,
                    CovidStore.store.getState().meta.itemsPerPage,
                    CovidStore.service.filterAllData(state.key, state.valueFrom, state.valueTo, state.startDate, state.endDate, state.searchParam, state.sortConfig, state.field)
                ),
                meta: {
                    ...CovidStore.store.getState().meta,
                    currentPage: page,
                }
            })
        },

        changePageLength: (qty: number) => {
            const state = CovidStore.store.getState().filterParam
            const sortArr = CovidStore.service.filterAllData(state.key, state.valueFrom, state.valueTo, state.startDate, state.endDate, state.searchParam, state.sortConfig, state.field)

            CovidStore.store.setState({
                ...CovidStore.store.getState(),
                currentData: CovidStore.service.displayData(
                    CovidStore.store.getState().meta.currentPage,
                    qty,
                    sortArr
                ),
                meta: {
                    ...CovidStore.store.getState().meta,
                    itemsPerPage: qty,
                    totalPage: Math.ceil(sortArr.length / qty)
                }
            })
        },

        searchCountry: (country: string) => {
            const state = CovidStore.store.getState().filterParam
            const sortArr = CovidStore.service.filterAllData(state.key, state.valueFrom, state.valueTo, state.startDate, state.endDate, country, state.sortConfig, state.field)
            CovidStore.store.setState({
                ...CovidStore.store.getState(),
                currentData: CovidStore.service.displayData(
                    1,
                    CovidStore.store.getState().meta.itemsPerPage,
                    sortArr
                ),
                filterParam: {
                    ...CovidStore.store.getState().filterParam,
                    searchParam: country
                },
                meta: {
                    ...CovidStore.store.getState().meta,
                    currentPage: 1,
                    totalPage: Math.ceil(sortArr.length / CovidStore.store.getState().meta.itemsPerPage)
                }
            })
        },

        filterData: (key: string, from: number, to: number) => {
            const state = CovidStore.store.getState().filterParam
            const sortArr = CovidStore.service.filterAllData(key as keyof CovidDataType, from, to, state.startDate, state.endDate, state.searchParam, state.sortConfig, state.field)

            CovidStore.store.setState({
                ...CovidStore.store.getState(),
                currentData: CovidStore.service.displayData(
                  1,
                  CovidStore.store.getState().meta.itemsPerPage,
                  sortArr
                ),
                filterParam: {
                    ...CovidStore.store.getState().filterParam,
                    key: key,
                    valueFrom: from,
                    valueTo: to
                },
                meta: {
                    ...CovidStore.store.getState().meta,
                    currentPage: 1,
                    totalPage: Math.ceil(sortArr.length / CovidStore.store.getState().meta.itemsPerPage)
                }
            })
        },

        sortData: (sortConfig: string, key: string) => {
            const state = CovidStore.store.getState().filterParam
            const sortArr = CovidStore.service.filterAllData(state.key, state.valueFrom, state.valueTo, state.startDate, state.endDate, state.searchParam, sortConfig, key)
            CovidStore.store.setState({
                ...CovidStore.store.getState(),
                currentData: CovidStore.service.displayData(1, CovidStore.store.getState().meta.itemsPerPage, sortArr),
                filterParam: {
                  ... CovidStore.store.getState().filterParam,
                    field: key,
                    sortConfig: sortConfig
                },
                meta: {
                    ...CovidStore.store.getState().meta,
                    currentPage: 1,
                    totalPage: Math.ceil(sortArr.length / CovidStore.store.getState().meta.itemsPerPage)
                }
            })
        },

        filterDataByDate:(startDateData: Date, endDateData: Date) => {
            const state = CovidStore.store.getState().filterParam
            const sortArr = CovidStore.service.filterAllData(state.key, state.valueFrom, state.valueTo, startDateData, endDateData, state.searchParam, state.sortConfig, state.field)
            CovidStore.store.setState({
                ...CovidStore.store.getState(),
                currentData: CovidStore.service.displayData(
                    1,
                    CovidStore.store.getState().meta.itemsPerPage,
                    sortArr
                ),
                chartData: CovidStore.service.getChartData(
                  CovidStore.service.filterChartData(
                    CovidStore.store.getState().chartCountry,
                    startDateData,
                    endDateData
                  )
                ),
                filterParam: {
                    ...CovidStore.store.getState().filterParam,
                    startDate: startDateData,
                    endDate: endDateData,
                },

                meta: {
                    ...CovidStore.store.getState().meta,
                    currentPage: 1,
                    totalPage: Math.ceil(sortArr.length / CovidStore.store.getState().meta.itemsPerPage)
                }
            })
        }, // type +

        filterChartByCountry: (country: string) => {
            CovidStore.store.setState({
                ...CovidStore.store.getState(),
                chartData: CovidStore.service.getChartData(
                  CovidStore.service.filterChartData(
                    country === "all" ? "" : country,
                    CovidStore.store.getState().filterParam.startDate,
                    CovidStore.store.getState().filterParam.endDate
                  )
                ),
                chartCountry: country
            })

        },

        resetFilter: () => {
            CovidStore.store.setState({
                ...CovidStore.store.getState(),
                filterParam: {
                    searchParam: "",
                    key: "cases",
                    valueFrom: 0,
                    valueTo: 0,

                    field: "countriesAndTerritories",
                    sortConfig: "ascend"
                },
                chartCountry: "all"
            })

            CovidStore.service.getInitialParam(CovidStore.store.getState().data)
        },
    }
}
