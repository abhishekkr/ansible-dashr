
function pie_chart(obj, values, title){
    obj.highcharts({
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false
        },
        title: { text: "Summary of " + title },
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
        series: [{ type: 'pie', name: title, data: values }]
      });
}

function half_pie(obj, values, title){
    obj.highcharts({
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: 0,
          plotShadow: false
        },
        title: {
          text: 'Ratio of<br/>' + title,
          align: 'center',
          verticalAlign: 'middle',
          y: 50
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            dataLabels: {
              enabled: true,
              distance: -50,
              style: { fontWeight: 'bold', color: 'white', textShadow: '0px 1px 2px black' }
            },
            startAngle: -90,
            endAngle: 90,
            center: ['50%', '75%']
          }
        },
        series: [{
            type: 'pie',
            name: title,
            innerSize: '50%',
            data: values
          }]
      });
}


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

    pie_chart($('#run_stats'), pie_data, 'Ansible Run Status')


    var detailed_stats = calculateDetailedTaskStats(hosts_info);
    var detailed_stats_data = [];
    for(var _type in detailed_stats){
      detailed_stats_data.push([_type, detailed_stats[_type].length]);
    }
    half_pie($('#peice_stat'), detailed_stats_data, "Ansible Cog")
  });
