<p align=center>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-dae1e7.svg"></a>
  <a><img src=https://github.com/arsalanc-v2/blotjson/workflows/Go%20CI/badge.svg></a>
  <a><img src=https://img.shields.io/codecov/c/github/arsalanc-v2/blotjson/master.svg></a>
  <a href="https://codeclimate.com/github/arsalanc-v2/blotjson/maintainability"><img src="https://api.codeclimate.com/v1/badges/c9aeea9413e7fd863224/maintainability" /></a>
</p>
<p align=center><img src="https://raw.githubusercontent.com/arsalanc-v2/blotjson/master/logo_light.svg"></p>

<p align=center><b>blotjson</b></p>

<p align=center><i>blotjson</i> is a tool to help you make sense of API responses by displaying JSON in a browser, <br />directly from backend code where the JSON is received</p>

---

## Why *blotjson*?
* There is no need to copy/paste or export your data
* Everything is done locally on your own computer
* An arbitrary number of JSON datum can be easily visualised
## Documentation


```go


package blotjson // import "blotjson"


FUNCTIONS

func SetPort(customPort int) error
    SetPort sets the port number to the provided number, which should be between
    1024 and 65535 (inclusive)

func ShouldOpenBrowser(open bool)
    ShouldOpenBrowser Sets whether the browser should be automatically opened.
    true by default

func Visualise(jsonStr string) error
    Visualise Displays json data in a browser


```

## Acknowledgements

The design of displaying the data is in part inspired by [Swagger](https://swagger.io)
