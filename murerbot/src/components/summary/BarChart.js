import ApexCharts from 'react-apexcharts';

const BarChart = (props) => {
    const { barData } = props;


    return (
        <ApexCharts
        height={300}
        width={"97%"}
        type="bar"
        series={barData}
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
            // yaxis:{
            //     show: false,
            //     axisTicks: {
            //         show: false
            //     }
            // },
            xaxis:{
                categories: ['디자인', '무게', '성능', '소음', '크기', '만족도'],
                // show:false,
                labels: {
                    show: false,
                    style: {
                        colors: [],
                        fontSize: '16px',
                        fontFamily: 'Spoqa-regular',
                        fontWeight: 400,
                        cssClass: 'apexcharts-xaxis-label',
                    },
                },
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
    );

}

export default BarChart;