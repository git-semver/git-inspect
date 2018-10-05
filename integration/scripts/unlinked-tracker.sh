#!/bin/bash
git init
echo "1" >> test0.txt
git add .
git commit -am 'PROJ-001 1'
echo "2" >> test0.txt
git commit -am '2 unlinked'
git checkout -b feature
echo "1" >> test1.txt
git add .
git commit -am 'FEA-001 2'
echo "2" >> test1.txt
git commit -am 'FEA-001 3'
echo "3" >> test1.txt
git commit -am '3 unlinked'
git checkout master
echo "3" >> test0.txt
git commit -am 'PROJ-001 2'
echo "4" >> test0.txt
git commit -am '4 unlinked'
