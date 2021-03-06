all: index.html test

clean:
	@rm -f index.html

test:
	@echo -n "airports.json: "
	@json_verify < airports.json
	@if [ -e db.json ] ; then echo -n "db.json: " ; json_verify < db.json ; else true ; fi

index.html: db.json whereintheworld airports.json
	@./whereintheworld db.json > index.html

upload: index.html
	@scp -r index.html img/ css/ whereis.fmarier.org:/var/www/whereis-fmarier/
