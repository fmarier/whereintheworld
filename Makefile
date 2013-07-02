test:
	json_verify < airports.json
	json_verify < db.json

uploaddb: test
	scp db.json app@whereisfrancois.personatest.org:code/
	ssh app@whereisfrancois.personatest.org forever restartall

pushcode:
	git push whereisfrancois HEAD:master

deploy: pushcode uploaddb

update: uploaddb
