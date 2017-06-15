/**
     * 作用：实现搜索输入框的输入提示js类
     * 注：只有重新获取焦点才会显示下拉框
     * 注：li的鼠标移出和click，才会导致下拉的隐藏，所以如果鼠标直接从输入框移除，不会隐藏下拉
     * @param searchFuc 外部注入的查询方法
     * @author yangzhen
*/
    function oSearchSuggest(searchFuc){
        var key  = "";  //key保存的永远是当前查询值
        var input = $('#gover_search_key');
        var suggestWrap = $('#gov_search_suggest');
        var putinDom = document.getElementById("putin");
        var init = function(){
            input.bind('focus',showSuggest);  //只有获取焦点，显示下拉框
            input.bind('keyup',sendKeyWord);  //点击keyup，前提就是获取焦点
            input.bind('blur',function(){
            	setTimeout(hideSuggest,100);
            });
        };
        /**
         * @param liDom   li dom节点
         */
        var invideText = function(liDom){
        	var li_text = liDom.innerHTML.toString();
        	var startIndex = li_text.indexOf("]")+1;
        	var endIndex = li_text.length;
           return li_text.substring(startIndex,endIndex);
        };
        
        /**
         * 作用：获得焦点后，把光标移动到可编辑文本框中的文本最末尾处
         * @param obj 可输入框的dom对象
         */
        var pull_Last_Div = function(obj) {
            if (window.getSelection) {//ie11 10 9 ff safari
                obj.focus(); //解决ff不获取焦点无法定位问题
                var range = window.getSelection();//创建range
                range.selectAllChildren(obj);//range 选择obj下所有子内容
                range.collapseToEnd();//光标移至最后
            }
            else if (document.selection) {//ie10 9 8 7 6 5
                var range = document.selection.createRange();//创建选择对象
                //var range = document.body.createTextRange();
                range.moveToElementText(obj);//range定位到obj
                range.collapse(false);//光标移至最后
                range.select();
            }
        }
        
       var hideSuggest = function(){
           //这样判断的意义在于：输入框失去焦点之前，鼠标是否移动到li上面，如果不hover在li上，直接移除输入框，则直接隐藏下拉
           var len = suggestWrap.find('li.hover').length;
           if(len>0){
               return;
           }
            suggestWrap.hide();
       };

        var showSuggest = function () {
            //如果输入框子都没有值，就不弹出下拉
            if(input.val()==""){
                return;
            }else{
                //获取初始初始查询值
                key = input.val();
                searchFuc(key);
            }
           // suggestWrap.show();

        };

        //发送请求，根据关键字到后台查询  不需要传递event，event应该是事件的内置对象
        var sendKeyWord = function(event){
            var current = suggestWrap.find('li.hover');
                //如果点击上箭头
                if(event.keyCode == 38){
                    //出现hover
                    if(current.length>0){
                        var prevLi = current.removeClass('hover').prev();
                        //如果有上一个，给上一个添加hover类
                        if(prevLi.length>0){
                            prevLi.addClass('hover');
                          /*  input.val(prevLi.html());*/
                            input.val(invideText(prevLi[0]));
                        }else{
                            //如果没有上一个,清除hover，input置为初始查询值
                            suggestWrap.find("li").removeClass("hover");
                            input.val(key);
                        }
                    }else{
                        //未出现hover，选中下拉框中最后一个Li(jquery对象)
                        var last = suggestWrap.find('li:last');
                        last.addClass('hover');
                        //需要传递dom ： last[0]
                        input.val(invideText(last[0]));
                    }
                    //如果点击下箭头
                }else if(event.keyCode == 40){
                    if(current.length>0){
                        var nextLi = current.removeClass('hover').next();
                        //如果存在下一个
                        if(nextLi.length>0){
                            nextLi.addClass('hover');
                            input.val(invideText(nextLi[0]));
                        }else{
                            suggestWrap.find("li").removeClass("hover");
                            input.val(key);
                        }
                    }else{
                        //未出现hover，选中下拉框中第一个Li
                        var first = suggestWrap.find('li:first');
                        first.addClass('hover');
                        input.val(invideText(first[0]));
                    }
                }else{
                	//如果不是点击上键或者下键，首先判断点击的是否为enter键，作用：保留li.hover,如果执行搜索方法searchFuc(valText)，li就会失去hover类，造成判断异常
                	if(event.keyCode == 13){
                    	 //enter键，下拉框被重新赋值，ul只剩下当前选中的li
                    	var textDom = suggestWrap.find("li.hover")[0];
                    	if(textDom){
                            $("#putin").append(invideText(textDom));
                          //只要赋完值后，就清空suggestwrap下的ul中的li，防止上次查询的数据残留下来
                            suggestWrap.children().empty();
                            //清空输入框
                            input.val("");
                    	}
                        suggestWrap.find("li").removeClass("hover");
                        suggestWrap.hide();
                        //把光标定位到文本的末尾
                        pull_Last_Div(putinDom);
                    }
                    //输入字符
                    var valText = $.trim(input.val());
                    //如果输入框内为空串
                    if(valText ==''){
                        return;
                    }
                    searchFuc(valText);
                    //赋值给当前查询值
                    key = valText;
                    //如果点击回车键就隐藏下拉
                    
                }

        }
        //请求返回后，执行数据展示
        this.dataDisplay = function(data){
            if(data.length <= 0){
                suggestWrap.hide();
                return;
            }

            //往搜索框下拉建议显示栏中添加条目并显示
            var li;
            var tmpFrag = document.createDocumentFragment();
            suggestWrap.find('ul').html('');
            for(var i=0; i<data.length; i++){
                li = document.createElement('LI');
                li.innerHTML = data[i];
                tmpFrag.appendChild(li);
            }
            suggestWrap.find('ul').append(tmpFrag);
            suggestWrap.show();

            //为下拉选项绑定鼠标事件
            suggestWrap.find('li').hover(function(){
                suggestWrap.find('li').removeClass('hover');
                $(this).addClass('hover');
                suggestWrap.show();
            },function(){
                $(this).removeClass('hover');
                suggestWrap.hide();
            }).on('click',function(){
                //如果输入框有blur事件，会先执行blur事件，可是执行完blur后，suggestWrap已经隐藏了
                //li同时注册hover和click事件，会首先执行hover，再执行click事件
                //点击选中项后，给输入框进行赋值
                $("#putin").append(invideText(this));
                //只要赋完值后，就清空suggestwrap下的ul中的li，防止上次查询的数据残留下来
                suggestWrap.children().empty();
                //清空输入框
                input.val("");
                //隐藏下拉框
                suggestWrap.hide();
              //把光标定位到文本的末尾
                pull_Last_Div(putinDom);
            });
        }
        init();
    };
    
   
