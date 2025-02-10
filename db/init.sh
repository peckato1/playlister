#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "${POSTGRES_USER}" --dbname "${POSTGRES_DB}" <<-EOSQL
	CREATE USER ${POSTGRES_PLAYLISTER_USER} WITH PASSWORD '${POSTGRES_PLAYLISTER_PASSWORD}';
	GRANT ALL PRIVILEGES ON DATABASE ${POSTGRES_DB} TO ${POSTGRES_PLAYLISTER_USER};
    \connect ${POSTGRES_DB} ${POSTGRES_PLAYLISTER_USER};
    CREATE SCHEMA "playlister";

    CREATE TABLE playlister.station (
        id serial4 NOT NULL,
        "name" varchar(255) NOT NULL,
        loader_class varchar(255) NOT NULL,
        loader_interval interval NULL,
        CONSTRAINT station_pkey PRIMARY KEY (id)
    );
    CREATE UNIQUE INDEX station_name ON playlister.station USING btree (name);

    CREATE TABLE playlister.loaderparams (
        station_id int4 NOT NULL,
        "key" varchar(255) NOT NULL,
        value varchar(255) NOT NULL,
        CONSTRAINT loaderparams_station_id_fkey FOREIGN KEY (station_id) REFERENCES playlister.station(id)
    );
    CREATE INDEX loaderparams_station_id ON playlister.loaderparams USING btree (station_id);
    CREATE UNIQUE INDEX loaderparams_station_id_key ON playlister.loaderparams USING btree (station_id, key);

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

    INSERT INTO playlister.station (id, "name", "loader_class", "loader_interval") VALUES
        (1, 'ČRo Radiožurnál', 'CzechRadioLoader', null),
        (2, 'ČRo Dvojka', 'CzechRadioLoader', null),
        (3, 'ČRo Vltava', 'CzechRadioLoader', null),
        (4, 'ČRo Plus', 'CzechRadioLoader', null),
        (5, 'ČRo Radiožurnál Sport', 'CzechRadioLoader', null),
        (6, 'ČRo Rádio Wave', 'CzechRadioLoader', null),
        (7, 'ČRo Rádio Junior', 'CzechRadioLoader', null),
        (8, 'ČRo D-dur', 'CzechRadioLoader', null),
        (9, 'ČRo Jazz', 'CzechRadioLoader', null),
        (10, 'ČRo Pohoda', 'CzechRadioLoader', null),
        (11, 'ČRo Rádio Junior +', 'CzechRadioLoader', null),
        --(12, 'ČRo Radio Prague Int.', 'CzechRadioLoader', null),
        (13, 'ČRo Brno', 'CzechRadioLoader', null),
        (14, 'ČRo České Budějovice', 'CzechRadioLoader', null),
        (15, 'ČRo Hradec Králové', 'CzechRadioLoader', null),
        (16, 'ČRo Karlovy Vary', 'CzechRadioLoader', null),
        (17, 'ČRo Liberec', 'CzechRadioLoader', null),
        (18, 'ČRo Olomouc', 'CzechRadioLoader', null),
        (19, 'ČRo Ostrava', 'CzechRadioLoader', null),
        (20, 'ČRo Pardubice', 'CzechRadioLoader', null),
        (21, 'ČRo Plzeň', 'CzechRadioLoader', null),
        (22, 'ČRo Rádio Praha', 'CzechRadioLoader', null),
        (23, 'ČRo Střední Čechy', 'CzechRadioLoader', null),
        (24, 'ČRo Sever', 'CzechRadioLoader', null),
        (25, 'ČRo Vysočina', 'CzechRadioLoader', null),
        (26, 'ČRo Zlín', 'CzechRadioLoader', null);

    INSERT INTO playlister.loaderparams (station_id, "key", value) VALUES
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

EOSQL
