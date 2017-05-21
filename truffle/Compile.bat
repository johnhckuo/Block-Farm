del build\contracts\Congress.json
del build\contracts\usingProperty.json
truf compile
del build\contracts\Congress.json
copy build\backup\*.json build\contracts
truf migrate --reset
truf test
