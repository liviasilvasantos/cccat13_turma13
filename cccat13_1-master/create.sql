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
	passenger_id uuid, 
	driver_id uuid, 
	status text,
	fare numeric, 
	distance numeric, 
	from_lat numeric, 
	from_lng numeric, 
	to_lat numeric, 
	to_lng numeric, 
	date timestamp
);

create table cccat13.position ( 
	position_id uuid,
	ride_id uuid,
	lat numeric, 
	lng numeric, 
	date timestamp
);