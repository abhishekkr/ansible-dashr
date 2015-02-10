/*
 * contains Ansible related data
 * the only file needing modification per Ansible setup
 * can be generaed using *WIP*
*/

var inventories = ['env.alpha', 'env.beta'];
var inventories_www_path = "/dummy-ansible-files/inventories";
var group_vars_www_path = "/dummy-ansible-files/group_vars";
var host_vars_www_path = "/dummy-ansible-files/host_vars";

//var playbook = ['pb01', 'pb02', 'pb03', 'pb04', 'pb05'];
var playbooks = ['pb04', 'pb05'];
var playbooks_www_path = "/dummy-ansible-files";

var roles = ['memcached', 'ntp', 'bind', 'mysql', 'nginx', 'redis'];
var roles_www_path = "/dummy-ansible-files/roles";

var dashr_log_directory = "/dummy-ansible-files/logs/hosts";
var dashr_log_hostlist = "/dummy-ansible-files/logs/dashr_log_hostlist.yaml";
