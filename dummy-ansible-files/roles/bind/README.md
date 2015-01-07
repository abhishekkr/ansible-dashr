[![Build Status](https://travis-ci.org/resmo/ansible-role-bind.png?branch=master)](https://travis-ci.org/resmo/ansible-role-bind)

# Ansible Bind Role

An ansible role for installing and managing bind, acting as primary and/or secondary nameserver. 
It does also copy the master zone files (`bind_masterzones_path`), but however, the zone files must exist.


## Configuration:

Define where your zones files are stored:

      bind_masterzones_path: path/to/zones_dir

Configure the domains of the zones for a bind act as primary nameserver:

      bind_config_master_zones:
        - name: example.com
        - name: example2.com
        - name: example3.com

Optionally: If your zone should be synced with secondary nameservers, define the IPs of those:

      bind_config_master_allow_transfer:
        - 127.0.0.1
        - 127.0.0.2

Optionally: If your nameservers acts as a secondary nameserver, here is a sample setup:

      bind_config_slave_zones:
        - name: example.net
          masters: [ '127.1.0.1', '127.1.0.2' ]
          zones:
            - example.net
            - example.org


## Dependencies

None.


## Example Playbook

    ---
    - hosts: nameservers
      remote_user: root
      roles:
         - { role: resmo.bind }


## License

BSD


## Author Information

René Moser <mail@renemoser.net>
