# W.I.P.
* Version: 0.0.3 alpha

## Ansible Dashr

##### It's supposed to fill in basic Dashboard/Controller requirement of Ansible WebUI.

> [Screenshots of fully/almost working features](./SCREENSHOTS.md)

> [QuickStart Guide on HowTo use Ansible-Dashr](./HowTo.md)

---

#### Features

* Working
> * **Hosts**: provides exploratory interface to all host/hostgroups under all listed inventories and their associated host/group-vars
> * **Roles**: gives task level details for listed roles::main

* InProgress
> * **Dashr**: golang based HTTP service for all static content and task API (for Dashboard, Runner, etc)
> * **Playbook**: provides linked view to workflow of listed playbook
> * **HomePage**: provides quick view of all listed details and some-bits from Dashboars&Runner once they are completed

* ToBeDone
> * **Dashboard**: provides last status updates of all Host::Tasks parsed from listed Ansible Log path
> * **Runner**: enables user to compose and run ansible tasks from listed details

---

re-using [Ansible-UI](https://github.com/mavimo/ansible-ui) pieces for Presentation Layer which is a light template over Bootstrap

