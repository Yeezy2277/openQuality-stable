#!/bin/bash

pathApk="$(pwd)/android/app/build/outputs/apk/release/app-release.apk"
pathDesktop="/Users/$(whoami)/Desktop"

stringName=$(grep -E '"name"' package.json)
notCutAppName=$(echo $stringName | cut -d: -f 2)
appName=$(echo $notCutAppName | tr -d '"' | tr -d ' ' | tr -d ',')

if [ -z "$appName" ]
  then 
  echo 'APPNAME IS EMPTY, CHECK YOU PACKAGE.JSON'
    exit 1
fi

if [ ! -f "$pathApk" ]
  then 
    echo 'APK FILE NOT EXIST, CHECK YOUR RELEASE DIRECTORY'
    exit 1
fi

read -p 'Enter application version: ' versionApp
echo $versionApp

renameApp=${pathDesktop}/${appName}_${versionApp}.apk
echo $renameApp

echo "NAME YOUR APPLICATION: $appName"
echo "VERSION YOUR APPLICATION: $versionApp"

cp $pathApk $renameApp || (echo 'ERROR COPY YOUR APK FILE' && exit 1)

echo "YOUR FILE HAS BEEN СOPIED: $renameApp"

