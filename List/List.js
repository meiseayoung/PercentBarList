var List = BaseComponent.extend({
    /**
     * 初始化组件
     */
    init: function (opts) {
        var defaultConfig = {
            renderTo: null,
            handlers: {},
            // list: [{
            //     name: "北京人民医院",
            //     value: 6344,
            //     percent: 75,
            //     unit: ""
            // }],
            list:[],
            itemHeight: 24,
            itemMargin: 5,
            itemTextAlign: "left",
            itemNameWidth: 80,
            itemPercentWidth: 300,
            itemValueWidth: 100,
            itemBorderRadius:true,
            itemPercentBackendHeight:8,
            itemPercentFrontendHeight:10,
            itemPercentBackendColor: "#204f7a",
            itemPercentFrontEndColorStart: "#0096f7",
            itemPercentFrontEndColorEnd: "#00dee1",
            itemNameColor: "#c8c6d5",
            itemValueColor: "#c8c6d5"
        };
        this.config = $.extend(defaultConfig, opts);
        this._createDOM();
        this._addBehavior();
    },
    /**
     * 更新组件
     */
    update: function (list) {
        if ($.type(list) !== "array") {
            console.warn("更新组件出错,更新方法传入参数类型为数组,请检查");
            return;
        }
        this.config.list = list;
        this._createDOM();
    },
    /**
     * 创建列表DOM元素
     */
    _createDOM: function () {
        var me = this;
        if ($(me.config.renderTo).length === 0) {
            console.warn("组件渲染目标不存在,请检查传入的renderTo配置项");
            return;
        };
        var listHTML = me.config.list.map(function (v, i) {
            return `<li data-index=${i} style="height:${me.config.itemHeight}px;margin:${me.config.itemMargin}px 0">${me._createItem(v)}</li>`;
        }).join("");
        $(me.config.renderTo).html(`<ul class="custom-list">${listHTML}</ul>`);
        (function (me) {
            setTimeout(function () {
                $(me.config.renderTo).find(".list-item-percent-frontend").each(function (index, elem) {
                    var elemWidth = $(elem).attr("data-percent");
                    $(elem).css({
                        width: elemWidth + "%"
                    });
                })
            }, 100)
        })(me);


    },
    /**
     * 创建列表项
     */
    _createItem: function (item) {
        var me = this;
        item.value === undefined && (item.value = "--");
        var itemHTML = `<div class="list-item" style="height:100%;">
                            <div class="list-item-name" style="width:${me.config.itemNameWidth}px;text-align:${me.config.itemTextAlign};line-height:${me.config.itemHeight}px;color:${me.config.itemNameColor}"><span>${item.name}</span></div>
                            <div class="list-item-percent" style="position:relative;width:${me.config.itemPercentWidth}px;">
                                <div class="list-item-percent-backend" style="position:absolute;height:${me.config.itemPercentBackendHeight}px;top:${ (me.config.itemHeight -me.config.itemPercentBackendHeight)/2 }px;width:100%;background-color:${me.config.itemPercentBackendColor};"></div>
                                <div class="list-item-percent-frontend" style="position:absolute;height:${me.config.itemPercentFrontendHeight}px;top:${ (me.config.itemHeight -me.config.itemPercentFrontendHeight)/2 }px;width:${0}%;background-image:linear-gradient(to right, ${me.config.itemPercentFrontEndColorStart}, ${me.config.itemPercentFrontEndColorEnd});border-radius:0 ${ me.config.itemBorderRadius ? me.config.itemHeight / 2 : 0}px ${me.config.itemBorderRadius ? me.config.itemHeight / 2 :0}px 0" data-percent=${item.percent || 0}></div>
                            </div>
                            <div class="list-item-value" style="width:${me.config.itemValueWidth}px;line-height:${me.config.itemHeight}px;color:${me.config.itemValueColor}"><span>${item.value}</span><span>${item.unit || ""}</span></div>
                        </div>`;
        return itemHTML;
    },
    /**
     * 添加组件行为
     */
    _addBehavior: function () {
        var me = this;
        if ($(this.config.renderTo).length === 0) {
            console.warn("组件渲染目标不存在,请检查传入的renderTo配置项");
            return;
        }
        function fireItemEnter(me){
                this.fire("itemEnter",$(this.config.renderTo).siblings(".layer-name").find(".layer-list-showmore"));
        }
        // var throttleFn = _.throttle(fireItemEnter,2000);
        var throttleFn = _.throttle(fireItemEnter.bind(me),700);

        $(this.config.renderTo).on("click", "li", function (e) {
            var index = $(this).attr("data-index");
            me.fire("itemClick", me.config.list[index]);
        });
       

        $(this.config.renderTo).closest('.layer-list').on("mouseenter",function (e) {                 
                me.clearEnterTimer();
                me.openEnterTimer(throttleFn,700);
        });
        $(this.config.renderTo).closest('.layer-list').on("mousemove", function (e) {
            $("#tipLayer2").css({
                    display:"block",
                    left: (window.screen.width - e.pageX + 10) < 340 ? e.pageX - 300 :  e.pageX + 10,
                    top:e.pageY + 10
            });
        });
        $(this.config.renderTo).closest('.layer-list').on("mouseleave", function (e) {
           
            // var index = $(this).parent().parent().attr("data-index");
            // me.fire("itemLeave", me.config.list[index]);
             $("#tipLayer2").css({
                display:"none",
                left:e.pageX,
                top:e.pageY
            });
            me.clearEnterTimer();
            tipLayer2.update([]);
            $(me.config.renderTo).attr("mouseIn","false");
            // me.fire("itemLeave",$(me.config.renderTo).siblings(".layer-name").find(".layer-list-showmore"));
        });
    },
    openEnterTimer:function(fn,time){
        this.enterTimer = setTimeout(fn,time);
    },
    clearEnterTimer:function(){
        clearTimeout(this.enterTimer);
    }
})