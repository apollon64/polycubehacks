#!/bin/bash
# Usage: bash how_to_take_screenshot.sh [script.rice]
# With no argument, loads index.html's default (part1_framebuffer.rice per index.js).
# With an argument, loads that file via index.html's ?query-string loader.
target="file://$(pwd)/index.html"
[ -n "$1" ] && target="file://$(pwd)/index.html?$1"
chromium --headless --disable-gpu --screenshot=output.png --window-size=1280,720 "$target" --virtual-time-budget=1000 --allow-file-access-from-files
