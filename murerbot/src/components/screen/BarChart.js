import ApexCharts from 'react-apexcharts';

const BarChart = (props) => {
    const { negativeVal, positiveVal } = props;
   

    return (
        <ApexCharts
        height={130}
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
            colors:['#F34C4C', '#5BE7A9'],
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
            tooltip: {
                enabled: false
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
                    opacity: 0.5
                },
            },
            yaxis:{
                show: false,
            },
            xaxis:{
                show:false,
                labels: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                }
            },
            
            fill:{
                opacity: 1
            },
            legend:{
                position: 'top',
                horizontalAlign: 'right',
            }         
        }}
    />
    );

}

export default BarChart;