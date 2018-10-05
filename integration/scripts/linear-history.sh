#!/bin/bash
git init
echo "1" >> test0.txt
git add . ; git commit -am '1'
git checkout -b topic1
echo "1" >> test1.txt
git add . ; git commit -am '2'
git checkout master
git checkout -b topic2
echo "1" >> test2.txt
git add . ; git commit -am '3'
git checkout master
echo "2" >> test0.txt
git commit -am '4'
git checkout topic1
echo "2" >> test1.txt
git commit -am '5'
git rebase master
git checkout master
git merge topic1 --no-edit --no-ff
git checkout topic2
git rebase master
echo "2" >> test2.txt
git commit -am '6'
git checkout master
git merge topic2 --no-edit --no-ff
git checkout -b topic3
echo "3" >> test1.txt
git commit -am '7'
git checkout master
git merge topic3 --no-edit --no-ff
