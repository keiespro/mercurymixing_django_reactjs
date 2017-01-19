# Mercury Mixing

- Mezzanine for content management
- Django REST Framework the the Mixing API
- React / Redux for the Mixing frontend

Note: The Mixing fronted has it's own README (see `mixing/frontend/README.md`).

## Notes

- **Running tests**: To run tests, call `python manage.py test mixing.tests
  mixing.purchases`. Trying to run `test` directly on `mixing` will result in a
  bunch of import errors.

- **Testing DB**: The project has been developed and runs on a Postgres
  database. Trying to run the test suite on SQLite will result in failing tests
  because SQLite doesn't raise `IntegrityError`, which is used in a few places
  in the code. This means that the Postgres user that runs the development
  database must also have permission to create new databases. You can achieve
  this in `psql` by running: `ALTER USER username CREATEDB;`.
