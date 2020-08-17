#!/bin/bash

echo -e '## Documentation\n' >> README.md
echo -e '\n```go\n' >> README.md
go doc -all blotjson >> README.md
echo -e '\n```'
