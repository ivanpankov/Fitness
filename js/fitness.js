(function () {
    'use strict';

    var RESIZE_TOMEOUT_MS = 50,

        forEach = function (list, callback) {
            var i;
            for (i = 0; i < list.length; i += 1) {
                if (callback(list[i], i) === false) {
                    break;
                }
            }
        },
        forEachIn = function (obj, callback) {
            var prop,
                i = 0;

            for (prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    if (callback(obj[prop], prop, i) === false) {
                        break;
                    }
                    i += 1;
                }
            }
        },
        createElement = function (domEl) {
            var el = {
                options: {
                    fitOnResize: domEl.getAttribute('data-fit-on-resize') || false,
                    verticalAlign: domEl.getAttribute('data-vertical-align') || 'top',
                    horizontalAlign: domEl.getAttribute('data-horizontal-align') || 'left',
                    wrap: domEl.getAttribute('data-nowrap') || false,
                    group: domEl.getAttribute('data-group') || null
                },
                parent: document.createElement('div'),
                dom: document.createElement('div'),
                fontSize: null
            };


            el.parent.setAttribute('style', 'position:relative;width:100%;height:100%');
            el.dom.setAttribute('style', 'position:absolute;top:0;left:0;display:inline-block;text-align:' +
                el.options.horizontalAlign + ';white-space:' + (el.options.wrap === 'true' ? 'nowrap' : 'normal'));

            el.dom.innerHTML = domEl.innerHTML;
            el.parent.appendChild(el.dom);

            return el;
        };


    function Fitness(resizeTimeout) {
        this.elements = [];
        this.onResizeArr = [];
        this.groups = {};
        this.init(resizeTimeout);
    }

    Fitness.prototype.init = function (resizeTimeout) {
        var that = this;
        this.resizeId = 0;

        window.addEventListener('resize', function () {
            clearTimeout(that.resizeId);
            that.resizeId = setTimeout(function () {
                that.fit(that.onResizeArr);
            }, resizeTimeout);
        });
    };
    Fitness.prototype.fit = function (collection) {
        this.fix(collection);
        this.setGroupSize();
        this.setFontSize(collection);
        this.verticalAlign(collection);
    };
    Fitness.prototype.add = function (domEl) {
        var el = createElement(domEl);
        this.elements.push(el);

        domEl.innerHTML = '';
        domEl.appendChild(el.parent);

        if (el.options.fitOnResize === 'true') {
            this.onResizeArr.push(el);
        }

        this.addToGroup(el);
    };
    Fitness.prototype.fix = function (collection) {
        var done = collection.length,

            setWidthAuto = function () {
                forEach(collection, function (item) {
                    item.dom.style.width = 'auto';
                });
            },
            initFitTemp = function () {
                forEach(collection, function (item) {
                    item.fitTemp = {
                        low: 2,
                        high: 600
                    };

                    item.fontSize = null;
                });
            },
            setWidthMax = function () {
                forEach(collection, function (item) {
                    item.dom.style.width = '100%';
                });
            },
            calcSize = function () {
                forEach(collection, function (item) {
                    if (!item.fontSize) {
                        item.fitTemp.size = (item.fitTemp.high + item.fitTemp.low) >> 1;
                    }
                });
            },
            setFontSize = function () {
                forEach(collection, function (item) {
                    if (!item.fontSize) {
                        item.dom.style.fontSize = item.fitTemp.size + 'px';
                    }
                });
            },
            checkDimensions = function () {
                forEach(collection, function (item) {
                    if (!item.fontSize) {
                        item.fitTemp.isIn = (item.dom.offsetHeight <= item.parent.offsetHeight) &&
                            (item.dom.offsetWidth <= item.parent.offsetWidth);
                    }
                });


            },
            evaluate = function () {
                forEach(collection, function (item) {
                    if (!item.fontSize) {
                        if (item.fitTemp.isIn) {
                            item.fitTemp.low = item.fitTemp.size;
                        } else {
                            item.fitTemp.high = item.fitTemp.size;
                        }
                        if ((item.fitTemp.high - item.fitTemp.low) === 1) {
                            item.fontSize = item.fitTemp.low;
                            done -= 1;
                        }
                    }
                });
            };


        setWidthAuto();
        initFitTemp();


        while (done > 0) {
            calcSize();
            setFontSize();
            checkDimensions();
            evaluate();
        }

        setWidthMax();
    };
    Fitness.prototype.setFontSize = function (collection) {
        forEach(collection, function (item) {
            if (item.fontSize) {
                item.dom.style.fontSize = item.fontSize + 'px';
            }
        });
    };
    Fitness.prototype.verticalAlign = function (collection) {
        var getVerticalDiff = function () {
                forEach(collection, function (item) {
                    item.verticalDiff = item.parent.offsetHeight - item.dom.offsetHeight;
                });
            },
            setMargins = function () {
                forEach(collection, function (item) {
                    switch (item.options.verticalAlign) {
                        case 'bottom':
                            item.dom.style.marginTop = item.verticalDiff + 'px';
                            item.dom.style.marginBottom = 0;
                            break;

                        case 'middle':
                            item.dom.style.marginTop = (item.verticalDiff >> 1) + 'px';
                            item.dom.style.marginBottom = (item.verticalDiff >> 1) + 'px';
                            break;

                        default:
                            break;
                    }
                });
            };

        getVerticalDiff();
        setMargins();
    };
    Fitness.prototype.addToGroup = function (el) {
        if (el.options.group) {
            if (!this.groups.hasOwnProperty(el.options.group)) {
                this.groups[el.options.group] = {
                    arr: [],
                    minSize: el.fontSize
                };
            }

            this.groups[el.options.group].arr.push(el);
        }
    };
    Fitness.prototype.setGroupSize = function () {
        var setSmallest = function (group) {
                group.minSize = 99999;

                forEach(group.arr, function (item) {
                    if (item.fontSize < group.minSize) {
                        group.minSize = item.fontSize;
                    }
                });
            },
            setSize = function (group) {
                forEach(group.arr, function (item) {
                    item.fontSize = group.minSize;
                });
            };

        forEachIn(this.groups, function (group) {
            setSmallest(group);
            setSize(group);
        });
    };

    window.fitness = new Fitness(RESIZE_TOMEOUT_MS);
    window.fitness.forEach = forEach;
    window.fitness.forEachIn = forEachIn;
}());
