#!/usr/bin/env python

import os
import yaml


def refresh_host_yaml(host_yaml):
    """ Prepares empty host yaml if not present. """
    dct = {}
    with open(host_yaml, "w") as f:
            yaml.dump(dct, f)


def state_to_yaml(host_yaml, res, state=None):
    """ Update Host yaml log file states. """
    module = res['invocation']['module_name']

    if not os.path.exists(host_yaml):
        refresh_host_yaml(host_yaml)

    with open(host_yaml) as f:
        newdct = yaml.load(f)

    newdct[str(module)] = { "state": str(state) }

    with open(host_yaml, "w") as f:
        yaml.dump(newdct, f)


def get_host_yaml(log_dir, host):
    """ Return path for host yaml to be log created. """
    return os.path.join(log_dir.strip(), host.split("->")[0].strip())


class CallbackModule(object):
    """
    This plugin makes use of the following environment variables:
        DASHR_LOG_DIRECTORY (else uses /var/log/ansible to create dashr logs)
    """

    def __init__(self):
        self.dashr_log_directory = os.getenv('DASHR_LOG_DIRECTORY', '/var/log/ansible')
        if not os.path.exists(self.dashr_log_directory):
            os.makedirs(self.dashr_log_directory)

    def on_any(self, *args, **kwargs):
        pass

    def runner_on_failed(self, host, res, ignore_errors=False):
        state_to_yaml(get_host_yaml(self.dashr_log_directory, host) , res, "failed")

    def runner_on_ok(self, host, res):
        state_to_yaml(get_host_yaml(self.dashr_log_directory, host), res, "ok")

    def runner_on_error(self, host, msg):
        pass

    def runner_on_skipped(self, host, item=None):
        pass

    def runner_on_unreachable(self, host, res):
        state_to_yaml(get_host_yaml(self.dashr_log_directory, host), res, "unreachable")

    def runner_on_no_hosts(self):
        pass

    def runner_on_async_poll(self, host, res, jid, clock):
        state_to_yaml(get_host_yaml(self.dashr_log_directory, host), res)

    def runner_on_async_ok(self, host, res, jid):
        state_to_yaml(get_host_yaml(self.dashr_log_directory, host), res, "ok")

    def runner_on_async_failed(self, host, res, jid):
        state_to_yaml(get_host_yaml(self.dashr_log_directory, host), res, "failed")

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
