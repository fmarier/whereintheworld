# Where in the World

Simple application to share your travel plans with friends, family and colleagues.

## Installation

1. clone the repository
2. install all dependencies

        npm install
3. write a JSON database file (see `sampledb.json`)
4. start the application

        npm start
5. open <http://localhost:3000> in your browser

## Deploying using awsbox

1. create a new VM

    node_modules/.bin/awsbox create -d -t t1.micro -p whereisfrancois.crt  -s whereisfrancois.key  --ssl force -u https://whereisfrancois.personatest.org -n whereisfrancois
2. deploy the code

    make deploy

### Updating the database

1. edit `db.json`
2. copy the db to the app server

        scp db.json app@whereisfrancois.personatest.org:code/
3. restart the service

        ssh app@whereisfrancois.personatest.org
        forever restartall

## Copyright notice

Copyright (C) 2013  Francois Marier <francois@fmarier.org>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
