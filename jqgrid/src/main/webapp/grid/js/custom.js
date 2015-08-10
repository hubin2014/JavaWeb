var regName = /^(?!_)[a-zA-Z0-9_]{6,16}$/;
var regStorageName = /^[0-9A-Za-z]{1,15}$/;
var regFn = /^[a-zA-Z\u4e00-\u9fa5]{1,16}$/;
var regProjectName = /^[a-zA-Z0-9\u4e00-\u9fa5]{6,16}$/;
var regVmName = /^[a-zA-Z0-9]{6,15}$/;
var regTemplateName = /^[a-zA-Z0-9_]{1,15}$/;
var regProjectDesc = /^.{1,255}$/;
var regHypervisorDesc = /^.{1,16}$/;
var regPhone = /(^0{0,1}13[0-9]{9}$)|(^0{0,1}15[0-9]{9}$)|(^0{0,1}17[0-9]{9}$)|(^0{0,1}18[0-9]{9}$)/;
var regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
var regIP = /^((([1-9]{1}[0-9]?)|([1]{1}[\d]{2})|(2[0-4][\d])|(25[0-4])))(\.(([01]?[\d]{1,2})|(2[0-4][\d])|(25[0-4]))){2}(\.(([1-9]{1}[0-9]?)|([1]{1}[\d]{2})|(2[0-4][\d])|(25[0-4])))$/;
var regIPMI = /^((([1]{1}[\d]{2})|([1-9]{1}[0-9]?)|(2[0-4][\d])|(25[0-4])))(\.(([01]?[\d]{1,2})|(2[0-4][\d])|(25[0-4]))){2}(\.(([1-9]{1}[0-9]?)|([1]{1}[\d]{2})|(2[0-4][\d])|(25[0-4])))$/;
var regDNS = /^(25[0-4]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-4]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-4]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-4]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])$/;
var regGateway = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;
var regDomainName=/[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;
var regNum = /^\d+/;
var regErrorMsg = {};
regErrorMsg[regName] = "6-16个字符(数字、字母、下划线)";
regErrorMsg[regStorageName] = "1-15个字符(数字、字母)";
regErrorMsg[regFn] = "1-16个字符(字母、汉字)";
regErrorMsg[regProjectName] = "6-16个字符(数字、字母、汉字)";
regErrorMsg[regVmName] = "6-15个字符(数字、字母)";
regErrorMsg[regTemplateName] = "1-15个字符(数字、字母、下划线)";
regErrorMsg[regProjectDesc] = "1-255个字符";
regErrorMsg[regHypervisorDesc] = "1-16个字符";
regErrorMsg[regPhone] = "请输入正确手机格式!";
regErrorMsg[regEmail] = "请输入正确邮箱格式!";
regErrorMsg[regIP] = "请输入正确的IP格式!";
regErrorMsg[regIPMI] = "请输入正确的IPMI格式!";
regErrorMsg[regDomainName] = "请输入正确的域名格式!";
//***********************************************************
//get from permission.js 
/**
 * get permission from permission.properties to show menu on left bar
 */
function setPermissions(){
    $.post('userController/getPermissions.htm',{},function(data){
        var permissions = $.parseJSON(data);
        $.each(permissions,function(k,v){
            $('#'+k).css("display",v);
        });
    },'html');
}
//****************************************************
//get from init.js
var message={};
message[0]="Success";
message[1]="Network is disconnect!";

/**
 * Container system configuration.et:
 * storageType:[nfs|ucsm]
 * ipmiAllow:[true|false]
 * minCPUCore: min cpu core for requesting a new vm
 * maxCPUCore: max cpu core for requesting a new vm
 * minMemory: min memory for requesting a new vm
 * maxMemory: max memory for requesting a new vm
 * minDisk:min disk size for requesting a new vm
 * maxDisk:max disk size for requesting a new vm
 * swdefmanage:[true|false] True to open template manager
 * topoDiagram:[true|false] True to open topo diagram
 * message: [true|false] true-display message text function
 * template_type: [true|false] true hidden swdefmanage vmware type 
 */
var sysconfig = {};

$(document).ready(function(){
	var url = window.location.href;
	if(url.indexOf("index") < 0){
		return;
	}
    $.ajax({
        url : "systemController/getInfo.htm",
        type :"POST",
        dataType : "json",
        async : false,
        success :function(data){
            $.each(data,function(i,item){
                sysconfig[i]=item;
            });
        }
    });
});


(function( $ ) {
    //this plugin used to open a top div to show some info.
    //title is used to show the top div name
    //hastitle  used to control that we should show the title or not
    //divId   where we should open the div to
    //callback   when we create the top div,then we should do what
    //backReplace  用于替换返回按钮的点击事件
    $.topLoad = function(title,hasTitle,divId,callback,backReplace){
            var titleTip = hasTitle == true ? ("<div class='index_resource_warning_title'>"+ "<div class='index_warning_title'>" + title + "</div>"+ "<hr class='index_warning_hr'/>"+ "</div>") : "";
            var div = "<div><div class='util_bg' style=''></div><div class='index_all_warning' style=''>"
                    + titleTip
                    + "<div class='index_warning_all_link'>&lt;&lt;返回</div>"
                    + "<div id='index_all_warning_data' >"
                    + "<div class='index-warning-load' ><i class='fa fa-tow fa-spinner fa-spin'></i><span>正在加载数据。。。</span></div>"
                    + "</div></div><div>";
            $(".index_all_warning").remove();
            $(divId).append(div);
            $(".wrapper").hide();
            //$("#bg").show();
            $(".index_all_warning").show("nomal");
            $(".index_warning_all_link").click(function(){
                if(backReplace == undefined){
                    $(".index_all_warning").parent().remove();
                    $(".wrapper").show();
                }else{
                    backReplace.call(this);
                }
               //$("#bg").hide();
            });
            callback();
    };
} )( jQuery );
//***************************************************
/**
 * Container for objects storage,vm,pool,host
 * @returns
 */
function Container(){
}

Container.prototype = {
    _eles:{},
    init:function () {}
};

Container.prototype.put = function(key,value){
    this._eles[key] = value;
};

Container.prototype.get = function(key){
    return this._eles[key];
};
//*******************************************************
//0- BaseNamePolicy for guangxi
//1- BaseIPPolich for hainan show ip in tree node
function NamePolicy(type){
  if(type==0){
      return new BasePolicy();
  }else if(type==1){
      return new BaseIPPolicy();
  }
}

function BasePolicy(){}

BasePolicy.prototype=new NamePolicy(0);

BasePolicy.prototype.generate = function(node){
  if (node.type == "vm" && node.role == "standby") {
      node.name = node.name + "(备机)";
  } else if (node.type == "vm" && node.role == "host") {
      node.name = node.name + "(主机)";
  } else {
      node.name = node.name;
  }
  return node;
};

function BaseIPPolicy(){}

BaseIPPolicy.prototype=new NamePolicy(1);

BaseIPPolicy.prototype.generate = function(node){
  if (node.type == "vm" && node.role == "standby") {
      node.name = node.ip + "("+node.name+")";
  } else if (node.type == "vm" && node.role == "host") {
      node.name = node.ip + "("+node.name+")";;
  } else {
      node.name = node.ip;
  }
  return node;
};


//比较两个IP或者IP和DNS、IP和网关是否在同一网段 
function sameSegment(ipBegin, ipEnd, mask){ 
    var temp1;   
    var temp2; 
    var temp3;
    if(!(ipBegin&&ipEnd&&mask)){
    	return 2;
    }
    temp1 = ipBegin.split(".");   
    temp2 = ipEnd.split(".");      
    temp3 = mask.split(".");
	for(var i =0;i<4;i++){
       var x1 = toBit(parseInt(temp1[i]));
        var x2 = toBit(parseInt(temp2[i]));
        var x3 = toBit(parseInt(temp3[i]));
        if (!(andBit(x1,x3)==(andBit(x2,x3)))) //对四位分别转化为二进制进行与运算，有一位不对应相等则不在同一网段  
        {   
            return 2;   
        }
	}
	return 0;
}

//*************custom.js************
var clickFlag;
var returnFlag;

/**
 * 该插件封装的是与弹出框相关的代码
 */
;(function( $ ) {
	/**
	 * 全局变量，用于调用，调用方式为：uDialog.form(array);
	 */
	uDialog = function () {};
        $.extend(uDialog ,{
        	/**
        	 * 弹出框输入数据，传入参数必须是数组
        	 */
        	form:function(options){
        		$("body").uDialogForm(options);
        	},
	        /**
	    	 * 弹出框输入数据，传入参数必须是数组，options中具体的参数如下：
	    	 * title:标题，用于说明弹出的作用
	    	 * controls:数组格式,内部数据参数如下:
	    	 *          id:当前控件的
	    	 * uDialog.form({
	               title : "添加用户",
	               controls : [
	                           {id:"adminuser_add_name",type:"input",label:"用户名(*)",tipid:"adminuser_add_name_tip",tip:"输入6-16个字符(数字、字母、下划线)",reg:regName},
	                           {id:"adminuser_add_role",type:"select",label:"用户角色(*)",tipid:"adminuser_add_role_tip",tip:"",li:[
	                               {value : "TeamAdm",text : "团队管理员"},
	                               {value : "TeamUser",text : "团队成员"},
	                             ]},
	                           {id:"adminuser_add_password",type:"password",label:"密码(*)",tipid:"adminuser_add_password_tip",tip:"输入6-16个字符(数字、字母、下划线)",reg:regName},
	                           {id:"adminuser_add_repassword",type:"repassword",label:"确认密码(*)",tipid:"adminuser_add_repassword_tip",tip:"确认密码应与密码一致",reg:regName},
	                           ],
	               buttons : [
	                          {id:'adminuser_add_confirm_buttom',type:'submit',click:'confirmAddUser()',text:'确定'}
	                          ],
	               loadComplete : function(){
	               }
	         });
	    	 */
	    	form:function(options){
	    		$("body").uDialogForm(options);
	    	},
	    	/**
	    	 * 该方法用于提示信息，第一个参数为提示的信息，第二个参数为提示信息多久后删除，不传入时，默认不删除.
	    	 * 该函数使用方法：  uDialog.alert("testAlert");  或者  uDialog.alert("testAlert",2000);提示信息存在2000毫秒
	    	 */
	    	alert:function(text,delay){
	    		var options = {"yes":"确定"};
	    		uDialog.ask(text,options,function(value){
	    		},delay);
	    	},
	    	/**
	    	 * 该方法用于提示信息,提示信息带有确定按钮，点击确定按钮触发callback回调函数，点击取消则关闭提示框。
	    	 * 第一个参数为提示的信息，第二个参数为点击确定按钮后触发的回调函数，第三个参数为提示信息多久后删除，不传入时，默认不删除.
	    	 * 该函数使用方法：  uDialog.confirm("testAlert",function(){console.log("enter the enter button")});  
	    	 * 或者  uDialog.alert("testAlert",function(){console.log("enter the enter button")},2000);提示信息存在2000毫秒
	    	 */
	    	confirm:function(text,callback,delay){
	    		var options = {"yes":"确定","no":"取消"};
	    		uDialog.ask(text,options,function(value){
	    			if(value == "yes"){
	    				callback.call(this);
	    			}
	    		},delay);
	    	},
	    	/**
	    	 * 该方法用于提示信息,提示信息带有自定义名称的按钮，点击按钮触发callback回调函数，
	    	 * 回调函数的参数为当前button的value属性的值，value的值为options数组的key-value格式中的key值
	    	 * 第一个参数为提示的信息。第二个参数为数组，格式为:{"yes":"确定","no":"取消"}，key值为需要传入回调函数的值，value时用于button的text值
	    	 * 第三个参数为点击确定按钮后触发的回调函数，函数的参数为button的值，如：点击确定后，参数值为 yes,点击取消，参数值为 no。
	    	 * 第四个参数为提示信息多久后删除，不传入时，默认不删除.
	    	 * 该函数使用方法：  uDialog.ask("testAlert",{"yes":"确定","no":"取消"},function(value){console.log(value)});  
	    	 * 或者  uDialog.ask("testAlert",{"yes":"确定","no":"取消"},function(value){console.log(value)},2000);提示信息存在2000毫秒
	    	 */
	    	ask : function(text,options,callback,delay){
	    		if($("#uDialog_alert").length > 0){
	    			setTimeout(uDialog.ask,1000,text,options,callback,delay);
	    			return false;
	    		}
	    		var timeout;
	    		var buttons = "";
	    		var temp = '<div id="uDialog_alert"><div class="util_bg"></div>'
	        		+ '<div class="util_uDialog_form"><div class="">'
	        		+ '  <div class="form_head">提示信息<div class="btnclose"></div></div>'
	        		+ '     <div class="del_show">' + text + '</div>'
	        		+ '  	<div class="form_foot">   	   ';
	    		for(var i in options){
	    			buttons = '<button type="button" class="ubtn" value="' + i + '">'+ options[i] +'</button>'+buttons;
	    		}
	    		temp += buttons;
	    		temp += '</div></div></div></div>';
	    		
	    		$(temp).appendTo("body").find(".util_bg").css("z-index","100001")
	    		                      .next().css("z-index","100002");
	    		if(delay != undefined){
	    			timeout = setTimeout(uDialog.removeAlert,delay);
	    		}
	            $("#uDialog_alert .btnclose").click(function(){
	            	if(timeout != undefined){
	            		clearTimeout(timeout);
	            	}
	            	uDialog.removeAlert();
	            });
	            $("#uDialog_alert :button").click(function(){
	            	if(timeout != undefined){
	            		clearTimeout(timeout);
	            	}
	            	var v = $(this).attr("value");
	            	uDialog.removeAlert();
	            	if (callback != undefined) {
	            		if(v != "" && v != null){
	            			callback(v);
	            		}
	            	}
	            });
	    	},
	    	removeAlert : function(){
	    		$('#uDialog_alert').remove();
	    	}
        });
    /**
     * 弹出框的封装
     */
    $.fn.uDialogForm = function(options){
    	return this.each(function(){
	    	var control = options.controls;
			var button = options.buttons;
			returnFlag = true;
			/**
			 * 初始化form所在div，
			 */
			appendForm = function(){
				var form = "<div class='util_pop_up_form'><div class='util_bg'></div><div class='util_uDialog_form'><div class='form_head'>"+ options.title +"<div class='form_close'><i class='fa fa-times fa-1'></i></div></div><table>";
				form +="</table>";
				form +="<div class='form_foot'>";
				form +="<button type='button' class='ubtn form_close' >取消</button>";
				form +="</div></div></div>";
				$(form).appendTo("body")
				.find(".form_close")
				.click(function(){
					$(this).closest(".util_pop_up_form").fadeOut("fast",function(){
						$(this).closest(".util_pop_up_form").remove();
					});
				});
			},
			/**
			 * 生成表单中部的控件，控件的type分为select,input,password,repassword
			 */
			createControls = function(){
				for(var i in control){
					if(control[i].type == "select"){
						appendSelect(control[i]);
					}else{
						appendInput(control[i]);
					}
				}
			},
			/**
			 * 将selct添加进表单中，并初始化下拉框
			 */
			appendSelect = function(controlTemp){
				var temp ="<tr class=''><td class='form_td_left'>"+controlTemp.label+"</td>"
		        +"<td class='form_td_left'><div class='form_select'><div class='uselect' data-resize='auto' id='"+controlTemp.id+"'>"
	            + "<button type='button' data-toggle='dropdown' class='uselect-button' style='width:268px;height:32px;' ><span class='dropdown-label'></span><i class='fa fa-chevron-down fa-select'></i></button>"
	            + "<div class='content'><div class='arrow2'></div><div class='arrow1'></div><ul class='dropdown-menu'>";
				var lis = controlTemp.li;
				for(var k in lis){
					temp +="<li data-value='"+ lis[k].value +"'><a href='#'>" +lis[k].text+ "</a></li>";
				}
				temp +="</ul></div></div></div></td>";
				temp +="<td class='form_tip' style='' id='" + (controlTemp.tipid == undefined ? "" : controlTemp.tipid) + "'>"+(controlTemp.tip == undefined ? "" : controlTemp.tip)+"</td></tr>";
				$(temp).appendTo(".util_pop_up_form table")
				.find(".uselect")
				.uselect();
			},
			/**
			 * 将input添加进表单中，并绑定blur事件
			 */
			appendInput = function(controlTemp){
				var type = controlTemp.type == "input" ? "text" : "password";
				var label = controlTemp.type == "textarea" ? "textarea" : "input";
				var temp = "<tr class=''><td class='form_td_left'>"+controlTemp.label+"</td>"
	             +"<td class='form_td_left'><"+label+" type='"+type+"' class='uinput' id='"+controlTemp.id+"' ></"+label+"><span class='reg' style='display:none'>"+controlTemp.reg+"</span><span class='reg' style='display:none'>"+controlTemp.type+"<span></td>"
		         +"<td class='form_tip' style='' id='" + (controlTemp.tipid == undefined ? "" : controlTemp.tipid) + "'>"+(controlTemp.tip == undefined ? "" : controlTemp.tip)+"</td></tr>";
		         var $temp = $(temp).appendTo(".util_pop_up_form table");
		         $temp.find("#"+controlTemp.id)
		         .blur(function(){
		        	var value = $(this).val().trim();
		        	var reg = $(this).next().text();
		        	var tip = $(this).parent().next().attr("id");
		        	var label = $(this).parent().prev().text();
		        	var inputType = $(this).next().next().text();
		        	if(reg != "undefined"){
		        		if(value == ""){
		        			$("#"+tip).html("<span style='color:red;font-style:italic'>"+label.replace(/:|：|\(\*\)|\（\*\）/,"") + "不可为空!</span>");
		        			returnFlag = false;
		        		}else{
		        			returnFlag = uValid.common(eval(reg),value,tip,regErrorMsg[eval(reg)]);
		        			if(inputType == "repassword" && returnFlag == true){
		        				var reValue = $(this).parent().parent().prev().find("input[type=password]").val();
		        				if(value != reValue){
		                     	   $("#"+tip).html("<span style='color:red;font-style:italic'>两次密码必须一致</span>");
		                     	  returnFlag = false;
		                        }else{
		                     	   $("#"+tip).html("<span style='color:green;'>验证成功</span>");
		                        }
		        			}
		        		}
		        	}else{
		        		returnFlag = true;
		        	}
		         });
			},
			/**
			 * 将表单中的密码框的粘贴功能屏蔽
			 */
			disablePaste = function(){
				$(".util_pop_up_form input[type=password]"). keydown(function(event){
		             if ( ((event.ctrlKey) && (event.which == 86)) || ((event.ctrlKey) && (event.keyCode == 86)) ) {  
		                    return false;  
		             } else {  
		                    return true;  
		             }  
		        });
			},
			createButtons = function(){
				for(var j in button){
					//var tempClick = button[j].type == "submit"? "":("onclick='"+button[j].click+"' ");
					var temp = "<button type='button' class='ubtn primary' id='"+button[j].id+"' ><i class='fa fa-tow fa-spinner fa-spin' style='display:none;margin-top:3px;'></i>"+button[j].text+"</button>";
					var $temp = $(temp).appendTo(".util_pop_up_form .form_foot");
					if(button[j].type == "submit"){
						$("#"+button[j].id).bind("click",function(){
							var flag = true;
							for(var i in control){
								if(!!control[i].reg){
									$("#"+control[i].id).blur();
									flag = flag && returnFlag;
								}
							}
							if(flag){
								$(this).attr("disabled",true);
								$(this).find(".fa-spinner").css("display", "inline-block");
								clickFlag = undefined;
								if(typeof(button[j].click) == "string"){
									eval(button[j].click);
								}else{
									button[j].click.call(this);
								}
								var buttonThis = this;
								setTimeout(waitForResult,100,buttonThis);
							}
						});
					}else{
						$("#"+button[j].id).bind("click",function(){
							$(this).attr("disabled",true);
							$(this).find(".fa-spinner").css("display", "inline-block");
							clickFlag = undefined;
							if(typeof(button[j].click) == "string"){
								eval(button[j].click);
							}else{
								button[j].click.call(this);
							}
							var buttonThis = this;
							setTimeout(waitForResult,100,buttonThis);
						});
					}
				}
			},
			waitForResult = function(buttonThis){
				if(clickFlag == undefined){
					setTimeout(waitForResult,100,buttonThis);
					return false;
				}
				if(clickFlag == true){
					$(".util_pop_up_form .form_close").click();
				}else{
					$(buttonThis).removeAttr("disabled").find(".fa-spinner").hide();
				}
			};
			
			appendForm();
			createControls();
			disablePaste();
			createButtons();
			$(".util_uDialog_form").css("width",($(".util_uDialog_form").width()+20)+"px");
			if(options.loadComplete != undefined){
				options.loadComplete.call();
			}
    	});
    };
    } )( jQuery );

;(function( $ ) {
	uValid = function () {};
        $.extend(uValid ,{
        	common:function(reg,value,errorSelector,errorMsg){
        		if(!reg.test(value)){
        			if(!!errorSelector){
        				$("#"+errorSelector).html("<span style='color:red;font-style:italic'>" + errorMsg + "</span>");
        			}
        			return false;
        		}else{
        			if(!!errorSelector){
        				$("#"+errorSelector).html("<span style='color:green'>格式正确</span>");
        			}
        			return true;
        		}
        	}
        });
    } )( jQuery );

function changeEnStatusToChines(vmStatus){
	var status = "";
	if(vmStatus == "agree"){
        status = "审批通过";
    }else if(vmStatus == "disagree"){
        status = "未审批";
    }else if(vmStatus == "deprecated"){
        status = "已废弃";
    }else if(vmStatus == "running"){
		status = "运行中";
	}else if(vmStatus == "starting"){
		status = "启动中";
	}else if(vmStatus == "stopping"){
		status = "关闭中";
	}else if(vmStatus == "stop"){
		status = "已关闭";
	}else if(vmStatus == "new"){
		status = "未审批";
	}else if(vmStatus == "maintenance"){
        status = "维护中";
    }else if(vmStatus == "paused"){
        status = "已暂停";
    }else if(vmStatus == "failed"){
        status = "已失败";
    }else if(vmStatus == "migrating"){
        status = "迁移中";
	}else if(vmStatus == "making"){
        status = "制作模板中";
	}else if(vmStatus == "processing"){
		status = "部署中";
	}else if(vmStatus == "online_testing"){
		status = "在线测试";
	}else if(vmStatus == "no_state"){
		status = "无状态";
	}else if(vmStatus == "disconnect"){
		status = "网络断连";
	}else if(vmStatus == "remove"){
		status = "审批拒绝";
	}
	else{
		status = vmStatus;
	}
	return status;
}

/******************************************uSider start**************************************/
;(function($) {
	var uSlider = function (element, options) {
    this.$element = $(element);

    this.baseBox = this.$element.find('.slider_baseBox');
    this.percentBox =this.$element.find('.slider_percentBox');
    this.baseBoxWidth = this.$element.find('.slider_baseBox').width();
    this.percentWidth=0;

    this.op = $.extend(true,{
        unit:null,//words after uslider
        width:130,//width of drag bar
        min:0,//min value
        max : 10,//max value
        minTip : null,//tip for min value
        maxTip : null,//tip for max value
        rangeTip : null,//tips when do exit only one tip
        initValue:0,// init value
        step : null,
        disable : true
      },options);
		this.resultValue = this.op.initValue;
		this.init();
    };

	uSlider.prototype = {
		constructor: uSlider,
    disable:function(){
        this.op.disable = false;
        this.$element.find('.slider_percentBox').addClass('uSliderDisable');
        this.$element.find('.slider_value').attr('disabled',true);
    },
    enable : function(){
    	this.op.disable = true;
        this.$element.find('.slider_percentBox').removeClass('uSliderDisable');
        this.$element.find('.slider_value').removeAttr('disabled');
    },
    setStep:function(value){
      this.op.step=value;
    },
    //show uslider
    showValue : function() {
      this.percentBox.width(this.percentWidth);
      this.$element.find('.slider_value').val(this.resultValue);
      this.setUnit();
      this.$element.find('.dragIcon').css('left',this.percentWidth+3);
      this.$element.trigger( 'changed', {"value":this.resultValue});
      if(this.op.rangeTip===null||this.op.rangeTip===undefined){
        this.setTip(this.op.minTip,this.op.maxTip);
      }else{
        this.setTip(this.op.rangeTip);
      }
    },
    //set tips under uslider
    setTip:function(minTip,maxTip){
      if(minTip===null||minTip===undefined){
        this.op.maxTip=null;
        this.op.minTip=null;
        this.$element.find('.slider_minValue').html('').html(this.op.rangeTip);
      }else{
        this.op.rangeTip=null;
        this.op.maxTip=maxTip;
        this.op.minTip=minTip;
        this.$element.find('.slider_minValue').html('').html(this.op.minTip);
        this.$element.find('.slider_maxValue').html('').html(this.op.maxTip);
      }
    },
    //show uSlidder by width thar user drag
    setPercentWidth : function(percentWidth) {
      this.percentWidth=( 0 < percentWidth ? (percentWidth < this.baseBoxWidth ? percentWidth : this.baseBoxWidth): 0);
      this.resultValue = this.percentWidth / this.baseBoxWidth * (this.op.max - this.op.min) + this.op.min;
      this.setResultValue(this.checkResultValue(this.resultValue));
    },
    checkResultValue:function(resultValue){
      if(!isNaN(this.op.step)){
        this.resultValue=this.op.min+ Math.round((resultValue-this.op.min)/this.op.step)*this.op.step;
      }
      return this.resultValue;
    },
    //show uSlidder by result value
    setResultValue : function(resultValue) {  
      if (resultValue===''||resultValue===undefined) {
        this.resultValue=0;
      }else {
        this.resultValue=(this.op.min < resultValue ? (resultValue < this.op.max ?resultValue : this.op.max): this.op.min);
      };
      var percentWidth = (this.resultValue - this.op.min) / (this.op.max - this.op.min)* this.baseBoxWidth;
      this.percentWidth=( 0 < percentWidth ? (percentWidth < this.baseBoxWidth ? percentWidth : this.baseBoxWidth): 0);
      this.showValue();
    },
    //init and show uSlidder
    init:function(){
      var timeout;
      var temp = "<div class='slider_dragBox'  onselectstart='return false' style='-moz-user-select:none;'><span><img class='dragIcon' src='images/dragIcon.png'/><div class='slider_baseBox'  style='width:"+(this.op.width)+"px'><div class='slider_percentBox'></div></div><div class='slider_tip'><input class='slider_value uinput vm-number'><div class='slider_unit'></div></div><div style='width:"+(this.op.width+10)+"px;  color: #c1c1c1;'><span class='slider_minValue'></span><span class='slider_maxValue'></span></div></span></div>";

      this.$element.html("").append(temp);
      this.baseBox = this.$element.find('.slider_baseBox');
      this.percentBox =this.$element.find('.slider_percentBox');
      this.baseBoxWidth = this.$element.find('.slider_baseBox').width();

      this.setResultValue(this.checkResultValue(this.resultValue));
      this.setBindingEvents();
    },
    //set events when do with uSlidder dom
    setBindingEvents:function(){
      var that = this;
      var $sliderIcon = this.$element.find('.dragIcon');
      var $sliderValue = this.$element.find('.slider_value');
      var move=false; 
      var disable=this.disable; 

      this.baseBox.mousedown(function(e) {
    	if(!that.op.disable){
    		return;
    	}
        that.setPercentWidth(e.pageX - that.percentBox.offset().left);
        move=true;
        return false;
      });

      $sliderIcon.mousedown(function(e) {
    	if(!that.op.disable){
      		return;
      	}
        that.setPercentWidth(e.pageX - that.percentBox.offset().left);
        move=true;
        return false;
      });

      that.baseBox.mousemove(function(e){
        if(move){
          that.setPercentWidth(e.pageX - that.percentBox.offset().left);
        }
        return false;
      });
      $sliderIcon.mousemove(function(e){
        if(move){
          that.setPercentWidth(e.pageX - that.percentBox.offset().left);
        }
        return false;
      });

      $(document).mouseup(function(e) {
        move=false;
        return false;
      });

      $sliderValue.blur(function() {
        var data=$sliderValue.val()-0;
        if(!isNaN(data)){
          that.setResultValue(that.checkResultValue(data));
        }else{
          that.setResultValue(that.checkResultValue(that.resultValue));
        }
      });
    },
    //set the max and min 
    setRange:function(min,max){
      this.op.min=(min===undefined)?this.op.min:min;
      this.op.max=(max===undefined)?this.op.max:max;
      this.setResultValue(this.checkResultValue(this.resultValue));
    },
    //set Slidder words after uslider
    setUnit:function(unit){
      if(unit===undefined||unit===null||unit===''){
        if(this.op.unit===undefined){
          this.$element.find('.slider_unit').css('display','none');
        }else{
          this.$element.find('.slider_unit').html('').html(this.op.unit);
        }
      }else{
        this.op.unit=unit;
        this.$element.find('.slider_unit').html('').html(unit);
      }
    },
    getResultValue:function(){
      return this.resultValue;
    }
  };

  $.fn.uSlider = function (option) {
    var args = Array.prototype.slice.call(arguments, 1);
    var methodReturn;
    var data;
    var $set = this.each(function () {
      var $this = $(this);
      data = $this.data('uSlider');
//      var options = typeof option === 'object' && option;
//      if (!data) $this.data('uSlider', (data = new uSlider(this, options)));
      if (typeof option === 'object') $this.data('uSlider', (data = new uSlider(this, option)));
      if (typeof option === 'string') methodReturn = data[option].apply(data, args);
    });
    return ( methodReturn === undefined ) ? $set : methodReturn;
  };
})(jQuery);
/******************************************uSlider end**************************************/
/******************************************uSelect start**************************************/
;(function($) {
    var uSelect = function (element, options) {
        var ts = this;
        this.$element = $(element);
        this.options = $.extend({}, $.fn.uselect.defaults, options);
        this.$element.on('click', 'a', $.proxy(this.itemclicked, this));
        this.$button = this.$element.find('button');
        this.$button.on('click',function(event) {
            var selects = $('.uselect');
            for(var i=0;i<selects.length;i++){
                if(selects.eq(i).attr('id') !== ts.$element.attr('id')){
                    selects.eq(i).find('.content').hide();
                }
            }
            $(this).next().toggle();
            event.stopPropagation();
        });
        $('body').on('click', function(event) {
            $('.uselect').find('.content').hide();
            //event.preventDefault();
        });
        this.$hiddenField = this.$element.find('.hidden-field');
        this.$label = this.$element.find('.dropdown-label');
        this.$content = this.$element.find('.content');
        this.setDefaultSelection();
        this.initSize();
    };

    uSelect.prototype = {

        constructor: uSelect,

        initSize: function () {
            var width = this.$button.width() + 14 - 126;
            var left = parseInt(this.$content.css('left'));
            this.$content.css('left',width+left);

        },

        itemclicked: function (e) {
            this.$selectedItem = $(e.target).parent();
            this.$hiddenField.val(this.$selectedItem.attr('data-value'));
            this.$label.text(this.$selectedItem.text());

            // pass object including text and any data-attributes
            // to onchange event
            var data = this.selectedItem();

            // trigger changed event
            this.$element.trigger('changed', data);

            e.preventDefault();
        },

        selectedItem: function() {
            var txt = this.$selectedItem.text();
            return $.extend({ text: txt }, this.$selectedItem.data());
        },

        selectByText: function(text) {
            var selector = 'li a:fuelTextExactCI(' + text + ')';
            this.selectBySelector(selector);
        },

        selectByValue: function(value) {
            var selector = 'li[data-value="' + value + '"]';
            this.selectBySelector(selector);
        },

        selectByIndex: function(index) {
            // zero-based index
            var selector = 'li:eq(' + index + ')';
            this.selectBySelector(selector);
        },

        selectBySelector: function(selector) {
            var item = this.$element.find(selector);

            this.$selectedItem = item;
            this.$hiddenField.val(this.$selectedItem.attr('data-value'));
            this.$label.text(this.$selectedItem.text());
        },

        setDefaultSelection: function() {
            var selector = 'li[data-selected=true]:first';
            var item = this.$element.find(selector);
            if(item.length === 0) {
                // uselect first item
                this.selectByIndex(0);
            }
            else {
                // uselect by data-attribute
                this.selectBySelector(selector);
                item.removeData('selected');
                item.removeAttr('data-selected');
            }
        },

        enable: function() {
            this.$button.removeClass('disabled');
        },

        disable: function() {
            this.$button.addClass('disabled');
        }

    };


    // SELECT PLUGIN DEFINITION
	
    var old = $.fn.uselect;
    
    $.fn.uselect = function (option) {
        var args = Array.prototype.slice.call(arguments, 1);
        var methodReturn;

        var $set = this.each(function () {
            var $this = $(this);
            var data = $this.data('uselect');
            var options = typeof option === 'object' && option;

            if (!data) $this.data('uselect', (data = new uSelect(this, options)));
            if (typeof option === 'string') methodReturn = data[option].apply(data, args);
        });

        return ( methodReturn === undefined ) ? $set : methodReturn;
    };

    $.fn.uselect.defaults = {};

    $.fn.uselect.Constructor = uSelect;

    $.fn.uselect.noConflict = function () {
      $.fn.uselect = old;
      return this;
    };


    // SELECT DATA-API

    $(function () {

        $(window).on('load', function () {
            $('.uselect').each(function () {
                var $this = $(this);
                if ($this.data('uselect')) return;
                $this.uselect($this.data());
            });
        });

        $('body').on('mousedown.uselect.data-api', '.uselect', function () {
            var $this = $(this);
            if ($this.data('uselect')) return;
            $this.uselect($this.data());
        });
    });
})(jQuery);
/******************************************uSelect end**************************************/
/******************************************uSelectMany start**************************************/
var uSelectMany = function (element, options) {
    var ts = this;
    this.$element = $(element);
    this.options = $.extend({}, $.fn.uselectmany.defaults, options);
    this.options.data = [];
    
    this.$element.find('input').on('click',  $.proxy(this.itemclicked, this));
    this.$element.find('input').on('change',  $.proxy(this.itemclicked, this));
    this.$button = this.$element.find('button');
    this.options.perdata = this.$button.find("span").text();
    this.$button.on('click',function(event) {
        var selects = $('.uselectmany');
        for(var i=0;i<selects.length;i++){
            if(selects.eq(i).attr('id') !== ts.$element.attr('id')){
                selects.eq(i).find('.content').hide();
            }
        }
        $(this).next().toggle();
        event.stopPropagation(); 
    });
    $('body').on('click', function(event) {
        $('.uselectmany').find('.content').hide();
    });

    this.$element.find('.content').click(function(event){ 
        event.stopPropagation(); 
    }); 
    this.$content = this.$element.find('.content');
    this.initSize();
};

uSelectMany.prototype = {

    constructor: uSelectMany,

    initSize: function () {
        var width = this.$button.width() + 14 - 126;
        var left = parseInt(this.$content.css('left'));
        this.$content.css('left',width+left);

    },

    itemclicked: function (e) {
/*        this.$selectedItem = $(e.target).parent();
        this.$span= this.$selectedItem.parent().find("span");
        var data = this.selectedItemData();

        if(this.$selectedItem.parent().find("input").prop("checked")){
            this.options.data.push(data);   
        }else{
            var new_data = [];
            for(var i=0;i<this.options.data.length;i++){
                    if(this.options.data[i].text != data.text || this.options.data[i].value != data.value){
                        new_data.push(this.options.data[i]);
                    }
            }
            this.options.data = new_data;
        }*/
    	this.options.data = [];
        
        var checkboxs = this.$element.find("input");
        
        for(var i=0;i<checkboxs.length;i++){
            if(checkboxs.eq(i).prop("checked")){
            	var data_eve = new Array();
                var thistext = checkboxs.eq(i).parent().parent().find('span').html();
                var thisvalue = checkboxs.eq(i).parent().attr("data-value");
                data_eve.text = thistext;
                data_eve.value = thisvalue;
                this.options.data.push(data_eve);
            }
        }

        this.appendValue();
        // trigger changed event
        this.$element.trigger('changed', {data:this.options.data});
    },

    appendValue:function(){
        var input_value = "";
        var checkedLength = 0;
        var checkboxs = this.$element.find("input");

        for(var i=0;i<checkboxs.length;i++){
            if(checkboxs.eq(i).prop("checked")){
                input_value += checkboxs.eq(i).parent().parent().find('span').html() + ' ';
                checkedLength++;
            }
        }

        var checkboxs = this.$element.find("input");

        if(checkedLength == 0){
            input_value = this.options.perdata;
        }

        this.$button.find("span").html(input_value);
    },

    selectedItemData: function() {
        var txt = this.$span.html();
        return $.extend({ text: txt }, this.$selectedItem.data());
    },
    getValue:function(){
    	return this.$button.find("span").html();
    },
    getData:function(){
    	return this.options.data;
    },
    setValue:function(data){
        var li = this.$element.find(".dropdown-menu li");

        for(var j=0;j<data.length;j++){
            for(var i=0;i<li.length;i++){
                if(li.eq(i).find("span").html() == data[j].text && li.eq(i).find(".ucheckbox").attr("data-value") == data[j].value ){
                    li.eq(i).find("input").prop("checked","true");
                    this.options.data.push(data[j]);
                }
            }
        }

        this.appendValue();
    },

    enable: function() {
        this.$button.removeClass('disabled');
    },

    disable: function() {
        this.$button.addClass('disabled');
    }
};


// SELECTMANY PLUGIN DEFINITION

var old = $.fn.uselectmany;

$.fn.uselectmany = function (option) {
    var args = Array.prototype.slice.call(arguments, 1);
    var methodReturn;

    var $set = this.each(function () {
        var $this = $(this);
        var data = $this.data('uselectmany');
        var options = typeof option === 'object' && option;

        if (!data) $this.data('uselectmany', (data = new uSelectMany(this, options)));
        if (typeof option === 'string') methodReturn = data[option].apply(data, args);
    });

    return ( methodReturn === undefined ) ? $set : methodReturn;
};

$.fn.uselectmany.defaults = {};

$.fn.uselectmany.Constructor = uSelectMany;

$.fn.uselectmany.noConflict = function () {
  $.fn.uselectmany = old;
  return this;
};


// SELECTMANY DATA-API

$(function () {

    $(window).on('load', function () {
        $('.uselectmany').each(function () {
            var $this = $(this);
            if ($this.data('uselectmany')) return;
            $this.uselectmany($this.data());
        });
    });

    $('body').on('mousedown.uselectmany.data-api', '.uselectmany', function () {
        var $this = $(this);
        if ($this.data('uselectmany')) return;
        $this.uselectmany($this.data());
    });
});
/******************************************uSelectMany end**************************************/
/******************************************uspinner start**************************************/
(function($) {
    var old = $.fn.spinner;

    // SPINNER CONSTRUCTOR AND PROTOTYPE

    var Spinner = function (element, options) {
      this.$element = $(element);

      this.appendTemp();
      this.options = $.extend(true, {}, $.fn.uSpinner.defaults, options);
      this.$input = this.$element.find('.spinner-input');
      this.$element.find(this.$input).on("blur",$.proxy(this.change, this));

      if (this.options.hold) {
        this.$element.on('mousedown', '.spinner-up', $.proxy(function() { this.startSpin(true); } , this));
        this.$element.on('mouseup', '.spinner-up, .spinner-down', $.proxy(this.stopSpin, this));
        this.$element.on('mouseout', '.spinner-up, .spinner-down', $.proxy(this.stopSpin, this));
        this.$element.on('mousedown', '.spinner-down', $.proxy(function() {this.startSpin(false);} , this));
      } else {
        this.$element.on('click', '.spinner-up', $.proxy(function() { this.step(true); } , this));
        this.$element.on('click', '.spinner-down', $.proxy(function() { this.step(false); }, this));
      }

      this.switches = {
        count: 1,
        enabled: true
      };

      if (this.options.speed === 'medium') {
        this.switches.speed = 300;
      } else if (this.options.speed === 'fast') {
        this.switches.speed = 100;
      } else {
        this.switches.speed = 500;
      }

      this.lastValue = null;

      this.render();

      if (this.options.disabled) {
        this.disable();
      }
    };

    Spinner.prototype = {
      constructor: Spinner,
      
      appendTemp: function(){
        var temp = ''
                  +'  <div id="" class="uspinner">'
                  +'  <input type="text" class="input-mini spinner-input memory_number" value="0">'
                  +'  <div class="spinner-buttons  btn-group btn-group-vertical">'
                  +'    <button class="btn spinner-up">'
                  +'      <i class="fa fa-chevron-up"></i>'
                  +'    </button>'
                  +'    <button class="btn spinner-down">'
                  +'      <i class="fa fa-chevron-down"></i>'
                  +'    </button>'
                  +'  </div>'
                  +'</div>';
        this.$element.html(temp);
      },

      render: function () {
        var inputValue = this.$input.val();
        if (inputValue) {
          this.$input.val(this.options.value);
          
        } else {
          this.options.prevalue = inputValue;
          this.value(inputValue);
        }

      },

      change: function () {
        var newVal = this.$input.val();
        var reg1 = new RegExp("^[0-9]+$");
        var reg2 = new RegExp("^-[0-9]+$");
        if(reg1.test(newVal) || reg2.test(newVal)){
          if(newVal > this.options.max || newVal < this.options.min){
            //uDialog.alert("您输入的数字必须在" + this.options.min + "~" + this.options.max + "之间");
            this.$input.val(this.options.value);
            return
          }

          if(newVal/1){
            this.options.value = newVal/1;
          }else{
            newVal = newVal.replace(/[^0-9]/g,'') || '';
            this.$input.val(newVal);
            this.options.value = newVal/1;
          }
        }else{
          //alert("please insert number");
          this.$input.val(this.options.value);
        }

        this.triggerChangedEvent();
      },

      stopSpin: function () {
              if(this.switches.timeout!==undefined){
                  clearTimeout(this.switches.timeout);
                  this.switches.count = 1;
                  this.triggerChangedEvent();
              }
      },

      triggerChangedEvent: function () {
        var currentValue = this.value();
        if (currentValue === this.lastValue) return;

        this.lastValue = currentValue;

        // Primary changed event
        this.$element.trigger('changed', currentValue);

        // Undocumented, kept for backward compatibility
        this.$element.trigger('change');
      },

      startSpin: function (type) {

        if (!this.options.disabled) {
          var divisor = this.switches.count;

          if (divisor === 1) {
            this.step(type);
            divisor = 1;
          } else if (divisor < 3){
            divisor = 1.5;
          } else if (divisor < 8){
            divisor = 2.5;
          } else {
            divisor = 4;
          }

          this.switches.timeout = setTimeout($.proxy(function() {this.iterator(type);} ,this),this.switches.speed/divisor);
          this.switches.count++;
        }
      },

      iterator: function (type) {
        this.step(type);
        this.startSpin(type);
      },

      step: function (dir) {
        var curValue = this.options.value;
        var limValue = dir ? this.options.max : this.options.min;

        if ((dir ? curValue < limValue : curValue > limValue)) {
          var newVal = curValue + (dir ? 1 : -1) * this.options.step;

          if (dir ? newVal > limValue : newVal < limValue) {
            this.value(limValue);
          } else {
            this.value(newVal);
          }
        } else if (this.options.cycle) {
          var cycleVal = dir ? this.options.min : this.options.max;
          this.value(cycleVal);
        } else if(curValue == limValue){
            this.value(limValue);
        }
        this.options.prevalue = curValue;
      },

      value: function (value) {
        if (!isNaN(parseFloat(value)) && isFinite(value)) {
          value = parseFloat(value);
          this.options.value = value;
          this.$input.val(value);
          return this;
        } else {
          return this.options.value;
        }
      },
      setvalue: function (Value) {
        var value = parseFloat(Value);
        this.options.value = value;
        this.$input.val(value);
      },
      disable: function () {
        this.options.disabled = true;
        this.$input.attr('disabled','');
        this.$element.find('button').addClass('disabled');
      },

      enable: function () {
        this.options.disabled = false;
        this.$input.removeAttr("disabled");
        this.$element.find('button').removeClass('disabled');
      },
      disableBtn: function () {
        this.options.disabled = true;
        this.$element.find('button').addClass('disabled');
      },

      enableBtn: function () {
        this.options.disabled = false;
        this.$element.find('button').removeClass('disabled');
      },

      disableInput: function () {
        this.options.disabled = true;
        this.$input.attr('disabled','');
      },

      enableInput: function () {
        this.options.disabled = false;
        this.$input.removeAttr("disabled");
      },
      
      getpre: function () {
        return this.options.prevalue;
      },
      
      setStep: function (value) {
        this.options.step = value;
      },

      setMin: function (minValue) {
        this.options.min = minValue;
      },

      setMax: function (maxValue) {
        this.options.max = maxValue;
      }
    };


    // SPINNER PLUGIN DEFINITION

    $.fn.uSpinner = function (option) {
      var args = Array.prototype.slice.call( arguments, 1 );
      var methodReturn;

      var $set = this.each(function () {
        var $this   = $( this );
        var data    = $this.data( 'spinner' );
        var options = typeof option === 'object' && option;

        if( !data ) $this.data('spinner', (data = new Spinner( this, options ) ) );//Ïàµ±ÓÚnewÒ»¸öSpinner
        if( typeof option === 'string' ) methodReturn = data[ option ].apply( data, args );
      });

      return ( methodReturn === undefined ) ? $set : methodReturn;
    };

    $.fn.uSpinner.defaults = {
      value: 1,//ÎÄ±¾¿òµÄÖµ
      prevalue: 1,
      min: 1,//¿ÉÒÔ¼õÐ¡µÄ×îÐ¡Öµ
      max: 9999999,//¿ÉÒÔÔö¼ÓµÄ×î´óÖµ
      step: 1,//Ã¿´ÎµÝ¼õµÄÖµ
      hold: true,//ÊÇ·ñ¿ÉÒÔÊó±ê·ÅÔÚ°´Å¥ÉÏÈ»ºó³ÖÐøµÝ¼õ»òµÝÔö
      speed: 'medium',//Êó±ê·ÅÔÚ°´Å¥ÉÏÈ»ºó³ÖÐøµÝ¼õ»òµÝÔöµÄËÙ¶È
      disabled: false//°´Å¥¼°ÎÄ±¾¿òÊÇ·ñ¿ÉÓÃ
    };

    $.fn.uSpinner.Constructor = Spinner;

    $.fn.uSpinner.noConflict = function () {
      $.fn.uSpinner = old;
      return this;
    };


    // SPINNER DATA-API

    /*$(function () {
      $('body').on('mousedown.spinner.data-api', '.spinner', function () {
        var $this = $(this);
        if ($this.data('spinner')) return;
        $this.spinner($this.data());
      });
    });*/
  })(jQuery);


/******************************************uspinner end**************************************/
/******************************************udate start**************************************/
;(function($) {
    var uDate = function (element, options) {
    this.$element = $(element);
    this.op = $.extend(true, {}, $.fn.uDate.defaults, options);
    this.viewDate=this.op.viewDate;

    this.showCalendarView();
  };

    uDate.prototype = {
        constructor: uDate,
    disable:function(){
        this.op.disable = true;
        this.$element.find('.uDateHeader').css('background','rgb(239, 239, 239)');
    },
    enable:function(){
        this.op.disable = false;
        this.$element.find('.uDateHeader').css('background','#fff');
    },
    showCalendarView:function(){
      this.updateCalendarData();
      this.$element.find('.uDateBody').hide();
    },
    updateCalendarData:function(){
      var daysOfThisMonth=this.range(1,32 - new Date( this.viewDate.getFullYear(), this.viewDate.getMonth(), 32 ).getDate());
      var daysOfLastmonth=this.range(1,this.viewDate.getDate()==6?0:this.viewDate.getDate()+1);
      this.renderCalendar();
    },
    range:function(startData,endData){
      var result=[];
      for (var i =startData; i <= endData; i++) {
        result[result.length]=i;
      };
      return result;
    },
    renderCalendar:function(){
        var temp="<div class='uDateBox'>"+
                "<div class='uDateHeader'  onselectstart='return false' style='-moz-user-select:none;'>"+
                  "<input value='"+this.op.tip+"' class='uDateInput' disabled>"+
                    "<a class='uDateCalendarIconA'></a></div>"+
                "<div class='uDateBody'  onselectstart='return false' style='-moz-user-select:none;'>"+
                  "<div class='uDatePicker'>"+
                    "<div class='uDateTrianger'>"+
                      "<div class='uDateTrianger' style='border-bottom: 10px solid white;position: relative;left:-10px;  z-index: 1;top:12px'></div></div>"+
                    "<div class='uDatePickerHeader'>"+
                      "<span class='uDatePickerLeft'><i class='fa fa-chevron-left'></i></span>"+
                      "<input class='uDatePickerCenter' value='' disabled>"+
                      "<span class='uDatePickerRight'><i class='fa fa-chevron-right'></i></span></div>"+
                    "<div class='uDatePickerTable'style='cellspacing:collapse;'>"+
                      "<table cellspacing='0';cellpading='0';>"+
                        "<tr><th><span>日</span></th><th><span>一</span></th><th><span>二</span></th><th><span>三</span></th><th><span>四</span></th><th><span>五</span></th><th><span>六</span></th></tr>"+
                        "<tr><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td></tr>"+
                        "<tr><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td></tr>"+
                        "<tr><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td></tr>"+
                        "<tr><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td></tr>"+
                        "<tr><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td></tr>"+
                        "<tr><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td></tr>"+
                      "</table></div>"+
                    "<div class='uDatePickerTime'style='padding: 12px 0px 12px 5px;'>"+
                      "<span class='uDatePickerHour'></span>"+
                      "<span class='uDatePickerMinute'></span>"+
                      "<span class='uDatePickerSecond'></span></div>"+
                "<div class='uDatePickerFoot'>"+
                  "<button class='uDatePickerToday'>今天</button>"+
                  "<button class='uDatePickerSubmit'>确定</button>"+
                  "<button class='uDatePickerReset'>取消</button></div></div></div></div>";

      this.$element.html('').append(temp);
      //set Calendar icon
      this.$element.find('.uDateCalendarIconA').html(this.op.uDateIcon);
      //set hour
      this.$element.find('.uDatePickerHour').uSpinner(this.op.hourSet);
      this.$element.find('.uDatePickerHour').uSpinner('setvalue',this.viewDate.getHours());
      //set minute
      this.$element.find('.uDatePickerMinute').uSpinner(this.op.minuteSet);
      this.$element.find('.uDatePickerMinute').uSpinner('setvalue', this.viewDate.getMinutes());
      //set second
      this.$element.find('.uDatePickerSecond').uSpinner(this.op.secondsSet);
      this.$element.find('.uDatePickerSecond').uSpinner('setvalue',this.viewDate.getSeconds());
      //show year and month
      this.$element.find('.uDatePickerCenter').val(this.viewDate.getFullYear()+'年'+(this.viewDate.getMonth()+1)+'月');
      //show weekdays
      var weekLength=this.$element.find('.uDatePickerTable').find('th').length;
      for (var i = 0; i < weekLength; i++) {
        this.$element.find('.uDatePickerTable').find('th:eq('+i+')').find('div').text(this.op.weekdays[i]);
      };
      //show days
      var dayLengthOfThismonth=32 - new Date( this.viewDate.getFullYear(), this.viewDate.getMonth(), 32 ).getDate();
      var dayLengthOfLastmonth=new Date( this.viewDate.getFullYear(), this.viewDate.getMonth(), 1 ).getDay();
      for (var i = 1; i <= dayLengthOfThismonth; i++) {
        this.$element.find('.uDatePickerTable').find('td:eq('+(dayLengthOfLastmonth+i-1)+')').find('div').text(i);
        this.$element.find('.uDatePickerTable').find('td:eq('+(dayLengthOfLastmonth+i-1)+')').find('div').attr('title',i);
        this.$element.find('.uDatePickerTable').find('td:eq('+(dayLengthOfLastmonth+i-1)+')').find('div').addClass('pointer');
      };
      var dayNumber=this.viewDate.getDate()>dayLengthOfThismonth?dayLengthOfThismonth:(this.viewDate.getDate()<1?1:this.viewDate.getDate());
      this.pickDate(this.$element.find('.uDatePickerTable').find('td').find('div[title='+dayNumber+']'));
      this.setBindingsEvent();
    },
    pickDate:function(selector){
      selector.addClass('uDatePickerTableTdSelected');
      this.viewDate=new Date(this.viewDate.getFullYear(),this.viewDate.getMonth(),selector.text(),this.$element.find(".uDatePickerHour").uSpinner("value"),this.$element.find(".uDatePickerMinute").uSpinner("value"),this.$element.find(".uDatePickerSecond").uSpinner("value"));
    },
    onSelect:function(selector){
      this.$element.find('.uDatePickerTable').find('td').each(function(){
        $(this).find('div').removeClass('uDatePickerTableTdSelected');
      });
      if($(selector).find("div").text()!=null&&$(selector).find("div").text()!=''&&$(selector).find("div").text()!=undefined){
        this.pickDate($(selector).find("div"));
        this.$element.find('.uDateInput').val(this.formatDate(this.viewDate));
      }
    },
    confirmValue:function(){
      this.viewDate=new Date(this.viewDate.getFullYear()-0, this.viewDate.getMonth(), this.$element.find('.uDatePickerTableTdSelected').text(),this.$element.find(".uDatePickerHour").uSpinner("value"),this.$element.find(".uDatePickerMinute").uSpinner("value"),this.$element.find(".uDatePickerSecond").uSpinner("value"));
      this.$element.find('.uDateInput').val(this.formatDate(this.viewDate));
      this.op.date=this.viewDate;
      this.$element.trigger( 'confirm', {"value":this.op.date});
      this.$element.find('.uDateBody').hide();
    },
    getDate:function(){
      return this.op.date==null?null:this.$element.find('.uDateInput').val();
    },
    getDateObject:function(){
        return this.op.date;
    },
    setDate:function(date){
      this.viewDate=date;
      this.renderCalendar();
      this.confirmValue();
    },
    resetDate:function(flag){
        this.viewDate=new Date();
        this.renderCalendar();
        this.op.date=null;
        this.$element.find('.uDateInput').val(this.op.tip);  
        if(flag===true){
            this.showBody();
        }else{
            this.hideBody();
        }
        
    },
    formatDate:function(value){
      if (value!=null) {
        date=value;
      }else{
          return null;
      }
      var dateFormat=this.op.dateFormat;
      var inputValue = dateFormat.replace(/yyyy/gm,date.getFullYear());
      inputValue = inputValue.replace(/MM/gm,date.getMonth()+1);
      inputValue = inputValue.replace(/dd/gm,date.getDate());
      inputValue = inputValue.replace(/hh/gm,date.getHours());
      inputValue = inputValue.replace(/mm/gm,date.getMinutes());
      inputValue = inputValue.replace(/ss/gm,date.getSeconds());
      inputValue = inputValue.replace(/week/gm,date.getDay());
      return inputValue;
    },
    showBody:function(){
      this.$element.find('.uDateBody').show();
    },
    hideBody:function(){
      this.$element.find('.uDateBody').hide();
    },
    setBindingsEvent:function(){
      var $this=this;
      $this.$element.find('.uDatePickerSubmit').on( 'click', function(){
        event.stopPropagation(); 
        $this.confirmValue();
      });

      $this.$element.find('.uDatePickerTable').find('td').on( 'click', function(){
        event.stopPropagation(); 
        $this.onSelect($(this));
      });

      $this.$element.find('.uDateHeader').toggle(function(){
          if(!$this.op.disable){
              $this.showBody();
          }
        },function(){
          if(!$this.op.disable){
            $this.hideBody();
          }
        });

      $this.$element.find('.uDatePickerLeft').on( 'click', function(){
        event.stopPropagation(); 
        $this.viewDate=new Date($this.viewDate.getFullYear()-0, ($this.viewDate.getMonth()-1), 1,$this.$element.find(".uDatePickerHour").uSpinner("value"),$this.$element.find(".uDatePickerMinute").uSpinner("value"),$this.$element.find(".uDatePickerSecond").uSpinner("value"));
        $this.renderCalendar();
        $this.$element.find('.uDateInput').val($this.formatDate(this.viewDate));
      
      });

      $this.$element.find('.uDatePickerRight').on( 'click', function(){
        event.stopPropagation(); 
        $this.viewDate=new Date($this.viewDate.getFullYear()-0, ($this.viewDate.getMonth()+1), 1,$this.$element.find(".uDatePickerHour").uSpinner("value"),$this.$element.find(".uDatePickerMinute").uSpinner("value"),$this.$element.find(".uDatePickerSecond").uSpinner("value"));
        $this.renderCalendar();
        $this.$element.find('.uDateInput').val($this.formatDate(this.viewDate));
      });

      $this.$element.find('.uDatePickerToday').on( 'click', function(){
        event.stopPropagation(); 
        $this.viewDate=new Date();
        $this.renderCalendar();
        $this.$element.find('.uDateInput').val($this.formatDate(this.viewDate));
      
      });

      $this.$element.find('.uDatePickerReset').on( 'click', function(){
        event.stopPropagation(); 
        $this.resetDate(true);
      });

       $this.$element.find('.uDateBox').click(function(event){ 
        event.stopPropagation(); 
      }); 
      $(document).on("click",function(e){
        $this.$element.find('.uDateBody').hide();
      });
    }
  };

  $.fn.uDate = function (option) {
    var args = Array.prototype.slice.call(arguments, 1);
    var methodReturn;
    var data;
    var $set = this.each(function () {
      var $this = $(this);
      data = $this.data('uDate');
      var options = typeof option === 'object' && option;
      if (!data) $this.data('uDate', (data = new uDate(this, options)));
      if (typeof option === 'string') methodReturn = data[option].apply(data, args);
    });
    return ( methodReturn === undefined ) ? $set : methodReturn;
  };

  $.fn.uDate.defaults = {
    uDateIcon:"<i class='fa fa-calendar uDateCalendarIcon'></i>",
    viewDate:new Date(),
    tip:'请选择时间',
    date:null,
    dateFormat:'yyyy-MM-dd hh:mm:ss',
    weekdays:[ "日", "一", "二", "三", "四", "五", "六"],
    month:1,
    year:1992,
    day:11,
    disable:false,
    hourSet:{
      value:0,
      min: 0,
      max: 23,
      step: 1
    },
    minuteSet:{
      value:0,
      min: 0,
      max: 59,
      step: 1
    },
    secondsSet:{
      value:0,
      min: 0,
      max: 59,
      step: 1
    }
  };

})(jQuery);

/******************************************udate end**************************************/

;(function ($) {

	  var uTooltip = function (element, options) {
	    this.init('utooltip', element);
	  };

	  uTooltip.prototype = {

	    constructor: uTooltip

	  , init: function (type, element, options) {
	      var eventIn, eventOut, triggers, trigger, i;

	      this.type = type;
	      this.$element = $(element);
	      this.options = options;
	      this.enabled = true;
	      this.create(options);
          eventIn = 'mouseenter';
          eventOut = 'mouseleave';
          this.$element.on(eventIn + '.' + this.type, $.proxy(this.enter, this));
          this.$element.on(eventOut + '.' + this.type, $.proxy(this.leave, this));
	    }
	  , create: function (options) {
		  this.options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options);
		  this.placement = this.$element.attr("data-placement");
	      this.$tip = $(this.options.template).insertAfter(this.$element).addClass(this.placement);
	      var content = this.$element.attr("title");
	      this.$tip.find(".utooltip-inner").html(content);
	      this.$element.attr("title","");
	  }
	  ,enter : function(event){
		  var width = this.$element.width();
	      var height = this.$element.height();
	      var tipWidth = this.$tip.width();
	      var tipHeight = this.$tip.height();
	      var offsetLeft = this.$element.offset().left;
	      var offsetTop = this.$element.offset().top;
	      var scollTop = $("body").scrollTop();
	      offsetTop -= scollTop;
	      var left,top;
	      switch(this.placement){
	        case "top":
	    	  left = offsetLeft + (width/2) - (tipWidth/2);
	    	  top = offsetTop-tipHeight-6;
	    	  break;
	        case "right":
		        left = offsetLeft + width + 6;
			    top = offsetTop + (height/2) -(tipHeight/2);
			    break;
	        case "bottom":
	        	left = offsetLeft + (width/2) - (tipWidth/2);
			    top = offsetTop - height + tipHeight + 6;
			    break;
	        case "left":
		        left = offsetLeft - tipWidth - 6;
			    top = offsetTop + (height/2) -(tipHeight/2);
			    break;
	      }
	      this.$tip.css("visibility","visible");
	      this.$tip.css({left:(left+"px"),top:(top+"px")});
	      
	  }
	  ,leave : function(event){
		  this.$tip.css("visibility","hidden");
	  }
	  , arrow: function(){
	      return this.$arrow = this.$arrow || this.tip().find(".utooltip-arrow");
	    }

	  , enable: function () {
	      this.enabled = true;
	    }

	  , disable: function () {
	      this.enabled = false;
	    }

	  , toggleEnabled: function () {
	      this.enabled = !this.enabled;
	    }

	  , destroy: function () {
	      this.hide().$element.off('.' + this.type).removeData(this.type);
	    }

	  };

	  var old = $.fn.utooltip;

	  $.fn.utooltip = function ( option ) {
	    return this.each(function () {
	      var $this = $(this)
	        , data = $this.data('utooltip')
	        , options = typeof option == 'object' && option;
	      if (!data) $this.data('utooltip', (data = new uTooltip(this, options)));
	      if (typeof option == 'string') data[option]();
	    });
	  };

	  $.fn.utooltip.Constructor = uTooltip;

	  $.fn.utooltip.defaults = {
	    animation: true
	  , placement: 'top'
	  , selector: false
	  , template: '<div class="utooltip"><div class="utooltip-arrow"></div><div class="utooltip-inner"></div></div>'
	  , delay: 0
	  , html: false
	  };



	  $.fn.utooltip.noConflict = function () {
	    $.fn.utooltip = old;
	    return this;
	  };

	})(jQuery);
