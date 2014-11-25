/*
* javascript library capable of parsing Ansible Playbooks to a desired dictionary
*/

/* file ext */
var FileExtRegex = {
    none: /[^\.]/,
    yaml: /\.ya?ml$/
}

/* regex for Playbook tokens */
var PlaybookRegex = {
    blank: /^\s*$/,
    initiate: /^---\s*$/,
    add_step: /^-\s*([a-zA-Z0-9]*)\s*:(.*)/,
    comment: /^\s*#(.*)/,
    include: /include:\s*(.*)\s*$/,
    hosts: /hosts:\s*(.*)\s*$/,
    _roles: /(\s*)roles:\s*$/,
    __role_with_def: /\s*\-\s*\{\s*role:\s*(.*)\s*\}\s*$/,
    __role_without_def: /\s*\-\s*(.*)\s*$/,
    _vars: /(\s*)vars:\s*$/,
    __var_value: /^\s*(.*)\s*:\s*(.*)\s*$/,
};

/* update Playbook info for included playbook */
function includePlaybook(Playbook, playbook_name, path){
  var playbookData = loadURI(path + "/" + playbook_name);

  var lines = playbookData.split(/\r\n|\r|\n/);
  for(var line_idx in lines){
    parsePlaybookLine(Playbook, lines[line_idx], path);
  }
}

/* parse line from Playbook */
function parsePlaybookLine(Playbook, line, path){
  if(PlaybookRegex.add_step.test(line)){
    Playbook.playbook_step_idx += 1;
    var match = line.match(PlaybookRegex.add_step);
    Playbook.playbook_steps[Playbook.playbook_step_idx] = {"name": match[2], "type": match[1]};
  }

  if(PlaybookRegex.blank.test(line)){
    return;

  }else if(PlaybookRegex.comment.test(line)){
    var match = line.match(PlaybookRegex.comment);
    Playbook.comments[Playbook.playbook_step_idx] += match[1];

  }else if(PlaybookRegex.include.test(line)){
    var match = line.match(PlaybookRegex.include);
    includePlaybook(Playbook, match[1], path);

  }else if(PlaybookRegex.hosts.test(line)){
    var match = line.match(PlaybookRegex.hosts);

  }else if(PlaybookRegex.initiate.test(line)){
    console.log("Playbook definition started.");
  };
}

/* parse Ansible Playbook configuration files */
function parsePlaybook(data, path){
  var Playbook = {playbook_steps: [], comments: [], playbook_step_idx: -1};
  var lines = data.split(/\r\n|\r|\n/);

  for(var line_idx in lines){
    parsePlaybookLine(Playbook, lines[line_idx], path);
  }
  return Playbook;
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

    var playbookData = loadURI(path + "/" + playbook_name);
    playbooksInfo[playbook] = parsePlaybook(playbookData, path);
  }
  return playbooksInfo;
}

/* publishes Playbooks Details to a given div */
function publishPlaybookDetails(playbook_name, div_id){
  //
  $DOM("#playbookName").innerHTML = playbook_name;
  var playbook_steps = playbooksInfo[playbook_name].playbook_steps;
  var innerHTML = "";

  for(var playbook_step_idx in playbook_steps){
    var playbook_step = playbook_steps[playbook_step_idx];
    var playbook_step_idx_human = parseInt(playbook_step_idx) + 1;
    innerHTML += "<tr class='playbook_step'> <td>#" + playbook_step_idx_human + " <b class='playbook_step_name'>" + playbook_step["name"] + "</b></td>";
    innerHTML += "<td><ul class='playbook_step_defs'>";
    for(var playbook_step_def_idx in playbook_step["playbook_step_def"]){
      var playbook_step_def = playbook_step["playbook_step_def"][playbook_step_def_idx];
      var playbook_step_def_class = " class='" + playbook_step_def + " " + playbook_step_idx + " "  + playbook_step_idx + "." + playbook_step_def_idx + "' ";
      var playbook_step_def_style = " style='' ";
      innerHTML += "<li" + playbook_step_def_class + playbook_step_def_style + ">" + playbook_step_def + "</li>";
    }
    innerHTML += "</ul></td></tr>";
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

