/*
* javascript library capable of parsing Ansible Roles to a desired dictionary
*/

/* regex for Role tokens */
var RoleRegex = {
    initiate: /^---\s*$/,
    comment: /^\s*#(.*)/,
    not_blank: /[^\s]+/,
    task_name: /^\- name:\s*(.*)$/
};

/* parse line from Role */
function parseRoleLine(Role, line){
  if(RoleRegex.comment.test(line)){
    var match = line.match(RoleRegex.comment);
    Role.comments[Role.task_count] += match[1];

  }else if(RoleRegex.task_name.test(line)){
    var match = line.match(RoleRegex.task_name);
    Role.tasks[Role.task_count] = {"name": match[1], "task_def": []};
    Role.task_count += 1;

  }else if(RoleRegex.initiate.test(line)){
    console.log("Role definition started.");

  }else if(RoleRegex.not_blank.test(line)){
    var current_role_idx = parseInt(Role.task_count) - 1;
    var task_def = Role.tasks[current_role_idx]["task_def"];
    task_def.push(line);
    Role.tasks[current_role_idx]["task_def"] = task_def;
  };
}

/* parse Ansible Role configuration files */
function parseRole(data){
  var Role = {tasks: [], comments: [], task_count: 0};
  var lines = data.split(/\r\n|\r|\n/);

  for(var line_idx in lines){
    parseRoleLine(Role, lines[line_idx]);
  }
  return Role;
}

/* parse all roles from a list at given path */
function parseRoles(roles, path){
  var rolesInfo = {};
  for(var role_idx in roles){
    var role = roles[role_idx];
    var roleData = loadURI(path + "/" + role + "/tasks/main.yml");
    rolesInfo[role] = parseRole(roleData);
  }
  return rolesInfo;
}

/* publishes Roles Details to a given div */
function publishTasks(rolename, div_id){
  $DOM("#roleName").innerHTML = rolename;
  var tasks = rolesInfo[rolename].tasks;
  var innerHTML = "";
  for(var task_idx in tasks){
    var task = tasks[task_idx];
    var task_idx_human = parseInt(task_idx) + 1;
    innerHTML += "<tr class='task'> <td>#" + task_idx_human + " <b class='task_name'>" + task["name"] + "</b></td>";
    innerHTML += "<td><ul class='task_defs'>";
    for(var task_def_idx in task["task_def"]){
      var task_def = task["task_def"][task_def_idx];
      var task_def_class = " class='" + task_def + " " + task_idx + " "  + task_idx + "." + task_def_idx + "' ";
      var task_def_style = " style='' ";
      innerHTML += "<li" + task_def_class + task_def_style + ">" + task_def + "</li>";
    }
    innerHTML += "</ul></td></tr>";
  }
  $DOM(div_id).innerHTML = innerHTML;
}


/*********************** main() *******************/

/* update roles sidebar */
$(function() {
  var innerHTML = "";
  for(var role_idx in roles){
    innerHTML += "<li class=\"active\" onClick=\"publishTasks('" + roles[role_idx] + "', '#tasks');\" ><a href=\"#\"><i class=\"icon-chevron-right\"></i>" + roles[role_idx] + "</a></li>"
  }
  $DOM("#roleList").innerHTML = innerHTML;
});


/* parse and update roles */
var rolesInfo = parseRoles(roles, roles_www_path);
publishTasks(roles[0], '#tasks')

