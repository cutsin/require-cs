require-cs IEcompatible
=======================

前端加载、编译CoffeeScript, 修改自jrburke的require-cs, 删除require-cs的node部分，修改了一些bug

## Example

page:
```html
<script>
var require = {
  paths: {
    cs: 'https://github.com/cutsin/require-cs/blob/master/require-cs.js'
  }
}</script>
<script data-main="cs!app/main" src="//static.abc.com/j/pub/require/2.1.14.js"></script>
```
app/main.coffee
```javascript
require [
  'cs!common/baseModel'
], ->
  console.log 'yeah~'
```
