#!/bin/bash
rm build/contracts/Congress.json
rm build/contracts/usingProperty.json
echo "===== Delete Complete ====="
echo "Now Compiling..."
truffle compile
rm build/contracts/Congress.json
echo "===== Compile Complete ====="
cp backup/Congress.json build/contracts
echo "===== Copy Complete ====="
truffle migrate --reset
echo "===== Migration Complete ====="
echo "Now running mocha test"
truffle test

