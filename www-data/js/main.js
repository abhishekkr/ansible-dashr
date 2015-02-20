/**********
j-ini-minified
**********/
var INIRegex={section:/^\s*\[\s*([^\]]*)\s*\]\s*$/,trueParam:/^\s*([\w\.\-\_]+)\s*$/,param:/^\s*([\w\.\-\_]+)\s*=\s*(.*?)\s*$/,comment:/^\s*;.*$/};function populateValueWithToken(c,a,b){if(c.hasOwnProperty("section")){if(c.hasOwnProperty("trueParam")){c.value[c.section][c.trueParam][a]=b}else{c.value[c.section][a]=b}}else{if(c.hasOwnProperty("trueParam")){c.value[c.trueParam][a]=b}else{c.value[a]=b}}}function parseINIToken(c,b){if(INIRegex.trueParam.test(b)){var a=b.match(INIRegex.trueParam);if(c.hasOwnProperty("section")){c.value[c.section][a[1]]={}}else{c.value[a[1]]={}}c.trueParam=a[1]}else{if(INIRegex.param.test(b)){var a=b.match(INIRegex.param);populateValueWithToken(c,a[1],a[2])}}}function parseINILine(e,a){if(INIRegex.comment.test(a)){return}else{if(INIRegex.section.test(a)){var b=a.match(INIRegex.section);e.value[b[1]]={};e.section=b[1]}else{if(a.length==0&&e.hasOwnProperty("section")){delete e.section}else{var d=a.split(/\s+/);for(var c in d){parseINIToken(e,d[c])}delete e.trueParam}}}}function parseINI(c){var d={value:{}};var a=c.split(/\r\n|\r|\n/);for(var b in a){parseINILine(d,a[b])}return d.value}function updateINIChildren(e,a,c){for(var d in e.value[a][c]){if(e.value[c].hasOwnProperty(d)){continue}_default_child_attrib=e.value[a][c][d];for(var b in e.value[c]){e.value[c][b][d]=_default_child_attrib}}}function updateINIParents(c,a){for(var b in c.value){if(a==b){continue}if(typeof(c.value[b])=="string"){continue}if(Object.keys(c.value[b]).indexOf(a)<0){continue}updateINIChildren(c,b,a);c.value[b][a]=(c.value[a])}}function parseINIHiera(b){var c={value:parseINI(b)};for(var a in c.value){updateINIParents(c,a)}return c.value};

/**********
j-minified
**********/
function loadURI(a){var b=new XMLHttpRequest();b.open("GET",a,false);b.send(); e=parseInt(b.status/100); if(e==4||e==5){return "";}; return b.responseText}
function $DOM(a,b){var c=document.querySelectorAll(a);if(b===undefined){b=0}return c[b]}
function getUrlVars(){var v={}; var p=window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,_k,_v){v[_k]=_v;}); return v;}

/**********
main()
**********/

/* return an index-ed key of a dictionary */
function indexKeyFromDict(index, dict){
  var count = 0;
  for(var _k in dict){
    if(count == index){ return _k }
    count += 1;
  }
}

/*converts data from YAML URL to JSON and return it
requirs 'nodeca/js-yaml' */
var YAMLURI2JSON = function (playbook_uri) {
  "use strict";
  var data = loadURI(playbook_uri);
  return jsyaml.load(data);
};

/* return list of hosts to be covered by provided yaml */
function parseHostList(hostlist_yaml){
  hostlist_yaml = decodeURIComponent(hostlist_yaml);
  return YAMLURI2JSON(hostlist_yaml);
}

/*calculate task state counter*/
function updateStateCounter(taskstate_counter, state){
  switch (state) {
  case "unreachable":
  case "failed":
    taskstate_counter["Failed"] += 1;
    break;
  case "changed":
  case "ok":
    taskstate_counter["Passed"] += 1;
    break;
  }
  return taskstate_counter;
}
function calculateTaskStats(hosts_info){
  var taskstate_counter = {"Passed":0, "Failed":0};
  for(var host in hosts_info){
    var host_info = hosts_info[host];
    for(var task in host_info){
      taskstate_counter = updateStateCounter(taskstate_counter, host_info[task]["state"]);
    }
  }
  return taskstate_counter;
}

/* calculate detailed logs */
function calculateDetailedTaskStats(hosts_info){
  var run_consists_of = {"playbooks":[], "roles":[], "tasks":[], "hosts":[]}
  for(var host in hosts_info){
    run_consists_of["hosts"].push(host)
    var host_info = hosts_info[host];
    for(var task in host_info){
      var name = task.split(":")
      if(name.length !=3){
        console.log(task + " task doesn't suit Playbook:Role:Task sturct");
        continue;
      }
      if (run_consists_of["playbooks"].indexOf(name[0]) < 0) {
        run_consists_of["playbooks"].push(name[0])
      }
      if (run_consists_of["roles"].indexOf(name[1]) < 0 && name[1] != "") {
        run_consists_of["roles"].push(name[1])
      }
      if (run_consists_of["tasks"].indexOf(name[2]) < 0) {
        run_consists_of["tasks"].push(name[2])
      }
    }
  }

  return run_consists_of;
}
