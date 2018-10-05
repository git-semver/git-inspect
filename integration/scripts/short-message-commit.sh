#!/bin/bash
git init
echo "1" >> test0.txt
git add .
git commit -am $'Normal ... Commit is GOOD\n\nThis description'
echo "2" >> test0.txt
git commit -am 'Short message commit'
echo "3" >> test0.txt
git commit -am $'Good commit\n\nWith full description'
