/*
* javascript library capable of parsing Ansible Playbooks to a desired dictionary
*/

/* file ext */
var FileExtRegex = {
    none: /[^\.]/,
    yaml: /\.ya?ml$/
}

function playbookPath(playbook_name){
  return playbooks_www_path + "/" + playbook_name;
}

/*common for all YAML, needs extraction*/
var YAMLURI2JSON = function (playbook_uri) {
  "use strict";
  var data = loadURI(playbook_uri);
  return jsyaml.load(data);
};

/**/
function PlaybookStepToHTML(playbook_step){
  var stepHTML = "";
  for(var key in playbook_step){
    if(key == "include"){
      playbooksInfo[playbook_step[key]] = YAMLURI2JSON(playbookPath(playbook_step[key]))
      stepHTML += "<div><i>" + key + "</i>: <b><a href='#' onClick='publishPlaybookDetails(\"" + playbook_step[key] + "\", \"#playbookDetails\")'>" + playbook_step[key] + "</a></b></div>"
    } else {
      stepHTML += "<div><i>" + key + "</i>: <b>" + playbook_step[key] + "</b></div>"
    }
  }
  return stepHTML;
}

/* parse all playbooks from a list at given path */
function parsePlaybooks(playbooks, path){
  var playbooksInfo = {};
  for(var playbook_idx in playbooks){
    var playbook = playbooks[playbook_idx];
    var playbook_name = playbook;
    if(!FileExtRegex.yaml.test(playbook)){
      playbook_name = playbook + ".yml";
    }

    playbooksInfo[playbook] = YAMLURI2JSON(path + "/" + playbook_name);
  }
  return playbooksInfo;
}

/* publishes Playbooks Details to a given div */
function publishPlaybookDetails(playbook_name, div_id){
  //
  $DOM("#playbookName").innerHTML = playbook_name;
  var playbook_steps = playbooksInfo[playbook_name];
  var innerHTML = "";
  for( var step_idx in playbook_steps){
    innerHTML += "<tr><td>#" + step_idx + "</td><td>" + PlaybookStepToHTML(playbook_steps[step_idx]) + "</td></tr>";
  }
 
  $DOM(div_id).innerHTML = innerHTML;
}


/*********************** main() *******************/

/* update playbooks sidebar */
$(function() {
  var innerHTML = "";
  for(var playbook_idx in playbooks){
    innerHTML += "<li class=\"active\" onClick=\"publishPlaybookDetails('" + playbooks[playbook_idx] + "', '#playbookDetails');\" ><a href=\"#\"><i class=\"icon-chevron-right\"></i>" + playbooks[playbook_idx] + "</a></li>"
  }
  $DOM("#playbookList").innerHTML = innerHTML;
});

/* parse and update playbook */
var playbooksInfo = parsePlaybooks(playbooks, playbooks_www_path);
publishPlaybookDetails(playbooks[0], "#playbookDetails");

