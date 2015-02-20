## Ansible Dashr

### HowTo Use

##### Customize Dashr

> To show details of your own Ansible setup than provided dummy-data, can update config at "<repo>/config/js/main.data.js".
> The variables here are self-explainatory, but still
For Dashboard:
> You'll need to set an ENV Variable by name "DASHR_LOG_DIRECTORY" which in case not set, shall be considered as "/var/log/ansible". Make sure Ansible and dashr has access to that path.
> It also requires you to copy "<REPO>/callback/dashr_callback.py" to your Ansible callback directory. If new to Ansible Callbacks read [Ansible Doc for Callback](http://docs.ansible.com/developing_plugins.html#callbacks) and [@jpmens quick description](http://jpmens.net/2012/09/11/watching-ansible-at-work-callbacks/) on it.
> * dashr_log_directory: shall be set based on path to DASHR_LOG_DIRECTORY as "{{ DASHR_LOG_DIRECTORY }}/hosts"
> * dashr_log_hostlist: set it as "{{ DASHR_LOG_DIRECTORY }}/dashr_log_hostlist.yaml"
For Hosts:
> * inventories: list of names of all inventories to be included
> * inventories_www_path: web-path for root of Inventory Files
> * group_vars_www_path: web-path for root of Group Var Files
> * host_vars_www_path: web-path for root of Host Var Files
For Playbooks:
> * playbooks: list of all the playbooks to be included
> * playbooks_www_path: web-path for root of Playbook YAML Files
For Roles:
> * roles: list of all the roles to be included
> * roles_www_path: web-path for root of Roles directories

> We'll enable Dashr to be capable of extracting configuration from any provided Ansible-Setup path or provide Interactive Utility to feed in details. But that for sometime later when other prior features are there.

---

##### Start Dashr

> ``` $ go run dashr.go ```
> requires [golang](https://golang.org/doc/install)

> ``` $ go run dashr.go -h ```
> to view all optional parameters available to be configure when showing a custom Ansible setup (which is the aim)
> Available parameters with there default values are:
> *  -ansible="dummy-ansible-files": path to ansible setup root of Playbooks, Roles Dir
> *  -config="config": path to fetch/save Config used by Static Site Content; from here it fetchs main.data.js
> *  -fqdn="127.0.0.1": IP/FQDN to run HTTP listener at
> *  -http="8001": port to run HTTP listener at
> *  -www="www-data": path to ansible dashr static site content, shouldn't normally change
>
> so, to run it at port:8888 and point to a custom ansible-setup:/home/you/ansibleX dir would change command to
> ``` $ go run dashr.go -http="8888" -ansible="/home/you/ansibleX" ```


> currently dashr.go doesn't do much excpet serving static content, so anything can be run to serve content at root of repo like ```python -m SimpleHTTPServer ```

---

