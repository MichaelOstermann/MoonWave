curl -LO https://github.com/lucide-icons/lucide/archive/refs/heads/main.zip
unzip main.zip

bun scripts/icon-data.js

rm -f main.zip
rm -rf lucide-main
