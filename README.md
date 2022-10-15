# db-backup-runner

unzip backup.tar.gz

pg_restore --clean -d 'postgresql://postgres:postgres@localhost:5432/peperino' .\backup.tar

https://console.cloud.google.com/storage/browser?hl=de&project=peperino-app&prefix=