drop schema cccat13 cascade;

create schema cccat13;

create table cccat13.account (
	account_id uuid,
	name text,
	email text,
	cpf text,
	car_plate text,
	is_passenger boolean,
	is_driver boolean,
	date timestamp,
	is_verified boolean,
	verification_code uuid
);

create table cccat13.ride (
	ride_id uuid,
	account_id text,
	from_lat float,
	from_lng float,
	to_lat float,
	to_lng float,
	date timestamp,
	status text
);
