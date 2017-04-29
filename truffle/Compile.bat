del build\contracts\*
truf compile
copy build\backup\*.json build\contracts
truf test
