# Assistant

## Installation

```
git clone https://github.com/RobinMalfait/Assistant.git
npm install
gulp build
npm run electron
```

## Plugins

A list of plugins can be found at [PersonalAssistant](https://github.com/PersonalAssistant). When you install the assistant, there will be a command `plugin list online` which shows you all the plugins available on this organisation account.

### Writing Your Own

**_NOTE:_ The code examples are with ES2015, but make sure that you compile it to ES5 and link to it in your package.json**

A plugin is very easy, it is just a file that receives a robot object:

```js
module.exports = robot => {
    const h = robot.h
    const Immutable = robot.immutable

    robot.listen(/Regex Command/, "Command Description", res => {
        // Do things when "Regex Command" is in the input
    })
}
```

The robot has 2 attributes which you can use:

- `h` - h, is a javascript way for writing html, using h we can optimize the speed of the application, more information can be found [here](https://github.com/Matt-Esch/virtual-dom)
- `Immutable` - Immutable js is also used for performance reasons, mor information can be found [here](https://facebook.github.io/immutable-js/docs/#/)

The robot also has a few methods you can use to build your plugin.

- `listen(regex, description, callback)` - This way you can listen for certain input and react accordingly
- `spawnCard(type, contents)` - You can spawn cards using this method, available cards:
    - `blank`
    - `empty`
    - `images`
    - `list`
    - `table`
- `speak(message, options)` - You can make your plugin speak, **Make It English Only**
- `on(event, callback)` - You can listen for certain events, and perform an action accordingly
- `fire(event, data)` - You can fire an event and provide optional data

### Events

Here are some interesting events you can listen for or which you can fire.

#### Fireable Events

- `plugins:fetch_plugin_list`

    ```js
    robot.fire('plugins:fetch_plugin_list', list => {
        // list is the list of plugins currently installed.
    })
    ```

- `notification:error`

    ```js
    robot.fire('notification:error', 'Some message you want so show of type error')
    ```

- `notification:info`

    ```js
    robot.fire('notification:info', 'Some message you want so show of type info')
    ```

- `notification:success`

    ```js
    robot.fire('notification:success', 'Some message you want so show of type success')
    ```

- `notification:warning`

    ```js
    robot.fire('notification:warning', 'Some message you want so show of type warning')
    ```

- `history:clear`

    Clear the history of all the commands ran in the input box.

    ```js
    robot.fire('history:clear')
    ```

- `history:undo`

    ```js
    robot.fire('history:undo')
    ```

- `history:redo`

    ```js
    robot.fire('history:redo')
    ```

- `clear`

    ```js
    robot.fire('clear')
    ```

- `clear:screen`

    ```js
    robot.fire('clear:screen')
    ```

### Icons

You can use [FontAwesome](http://fontawesome.io) icons, just add a class like for example: `h('span.fa.fa-terminal')`. We use version **4.5.0**, we try to keep up to date, but when there is a new version and we didn't upgrade yet, feel free to file an issue.

### Useful CSS Classes

> Colors are based on [Google Material Color Palette](https://www.google.com/design/spec/style/color.html#color-color-palette)

| Class | Description |
| :---- | :---------- |
| `.right` | Float an element to the right |
| `.left` | Float an element to the left |
| `.clearfix` | Put a clearfix on an element, put it on the parent of floating elements |
| `.breathing` | Some breathing room, `margin: 0 8px` |
| `.text-theme` | The color of your current theme, with the **500** weight applied to it |
| `.text-red-50` | Text with the following color: <font style="color: #ffebee;">#ffebee</font> |
| `.text-red-100` | Text with the following color: <font style="color: #ffcdd2;">#ffcdd2</font> |
| `.text-red-200` | Text with the following color: <font style="color: #ef9a9a;">#ef9a9a</font> |
| `.text-red-300` | Text with the following color: <font style="color: #e57373;">#e57373</font> |
| `.text-red-400` | Text with the following color: <font style="color: #ef5350;">#ef5350</font> |
| `.text-red-500` or `.text-red` | Text with the following color: <font style="color: #f44336;">#f44336</font> |
| `.text-red-600` | Text with the following color: <font style="color: #e53935;">#e53935</font> |
| `.text-red-700` | Text with the following color: <font style="color: #d32f2f;">#d32f2f</font> |
| `.text-red-800` | Text with the following color: <font style="color: #c62828;">#c62828</font> |
| `.text-red-900` | Text with the following color: <font style="color: #b71c1c;">#b71c1c</font> |
| `.text-red-A100` | Text with the following color: <font style="color: #ff8a80;">#ff8a80</font> |
| `.text-red-A200` | Text with the following color: <font style="color: #ff5252;">#ff5252</font> |
| `.text-red-A400` | Text with the following color: <font style="color: #ff1744;">#ff1744</font> |
| `.text-red-A700` | Text with the following color: <font style="color: #d50000;">#d50000</font> |
| `button.button--red` | A button with background color <font style="color: white; padding: 4px 6px;background-color: #c62828;">#c62828</font> this uses the `800` level, but when hoverd or active it will be the `600` version <font style="color: white; padding: 4px 6px;background-color: #e53935;">#e53935</font> |
| `.text-pink-50` | Text with the following color: <font style="color: ##fce4ec;">#fce4ec</font> |
| `.text-pink-100` | Text with the following color: <font style="color: ##f8bbd0;">#f8bbd0</font> |
| `.text-pink-200` | Text with the following color: <font style="color: ##f48fb1;">#f48fb1</font> |
| `.text-pink-300` | Text with the following color: <font style="color: ##f06292;">#f06292</font> |
| `.text-pink-400` | Text with the following color: <font style="color: ##ec407a;">#ec407a</font> |
| `.text-pink-500` or `.text-pink` | Text with the following color: <font style="color: ##e91e63;">#e91e63</font> |
| `.text-pink-600` | Text with the following color: <font style="color: ##d81b60;">#d81b60</font> |
| `.text-pink-700` | Text with the following color: <font style="color: ##c2185b;">#c2185b</font> |
| `.text-pink-800` | Text with the following color: <font style="color: ##ad1457;">#ad1457</font> |
| `.text-pink-900` | Text with the following color: <font style="color: ##880e4f;">#880e4f</font> |
| `.text-pink-A100` | Text with the following color: <font style="color: ##ff80ab;">#ff80ab</font> |
| `.text-pink-A200` | Text with the following color: <font style="color: ##ff4081;">#ff4081</font> |
| `.text-pink-A400` | Text with the following color: <font style="color: ##f50057;">#f50057</font> |
| `.text-pink-A700` | Text with the following color: <font style="color: ##c51162;">#c51162</font> |
| `button.button--pink` | A button with background color <font style="color: white; padding: 4px 6px;background-color: #ad1457;">#ad1457</font> this uses the `800` level, but when hoverd or active it will be the `600` version <font style="color: white; padding: 4px 6px;background-color: #d81b60;">#d81b60</font> |

(To be continued...)