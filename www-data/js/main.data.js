/*
 * contains Ansible related data
 * the only file needing modification per Ansible setup
 * can be generaed using *WIP*
*/

//var playbook = ['pb01', 'pb02', 'pb03', 'pb04', 'pb05'];
var playbooks = ['pb04', 'pb05'];
var playbooks_www_path = "/www-data/dummy-ansible-files";

var roles = ['memcached', 'ntp', 'bind', 'mysql', 'nginx', 'redis'];
var roles_www_path = "/www-data/dummy-ansible-files/roles";
