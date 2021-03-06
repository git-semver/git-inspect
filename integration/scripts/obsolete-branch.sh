#!/bin/bash
git init
echo "1" >> test0.txt
git add .
git commit -am '1'

git checkout -b obsolete-branch
echo "1" >> test1.txt
git add .
git commit -am '2'
echo "2" >> test1.txt
git commit -am '3'

git checkout master
echo "3" >> test0.txt
git commit -am '4'
echo "4" >> test0.txt
git commit -am '5'

git checkout obsolete-branch
echo "5" >> test1.txt
git commit -am '6'
