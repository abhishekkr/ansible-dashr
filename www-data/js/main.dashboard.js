/*********
 * Dashboard display specific to Hosts Callback YAML Log File listing
*********/
var dashr_dashboard = new Object();

/* return bootstrap badge class based on state */
dashr_dashboard.getBadge = function (state){
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
};

/* toggle DashbBoard Task Details */
dashr_dashboard.toggleDashboardTaskDetails = function (self){
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
};

/* convert passed task details-dict to html */
dashr_dashboard.taskDetailsToHTML = function (details){
  var _html = "<div><div onclick=\"dashr_dashboard.toggleDashboardTaskDetails(this);\"><span class=\"toggle-icon icon-plus-sign\"></span><i class=\"toggle-msg\">show details</i></div><div class=\"task-detail\" style=\"display:none\">";
  for(var detail_type in details){
    _html += "<div>" + detail_type + ":" + details[detail_type] + "</div>";
  }
  _html += "</div></div>";
  return _html;
};

/* boolean return if element is in list */
dashr_dashboard.isElementInList = function (element, list){
  return list.indexOf(element) >= 0
};

/* boolean return if element is not in list */
dashr_dashboard.isElementNotInList = function (element, list){
  return list.indexOf(element) < 0
};

/* entry for a host if got no logs till now */
dashr_dashboard.ifHostHasNoTasksListed = function (hostname){
  var entry = {
    "hostname": hostname,
    "taskstate": "",
    "taskdetails": ""
  };
  if(dashr_dashboard.isElementInList("failed", dashr_dashboard.state_type)){
    entry["taskname"] = "Nothing Failed :)";
  } else if(dashr_dashboard.isElementInList("ok", dashr_dashboard.state_type)){
    entry["taskname"] = "Nothing Passed :(";
  } else {
    entry["taskname"] = "Run Something :/";
  }
  return entry;
};

/* updating dashboard list for a given host details */
dashr_dashboard.get_host_info = function (hostname, host_info_list, state_type){
  if(host_info_list.length == 0){
    dashr_dashboard.listjs.add(hostname, dashr_dashboard.ifHostHasNoTasksListed(hostname));
    return
  }
  for(var info_idx in host_info_list){
    var _state = host_info_list[info_idx]['state'];
    dashr_dashboard.taskstate_counter = updateStateCounter(dashr_dashboard.taskstate_counter, _state);
    if(state_type != "all" && dashr_dashboard.isElementNotInList(_state, state_type)){
      continue;
    }
    dashr_dashboard.listjs.add(
      {
        "hostname": hostname,
        "taskname": host_info_list[info_idx]['name'],
        "taskstate": "<span class=\"badge " + dashr_dashboard.getBadge(_state) + "\">" + _state + "<span>",
        "taskdetails": dashr_dashboard.taskDetailsToHTML(host_info_list[info_idx]['details']),
      }
    ) ;
  }
};

/* manage update of dashboard for all hosts for given state */
dashr_dashboard.get_dashboard_values = function (callback_dir, state_type){
  // update hosts_info
  for(var host_idx in dashr_dashboard.host_list){
    var host_yaml_uri = decodeURIComponent(callback_dir + "/" + dashr_dashboard.host_list[host_idx]);
    var host_info_list = YAMLURI2JSON(host_yaml_uri);
    dashr_dashboard.get_host_info(dashr_dashboard.host_list[host_idx], host_info_list, state_type);
  }
};

/* update task state counter on side-navs */
dashr_dashboard.update_task_counter = function(){
  document.querySelector("#AllCount").innerHTML = " <span style=\"font-style: italic;\">(" + (dashr_dashboard.taskstate_counter["Passed"] + dashr_dashboard.taskstate_counter["Failed"]) + " Tasks)</span>";
  document.querySelector("#PassedCount").innerHTML = " <span style=\"font-style: italic;\">(" + (dashr_dashboard.taskstate_counter["Passed"]) + " Tasks)</span>";
  document.querySelector("#FailedCount").innerHTML = " <span style=\"font-style: italic;\">(" + (dashr_dashboard.taskstate_counter["Failed"]) + " Tasks)</span>";
};

/* assign onclick action to All, Passed, Failed */
dashr_dashboard.submenu_events = function(){
  document.querySelector("#All").onclick = function(){
    dashr_dashboard.listjs.clear();
    dashr_dashboard.get_dashboard_values(dashr_log_directory, ["all"]);
  };
  document.querySelector("#Passed").onclick = function(){
    dashr_dashboard.listjs.clear();
    dashr_dashboard.get_dashboard_values(dashr_log_directory, ["ok", "changed"]);
  };
  document.querySelector("#Failed").onclick = function(){
    dashr_dashboard.listjs.clear();
    dashr_dashboard.get_dashboard_values(dashr_log_directory, ["failed", "unreachable", "error"]);
  };
};

/* getParameters to initiate parameters used (and passed) as HTTP Request Variables */
dashr_dashboard.getParameters = function(){
  dashr_dashboard.state_type = ["all"];
  dashr_dashboard.host_list = parseHostList(dashr_log_hostlist);

  var get_vars = getUrlVars()
  if (get_vars.hasOwnProperty("state")) {
    dashr_dashboard.state_type = get_vars["state"].split(",");
  }
  if (get_vars.hasOwnProperty("host")) {
    var q_host = decodeURIComponent(get_vars["host"]);
    dashr_dashboard.host_list = [q_host];
  }
};

/* listjs preparations */
dashr_dashboard.listjs_init = function(){
  var dashboard_options = {
    valueNames: [ 'hostname', 'taskname', 'taskstate', 'taskdetails' ],
    item: '<li>Host: <span class="hostname"></span><br/>Task: <span class="taskname"></span><br/>State: <span class="taskstate"></span><p class="taskdetails"></p></li>',
    page: 7,
    plugins: [ ListPagination({}) ]
  };
  dashr_dashboard.listjs = new List('callbackDetails', dashboard_options);
};

/*********************** main() *******************
require following variable pre-defined via dashr-created config/js/main-data.js:
* dashr_log_directory : path where all host callback log yamls will get generated
* dashr_log_hostlist : path to yaml of host list resulting on callback
**************************************************/

dashr_dashboard.listjs_init();
dashr_dashboard.getParameters();
dashr_dashboard.taskstate_counter = {"Passed":0, "Failed":0};

dashr_dashboard.submenu_events();

dashr_dashboard.get_dashboard_values(dashr_log_directory, dashr_dashboard.state_type);

dashr_dashboard.update_task_counter(dashr_dashboard.taskstate_counter);
