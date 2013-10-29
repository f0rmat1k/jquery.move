(function($){
    'use strict';

    var
        defaults = {
            speeds: {
                fast: 200,
                middle: 400,
                slow: 600
            }
        },
        context,
        check4Transform3D = function () {
            var el = document.createElement('p'),
                has3D,
                transforms = {
                    'webkitTransform': '-webkit-transform',
                    'OTransform': '-o-transform',
                    'msTransform': '-ms-transform',
                    'MozTransform': '-moz-transform',
                    'transform': 'transform'
                };

            document.body.insertBefore(el, null);
            for (var t in transforms) {
                if (el.style[t] !== undefined) {
                    el.style[t] = "translate3d(1px,1px,1px)";
                    has3D = window.getComputedStyle(el).getPropertyValue(transforms[t]);
                }
            }
            document.body.removeChild(el);
            return (has3D !== undefined && has3D.length > 0 && has3D !== "none");
        },
        check4Transitions = function(){
            var s = document.createElement('p').style,
                hasTransitions = 'transition' in s ||
                    'WebkitTransition' in s ||
                    'MozTransition' in s ||
                    'msTransition' in s ||
                    'OTransition' in s;

            return hasTransitions;
        },
        getTransform = function() {
            var results = context.css('transform').match(/matrix(?:(3d)\(\d+(?:, \d+)*(?:, (\d+))(?:, (\d+))(?:, (\d+)), \d+\)|\(\d+(?:, \d+)*(?:, (\d+))(?:, (\d+))\))/)
            if(!results) return [0, 0, 0];
            if(results[1] == '3d') return results.slice(2,5);

            results.push(0);
            return results.slice(5, 8);
        },
        setDuration = function(duration){
            if (typeof duration === 'string') {
                switch (duration) {
                    case 'fast':
                        return defaults.speeds.fast;
                        break;
                    case 'middle':
                        return defaults.speeds.middle;
                        break;
                    case 'slow':
                        return defaults.speeds.slow;
                    default:
                        if (parsInt(duration, 10) > 0) {
                            return parsInt(duration, 10) + 'ms';
                        } else {
                            $.error('Wrong duration value with object ' + context + '. Taken default');
                            return defaults.speeds.fast;
                        }
                }
            } else if (typeof duration === 'number') {
                return duration + 'ms';
            } else {
                $.error('Wrong duration value with object ' + context + '. Taken default');
                return defaults.speeds.fast;
            }
        },
        move = function(params){
            var transitionPropList,
                transitionDurationList,
                translateMethod,
                zProp,
                top,
                left;

            if (check4Transitions()) {
                if (check4Transform3D()) {
                    translateMethod = 'translate3d';
                    zProp = ', 0';
                } else {
                    translateMethod = 'translate';
                    zProp = '';
                }

                move = function(params){
                    transitionPropList = context.css('transition-property');
                    transitionDurationList = context.css('transition-duration');
                    top = params.top;
                    left = params.left;

                    if (typeof left === 'string') {
                        if (left.search(/\+=/) >= 0){
                            left = parseInt(getTransform()[0], 10) + parseInt(left.replace('+=', ''), 10) + 'px';
                        } else if (left.search(/\-=/) >= 0) {
                            left = parseInt(getTransform()[0], 10) - parseInt(left.replace('-=', ''), 10) + 'px';
                        }
                    }

                    if (typeof top === 'string') {
                        if (top.search(/\+=/) >= 0){
                            top = parseInt(getTransform()[1], 10) + parseInt(top.replace('+=', ''), 10) + 'px';
                        } else if (top.search(/\-=/) >= 0) {
                            top = parseInt(getTransform()[1], 10) - parseInt(top.replace('-=', ''), 10) + 'px';
                        }
                    }
                    if (transitionPropList.search('transform') <= 0) {
                        if (transitionPropList !== '') {
                            context
                                .css('transition-property', transitionPropList += ', transform')
                                .css('transition-duration', transitionDurationList += ',' + params.duration);
                        } else {
                            context
                                .css('transition-property', 'transform')
                                .css('transition-duration', params.duration);
                        }
                    } else {
                        var pos = $.inArray('transform', transitionPropList.split(', ')),
                            newDurationProp = transitionDurationList.split(', ');

                        newDurationProp[pos] = params.duration;
                        transitionDurationList = newDurationProp.join();

                        context.css('transition-duration', transitionDurationList);
                    }

                    context
                        .css('transform', translateMethod + '(' + (left || 0) + ', ' + (top || 0) + zProp + ')');
                };
            } else {
                move = function(params){
                    context.animate({
                        left: params.left || context.css('left'),
                        top: params.top || context.css('top')
                    }, {
                        duration: params.duration,
                        complete: params.callback
                    });
                };
            }

            move(params);
        };

    $.fn.move = function(coords, params, cb){
        context = this;
        var duration,
            left,
            top,
            callback = false;

        left = coords.left,
        top = coords.top;

        if (typeof left === 'number') {
            left = left + 'px';
        } else if (typeof left === 'undefined') {
            left = false;
        }

        if (typeof top === 'number') {
            top = top + 'px';
        } else if (typeof top === 'undefined') {
            top = false;
        }

        if (typeof params !== 'object') {
            duration = setDuration(params);
        } else if (typeof params === 'object') {
            duration = setDuration(params.duration);
        } else {
            $.error('Wrong params format. Plz, number or object');
        }

        if (typeof cb === 'function') {
            callback = cb;
        } else if (params.callback && typeof params.callback === 'function') {
            callback = params.callback;
        }

        params = {
            left: left,
            top: top,
            duration: duration,
            callback: callback
        };

        move(params);
    };
})(jQuery);