#!/bin/sh

for file in `ls ./content/posts/*.{jpg,jpeg,png}` ; do
    cwebp "${file}" -o "${file%.*}.webp"
done

rm ./content/posts/*.{jpg,jpeg,png}
find ./content/posts/ -type f -name "*.md" -print0 | xargs -0 sed -i -e "s/.jpg/.webp/g" -e "s/.jpeg/.webp/g" -e "s/.png/.webp/g"
