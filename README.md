# Fitness
> Fit Text To Parent Element

## Options
> To set options, just add attributes to parent container.

### Fix font size on window resize event

```html
<div class="tofit" data-fix-on-resize="true">Text to fit</div>
```

Values: `true` `false`
Default: `false`


### Vertical alignment

```html
<div class="tofit" data-vertical-align="middle">Text to fit</div>
```

Values: `top` `middle` `bottom`
Default: `top`


### Horizontal alignment

```html
<div class="tofit" data-horizontal-align="center">Text to fit</div>
```

Values: `left` `center` `right` `justify`
Default: `left`


### Prevent text to wrap

```html
<div class="tofit" data-nowrap="true">Text to fit</div>
```

Values: `true` `false`
Default: `false`


### Group Elements
> If group of dom elements have same attribute `data-group=""`, all elements will have equal smallest font size of group.

```html
<div class="tofit" data-group="myGroup">Text to fit</div>
<div class="tofit" data-group="myGroup">Second text to fit</div>
```

Values: `any string`


#### _!!! Take care about: the text will be moved in new two nested divs. It may brake text styles._

The code:

```html
<div class="fittext" data-fix-on-resize="true" data-horizontal-align="right" data-vertical-align="bottom">
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti eniamus commod
</div>
```

will generate:
```html
<div class="fittext" data-fix-on-resize="true" data-horizontal-align="right" data-vertical-align="bottom">
    <div style="position:relative;width:100%;height:100%">
        <div style="position: absolute; top: 0px; left: 0px; display: inline-block; text-align: center; white-space: normal; width: 100%; font-size: 40px; margin-top: 1px; margin-bottom: 1px;">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti eniamus commod
        </div>
    </div>
</div>
```
