#!/usr/bin/env bash

THISDIR=$(dirname $0)

# BATCH
# set GOARCH=amd64
# set GOOS=linux
# go tool dist install -v pkg/runtime
# go install -v -a std
# go build dashr.go

GOARCH=amd64
GOOS=linux
mkdir -p $THISDIR/pkg
go build -o $THISDIR/pkg/dashr $THISDIR/dashr.go
