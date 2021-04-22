
// -------------------------------------------------------------------------//
// Open Modal Panel - Use in DataTable //
function openModalPanel(panelName) {
    //Open Modal Form/Panel
    jQuery.magnificPopup.open({
        removalDelay: 500, //delay removal by X to allow out-animation,
        items: { src: panelName },
        callbacks: {
            beforeOpen: function (e) {
                var Animation = "mfp-zoomIn";
                this.st.mainClass = Animation;
            },
            afterClose: function () {
            }
        },
        midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
    })
}

function playnow() {
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', mp3notify);
    //audioElement.setAttribute('autoplay', 'autoplay');
    audioElement.load();
    audioElement.play();
    //$.get();
}

function loadSummerNote() {
    // Init Summernote
    $('.summernote').summernote({
        height: 255, //set editable area's height
        focus: false, //set focus editable area after Initialize summernote
        oninit: function () { },
        onChange: function (contents, $editable) {
         //   console.log(contents);
            angular.element(document.getElementById('ctrlMinutesSetup')).scope().ctrl.onSaveMeetingNote(contents);
        },
        toolbar: [
   // [groupName, [list of button]]
   ['style', ['bold', 'italic', 'underline', 'clear']],
   ['fontsize', ['fontsize']],
   ['color', ['color']],
   ['para', ['ul', 'ol', 'paragraph']],
   ['height', ['height']]
        ]
    });
}

// Circle Graphs Demo
var demoCircleGraphs = function () {
    var infoCircle = $('.info-circle');
    if (infoCircle.length) {
        // Color Library we used to grab a random color
        var colors = {
            "primary": [bgPrimary, bgPrimaryLr,
                bgPrimaryDr
            ],
            "info": [bgInfo, bgInfoLr, bgInfoDr],
            "warning": [bgWarning, bgWarningLr,
                bgWarningDr
            ],
            "success": [bgSuccess, bgSuccessLr,
                bgSuccessDr
            ],
            "alert": [bgAlert, bgAlertLr, bgAlertDr]
        };
        // Store all circles
        var circles = [];
        infoCircle.each(function (i, e) {
            // Define default color
            var color = ['#DDD', bgPrimary];
            // Modify color if user has defined one
            var targetColor = $(e).data(
                'circle-color');
            if (targetColor) {
                var color = ['#DDD', colors[
                    targetColor][0]]
            }
            // Create all circles
            var circle = Circles.create({
                id: $(e).attr('id'),
                value: $(e).attr('value'),
                radius: $(e).width() / 2,
                width: 14,
                colors: color,
                text: function (value) {
                    var title = $(e).attr('title');
                    if (title) {
                        return '<h2 class="circle-text-value">' + value + '</h2><p>' + title + '</p>'
                    }
                    else {
                        return '<h2 class="circle-text-value mb5">' + value + '</h2>'
                    }
                }
            });
            circles.push(circle);
        });

        // Add debounced responsive functionality
        var rescale = function () {
            infoCircle.each(function (i, e) {
                var getWidth = $(e).width() / 2;
                circles[i].updateRadius(
                    getWidth);
            });
            setTimeout(function () {
                // Add responsive font sizing functionality
                $('.info-circle').find('.circle-text-value').fitText(0.4);
            }, 50);
        }
        var lazyLayout = _.debounce(rescale, 300);
        $(window).resize(lazyLayout);

    }

} // End Circle Graphs Demo


function loadSummerNoteReadOnly() {
    // Init Summernote
    $('.summernote').summernote({
        height: 255, //set editable area's height
        focus: false, //set focus editable area after Initialize summernote
        oninit: function () { },
        onChange: function (contents, $editable) {
           
        },
        toolbar: [
   // [groupName, [list of button]]
   //['style', ['bold', 'italic', 'underline', 'clear']],
   //['fontsize', ['fontsize']],
   //['color', ['color']],
   //['para', ['ul', 'ol', 'paragraph']],
   //['height', ['height']]
        ]
    });
}

// -------------------------------------------------------------------------//
// Usage for spin.js
var opts = {
    lines: 11, // The number of lines to draw
    length: 11, // The length of each line
    width: 4, // The line thickness
    radius: 11, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#000', // #rgb or #rrggbb or array of colors
    speed: 1, // Rounds per second
    trail: 46, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: '50%', // Top position relative to parent
    left: '50%' // Left position relative to parent
};
var spinnerTarget = document.getElementById('spinnerTarget');

// example email compose success notification

function filterCompareJson(obj1, obj2) {
    if (JSON.stringify(obj1) == JSON.stringify(obj2)) {
        return false;
    } else {
        return true;
    }
}

function convertNulltoEmpty(stringParam) {
    if (stringParam == null || stringParam == undefined)  {
        return "";
    } else {
        return stringParam;
    }

}

function initReponse() {
    // Init custom navigation animation
    setTimeout(function () {
        $('.custom-nav-animation li').each(function (i, e) {
            var This = $(this);
            var timer = setTimeout(function () {
                This.addClass('animated animated-short zoomIn');
            }, 50 * i);
        });
    }, 500);

    // Init Demo smoothscroll
    $('.tray-nav a').smoothScroll({
        offset: -145
    });

   
    
}

