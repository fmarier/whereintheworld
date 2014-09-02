test:
	json_verify < airports.json
	json_verify < db.json

uploaddb: test
	scp db.json nodeuser@whereis.fmarier.org:whereintheworld/
	ssh nodeuser@whereis.fmarier.org killall node || true
	ssh nodeuser@whereis.fmarier.org /home/nodeuser/restart_service.sh &

pushcode: test
	git push
	ssh nodeuser@whereis.fmarier.org killall node || true
	ssh nodeuser@whereis.fmarier.org /home/nodeuser/restart_service.sh &

deploy: pushcode uploaddb

update: uploaddb
