#!/bin/bash
git init
echo "1" >> test0.txt
git add .
git commit -am '1'
echo "2" >> test0.txt
git commit -am '1'
echo "3" >> test0.txt
git commit -am '2'
echo "4" >> test0.txt
git commit -am '3'
echo "5" >> test0.txt
git commit -am '4'
echo "6" >> test0.txt
git commit -am '4'
echo "7" >> test0.txt
git commit -am '4'
echo "8" >> test0.txt
git commit -am '5'
echo "9" >> test0.txt
git commit -am '5'
