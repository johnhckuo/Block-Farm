#!/bin/bash
rm build/contracts/*
echo "===== Delete Complete ====="
echo "Now Compiling..."
truffle compile
echo "===== Compile Complete ====="
cp backup/*.json build/contracts
echo "===== Copy Complete ====="
truffle migrate --reset
echo "===== Migration Complete ====="
echo "Now running mocha test"
truffle test

