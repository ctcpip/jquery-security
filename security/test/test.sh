#!/bin/sh

node ../server/index.cjs & SERVER_PID=$! ;
tap run --allow-empty-coverage;
TEST_EXIT=$? ;
kill $SERVER_PID ;
exit $TEST_EXIT ;
