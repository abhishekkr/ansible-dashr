package main

import (
	"bufio"
	"flag"
	"fmt"
	"os"
	"regexp"
)

var (
	mainlogPattern      = createPattern(`^(PLAY|TASK\:|FATAL\:|ok\:|changed\:|failed\:)`)
	playPattern         = createPattern(`^PLAY\s*\[*([a-zA-Z0-9]*)\]*`)
	taskPattern         = createPattern(`^TASK\:\s*\[\s*([^|\]]*)\s*|\s*([^|\]]*)\s*\]`)
	fatalPattern        = createPattern(`^FATAL:\s*(.*)`)
	statusPattern       = createPattern(`^(ok|changed|failed):\s*\[([^\]]*)\](.*)`)
	statusDetailPattern = createPattern(`\s*=>\s*(.*)\s*`) //gives out json with task status detail for that node
)

func createPattern(pattern string) *regexp.Regexp {
	regex, err := regexp.Compile(pattern)
	if err != nil {
		panic("There was a problem with the regular expression.")
	}
	return regex
}

func lineToDetails(line, line_type string) {
	switch line_type {
	case "PLAY":
		playbook := playPattern.FindStringSubmatch(line)
		fmt.Printf("PLAYBOOK: %q\n", playbook[1])
	case "TASK:":
		task := taskPattern.FindStringSubmatch(line)
		fmt.Printf("TASK: %q\n", task[1])
	case "FATAL:":
		fatal := fatalPattern.FindStringSubmatch(line)
		fmt.Printf("FATAL: %q\n", fatal[1])
	case "ok:", "changed:", "failed:":
		status := statusPattern.FindStringSubmatch(line)
		var statusDetail string
		if statusDetailPattern.MatchString(status[3]) {
			statusDetail = statusDetailPattern.FindStringSubmatch(status[3])[1]
		}
		updateStatus(status[1], status[2], statusDetail)
	}
}

func updateStatus(status, node, detail string) {
	switch status {
	case "ok":
		fmt.Printf("%s is ok:\n%s\n", node, detail)
	case "changed":
		fmt.Printf("%s is changed:\n%s\n", node, detail)
	case "failed":
		fmt.Printf("%s is failed:\n%s\n", node, detail)
	}
}

func grep(regex *regexp.Regexp, filename string) {
	fh, err := os.Open(filename)
	f := bufio.NewReader(fh)

	if err != nil {
		fmt.Println("ERROR: There was a problem opening the file.")
		return
	}
	defer fh.Close()

	buf := make([]byte, 1024)
	for {
		buf, _, err = f.ReadLine()
		if err != nil {
			return
		}

		line := string(buf)
		match_line := regex.FindStringSubmatch((line))
		if len(match_line) > 0 {
			lineToDetails(line, match_line[1])
		}
	}
}

func main() {
	flag.Parse()
	if flag.NArg() == 1 {
		logfile := flag.Arg(0)
		grep(mainlogPattern, logfile)
	} else {
		fmt.Printf("Wrong number of arguments.\n")
	}
}
