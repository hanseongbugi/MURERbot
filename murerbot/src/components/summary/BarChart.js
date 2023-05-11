import ApexCharts from 'react-apexcharts';

const BarChart = (props) => {
    const { negativeVal, positiveVal } = props;
   

    return (
        <ApexCharts
        height={120}
        width={"98%"}
        type="bar"
        series= {[
            {
                name: '부정',
                data: [negativeVal],
                }, {
                name: '긍정',
                data: [positiveVal],
                },
        ]}
        options={{
            colors:['#E3465F', '#6BA694'],
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
    );

}

export default BarChart;