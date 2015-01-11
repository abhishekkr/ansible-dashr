/*********
 *  specific to Hosts Inventory File listing
*********/

/*** populate inventory-bar for all inventory list ***/
function UpdateInventoryList(inventory_list){
  var inventories = document.querySelector('#inventories');

  var inventoryHTML = "<h3>Inventories</h3><ul class='nav nav-list bs-docs-sidenav'>";
  for(idx in inventory_list){
    inventoryHTML += "<li class='inventoryEntry' id='" + inventory_list[idx] + "'><a href='#'><i class='icon-chevron-right'></i>" + inventory_list[idx] + "</a></li>";
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
      hostsHTML += "    <li class='hostEntry' id='" + _host + "'><a href='#'><i class='icon-chevron-right'></i>" + _host + "</a></li>";
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

  var group_vars_filedata = loadURI(group_vars_www_path + "/all");
  group_vars_filedata = group_vars_filedata.replace(/{/g, "\\{").replace(/}/g, "\\}");
  var group_vars = jsyaml.load(group_vars_filedata);
  var hostsGroupVarHTML = "";
  for(var _key in group_vars){
    hostsGroupVarHTML += "<tr><td>" + _key + ":</td><td>" + group_vars[_key].replace(/\\{/g, "<i>{").replace(/\\}/g, "}</i>") + "</td></tr>"
  }
  hostdetails.querySelector("#host_details_keyval").innerHTML = hostsGroupVarHTML;
}

/*** main() ***/
var hostINI = [];
for(var idx in inventories){
  var hostINIConf = loadURI(inventories_www_path + "/" + inventories[idx]);
  hostINI[inventories[idx]] = parseINIHiera(hostINIConf);
}
UpdateInventoryList(inventories)
