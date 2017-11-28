var BaseComponent = Class.extend({
    /**
     * 初始化组件事件
     */
    init:function(opts){
       var defaultConfig = {
           handlers:{}
       };
       this.config = Object.assign(defaultConfig,opts);
    },
	/**
	 * 功能说明： 更新组件 子组件自行实现
	 */
	update: $.noop,
	/**
	 * 功能说明： 消毁组件 子组件自行实现
	 * 参数说明：
	 * 无参数
	 **/
	destroy: $.noop,
	/**
	 * 功能说明 ：添加自定义事件
	 * 参数说明 ：
	 * @param type [String] 自定义事件类型(名称)
	 * @param hander [Function] 自定义事件类型对应的事件执行函数
	 **/
	on: function (type, handler) {
		var me = this;
		if (typeof me.config.handlers[type] == "undefined") {
			me.config.handlers[type] = [];
		}
		me.config.handlers[type].push(handler);
	},
	/**
	 * 功能说明 ：触发自定义事件
	 * 参数说明 ：
	 * @param type [String] 自定义事件类型(名称)
	 * @param data [Function] 自定义事件类型对应的事件执行函数的参数
	 * @return undefined 无返回值
	 **/
	fire: function (type, data) {
		var me = this;
		if (me.config.handlers[type] instanceof Array) {
			var handlers = me.config.handlers[type];
			for (var i = 0; i < handlers.length; i++) {
				handlers[i](data);
			}
		}
	},
	/**
	 * 功能说明 ：移除事件
	 * 参数说明 ：
	 * @param type [String] 事件类型(名称)
	 * @param handler [Function] 事件处理函数
	 * @return undefined 无返回值
	 **/
	off: function (type, handler) {
		var me = this;
		var handlers = this.handlers[type];
		if (me.handlers[type] instanceof Array) {
			for (var i = 0; i < handlers.length; i++) {
				if (handlers[i] === handler) {
					break;
				}
			}
		}
		handlers.splice(i, 1);
	},
	/**
	 * 功能说明 : 显示组件UI
	 * 参数说明 ：
	 * @param isAnimate [Boolean] 是否开启动画效果
	 * @return undefined 无返回值
	 **/
	show: function (isAnimate) {
		var me = this;
		if (isAnimate === true) {
			$(me.config.renderTo).slideDown(400)
		} else {
			$(me.config.renderTo).show();
		}
	},
	/**
	 * 功能说明 : 隐藏组件UI
	 * 参数说明 ：
	 * @param isAnimate [Boolean] 是否开户动画效果
	 * @return undefined 无返回值
	 **/
	hide: function (isAnimate) {
		var me = this;
		if (isAnimate === true) {
			$(me.config.renderTo).slideUp(400);
		} else {
			$(me.config.renderTo).hide();
		}
	},
	/**
	 * 功能说明 : 设置组件UI高度
	 * 参数说明 ：
	 * @param height [Number] 高度
	 * @return undefined 无返回值
	 **/
	setHeight: function (height) {
		var me = this;
		$(me.config.renderTo).css({
			height: height
		});
	},
	/**
	 * 功能说明 : 设置组件UI高度
	 * 参数说明 ：
	 * @param width [Number] 宽度
	 * @return undefined 无返回值
	 **/
	setWidth: function (width) {
		var me = this;
		$(me.config.renderTo).css({
			width: width
		});
	},
	/**
	 * 功能说明 : 设置组件UI高度
	 * 参数说明 ：
	 * 无参数
	 * @return undefined 无返回值
	 **/
	getHeight: function () {
		var me = this;
		var height = $(me.config.renderTo).height();
		return height;
	},
	/**
	 * 功能说明 : 设置组件UI高度
	 * 参数说明 ：
	 * 无参数
	 * @return undefined 无返回值
	 **/
	getWidth: function () {
		var me = this;
		var width = $(me.config.renderTo).width();
		return width;
	},
	/**
	 * 功能说明 : 容器发生尺寸变化时的回调
	 * 参数说明 ：
	 * 无参数
	 * @return undefined 无返回值
	 **/
	_resize: $.noop,
	/**
	 * 功能说明 : 初始化组件名
	 * 参数说明 ：
	 * 无参数
	 **/
	_setWidgetClass: function () {
		var me = this;
	}
});
