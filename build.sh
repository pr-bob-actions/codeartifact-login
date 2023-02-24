#! /bin/sh

BUILD="./dist"
TMP="$BUILD/tmp"

clean_tmp() {
	echo "Clean tmp directory"
	if [ -d "$TMP" ]; then
		rm -rf $TMP
	fi
}

clean_tmp

echo "Build main"
yarn ncc build ./src/main.ts -o $TMP
cp $TMP/index.js $BUILD/main.js

echo "Build clean"
yarn ncc build ./src/clean.ts -o $TMP
cp $TMP/index.js $BUILD/clean.js

clean_tmp
