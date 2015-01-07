package main

import (
	"log"
	"net/http"
)

func main() {
	dashr_fs := http.FileServer(http.Dir("www-data"))
	http.Handle("/www-data/", http.StripPrefix("/www-data/", dashr_fs))

	ansible_fs := http.FileServer(http.Dir("dummy-ansible-files"))
	http.Handle("/dummy-ansible-files/", http.StripPrefix("/dummy-ansible-files/", ansible_fs))

	log.Println("Ansible Dashr @ localhost:8001")
	http.ListenAndServe(":8001", nil)
}
