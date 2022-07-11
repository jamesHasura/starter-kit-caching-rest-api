SET check_function_bodies = false;
CREATE TABLE public.business_object_events (
    event_id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    operation text NOT NULL,
    object_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    finished_at timestamp with time zone
);
CREATE TABLE public.employee_cached_model (
    id text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    birth_date text NOT NULL
);
ALTER TABLE ONLY public.business_object_events
    ADD CONSTRAINT business_object_events_pkey PRIMARY KEY (event_id);
ALTER TABLE ONLY public.employee_cached_model
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);