function runAdminPannel() {
    // Init Admin Panels on widgets inside the ".admin-panels" container
    $('.admin-panels').adminpanel({
        grid: '.admin-grid',
        draggable: true,
        preserveGrid: true,
        mobile: false,
        callback: function () {
            bootbox.confirm('<h3>A Custom Callback!</h3>', function () { });
        },
        onFinish: function () {
            $('.admin-panels').addClass('animated fadeIn').removeClass('fade-onload');

            // Init the rest of the plugins now that the panels
            // have had a chance to be moved and organized.
            // It's less taxing to organize empty panels
           // demoHighCharts.init();
           // runVectorMaps();

            // We also refresh any "in-view" waypoints to ensure
            // the correct position is being calculated after the 
            // Admin Panels plugin moved everything
            Waypoint.refreshAll();

        },
        onSave: function () {
            $(window).trigger('resize');
        }
    });
}

function runDashboard(data) {
    // Init Admin Panels on widgets inside the ".admin-panels" container
    var option = { remove: false };
 
   $('.admin-panels').adminpanel({
        grid: '.admin-grid',
        draggable: false,
        preserveGrid: false,
        mobile: false,
        callback: function () {
            bootbox.confirm('<h3>A Custom Callback!</h3>', function () { });
        },
        onFinish: function () {
            $('.admin-panels').addClass('animated fadeIn').removeClass('fade-onload');

            // Init the rest of the plugins now that the panels
            // have had a chance to be moved and organized.
            // It's less taxing to organize empty panels
            fillDashboard1(data[0].data);

            var areaLuzon=$.grep(data[1].data, function( n, i ) {
                return n.area==='LUZON';
            });

            var areaVisayas = $.grep(data[1].data, function (n, i) {
                return n.area === 'VISAYAS';
            });

            var areaMindanao = $.grep(data[1].data, function (n, i) {
                return n.area === 'MINDANAO';
            });

            fillDashboardAreaLuzon(areaLuzon);
            fillDashboardAreaVisayas(areaVisayas);
            fillDashboardAreaMindanao(areaMindanao);
            fillDashboardAreaBranch(data[2].data);
            // runVectorMaps();

            // We also refresh any "in-view" waypoints to ensure
            // the correct position is being calculated after the 
            // Admin Panels plugin moved everything
            Waypoint.refreshAll();

        },
        onSave: function () {
            $(window).trigger('resize');
        }

     
    });

   $(".panel-control-remove").remove();
   $(".panel-control-title").remove();
    //$('.admin-panels').methods.createControls(option);
}

function uploadFile(issueId) {
    $('input[type=text]').click(function () {
        $('input[type=file]').trigger('click');
    });

    $('input[type=file]').change(function () {
        var vals = $(this).val(),
            val = vals.length ? vals.split('\\').pop() : '';

        $('input[type=text]').val(val);
    });
}

function fillDashboard1(data) {

    var categories = [];
    var series = [];
    var openseries = [];
    var closeseries = [];
    var fspercentage = 0;
    var fcpercentage = 0;
    var fdpercentage = 0;
    for (var x in data) {
        categories.push(data[x].sbu);
        openseries.push(data[x].openpaf);
        closeseries.push(data[x].closepaf);

        //circle formula
        if (data[x].sbu === "FS") {
            fspercentage = (data[x].closepaf / (data[x].openpaf + data[x].closepaf)) * 100;
        } else if (data[x].sbu === "FC") {
            fcpercentage = (data[x].closepaf / (data[x].openpaf + data[x].closepaf)) * 100;
        } else if (data[x].sbu === "FC") {
            fdpercentage = (data[x].closepaf / (data[x].openpaf + data[x].closepaf)) * 100;
        }
    }

    series.push({ name: 'CLOSE', data: closeseries });
    series.push({ name: 'OPEN', data: openseries });
 
    $('#c1').attr('value', fcpercentage);
    $('#c2').attr('value', fspercentage);
    $('#c3').attr('value', fdpercentage);

    demoCircleGraphs();

    $('#dash1').highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: categories
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
        legend: {
            reversed: true
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        series: series
    });
}

function fillDashboardAreaLuzon(data) {

    var categories = [];
    var series = [];
    var openseries = [];
    var closeseries = [];
    for (var x in data) {
        categories.push(data[x].sbu);
        openseries.push(data[x].openpaf);
        closeseries.push(data[x].closepaf);
    }
    series.push({ name: 'CLOSE', data: closeseries });
    series.push({ name: 'OPEN', data: openseries });


    $('#dash2').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: categories
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
        legend: {
            reversed: true
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        series: series
    });
}

