import React, {useEffect, useState} from "react";
import "./App.css";
import {TablePage} from "./pages/TablePage/TablePage";
import {ChartPage} from "./pages/ChartPage/ChartPage";
import {Button, Chips, CustomDatePicker} from "./components";
import {CovidStore} from "./core/store/covidStore";
import {useObservable} from "./core/state";
import {GlobalStore} from "./core/store/globalStore";



const App = () => {
    const { currentData, meta, filterParam, chartData, country, chartCountry } = useObservable(CovidStore.store);
    const { message } = useObservable(GlobalStore.store);
    const { loading } = useObservable(GlobalStore.store);
    const [activeTab, setActiveTab] = useState('table');
    const handleTabChange = (tab: string) => setActiveTab(tab);

    useEffect(() => {
        CovidStore.service.getCovidData();
    },[]);


    return (
        <div className="container">
            <Chips status="error" message={message} show={message !== ""}/>
            <div className="wrapper">
                <CustomDatePicker filterParam={filterParam}/>
                <div className="tab-buttons">
                    <Button size="m" appearance={activeTab === 'table' ? 'ghost' : 'default'} event={() => handleTabChange('table')}>Таблица</Button>
                    <Button size="m" appearance={activeTab === 'chart' ? 'ghost' : 'default'} event={() => handleTabChange('chart')}>График</Button>
                </div>
            </div>
            { activeTab === "table" && <TablePage loading={loading} currentData={currentData} meta={meta} filterParam={filterParam}/> }
            { activeTab === "chart" && <ChartPage data={chartData} country={country} chartCountry={chartCountry}/> }
        </div>
    );
}

export default App;
