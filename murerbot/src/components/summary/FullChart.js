import ApexCharts from 'react-apexcharts';
import React from "react";


const FullChart = ({fullData}) => {
    return (
        <ApexCharts
            height={130}
            width={"97%"}
            type="bar"
            series={fullData}
            options={{
                colors:['#6BA694', '#E3465F'],
                chart:{
                    stacked: true,
                    stackType: '100%',
                    toolbar: {
                        show:false,
                    },
                    background: "transparent",
                zoom: {
                    enabled: false
                    }
                },
                states: {
                    hover: {
                        filter: {
                            type: 'none'
                        }
                    },
                    active: {
                        allowMultipleDataPointsSelection: false,
                        filter: {
                            type: 'none'
                        }
                    }
                },
                tooltip: {
                    enabled: false,  
                },
                plotOptions:{
                    bar: {
                        horizontal: true,
                    },
                },
                stroke:{
                    width: 1,
                    colors: ['#fff']
                },
                grid: {
                    row: {
                        colors: ['#f7f7f7', 'transparent'], // takes an array which will be repeated on columns
                        opacity: 1
                    },
                },
                yaxis:{
                    show: false,
                    axisTicks: {
                        show: false
                    }
                },
                xaxis:{
                    show:false,
                    labels: {
                        show: false,
                    },
                    axisTicks: {
                        show: true
                    }
                },
                
                fill:{
                    opacity: 1
                },
                legend:{
                    position: 'bottom',
                    fontSize: '12px',
                    horizontalAlign: 'right',
                    onItemClick: {
                        toggleDataSeries: false
                    },
                    onItemHover: {
                        highlightDataSeries: false
                    },
                }         
            }}
        />
    )
}

export default FullChart;