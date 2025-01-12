ALTER TABLE public.current_print_batch DROP CONSTRAINT current_print_batch_pkey;
ALTER TABLE public.current_print_batch ADD PRIMARY KEY (user_id, file_path);
