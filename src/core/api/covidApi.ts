import {instance} from "./api";

export const covidApi = {
    getCovidData() {
        return instance.get(`covid19/casedistribution/json/`)
    },
}
