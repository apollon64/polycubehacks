#chromium index.html --allow-file-access-from-files
# Usage: bash how_to_launch.sh [script.rice]
# With no argument, loads index.html's default (part1_framebuffer.rice per index.js).
# With an argument, loads that file via index.html's ?query-string loader.
target="file://$(pwd)/index.html"
[ -n "$1" ] && target="file://$(pwd)/index.html?$1"
# --user-data-dir forces a fresh, separate browser process: without it, if a
# Chromium window is already running, this just sends the URL to that
# existing process over IPC and --allow-file-access-from-files is silently
# ignored (flags only apply to a brand-new process), which is what causes
# "failed to download <script>" -- the script XHR gets blocked by the
# default file:// same-origin policy.
echo "Start index.html?=$1"
chromium "$target" --allow-file-access-from-files --user-data-dir=/tmp/rice-chromium-profile
