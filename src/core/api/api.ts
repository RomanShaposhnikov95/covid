import axios from "axios";

export const instance = axios.create({
    baseURL: "https://opendata.ecdc.europa.eu/",
    headers: {
        "Accept": "application/json",
    }
})
