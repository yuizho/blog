#!/bin/sh
find ./content/posts/ -name "*.png" | xargs optipng -o5
find ./content/posts/ -name "*.jpg" -type f -exec jpegtran -copy none -optimize -outfile {} {} \;
