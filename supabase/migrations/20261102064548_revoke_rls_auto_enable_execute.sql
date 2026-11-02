-- rls_auto_enable() es la función del event trigger "ensure_rls".
-- No necesita ser invocable por la API; el event trigger sigue funcionando.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
