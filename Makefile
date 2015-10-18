deploy: pushcode uploaddb

test:
	@echo -n "airports.json: "
	@json_verify < airports.json
	@if [ -e db.json ] ; then echo -n "db.json: " ; json_verify < db.json ; else true ; fi

uploaddb: test
	scp db.json nodeuser@whereis.fmarier.org:whereintheworld/
	ssh nodeuser@whereis.fmarier.org killall node || true
	ssh nodeuser@whereis.fmarier.org /home/nodeuser/restart_service.sh &

pushcode: test
	git push
	ssh nodeuser@whereis.fmarier.org killall node || true
	ssh nodeuser@whereis.fmarier.org /home/nodeuser/restart_service.sh &

update: uploaddb
