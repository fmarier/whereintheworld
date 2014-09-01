test:
	json_verify < airports.json
	json_verify < db.json

uploaddb: test
	scp db.json nodeuser@whereis.fmarier.org:whereintheworld/

pushcode:
	git push whereisfrancois HEAD:master

deploy: pushcode uploaddb

update: uploaddb