function fillDashboardAreaVisayas(data) {

    var categories = [];
    var series = [];
    var openseries = [];
    var closeseries = [];
    for (var x in data) {
        categories.push(data[x].sbu);
        openseries.push(data[x].openpaf);
        closeseries.push(data[x].closepaf);
    }
    series.push({ name: 'CLOSE', data: closeseries });
    series.push({ name: 'OPEN', data: openseries });


    $('#dash3').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: categories
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
        legend: {
            reversed: true
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        series: series
    });
}

function fillDashboardAreaBranch(data) {

    var categories = [];
    var series = [];
    var openseries = [];
    var closeseries = [];
    for (var x in data) {
        categories.push(data[x].sbu);
        openseries.push(data[x].openpaf);
        closeseries.push(data[x].closepaf);
    }
    series.push({ name: 'CLOSE', data: closeseries });
    series.push({ name: 'OPEN', data: openseries });


    $('#dash5').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: data.branch
        },
        xAxis: {
            categories: categories
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
        legend: {
            reversed: true
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        series: series
    });
}

function fillDashboardAreaMindanao(data) {

    var categories = [];
    var series = [];
    var openseries = [];
    var closeseries = [];
    for (var x in data) {
        categories.push(data[x].sbu);
        openseries.push(data[x].openpaf);
        closeseries.push(data[x].closepaf);
    }
    series.push({ name: 'CLOSE', data: closeseries });
    series.push({ name: 'OPEN', data: openseries });


    $('#dash4').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: data.branch
        },
        xAxis: {
            categories: categories
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
        legend: {
            reversed: true
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        series: series
    });
}
Date.prototype.addDays = function (days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

function themesDracula() {
    return Highcharts.theme = {
        colors: ['#F7C661', '#669AE1', '#85D27C', '#EC715C', '#aaeeee', '#ff0066',
            '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
        chart: {
            backgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                stops: [
                    [0, '#2a2a2b'],
                    [1, '#3e3e40']
                ]
            },
            style: {
                fontFamily: '\'Unica One\', sans-serif'
            },
            plotBorderColor: '#606063'
        },
        title: {
            style: {
                color: '#E0E0E3',
                textTransform: 'uppercase',
                fontSize: '20px'
            }
        },
        subtitle: {
            style: {
                color: '#E0E0E3',
                textTransform: 'uppercase'
            }
        },
        xAxis: {
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            title: {
                style: {
                    color: '#A0A0A3'

                }
            }
        },
        yAxis: {
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            tickWidth: 1,
            title: {
                style: {
                    color: '#A0A0A3'
                }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            style: {
                color: '#F0F0F0'
            }
        },
        plotOptions: {
            series: {
                dataLabels: {
                    color: '#B0B0B3'
                },
                marker: {
                    lineColor: '#333'
                }
            },
            boxplot: {
                fillColor: '#505053'
            },
            candlestick: {
                lineColor: 'white'
            },
            errorbar: {
                color: 'white'
            }
        },
        legend: {
            itemStyle: {
                color: '#E0E0E3'
            },
            itemHoverStyle: {
                color: '#FFF'
            },
            itemHiddenStyle: {
                color: '#606063'
            }
        },
        credits: {
            style: {
                color: '#666'
            }
        },
        labels: {
            style: {
                color: '#707073'
            }
        },

        drilldown: {
            activeAxisLabelStyle: {
                color: '#F0F0F3'
            },
            activeDataLabelStyle: {
                color: '#F0F0F3'
            }
        },

        navigation: {
            buttonOptions: {
                symbolStroke: '#DDDDDD',
                theme: {
                    fill: '#505053'
                }
            }
        },

        // scroll charts
        rangeSelector: {
            buttonTheme: {
                fill: '#505053',
                stroke: '#000000',
                style: {
                    color: '#CCC'
                },
                states: {
                    hover: {
                        fill: '#707073',
                        stroke: '#000000',
                        style: {
                            color: 'white'
                        }
                    },
                    select: {
                        fill: '#000003',
                        stroke: '#000000',
                        style: {
                            color: 'white'
                        }
                    }
                }
            },
            inputBoxBorderColor: '#505053',
            inputStyle: {
                backgroundColor: '#333',
                color: 'silver'
            },
            labelStyle: {
                color: 'silver'
            }
        },

        navigator: {
            handles: {
                backgroundColor: '#666',
                borderColor: '#AAA'
            },
            outlineColor: '#CCC',
            maskFill: 'rgba(255,255,255,0.1)',
            series: {
                color: '#7798BF',
                lineColor: '#A6C7ED'
            },
            xAxis: {
                gridLineColor: '#505053'
            }
        },

        scrollbar: {
            barBackgroundColor: '#808083',
            barBorderColor: '#808083',
            buttonArrowColor: '#CCC',
            buttonBackgroundColor: '#606063',
            buttonBorderColor: '#606063',
            rifleColor: '#FFF',
            trackBackgroundColor: '#404043',
            trackBorderColor: '#404043'
        },

        // special colors for some of the
        legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
        background2: '#505053',
        dataLabelsColor: '#B0B0B3',
        textColor: '#C0C0C0',
        contrastTextColor: '#F0F0F3',
        maskColor: 'rgba(255,255,255,0.3)'
    };
} 








