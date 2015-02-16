

$(function () {
    var pie_data = [], hosts_info = {};
    var host_list = parseHostList(dashr_log_hostlist);
    for(var idx in host_list){
      var host_yaml_uri = decodeURIComponent(dashr_log_directory + "/" + host_list[idx]);
      hosts_info[host_list[idx]] = YAMLURI2JSON(host_yaml_uri);
    }
    var state_count = calculateTaskStats(hosts_info);
    for(var _type in state_count){
      pie_data.push([_type, state_count[_type]]);
    }

    $('#summary').highcharts({
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false
        },
        title: {
          text: 'Summary of run states for Ansible Runs'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
              style: {
                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
              }
            }
          }
        },
        series: [{
            type: 'pie',
            name: 'Browser share',
            data: pie_data
          }]
      });
  });
