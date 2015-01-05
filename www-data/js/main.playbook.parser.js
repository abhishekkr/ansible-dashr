/*
* javascript library capable of parsing Ansible Playbooks to a desired dictionary
*/

/* file ext */
var FileExtRegex = {
    none: /[^\.]/,
    yaml: /\.ya?ml$/
}

YAML2JSON = function (playbook_uri) {
  "use strict";
  var data = loadURI(playbook_uri);
  return jsyaml.load(data);
};


/* parse Ansible Playbook configuration files */
function parsePlaybook(playbook_uri){
  console.log(playbook_uri);
  var playbookJSON = YAML2JSON(playbook_uri);
  return playbookJSON;
}

/* parse all playbooks from a list at given path */
function parsePlaybooks(playbooks, path){
  var playbooksInfo = {};
  for(var playbook_idx in playbooks){
    var playbook = playbooks[playbook_idx];
    var playbook_name = playbook;
    console.log("loading playbook", playbook)

    if(!FileExtRegex.yaml.test(playbook)){
      playbook_name = playbook + ".yml";
    }

    playbooksInfo[playbook] = parsePlaybook(path + "/" + playbook_name);
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
    innerHTML += "<tr>#" + step_idx + " " + JSON.stringify(playbook_steps[step_idx]) + "</tr>";
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

