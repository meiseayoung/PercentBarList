var LayerList = BaseComponent.extend({
    /**
     * 组件初始化
     */
    init: function (opts) {
        var defaultConfig = {
            handlers: {},
            renderTo: null,
            layerZoom: 2,      //层级
            data:[]
            // data: [{
            //     name: "二级指标名称",
            //     list: [{
            //         name: "平均分",
            //         layerCode:"",
            //         areaCode:"",
            //         value: 56,
            //         percent: 65
            //     }, {
            //         name: "最高分",
            //         value: 86,
            //         percent: 75
            //     }, {
            //         name: "最低分",
            //         value: 23,
            //         percent: 32
            //     }]
            // }, {
            //     name: "二级指标名称",
            //     list: [{
            //         name: "平均分",
            //         value: 56,
            //         percent: 65
            //     }, {
            //         name: "最高分",
            //         value: 86,
            //         percent: 75
            //     }, {
            //         name: "最低分",
            //         value: 23,
            //         percent: 32
            //     }]
            // }]
        };
        this.config = $.extend(defaultConfig, opts);
        this._createDOM();
        this._addBehavior();
    },
    /**
     * 更新组件
     */
    update: function (data) {
        if ($(this.config.renderTo).length === 0) {
            console.warn("组件渲染目标不存在,请检查传入的renderTo配置项");
            return;
        }
        this.config.data = data;
        this._createDOM();
    },
    /**
     * 创建组件DOM元素
     */
    _createDOM: function () {
        if ($(this.config.renderTo).length === 0) {
            console.warn("组件渲染目标不存在,请检查传入的renderTo配置项");
            return;
        }
        var me = this;
        var listHTML = me.config.data.map(function (v, i) {
            return me._createItem(v);
        }).join("");
        $(me.config.renderTo).html(`<ul>${listHTML}</ul>`);
        me._renderList();
    },
    /**
     * 创建列表项
     * @return type:String 列表项的HTML片段
     */
    _createItem: function (item) {
        var name = {
                    layerCode:item.layerCode,
                    areaCode:item.areaCode
        };
        return `<li class="layer-list" style="padding:5px 0px;">
                    <div>
                        <div class="layer-name" title=${item.name || ""} style="color:#02eff5;font-family:微软雅黑;font-size: 12px;font-weight: 700"><span style="float:left;text-indent:1em;"">${item.name || ""}</span><span class="layer-list-total">${item.totalNumber}</span><span style="float:right;padding-right:10px;" class="layer-list-showmore" data-metadata=${JSON.stringify(name)}>&gt;&gt;</span></div>
                        <div class="layer-container" style="clear:both;"></div>
                    </div>
                </li>`;
    },
    /**
     * 渲染列表
     */
    _renderList: function () {
        var me = this;
        if ($(this.config.renderTo).length === 0) {
            console.warn("组件渲染目标不存在,请检查传入的renderTo配置项");
            return;
        }
        $(me.config.renderTo).find("li.layer-list").each(function (index, elem) {
            var list = new List({
                list: me.config.data[index].list,
                renderTo: $(elem).find(".layer-container"),
                itemTextAlign: "center",
                itemHeight: 24,
                itemMargin: 3,
                itemNameWidth: 60,
                itemPercentWidth: 100,
                itemValueWidth: 50,
                itemBorderRadius: false,
                itemPercentBackendHeight: 8,
                itemPercentFrontendHeight: 8,
                itemPercentFrontEndColorStart: "rgb(255,144,62)",
                itemPercentFrontEndColorEnd: "rgb(255,93,0)"
            });

            // function getListData(url,data){
            //     $.ajax({
            //         url:url,
            //         type:"post",
            //         data:{
            //             indId:data.layerCode,
            //             oXzqh:data.areaCode,
            //             oType: $('.nav_right li.active').attr("type") || "全部"
            //         }
            //     })
            //     .done(function(res){
            //         console.log("itemEnter-res",res);
            //          var list = res.data.map(function(v,i){
            //             return {
            //                 name:v.oname,
            //                 value:v.num,
            //                 percent:v.num/v.total1*100
            //             }
            //         });
            //         tipLayer2.update(list);
            //     })
            //     .fail(function(err){

            //     })
            // };
            // var throttleFn = _.throttle(getListData,300);

            list.on("itemEnter",function(item){
                console.log("itemEnter-item",item);
                // tipLayer2.update([]);
                var data = JSON.parse($(item).attr("data-metadata"));
                var url = "/Hospital/service/hostp/getHospitalDashBoardTip";
                window.ajaxStack.forEach(function(v,i){
                    v.abort();
                });
                window.ajaxStack = [];
                var ajax = $.ajax({
                    url:url,
                    type:"post",
                    data:{
                        indId:data.layerCode,
                        oXzqh:data.areaCode,
                        oType: $('.nav_right li.active').attr("type") || "全部"
                    }
                })
                .done(function(res){
                    console.log("itemEnter-res",res);
                     var list = res.data.map(function(v,i){
                        return {
                            name:v.oname,
                            value:v.num,
                            percent:v.num/v.total1*100
                        }
                    });
                    tipLayer2.update(list);
                })
                .fail(function(err){

                });
                window.ajaxStack.push(ajax);
                // throttleFn(url,data);
            });
            list.on("itemLeave",function(item){

            });
        })
    },
    /**
     * 添加组件行为
     * @return undefined 无返回值
     */
    _addBehavior: function () {
        var me = this;
        if ($(this.config.renderTo).length === 0) {
            console.warn("组件渲染目标不存在,请检查传入的renderTo配置项");
            return;
        }
        $(this.config.renderTo).on("click", ".layer-list-showmore", function (e) {
            me.fire("layer2more", {
                zoom: me.config.layerZoom,
                name: $(this).attr("data-metadata")
            });
        });
    },
    /**
     * 执行动画
     * @param opts 动画的配置项
     * @param opts.time type:Number 动画执行时间
     * @param opts.delay type:Number 动画延时执行时间
     * @param opts.width type:Number 元素宽度将要动画过渡到的值
     * @param opts.height type:Number 元素高度将要动画过渡到的值
     * @param opts.opacity type:Number 元素透明度将要动画过渡到的值
     * @return undefined 无返回值
     */
    animation:function(opts){
        var me = this;
        if ($(this.config.renderTo).length === 0) {
            console.warn("组件渲染目标不存在,请检查传入的renderTo配置项");
            return;
        }
        var defaultOptions = {
            time:0.5,
            delay:0,
            onComplete:null,
            width:"246px",
            height:"100%",
            opacity:1
        };
        TweenMax.to(document.querySelectorAll(me.config.renderTo), opts.time, $.extend(defaultOptions,opts));
    }
})