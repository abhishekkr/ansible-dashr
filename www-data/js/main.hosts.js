/*********
 *  specific to Hosts Inventory File listing
*********/

/*** populate inventory-bar for all inventory list ***/
function UpdateInventoryList(inventory_list){
  var inventories = document.querySelector('#inventories');

  var inventoryHTML = "<h3>Inventories</h3><ul class='nav nav-list bs-docs-sidenav'>";
  for(idx in inventory_list){
    var actionAttrib = "onClick='UpdateHostGroupList(\"" + inventory_list[idx] + "\");' onkeypress='UpdateHostGroupList(\"" + inventory_list[idx] + "\");' ";
    inventoryHTML += "<li class='inventoryEntry' id='" + inventory_list[idx] + "' " + actionAttrib + "><a href='#'><i class='icon-chevron-right'></i>" + inventory_list[idx] + "</a></li>";
  }
  inventoryHTML += "  </ul>";
  inventories.innerHTML = inventoryHTML;
  UpdateHostGroupList(document.querySelector('.inventoryEntry').id);
}

/*** populating host-bar for first or required invenotry ***/
function UpdateHostGroupList(inventory){
  var hosts = document.querySelector('#hostgroups');

  var hostsHTML = "<h3>" + inventory + "</h3>";
  for(var _group in hostINI[inventory]){
    hostsHTML += "<div class='hostGroupEntry' id='" + _group + "'>";
    hostsHTML += "  <h4>" + _group + "</h4>";
    hostsHTML += "  <ul class='nav nav-list bs-docs-sidenav'>";
    for(var _host in hostINI[inventory][_group]){
      var actionAttrib = "onClick='UpdateHostDetails(\"" + _host + "\");' onkeypress='UpdateHostDetails(\"" + _host + "\");' ";
      hostsHTML += "    <li class='hostEntry' id='" + _host + "' " + actionAttrib + "><a href='#'><i class='icon-chevron-right'></i>" + _host + "</a></li>";
    }
    hostsHTML += "  </ul>";
    hostsHTML += "</div><br/>";
  }
  hosts.innerHTML = hostsHTML;
  UpdateHostDetails(document.querySelector('.hostEntry').id);
}

/*** populate host-detail field ***/
function UpdateHostDetails(hostname){
  var hostname_id = hostname.replace(/\./g, "\\.")
  var hostdetails = document.querySelector('#hostdetails');

  var group_element = document.querySelector('#' + hostname_id).parentNode.parentNode.querySelector("h4");
  var group_name = group_element.innerHTML;
  var inventory = group_element.parentNode.parentNode.querySelector("h3").innerHTML;
  var inventory_file_details = hostINI[inventory][group_name][hostname];

  hostdetails.querySelector("#hostname").innerHTML = hostname;

  var hostsDLHTML = "<dt>Group:</dt><dd>" + group_name + "</dd>";
  for(var _key in inventory_file_details){
    hostsDLHTML += "<dt>" + _key + ":</dt><dd>" + inventory_file_details[_key] + "</dd>";
  }
  hostdetails.querySelector("dl").innerHTML = hostsDLHTML;
  hostdetails.querySelector("#host_details_keyval").innerHTML = UpdateHostDetailsByVars(hostname, group_name, inventory);
}

/*** update GroupVars applicable to Hostname ***/
function UpdateHostDetailsByVars(hostname, group_name, inventory){
  var host_vars = VarYAMLAsJSON(host_vars_www_path + "/" + hostname);
  host_vars = VarsUpdatedFromGroup(inventory, group_name, host_vars)
  var all_vars = VarYAMLAsJSON(group_vars_www_path + "/all");
  for(var _k in all_vars){
    if(! host_vars.hasOwnProperty(_k)){
      host_vars[_k] = all_vars[_k];
    }
  }

  var hostsGroupVarHTML = "";
  for(var _key in host_vars){
    var _host_vars_html = JSON.stringify(host_vars[_key]).replace(/\{\{/g, "<i>{{").replace(/\}\}/g, "}}</i>");
    hostsGroupVarHTML += "<tr><td>" + _key + ":</td><td>" + _host_vars_html  + "</td></tr>"
  }
  return hostsGroupVarHTML;
}

/*** return group_updated Var appended not overrideen ***/
function VarsUpdatedFromGroup(inventory, group_name, var_dict){
  var group_vars = VarYAMLAsJSON(group_vars_www_path + "/" + group_name);
  for(var _k in group_vars){
    if(! var_dict.hasOwnProperty(_k)){
      var_dict[_k] = group_vars[_k];
    }
  }
  for(var _group in hostINI[inventory]){
    for(var _host in hostINI[inventory][_group]){
        if(_host == group_name){
          var_dict = VarsUpdatedFromGroup(inventory, _group, var_dict);
          break;
        }
    }
  }
  return var_dict; 
}

/*** fetch var yaml as json ***/
function VarYAMLAsJSON(var_path){
  var group_vars_filedata = loadURI(var_path);
  if (group_vars_filedata == "") {return {};}
  // replacing only {|} which are not in quotes
  group_vars_filedata = group_vars_filedata.replace(/(\{\{)(?=(?:(?:[^"]*"){2})*[^"]*$)/g, "\\{\\{").replace(/(\}\})(?=(?:(?:[^"]*"){2})*[^"]*$)/g, "\\}\\}");
  return jsyaml.load(group_vars_filedata);
}

/*** main() ***/
var hostINI = [];
for(var idx in inventories){
  var hostINIConf = loadURI(inventories_www_path + "/" + inventories[idx]);
  hostINI[inventories[idx]] = parseINIHiera(hostINIConf);
}
UpdateInventoryList(inventories)
