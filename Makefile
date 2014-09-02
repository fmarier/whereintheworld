test:
	json_verify < airports.json
	json_verify < db.json

uploaddb: test
	scp db.json nodeuser@whereis.fmarier.org:whereintheworld/
	ssh nodeuser@whereis.fmarier.org killall node || true
	ssh nodeuser@whereis.fmarier.org /home/nodeuser/restart_service.sh &

pushcode:
	git push whereisfrancois HEAD:master

deploy: pushcode uploaddb

update: uploaddb
