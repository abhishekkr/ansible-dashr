/*********
 *  specific to Hosts Inventory File listing
*********/
hostINIConf = loadURI("./dummy-ansible-files/inventories/env.alpha");
hostINI = parseINIHiera(hostINIConf);

$(function() {
  console.log("<<<<<<<<<<");
  hosts = $('#hosts')

  var hostsHTML = ""
  for(var _group in hostINI){
    hostsHTML += "<div class='hostGroupEntry' id='" + _group + "'>";
    hostsHTML += "  <h4>" + _group + "</h4>";
    hostsHTML += "  <ul class='nav nav-list bs-docs-sidenav'>";
    for(var _host in hostINI[_group]){
      hostsHTML += "    <li class='hostEntry' id='" + _host + "'><a href='#'><i class='icon-chevron-right'></i>" + _host + "</a></li>";
    }
    hostsHTML += "  </ul>";
    hostsHTML += "</div><br/>";
  }
  hosts.append(hostsHTML);
  var firstHost = $('.hostEntry')[0];
  console.log(firstHost);
});

