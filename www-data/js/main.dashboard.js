/*********
 *  specific to Hosts Callback YAML Log File listing
*********/

function getBadge(state){
  switch (state) {
  case "unreachable":
  case "failed":
    state_count["Failed"] += 1;
    return "badge-danger";
  case "ok":
    state_count["Passed"] += 1;
    return "badge-success";
  case "ok":
    state_count["Changed"] += 1;
    return "badge-success";
  default:
    console.log("Sorry, we are out of " + state + ".");
    return "";
  }
}

/* toggle DashbBoard Task Details */
function toggleDashboardTaskDetails(self){
  var task_detail_node = self.parentNode;
  var task_details = task_detail_node.querySelector(".task-detail");
  var icon = task_detail_node.querySelector(".toggle-icon");
  var msg = task_detail_node.querySelector(".toggle-msg");
  if(icon.classList.contains("icon-plus-sign")){
    icon.classList.remove('icon-plus-sign');
    icon.classList.add('icon-minus-sign');
    task_details.style.display = "block";
    msg.innerHTML = "hide details"
  } else {
    icon.classList.remove('icon-minus-sign');
    icon.classList.add('icon-plus-sign');
    task_details.style.display = "none";
    msg.innerHTML = "show details"
  }
}

function taskDetailsToHTML(details){
  var _html = "<div><div onclick=\"toggleDashboardTaskDetails(this);\"><span class=\"toggle-icon icon-plus-sign\"></span><i class=\"toggle-msg\">show details</i></div><div class=\"task-detail\" style=\"display:none\">";
  for(var detail_type in details){
    _html += "<div>" + detail_type + ":" + details[detail_type] + "</div>";
  }
  _html += "</div></div>";
  return _html;
}

function isElementNotInList(element, list){
  return list.indexOf(element) < 0
}

function publishHostDetails(host, host_info, state_type){
  var _html = "";
  console.log(host, host_info);
  var host_added = false;
  var num_tasks = Object.keys(host_info).length;
  for(var task in host_info){
    if(state_type != "all" && isElementNotInList(host_info[task]["state"], state_type)){
      continue;
    }
    _html += "<tr>";
    if(host_added === false){
      _html += "  <td rowspan=\"" + num_tasks  + "\">" + host + "</td>";
      host_added = true;
    }
    _html += "  <td>" + task + "</td>";
    _html += "  <td><span class=\"badge " + getBadge(host_info[task]["state"]) + "\">" + host_info[task]["state"] + "<span></td>";
    _html += "  <td>" + taskDetailsToHTML(host_info[task]["details"]) + "</td>";
    _html += "</tr>";
    host = "";
  }
  return _html;
}

function publishHostsDetails(hosts_info, state_type){
  var callback_details = "";
  for(var host in hosts_info){
    host_info = hosts_info[host];
    callback_details += publishHostDetails(host, host_info, state_type);
  }
  return callback_details;
}

function parseHostList(hostlist_yaml){
  hostlist_yaml = decodeURIComponent(hostlist_yaml);
  return YAMLURI2JSON(hostlist_yaml);
}

function prepareDashboard(callback_dir, host_list, node_id, state_type){
  // update hosts_info
  for(var idx in host_list){
    console.log("Publish results for", host_list[idx], "under", node_id);
    host_yaml_uri = decodeURIComponent(callback_dir + "/" + host_list[idx]);
    hosts_info[host_list[idx]] = YAMLURI2JSON(host_yaml_uri);
  }
  callback_details = publishHostsDetails(hosts_info, state_type);
  document.querySelector(node_id).innerHTML = callback_details;
}


/*********************** main() *******************
require following variable pre-defined via dashr-created config/js/main-data.js:
* dashr_log_directory : path where all host callback log yamls will get generated
* dashr_log_hostlist : path to yaml of host list resulting on callback
**************************************************/

/* parse and update host */
var state_type = ["all"];
var state_count = {"Passed":0, "Failed":0, "Changed":0};
var hosts_info = [];
var host_list = parseHostList(dashr_log_hostlist);

document.querySelector("#All").onclick = function(){
  prepareDashboard(dashr_log_directory, host_list, "#callbackDetails", ["all"]);
};
document.querySelector("#Passed").onclick = function(){
  prepareDashboard(dashr_log_directory, host_list, "#callbackDetails", ["ok", "changed"]);
};
document.querySelector("#Changed").onclick = function(){
  prepareDashboard(dashr_log_directory, host_list, "#callbackDetails", ["changed"]);
};
document.querySelector("#Failed").onclick = function(){
  prepareDashboard(dashr_log_directory, host_list, "#callbackDetails", ["failed", "unreachable", "error"]);
};

var get_vars = getUrlVars()
if (get_vars.hasOwnProperty("state")) {
  state_type = get_vars["state"].split(",");
}
if (get_vars.hasOwnProperty("host")) {
  var q_host = decodeURIComponent(get_vars["host"]);
  if(! hosts_info.hasOwnProperty(q_host)){
    hosts_info[q_host] = YAMLURI2JSON([q_host]);
  }
  prepareDashboard(dashr_log_directory, [q_host], '#callbackDetails', state_type)
} else {
  prepareDashboard(dashr_log_directory, host_list, "#callbackDetails", state_type);
}

document.querySelector("#AllCount").innerHTML = " <span style=\"font-style: italic;\">(" + (state_count["Passed"] + state_count["Changed"] + state_count["Failed"]) + " Tasks)</span>";
document.querySelector("#PassedCount").innerHTML = " <span style=\"font-style: italic;\">(" + (state_count["Passed"]) + " Tasks)</span>";
document.querySelector("#ChangedCount").innerHTML = " <span style=\"font-style: italic;\">(" + (state_count["Changed"]) + " Tasks)</span>";
document.querySelector("#FailedCount").innerHTML = " <span style=\"font-style: italic;\">(" + (state_count["Failed"]) + " Tasks)</span>";

$(function () {
    var values = [], labels = [];
    for(var _type in state_count){
      labels.push(_type); values.push(state_count[_type]);
    }
    console.log(labels, values);
    //Raphael(10, 50, 640, 480).pieChart(320, 240, 100, [55, 20, 13, 32, 5, 1, 2]); 
    document.querySelector("#summary").style.backgroundColor = "#999";
    Raphael("summary").pieChart(115, 115, 50, values, labels, "#fff");
});
