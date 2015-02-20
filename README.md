# W.I.P.
* Version: 0.0.5

## Ansible Dashr

##### It's supposed to fill in basic Dashboard/Controller requirement of Ansible WebUI.

> [Screenshots of fully/almost working features](./SCREENSHOTS.md)

> [QuickStart Guide on HowTo use Ansible-Dashr](./HowTo.md)

---

#### Features

* Working
> * **Dashboard**: provides last status updates of all Host's Playbook:Role:Tasks by use of ansible callback plugin
> * **Playbook**: provides linked view to workflow of listed playbook
> * **Hosts**: provides exploratory interface to all host/hostgroups under all listed inventories and their associated host/group-vars
> * **Roles**: gives task level details for listed roles::main

* InProgress
> * **Dashr**: golang based HTTP service for all static content and task API (for Dashboard, Runner, etc)
> * **HomePage**: provides quick view of all listed details and some-bits from Dashboars&Runner once they are completed

* ToBeDone
> * **OptOut**: Enable to opt-out of any feature, say you don't wanna use Callabck plug-in just for the Dashboard... so opt-out of using dashboard
> * **Runner**: enables user to compose and run ansible tasks from listed details

---

re-using [Ansible-UI](https://github.com/mavimo/ansible-ui) pieces for Presentation Layer which is a light template over Bootstrap

