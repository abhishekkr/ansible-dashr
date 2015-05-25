#!/usr/bin/env python

"""
Author: [AbhishekKr <abhikumar@gmail.com>](http://abhishekkr.github.io)
"""

import os
import sys
import yaml


EXTRA_DETAILS = ['cmd', 'command', 'start', 'end', 'delta', 'msg', 'stdout', 'stderr']


def stringify(something):
    return str(something).encode('ascii','ignore')


def refresh_host_yaml(host_yaml, type={}):
    """ Prepares empty host yaml if not present. """
    with open(host_yaml, "w") as f:
            yaml.dump(type, f)


def state_to_yaml(host_yaml, _details):
    """ Update Host yaml log file states. """

    if not os.path.exists(host_yaml):
        refresh_host_yaml(host_yaml)

    with open(host_yaml) as f:
        newdct = yaml.load(f)

    newdct[_details["name"]] = _details

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


def prepare_details(obj, result, state):
    _details = {"state": state, "details": {}}
    if type(result) == type(dict()):
        return _details

    _module = result['invocation']['module_name']

    if "role_name" in dir(obj.task):
        if obj.task.role_name:
            _module = "%s:%s" % (obj.task.role_name, _module)
            _details["details"]["role_name"] = obj.task.role_name
        else:
            _module = ":%s" % (_module)

    if "filename" in dir(obj.playbook):
        _playbook_filename = stringify(obj.playbook.filename)
        _playbook = ".".join(_playbook_filename.split('.')[0:-1])
        _module = "%s:%s" % (_playbook, _module)
        _details["details"]["playbook_name"] = _playbook

    _details["name"] = stringify(_module)

    for field in EXTRA_DETAILS:
      if field in result.keys():
          _details["details"][field] = stringify(result[field])

    return _details


def log_error(err_file, err_msg):
    """ make note of errors instead of failing ansible run cuz of callback"""
    with open(str(err_file), "a") as myfile:
            myfile.write(str(err_msg))


class CallbackModule(object):
    """
    This plugin makes use of the following environment variables:
        DASHR_LOG_DIRECTORY (else uses /var/log/ansible to create dashr logs)
    """

    def __init__(self):
        try:
            self.dashr_log_directory = os.getenv('DASHR_LOG_DIRECTORY', '/var/log/ansible')

            self.dashr_hostlog_directory = os.path.join(self.dashr_log_directory, "hosts")
            if not os.path.exists(self.dashr_hostlog_directory):
                os.makedirs(self.dashr_hostlog_directory)

            self.dashr_hostlog = os.path.join(self.dashr_log_directory, "dashr_log_hostlist.yaml")
            self.dashr_errorlog = os.path.join(self.dashr_log_directory, "dashr_log_hostlog.log")
            if not os.path.exists(self.dashr_hostlog):
                refresh_host_yaml(self.dashr_hostlog, [])
        except:
            print "ERROR: Dashr callback plug-in init failed.\n%s\n" % (sys.exc_info())
            this_script = os.path.realpath(__file__)
            os.rename(this_script, "%s.original" % this_script)
            print "For now we have renamed '%s' to '%s.original'. Report the issue, and re-apply the file once fixed." % (this_script, this_script)
            sys.exit(0)

    def on_any(self, *args, **kwargs):
        pass

    def runner_on_failed(self, host, res, ignore_errors=False):
        try:
            host_yaml = get_host_yaml(self.dashr_hostlog, self.dashr_hostlog_directory, host)
            _details = prepare_details(self, res, "failed")
            state_to_yaml(host_yaml, _details)
        except:
            err_msg = "* %s for 'runner_on_failed'\n%s\n---\n\n" % (host, str(sys.exc_info()))
            log_error(self.dashr_errorlog, err_msg)

    def runner_on_ok(self, host, res):
        try:
            host_yaml = get_host_yaml(self.dashr_hostlog, self.dashr_hostlog_directory, host)
            _details = prepare_details(self, res, "ok")
            state_to_yaml(host_yaml, _details)
        except:
            err_msg = "* %s for 'runner_on_ok'\n%s\n---\n\n" % (host, str(sys.exc_info()))
            log_error(self.dashr_errorlog, err_msg)

    def runner_on_error(self, host, msg):
        pass

    def runner_on_skipped(self, host, item=None):
        pass

    def runner_on_unreachable(self, host, res):
        try:
            host_yaml = get_host_yaml(self.dashr_hostlog, self.dashr_hostlog_directory, host)
            _details = prepare_details(self, res, "unreachable")
            state_to_yaml(host_yaml, _details)
        except:
            err_msg = "* %s for 'runner_on_unreachable'\n%s\n---\n\n" % (host, str(sys.exc_info()))
            log_error(self.dashr_errorlog, err_msg)

    def runner_on_no_hosts(self):
        pass

    def runner_on_async_poll(self, host, res, jid, clock):
        try:
            host_yaml = get_host_yaml(self.dashr_hostlog, self.dashr_hostlog_directory, host)
            state_to_yaml(host_yaml, res)
        except:
            err_msg = "* %s for 'runner_on_async_poll'\n%s\n---\n\n" % (host, str(sys.exc_info()))
            log_error(self.dashr_errorlog, err_msg)

    def runner_on_async_ok(self, host, res, jid):
        try:
            host_yaml = get_host_yaml(self.dashr_hostlog, self.dashr_hostlog_directory, host)
            _details = prepare_details(self, res, "ok")
            state_to_yaml(host_yaml, _details)
        except:
            err_msg = "* %s for 'runner_on_async_ok'\n%s\n---\n\n" % (host, str(sys.exc_info()))
            log_error(self.dashr_errorlog, err_msg)

    def runner_on_async_failed(self, host, res, jid):
        try:
            host_yaml = get_host_yaml(self.dashr_hostlog, self.dashr_hostlog_directory, host)
            _details = prepare_details(self, res, "failed")
            state_to_yaml(host_yaml, _details)
        except:
            err_msg = "* %s for 'runner_on_async_failed'\n%s\n---\n\n" % (host, str(sys.exc_info()))
            log_error(self.dashr_errorlog, err_msg)

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
