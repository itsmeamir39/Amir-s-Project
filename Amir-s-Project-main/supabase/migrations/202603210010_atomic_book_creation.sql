create or replace function public.create_biblio_with_item(
  p_isbn text,
  p_title text,
  p_author text,
  p_publisher text,
  p_description text default null,
  p_cover_url text default null,
  p_barcode text default null
)
returns table (
  biblio_id bigint,
  barcode text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_biblio_id bigint;
  v_barcode text;
begin
  insert into public.biblios (
    isbn,
    title,
    author,
    publisher,
    description,
    cover_url
  ) values (
    nullif(trim(p_isbn), ''),
    trim(p_title),
    trim(p_author),
    trim(p_publisher),
    nullif(trim(coalesce(p_description, '')), ''),
    nullif(trim(coalesce(p_cover_url, '')), '')
  )
  returning id into v_biblio_id;

  v_barcode := coalesce(
    nullif(trim(coalesce(p_barcode, '')), ''),
    'LIB-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8))
  );

  insert into public.items (biblio_id, barcode, status)
  values (v_biblio_id, v_barcode, 'available');

  return query select v_biblio_id, v_barcode;

exception
  when unique_violation then
    if strpos(SQLERRM, 'biblios_isbn_unique') > 0 then
      raise exception using
        errcode = '23505',
        message = 'A book with this ISBN already exists.';
    elsif strpos(SQLERRM, 'items_barcode_unique') > 0 then
      raise exception using
        errcode = '23505',
        message = 'Generated barcode conflict. Please retry.';
    else
      raise;
    end if;
end;
$$;

grant execute on function public.create_biblio_with_item(text, text, text, text, text, text, text)
to authenticated;
