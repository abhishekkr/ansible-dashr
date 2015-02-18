#!/usr/bin/env python

"""
Author: [AbhishekKr <abhikumar@gmail.com>](http://abhishekkr.github.io)
"""

import os
import yaml


EXTRA_DETAILS = ['cmd', 'command', 'start', 'end', 'delta', 'msg', 'stdout', 'stderr']


def utf8ize(something):
    return str(something).encode('utf-8')


def prepare_extra_details(res):
    """ Add EXTRA_DETAIL field matched details to task yaml. """
    details = {}
    if type(res) == type(dict()):
      for field in EXTRA_DETAILS:
        if field in res.keys():
            details[field] = utf8ize(res[field])
    return details


def refresh_host_yaml(host_yaml, type={}):
    """ Prepares empty host yaml if not present. """
    with open(host_yaml, "w") as f:
            yaml.dump(type, f)


def state_to_yaml(host_yaml, res, state=None):
    """ Update Host yaml log file states. """
    module = res['invocation']['module_name']

    if not os.path.exists(host_yaml):
        refresh_host_yaml(host_yaml)

    with open(host_yaml) as f:
        newdct = yaml.load(f)

    newdct[str(module)] = { "state": str(state), "details": prepare_extra_details(res) }

    with open(host_yaml, "w") as f:
        yaml.dump(newdct, f)


def get_host_yaml(host_log, log_dir, host):
    """ Update hostlog yaml with host name. Return path for host yaml to be log created. """
    host = host.split("->")[0].strip()

    with open(host_log) as f:
        host_list = yaml.load(f)

    if host not in host_list:
        host_list.append(host)

    with open(host_log, "w") as f:
        yaml.dump(host_list, f)

    return os.path.join(log_dir.strip(), host)


class CallbackModule(object):
    """
    This plugin makes use of the following environment variables:
        DASHR_LOG_DIRECTORY (else uses /var/log/ansible to create dashr logs)
    """

    def __init__(self):
        self.dashr_log_directory = os.getenv('DASHR_LOG_DIRECTORY', '/var/log/ansible')

        self.dashr_hostlog_directory = os.path.join(self.dashr_log_directory, "hosts")
        if not os.path.exists(self.dashr_hostlog_directory):
            os.makedirs(self.dashr_hostlog_directory)

        self.dashr_hostlog = os.path.join(self.dashr_log_directory, "dashr_log_hostlist.yaml")
        if not os.path.exists(self.dashr_hostlog):
            refresh_host_yaml(self.dashr_hostlog, [])

    def on_any(self, *args, **kwargs):
        pass

    def runner_on_failed(self, host, res, ignore_errors=False):
        host_yaml = get_host_yaml(self.dashr_hostlog, self.dashr_hostlog_directory, host)
        state_to_yaml(host_yaml , res, "failed")

    def runner_on_ok(self, host, res):
        host_yaml = get_host_yaml(self.dashr_hostlog, self.dashr_hostlog_directory, host)
        state_to_yaml(host_yaml, res, "ok")

    def runner_on_error(self, host, msg):
        pass

    def runner_on_skipped(self, host, item=None):
        pass

    def runner_on_unreachable(self, host, res):
        host_yaml = get_host_yaml(self.dashr_hostlog, self.dashr_hostlog_directory, host)
        state_to_yaml(host_yaml, res, "unreachable")

    def runner_on_no_hosts(self):
        pass

    def runner_on_async_poll(self, host, res, jid, clock):
        host_yaml = get_host_yaml(self.dashr_hostlog, self.dashr_hostlog_directory, host)
        state_to_yaml(host_yaml, res)

    def runner_on_async_ok(self, host, res, jid):
        host_yaml = get_host_yaml(self.dashr_hostlog, self.dashr_hostlog_directory, host)
        state_to_yaml(host_yaml, res, "ok")

    def runner_on_async_failed(self, host, res, jid):
        host_yaml = get_host_yaml(self.dashr_hostlog, self.dashr_hostlog_directory, host)
        state_to_yaml(host_yaml, res, "failed")

    def playbook_on_start(self):
        pass

    def playbook_on_notify(self, host, handler):
        pass

    def playbook_on_no_hosts_matched(self):
        pass

    def playbook_on_no_hosts_remaining(self):
        pass

    def playbook_on_task_start(self, name, is_conditional):
        pass

    def playbook_on_vars_prompt(self, varname, private=True, prompt=None, encrypt=None, confirm=False, salt_size=None, salt=None, default=None):
        pass

    def playbook_on_setup(self):
        pass

    def playbook_on_import_for_host(self, host, imported_file):
        pass

    def playbook_on_not_import_for_host(self, host, missing_file):
        pass

    def playbook_on_play_start(self, pattern):
        pass

    def playbook_on_stats(self, stats):
        pass