/**************************************************************************************/
function loadRightContent(url,option){
    /*    showORHideRightPanel();
    var right_panel = $('div.resource_manager_right');
    var status = right_panel.data('status');
    if(status!=undefined&&status=='active'){
        right_panel.css('display','table-cell');
        right_panel.removeData('status');
        return;
    }*/
    if(option!=undefined){
        if(option.before!=undefined){
            option.before();
        }
        $('div.resource_manager_load').html('');
        $('div.resource_manager_load').load(url,{data:option.data},function(){
            if(!projectShow){
                $(this).parent().css('display','table-cell');
            }
        });
        if(option.after!=undefined){
        	option.after();
        }
    }else{
        $('div.resource_manager_load').html('');
        $('div.resource_manager_load').load(url,{},function(){
            if(!projectShow){
                $(this).parent().css('display','table-cell');
            }
        });
    }
}

function addWarningTip(tipId,errorTip,title,place){
	var errorInfo = '<div class="warning_i_icon createvm-tooltip" data-toggle="utooltip" data-placement="bottom" title="'+title+'"></div>&nbsp;&nbsp;'+errorTip;
    $("#"+tipId).html(errorInfo);
    if(title != ""){
    	$("#"+tipId).find("[data-toggle=utooltip]").utooltip();
    }
}
