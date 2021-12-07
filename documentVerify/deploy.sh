#!/usr/bin/env bash

rm dist-*
npm i
npm run build
DIST_ZIP=$(ls|grep dist-)
mv "$DIST_ZIP" rest/
cd rest

#Предполагается, что подключение уже есть
#smpsync stands add nordclan http://nordclan.nsd.naumen.ru/sd/ -u naumen -p n@usd40
smpsync stands use nordclan
smpsync push -af

smpsync application upload -f "$DIST_ZIP" -c dashboards -t dashboards -h 400
rm "$DIST_ZIP"
