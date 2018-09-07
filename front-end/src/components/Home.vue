<template>
    <div>
        <div class="container-fluid">
            <div class="row text-center">
                <div class="col-xs-12 col-lg-4 col-lg-offset-4">
                    <img src="../assets/nu.gif" width="500" height="200">
                </div>
                
                <div class="col-xs-12 col-sm-12 col-md-12  col-lg-12">
                    
                    <!-- Panel div start -->
                    <div class="panel panel-primary">
                        <div class="panel-heading">
                            <h3 class="panel-title">ECG</h3>
                        </div>
                        <div class="panel-body">
                            <!-- Chart container -->
                            <div id="chart_container" >
                                <div id="y_axis"></div>
                                <div id="demo_chart" ref="panel"></div>
                            </div>
                            <!-- End of chart container -->
                        </div>
                    </div>
                </div>
            </div>
            <!-- End of footer -->
        </div>
    </div>
</template>

<script>
    import io from 'socket.io-client'
    import Rickshaw from 'rickshaw'
    import 'rickshaw/rickshaw.min.css'
    import 'bootstrap/dist/css/bootstrap.css'
    var socket = io.connect("http://localhost:3000");
    var magnitudeChart;
    var magnitudeChart2;

    export default {
        name: 'home',
        data() {
            return {
                messageSeries: [],
                renderEveryNth: 5,
                updateInterval: 20,
                streamFrequency: 50,
                connStatus: "Disconnected",
                messageIndex: 0,
                displayedValues: [],
                dvColors: {
                    v1: "#cb503a",
                    v2: "#72c039",
                    v3: "#65b9ac"
                }
            }
        },
        mounted() {
            this.initChart();
            this.openSocketListeners();
            // setInterval(this.thistest, 100);
        },
        watch: {
            renderEveryNth: function() {
                this.messageSeries = [];
                this.messageIndex = 0;
            }
        },
        methods: {
            /* Rickshaw.js initialization */
            thistest(){
                var x = []
                for(let i =0; i < 50; i++) {
                    x.push(i* 100)
                }
                for (let i = 0; i < 10; i++) {
                    let tmpData = {
                        one: Math.floor(Math.random() * 350) + 1000
                    };
                    magnitudeChart.series.addData(tmpData);
                }
                magnitudeChart.render();                

            },
            initChart() {
                magnitudeChart = new Rickshaw.Graph({
                    element: document.querySelector("#demo_chart"),
                    width: "500",
                    height: "180",
                    renderer: "line",
                    min: 228,
                    max: 16000,
                    series: new Rickshaw.Series.FixedDuration([{
                        name: 'v1',
                        color: '#EC644B'
                    }], undefined, {
                        timeInterval: this.updateInterval,
                        maxDataPoints: 500
                    })
                });
                var y_axis = new Rickshaw.Graph.Axis.Y({
                    graph: magnitudeChart,
                    orientation: 'left',
                    tickFormat: function(y) {
                        return y.toFixed(1);
                    },
                    ticks: 5,
                    element: document.getElementById('y_axis'),
                });

                this.resizeChart(magnitudeChart);

                window.addEventListener('resize', () => {
                    this.resizeChart(magnitudeChart)
                });

            },
            resizeChart(chart) {
                chart.configure({
                    width: this.$refs.panel.clientWidth,
                });
                chart.render();
            },
            /* Insert received datapoints into the chart */
            openSocketListeners() {
                socket.on('connect', () => {
                    this.connStatus = "Connected";
                });

                socket.on('disconnect', () => {
                    this.connStatus = "Disconnected";
                });

                /* Update chart after every #renderEveryNth message */
                socket.on('voltageData', (message) => {
                    // console.log(message)
                    for (var i = 0; i < 5; i++) {
                        let tmpData = {
                            one: message[i*10]
                        };
                        magnitudeChart.series.addData(tmpData);
                    }
                    magnitudeChart.render();

                });
            }
        }
    }

</script>

<style scoped>
    #chart_container {
        padding-right: 40px;
        padding-bottom: 20px;
        margin-top: 20px;
        position: relative;
    }
    
    #demo_chart {
        position: relative;
        left: 40px;
    }
    
    #y_axis {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 40px;
    }
    
    .footy {
        position: relative;
        width: 100%;
        margin-top: 50px;
        height: 60px;
        opacity: 0.2;
    }
    
    .glyphicon {
        color: #8E44AD;
        font-weight: bold;
    }

</style>
