#!/bin/bash

cat > /app/src/env.js << EOF
(function(window) {
window.__env = window.__env || {};
window.__env.environmentName  = "${1}";

})(this);
EOF
cat /app/src/env.js
#cat /usr/share/nginx/html/env.js

