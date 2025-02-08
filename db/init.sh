#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "${POSTGRES_USER}" --dbname "${POSTGRES_DB}" <<-EOSQL
	CREATE USER ${POSTGRES_PLAYLISTER_USER} WITH PASSWORD '${POSTGRES_PLAYLISTER_PASSWORD}';
	GRANT ALL PRIVILEGES ON DATABASE ${POSTGRES_DB} TO ${POSTGRES_PLAYLISTER_USER};
    \connect ${POSTGRES_DB} ${POSTGRES_PLAYLISTER_USER};
    CREATE SCHEMA "playlister";

    CREATE TABLE playlister.loader (
        loader_id serial4 NOT NULL,
        class_name varchar(255) NOT NULL,
        "interval" interval NULL,
        CONSTRAINT loader_pkey PRIMARY KEY (loader_id)
    );

    CREATE TABLE playlister.loaderparams (
        loader_id int4 NOT NULL,
        "key" varchar(255) NOT NULL,
        value varchar(255) NOT NULL,
        CONSTRAINT loaderparams_loader_id_fkey FOREIGN KEY (loader_id) REFERENCES playlister.loader(loader_id)
    );
    CREATE INDEX loaderparams_loader_id ON playlister.loaderparams USING btree (loader_id);
    CREATE UNIQUE INDEX loaderparams_loader_id_key ON playlister.loaderparams USING btree (loader_id, key);

    CREATE TABLE playlister.station (
        id serial4 NOT NULL,
        "name" varchar(255) NOT NULL,
        loader_id int4 NOT NULL,
        CONSTRAINT station_pkey PRIMARY KEY (id),
        CONSTRAINT station_loader_id_fkey FOREIGN KEY (loader_id) REFERENCES playlister.loader(loader_id)
    );
    CREATE INDEX station_loader_id ON playlister.station USING btree (loader_id);
    CREATE UNIQUE INDEX station_name ON playlister.station USING btree (name);

    CREATE TABLE playlister.interpret (
        id serial4 NOT NULL,
        "name" varchar(255) NOT NULL,
        CONSTRAINT interpret_pkey PRIMARY KEY (id)
    );
    CREATE INDEX interpret_name ON playlister.interpret USING btree (name);
    CREATE TABLE playlister.interpretmetadata (
        interpret_id int4 NOT NULL,
        "key" varchar(255) NOT NULL,
        value varchar(255) NOT NULL,
        CONSTRAINT interpretmetadata_interpret_id_fkey FOREIGN KEY (interpret_id) REFERENCES playlister.interpret(id)
    );
    CREATE INDEX interpretmetadata_interpret_id ON playlister.interpretmetadata USING btree (interpret_id);
    CREATE UNIQUE INDEX interpretmetadata_interpret_id_key ON playlister.interpretmetadata USING btree (interpret_id, key);

    CREATE TABLE playlister.track (
        id serial4 NOT NULL,
        "name" varchar(255) NOT NULL,
        interpret_id int4 NOT NULL,
        CONSTRAINT track_pkey PRIMARY KEY (id),
        CONSTRAINT track_interpret_id_fkey FOREIGN KEY (interpret_id) REFERENCES playlister.interpret(id)
    );
    CREATE INDEX track_interpret_id ON playlister.track USING btree (interpret_id);
    CREATE INDEX track_name ON playlister.track USING btree (name);
    CREATE TABLE playlister.trackmetadata (
        track_id int4 NOT NULL,
        "key" varchar(255) NOT NULL,
        value varchar(255) NOT NULL,
        CONSTRAINT trackmetadata_track_id_fkey FOREIGN KEY (track_id) REFERENCES playlister.track(id)
    );
    CREATE INDEX trackmetadata_track_id ON playlister.trackmetadata USING btree (track_id);
    CREATE UNIQUE INDEX trackmetadata_track_id_key ON playlister.trackmetadata USING btree (track_id, key);

    CREATE TABLE playlister.trackplayed (
        "start" timestamptz NOT NULL,
        station_id int4 NOT NULL,
        track_id int4 NOT NULL,
        synced_at timestamptz NOT NULL,
        CONSTRAINT trackplayed_pkey PRIMARY KEY (station_id, start),
        CONSTRAINT trackplayed_station_id_fkey FOREIGN KEY (station_id) REFERENCES playlister.station(id),
        CONSTRAINT trackplayed_track_id_fkey FOREIGN KEY (track_id) REFERENCES playlister.track(id)
    );
    CREATE INDEX trackplayed_start ON playlister.trackplayed USING btree (start);
    CREATE INDEX trackplayed_station_id ON playlister.trackplayed USING btree (station_id);
    CREATE INDEX trackplayed_track_id ON playlister.trackplayed USING btree (track_id);

    INSERT INTO playlister.loader (loader_id, class_name, interval)
        SELECT seq, 'CzechRadioLoader', '0:10:00'
        FROM generate_series(1, 26) AS seq;

    INSERT INTO playlister.loaderparams (loader_id, "key", value) VALUES
        (1, 'stationname', 'radiozurnal'),
        (2, 'stationname', 'dvojka'),
        (3, 'stationname', 'vltava'),
        (4, 'stationname', 'plus'),
        (5, 'stationname', 'radiozurnal-sport'),
        (6, 'stationname', 'radiowave'),
        (7, 'stationname', 'radiojunior'),
        (8, 'stationname', 'd-dur'),
        (9, 'stationname', 'jazz'),
        (10, 'stationname', 'pohoda'),
        (11, 'stationname', 'webik'),
        (13, 'stationname', 'brno'),
        (14, 'stationname', 'cb'),
        (15, 'stationname', 'hradec'),
        (16, 'stationname', 'kv'),
        (17, 'stationname', 'liberec'),
        (18, 'stationname', 'olomouc'),
        (19, 'stationname', 'ostrava'),
        (20, 'stationname', 'pardubice'),
        (21, 'stationname', 'plzen'),
        (22, 'stationname', 'regina'),
        (23, 'stationname', 'strednicechy'),
        (24, 'stationname', 'sever'),
        (25, 'stationname', 'vysocina'),
        (26, 'stationname', 'zlin');

    INSERT INTO playlister.station (id, loader_id, "name") VALUES
        (1, 1, 'ČRo Radiožurnál'),
        (2, 2, 'ČRo Dvojka'),
        (3, 3, 'ČRo Vltava'),
        (4, 4, 'ČRo Plus'),
        (5, 5, 'ČRo Radiožurnál Sport'),
        (6, 6, 'ČRo Rádio Wave'),
        (7, 7, 'ČRo Rádio Junior'),
        (8, 8, 'ČRo D-dur'),
        (9, 9, 'ČRo Jazz'),
        (10, 10, 'ČRo Pohoda'),
        (11, 11, 'ČRo Rádio Junior +'),
        --(12, 12, 'ČRo Radio Prague Int.'),
        (13, 13, 'ČRo Brno'),
        (14, 14, 'ČRo České Budějovice'),
        (15, 15, 'ČRo Hradec Králové'),
        (16, 16, 'ČRo Karlovy Vary'),
        (17, 17, 'ČRo Liberec'),
        (18, 18, 'ČRo Olomouc'),
        (19, 19, 'ČRo Ostrava'),
        (20, 20, 'ČRo Pardubice'),
        (21, 21, 'ČRo Plzeň'),
        (22, 22, 'ČRo Rádio Praha'),
        (23, 23, 'ČRo Střední Čechy'),
        (24, 24, 'ČRo Sever'),
        (25, 25, 'ČRo Vysočina'),
        (26, 26, 'ČRo Zlín');
EOSQL
