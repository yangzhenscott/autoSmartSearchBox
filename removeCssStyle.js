/**
 * 作用：去除掉输入框样式，从粘贴板获取文本
 * @param contenteditableDiv  div的可编辑属性   例如：contenteditable
 */
function removeCssStyle(contenteditableDiv){
	//contenteditable元素纯文本输入控制 (兼容IE)
	$('['+contenteditableDiv+']').each(function() {
	    // 干掉IE http之类地址自动加链接
	    try {
	        document.execCommand("AutoUrlDetect", false, false);
	    } catch (e) {}
	    
	    $(this).on('paste', function(e) {
	        e.preventDefault();
	        var text = null;
	    
	        if(window.clipboardData && clipboardData.setData) {
	            // IE
	            text = window.clipboardData.getData('text');
	        } else {
	            text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('在这里输入文本');
	        }
	        if (document.body.createTextRange) {    
	            if (document.selection) {
	                textRange = document.selection.createRange();
	            } else if (window.getSelection) {
	                sel = window.getSelection();
	                var range = sel.getRangeAt(0);
	                
	                // 创建临时元素，使得TextRange可以移动到正确的位置
	                var tempEl = document.createElement("span");
	                tempEl.innerHTML = "&#FEFF;";
	                range.deleteContents();
	                range.insertNode(tempEl);
	                textRange = document.body.createTextRange();
	                textRange.moveToElementText(tempEl);
	                tempEl.parentNode.removeChild(tempEl);
	            }
	            textRange.text = text;
	            textRange.collapse(false);
	            textRange.select();
	        } else {
	            // Chrome之类浏览器
	            document.execCommand("insertText", false, text);
	        }
	    });
	    // 去除Crtl+b/Ctrl+i/Ctrl+u等快捷键
	    $(this).on('keydown', function(e) {
	        // e.metaKey for mac
	        if (e.ctrlKey || e.metaKey) {
	            switch(e.keyCode){
	                case 66: //ctrl+B or ctrl+b
	                case 98: 
	                case 73: //ctrl+I or ctrl+i
	                case 105: 
	                case 85: //ctrl+U or ctrl+u
	                case 117: {
	                    e.preventDefault();    
	                    break;
	                }
	            }
	        }    
	    });
	});
}