
# resizable

  UI Resizable component, make any element resizable.

## Installation

    $ component install ui-component/resizable

## Example

```js
var resizable = require('resizable')(myElement);
resizable.set('handles', 'se, s, e');
resizable.build();
```

## API

### resizable(el[, opts])

  Create a new `Resizable` instance.

### resizable.set(optname, optvalue)

  Set options.

### resizable.build()

  bind events and append handles.

### resizable.destroy()

  unbind events and remove handles.
   

## License

  MIT
