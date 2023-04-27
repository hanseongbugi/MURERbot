import ApexCharts from 'react-apexcharts';

const BarChart = (props) => {
    const { negativeVal, positiveVal, propertyName } = props;
   

    return (
        <ApexCharts
        height={140}
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
            zoom: {
                enabled: false
                }
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
            xaxis:{
                categories: [propertyName],
            },
            
            fill:{
                opacity: 1
            },
            legend:{
            position: 'top',
            horizontalAlign: 'left',
            offsetX: 25,
            offsetY: 20
            }         
        }}
    />
    );

}

export default BarChart;