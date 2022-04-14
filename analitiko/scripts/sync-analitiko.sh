#!/bin/bash

# This bash script starts the analitiko blockchain
# analytics middleware only. The the shiny server for the associated model
# will also be deployed. Automated model deployments will not
# have accurate information until both Monero LMDB and Analitiko
# PGDB have completed synchronization.
MODEL_PATH=/infosec/analitiko/scripts/$1
echo "Setting R environment"
touch $MODEL_PATH/.Renviron
echo "DEV_ENV=docker" >> $MODEL_PATH/.Renviron
echo "PG_USER=$2" >> $MODEL_PATH/.Renviron
echo "PG_CRED=$3" >> $MODEL_PATH/.Renviron
echo "PG_HOST=$4" >> $MODEL_PATH/.Renviron
echo "PG_DB_NAME=$5" >> $MODEL_PATH/.Renviron
echo "SHINY_PORT=$8" >> $MODEL_PATH/.Renviron
sleep 5
echo "Updating analitiko"
cd /infosec/analitiko && git pull && npm run clean && npm run build
sleep 5
echo "Starting analitko..."
cd /infosec/analitiko && pm2 start /infosec/analitiko/dist/analitiko.js -- -u $2 -c $3 -h $4 -p 5432 -n $5 \
-l ERROR,INFO,PERF --num-blocks $6 --daemon-host $7
pm2 describe 0
tail -f /root/.pm2/logs/analitiko-out.log &
sleep 5
echo "Deploying $MODEL_PATH..."
cd $MODEL_PATH && Rscript app.R
