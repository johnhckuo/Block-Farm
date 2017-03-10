#!/bin/bash
rm build/contracts/*
echo "===== Delete Complete ====="
echo "Now Compiling..."
truffle compile
echo "===== Compile Complete ====="
cp build/Congress.json build/contracts
echo "===== Copy Complete ====="
truffle migrate
echo "===== Migration Complete ====="
echo "Now running mocha test"
truffle test
