curl -LO https://github.com/lucide-icons/lucide/releases/download/0.561.0/lucide-icons-0.561.0.zip
unzip lucide-icons-0.561.0.zip

bun scripts/icon-data.js

rm -f lucide-icons-0.561.0.zip
rm -rf icons
