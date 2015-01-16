package main

import (
	"bufio"
	"flag"
	"fmt"
	"os"
	"regexp"
)

var (
	mainlogPattern = createPattern(`^(TASK\:|PLAY|FATAL\:|ok\:|changed\:|failed\:)`)
	playPattern    = createPattern(`^PLAY\s*\[*([a-zA-Z0-9]*)\]*`)
	taskPattern    = createPattern(`^TASK\:\s*\[([^\]]*)|([^\]]*)\]`)
	fatalPattern   = createPattern(`^FATAL:\s*(.*)`)
	okPattern      = createPattern(`^ok:\s*\[([^\]]*)|([^\]]*)\]`)
	changedPattern = createPattern(`^changed:\s*\[([^\]]*)|([^\]]*)\]`)
	failedPattern  = createPattern(`^failed:\s*\[([^\]]*)|([^\]]*)\]`)
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
		fmt.Printf("FATAL: %q\n", fatal)
	case "ok:":
		ok := okPattern.FindStringSubmatch(line)
		fmt.Printf("ok: %q\n", ok)
	case "changed:":
		changed := changedPattern.FindStringSubmatch(line)
		fmt.Printf("changed: %q\n", changed)
	case "failed:":
		failed := failedPattern.FindStringSubmatch(line)
		fmt.Printf("failed: %q\n", failed)
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
