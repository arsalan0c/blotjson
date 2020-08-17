#!/bin/sh

rm README.md && cat docs/go_header.md >> README.md && cat ../../../docs/common_header.md >> README.md && docs/generate_body.sh >> README.md && cat ../../../docs/common_footer.md >> README.md
