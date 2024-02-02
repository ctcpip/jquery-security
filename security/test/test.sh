#!/bin/sh

node ../server/index.cjs & SERVER_PID=$! ;
node --test ;
TEST_EXIT=$? ;
kill $SERVER_PID ;
exit $TEST_EXIT ;
