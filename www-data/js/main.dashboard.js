/*********
 *  specific to Hosts Callback YAML Log File listing
*********/

/* return bootstrap badge class based on state */
function getBadge(state){
  switch (state) {
  case "unreachable":
  case "failed":
    return "badge-important";
  case "changed":
  case "ok":
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

/* convert passed task details-dict to html */
function taskDetailsToHTML(details){
  var _html = "<div><div onclick=\"toggleDashboardTaskDetails(this);\"><span class=\"toggle-icon icon-plus-sign\"></span><i class=\"toggle-msg\">show details</i></div><div class=\"task-detail\" style=\"display:none\">";
  for(var detail_type in details){
    _html += "<div>" + detail_type + ":" + details[detail_type] + "</div>";
  }
  _html += "</div></div>";
  return _html;
}

/* boolean return if element is in list */
function isElementInList(element, list){
  return list.indexOf(element) >= 0
}

/* boolean return if element is not in list */
function isElementNotInList(element, list){
  return list.indexOf(element) < 0
}

/* entry for a host if got no logs till now */
function ifHostHasNoTasksListed(hostname, state_type){
  var entry = {
    "hostname": hostname,
    "taskstate": "",
    "taskdetails": ""
  };
  if(isElementInList("failed", state_type)){
    entry["taskname"] = "Nothing Failed :)";
  } else if(isElementInList("ok", state_type)){
    entry["taskname"] = "Nothing Passed :(";
  } else {
    entry["taskname"] = "Run Something :/";
  }
  return entry;
}

/* updating dashboard list for a given host details */
function get_host_info(dashboard, state_type, hostname, host_info_list){
  if(host_info_list.length == 0){
    dashboard.add(hostname, ifHostHasNoTasksListed(state_type));
    return
  }
  for(var info_idx in host_info_list){
    var _state = host_info_list[info_idx]['state'];
    taskstate_counter = updateStateCounter(taskstate_counter, _state);
    if(state_type != "all" && isElementNotInList(_state, state_type)){
      continue;
    }
    dashboard.add(
      {
        "hostname": hostname,
        "taskname": host_info_list[info_idx]['name'],
        "taskstate": "<span class=\"badge " + getBadge(_state) + "\">" + _state + "<span>",
        "taskdetails": taskDetailsToHTML(host_info_list[info_idx]['details']),
      }
    ) ;
  }
}

/* manage update of dashboard for all hosts for given state */
function get_dashboard_values(callback_dir, host_list, dashboard, state_type){
  // update hosts_info
  for(var host_idx in host_list){
    var host_yaml_uri = decodeURIComponent(callback_dir + "/" + host_list[host_idx]);
    var host_info_list = YAMLURI2JSON(host_yaml_uri);
    get_host_info(dashboard, state_type, host_list[host_idx], host_info_list);
  }
}

/* update task state counter on side-navs */
function update_task_counter(taskstats){
  document.querySelector("#AllCount").innerHTML = " <span style=\"font-style: italic;\">(" + (taskstate_counter["Passed"] + taskstate_counter["Failed"]) + " Tasks)</span>";
  document.querySelector("#PassedCount").innerHTML = " <span style=\"font-style: italic;\">(" + (taskstate_counter["Passed"]) + " Tasks)</span>";
  document.querySelector("#FailedCount").innerHTML = " <span style=\"font-style: italic;\">(" + (taskstate_counter["Failed"]) + " Tasks)</span>";
}

/*********************** main() *******************
require following variable pre-defined via dashr-created config/js/main-data.js:
* dashr_log_directory : path where all host callback log yamls will get generated
* dashr_log_hostlist : path to yaml of host list resulting on callback
**************************************************/

/* listjs preparations */
var dashboard_options = {
  valueNames: [ 'hostname', 'taskname', 'taskstate', 'taskdetails' ],
  item: '<li>Host: <span class="hostname"></span><br/>Task: <span class="taskname"></span><br/>State: <span class="taskstate"></span><p class="taskdetails"></p></li>'
};
var dashboard_listjs = new List('callbackDetails', dashboard_options);

/* parse and update host */
var state_type = ["all"];
var host_list = parseHostList(dashr_log_hostlist);
var taskstate_counter = {"Passed":0, "Failed":0};

var get_vars = getUrlVars()
if (get_vars.hasOwnProperty("state")) {
  state_type = get_vars["state"].split(",");
}
if (get_vars.hasOwnProperty("host")) {
  var q_host = decodeURIComponent(get_vars["host"]);
  host_list = [q_host];
}


/************** list populate ********************/

document.querySelector("#All").onclick = function(){
  dashboard_listjs.clear()
  get_dashboard_values(dashr_log_directory, host_list, dashboard_listjs, ["all"]);
};
document.querySelector("#Passed").onclick = function(){
  dashboard_listjs.clear()
  get_dashboard_values(dashr_log_directory, host_list, dashboard_listjs, ["ok", "changed"]);
};
document.querySelector("#Failed").onclick = function(){
  dashboard_listjs.clear()
  get_dashboard_values(dashr_log_directory, host_list, dashboard_listjs, ["failed", "unreachable", "error"]);
};


get_dashboard_values(dashr_log_directory, host_list, dashboard_listjs, state_type);
update_task_counter(taskstate_counter);

