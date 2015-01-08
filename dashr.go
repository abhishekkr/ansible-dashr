package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
)

func main() {
	dashr_ip := flag.String("fqdn", "127.0.0.1", "IP/FQDN to run HTTP listener at")
	dashr_port := flag.String("http", "8001", "port to run HTTP listener at")
	connection_string := fmt.Sprintf("%s:%s", *dashr_ip, *dashr_port)

	www_data := flag.String("www", "www-data", "path to ansible dashr static site content")
	www_data_uri := fmt.Sprintf("/%s/", *www_data)

	ansible_setup := flag.String("ansible", "dummy-ansible-files", "path to ansible setup root of Playbooks, Roles Dir")
	ansible_setup_uri := fmt.Sprintf("/%s/", *ansible_setup)

	dashr_config := flag.String("config", "config", "path to fetch/save Config used by Static Site Content")
	dashr_config_uri := fmt.Sprintf("/%s/", *dashr_config)

	dashr_fs := http.FileServer(http.Dir(*www_data))
	http.Handle(www_data_uri, http.StripPrefix(www_data_uri, dashr_fs))

	ansible_fs := http.FileServer(http.Dir(*ansible_setup))
	http.Handle(ansible_setup_uri, http.StripPrefix(ansible_setup_uri, ansible_fs))

	config_fs := http.FileServer(http.Dir(*dashr_config))
	http.Handle(dashr_config_uri, http.StripPrefix(dashr_config_uri, config_fs))

	log.Println("Ansible Dashr @", connection_string)
	http.ListenAndServe(connection_string, nil)
}
