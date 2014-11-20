/*
* javascript library capable of parsing Ansible Playbooks to a desired dictionary
*/

/* regex for Playbook tokens */
var PlaybookRegex = {
    blank: /^\s*$/,
    initiate: /^---\s*$/,
    comment: /^\s*#(.*)/,
    include: /^\- include:\s*(.*)\s*$/,
    hosts: /^\- hosts:\s*(.*)\s*$/,
    _roles: /\s*\- roles:\s*$/,
    _role_with_def: /\s*\-\s*\{\s*role:\s*(.*)\s*\}\s*$/,
    _role_without_def: /\s*\-\s*(.*)\s*$/
};

/* parse line from Playbook */
function parsePlaybookLine(Playbook, line){
  if(PlaybookRegex.blank.test(line)){
    return;

  }else if(PlaybookRegex.comment.test(line)){
    var match = line.match(PlaybookRegex.comment);
    Playbook.comments[Playbook.task_count] += match[1];

  }else if(PlaybookRegex.include.test(line)){
    var match = line.match(PlaybookRegex.include);
    console.log("Include:", match[1]);

  }else if(PlaybookRegex.hosts.test(line)){
    var match = line.match(PlaybookRegex.hosts);
    console.log("Hosts:", match[1]);

  }else if(PlaybookRegex.initiate.test(line)){
    console.log("Playbook definition started.");
  };
}

/* parse Ansible Playbook configuration files */
function parsePlaybook(data){
  var Playbook = {tasks: [], comments: [], task_count: 0};
  var lines = data.split(/\r\n|\r|\n/);

  for(var line_idx in lines){
    parsePlaybookLine(Playbook, lines[line_idx]);
  }
  return Playbook;
}

/* parse all playbooks from a list at given path */
function parsePlaybooks(playbooks, path){
  var playbooksInfo = {};
  for(var playbook_idx in playbooks){
    var playbook = playbooks[playbook_idx];
    var playbookData = loadURI(path + "/" + playbook + ".yml");
    playbooksInfo[playbook] = parsePlaybook(playbookData);
  }
  return playbooksInfo;
}

/* publishes Playbooks Details to a given div */
function publishTasks(playbookname, tasks, div_id){
  //
}


/*********************** main() *******************/

/* update playbooks sidebar */
$(function() {
  var innerHTML = "";
  for(var playbook_idx in playbooks){
    innerHTML += "<li class=\"active\"><a href=\"#\"><i class=\"icon-chevron-right\"></i>" + playbooks[playbook_idx] + "</a></li>"
  }
  $DOM("#playbookList").innerHTML = innerHTML;
});

/* parse and update playbook */
$(function() {
  var playbooksInfo = parsePlaybooks(playbooks, playbooks_www_path);
  for(var playbook_idx in playbooks){
    var playbook = playbooks[playbook_idx];
    var playbookInfo = playbooksInfo[playbook];
    //publishTasks(playbook, playbookInfo['tasks'], '#tasks')
  }
});
