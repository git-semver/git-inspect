#!/bin/bash
git init
echo "1" >> test0.txt
git add .
git commit -am 'Normal ... Commit is GOOD'
echo "2" >> test0.txt
# Error commit message with:
# "This is not normal but is very long title. Bad commit12345678901234"
# TODO check this error
git commit -am 'This is not normal but is very long title. Bad commit'
echo "3" >> test0.txt
git commit -am 'Again normal commit'
echo "4" >> test0.txt
git commit -am 'Again normal commit'
echo "5" >> test0.txt
git commit -am 'Again normal commit'
echo "6" >> test0.txt
git commit -am 'Again normal commit'
