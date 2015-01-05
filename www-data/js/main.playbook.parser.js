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

/* html-ize role like dict details for playbook */
function DictToHTML(tasks){
  console.log("DictToHTML", tasks); /***********/
  var innerHTML = "";
  for(var task_idx in tasks){
    innerHTML += GeneralStepToHTML(task_idx, tasks[task_idx]);
  }
  return innerHTML;
}

/* html-ize role like list details for playbook */
function ListToHTML(tasks){
  console.log("ListToHTML", tasks); /***********/
  var innerHTML = "<ul>";
  for(var task_idx in tasks){
    innerHTML += "<li>" + GeneralStepToHTML(task_idx, tasks[task_idx])  + "</li>";
  }
  innerHTML += "</ul>";
  return innerHTML;
}

/* html-ize value to steps */
function GeneralStepToHTML(step_key, step){
  console.log("GeneralStepToHTML", step_key, step); /***********/
  var stepHTML = "";
  if(typeof(step) == "object"){
    stepHTML += "<blockquote>";
    if (step.length == undefined){ //dictionary
      stepHTML += DictToHTML(step)
    } else { //list
      stepHTML += ListToHTML(step)
    }
    stepHTML += "<hr/></blockquote>"
  } else {
      stepHTML += "<div><i>" + step_key + "</i>: <b>" + step + "</b></div>";
  }
  return stepHTML;
}

/* convert playbook step to html-ize */
function PlaybookStepToHTML(playbook_step){
  var stepHTML = "";
  var count = 0;
  for(var key in playbook_step){
    if(key == "include"){
      if(! playbooksInfo.hasOwnProperty(playbook_step[key])){
        playbooksInfo[playbook_step[key]] = YAMLURI2JSON(playbookPath(playbook_step[key]));
      }
      stepHTML += "<div><i>" + key + "</i>: <b><a href='#' onClick='publishPlaybookDetails(\"" + playbook_step[key] + "\", \"#playbookDetails\")'>" + playbook_step[key] + "</a></b></div>";
    } else {
      stepHTML += GeneralStepToHTML(key, playbook_step[key])
    }
    count += 1;
  }
  return stepHTML;
}

/* parse all playbooks from a list at given path */
function parsePlaybooks(playbooks){
  var playbooksInfo = {};
  for(var playbook_idx in playbooks){
    var playbook = playbooks[playbook_idx];
    var playbook_name = playbook;
    if(!FileExtRegex.yaml.test(playbook)){
      playbook_name = playbook + ".yml";
    }

    playbooksInfo[playbook] = YAMLURI2JSON(playbookPath(playbook_name));
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
    var step_idx_human = parseInt(step_idx) + 1;
    innerHTML += "<tr><td>#" + step_idx_human + " " + PlaybookStepToHTML(playbook_steps[step_idx]) + "</td></tr>";
  }

  $DOM(div_id).innerHTML = innerHTML;
}


/*********************** main() *******************
require following variable pre-defined via main-data.js:
* playbooks : list of all playbook names to be displayed {names should be with file extension unless it's just 'yml'}
* playbooks_www_path : relative path for Playbook files
**************************************************/

/* update playbooks sidebar */
$(function() {
  var innerHTML = "";
  for(var playbook_idx in playbooks){
    innerHTML += "<li class=\"active\" onClick=\"publishPlaybookDetails('" + playbooks[playbook_idx] + "', '#playbookDetails');\" ><a href=\"#\"><i class=\"icon-chevron-right\"></i>" + playbooks[playbook_idx] + "</a></li>"
  }
  $DOM("#playbookList").innerHTML = innerHTML;
});

/* parse and update playbook */
var playbooksInfo = parsePlaybooks(playbooks);
publishPlaybookDetails(playbooks[0], "#playbookDetails");

