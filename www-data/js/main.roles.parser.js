/*
* javascript library capable of parsing Ansible Roles to a desired dictionary
*/

/* toggle Task Details */
function toggleTaskDetail(self){
  var task_detail_node = self.parentNode;
  var task_details = task_detail_node.querySelectorAll(".task-detail");
  var icon = task_detail_node.querySelector(".toggle-icon");
  var display_mode;
  if(icon.classList.contains("icon-plus-sign")){
    icon.classList.remove('icon-plus-sign');
    icon.classList.add('icon-minus-sign');
    display_mode = "block";
  } else {
    icon.classList.remove('icon-minus-sign');
    icon.classList.add('icon-plus-sign');
    display_mode = "none";
  }

  for(var task_detail_idx=0; task_detail_idx < task_details.length; task_detail_idx++){
    var task = task_details[task_detail_idx];
    task.style.display = display_mode;
  }
}

/* create a Role Path */
function rolePath(role_name){
  return roles_www_path + "/" + role_name + "/tasks/main.yml";
}

/* parse all roles from a list at given path */
function parseRoles(roles){
  var rolesInfo = {};
  for(var role_idx in roles){
    var role_name = roles[role_idx];
    var role_uri = rolePath(role_name);
    rolesInfo[role_name] = YAMLURI2JSON(role_uri);
  }
  return rolesInfo;
}

/* publishes Roles Details to a given div */
function publishRoleDetails(rolename, div_id){
  $DOM("#roleName").innerHTML = rolename;
  var tasks = rolesInfo[rolename];
  var innerHTML = "";
  for(var task_idx in tasks){
    innerHTML += "<tr><td>";
    var task = tasks[task_idx];
    var task_idx_human = parseInt(task_idx) + 1;
    var count = 0;
    for(var inner_task_key in task){
      if(count == 0){
        innerHTML += "#" + task_idx_human + " <i>" + inner_task_key + "</i>: <b>" + task[inner_task_key]  + "</b> <i onClick=\"toggleTaskDetail(this);\" class=\"toggle-icon icon-plus-sign\"></i><blockquote class=\"task-detail\">";
      } else {
        innerHTML += "<div><i>" + inner_task_key + "</i>: <b>" + task[inner_task_key]  + "</b></div>";
      }
      count += 1;
    }
    innerHTML += "</blockquote></td></tr>";
  }
  $DOM(div_id).innerHTML = innerHTML;
}


/*********************** main() *******************/

/* update roles sidebar */
$(function() {
  var innerHTML = "";
  for(var role_idx in roles){
    innerHTML += "<li class=\"active\" onClick=\"publishRoleDetails('" + roles[role_idx] + "', '#roleDetails');\" ><a href=\"#\"><i class=\"icon-chevron-right\"></i>" + roles[role_idx] + "</a></li>"
  }
  $DOM("#roleList").innerHTML = innerHTML;
});


/* parse and update roles */
var rolesInfo = parseRoles(roles);
publishRoleDetails(roles[0], '#roleDetails')

