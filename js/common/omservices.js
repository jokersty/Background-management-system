/**
 * Created by gaopeng on 17/2/13.
 */

var base_server_url = "http://www.roam-tech.com:8100/";


function HttpError(code, message) {
    this.errorCode = code;
    this.errorMessage = message;
}

function stripResult(responseData) {
    var error_no = responseData.error_no;
    if (error_no == 0) {
        return responseData.result;
    } else {
        var error_info = responseData.error_info;
        if (error_no == 1101) {
            // 1101错误，会话失效，返回登录页面
            alert(error_info);
            window.location = "login.html";
        } else  {
            return new HttpError(error_no, error_info);
        }
    }
}

function httplogin(username, password, callback) {
    $.post(base_server_url+"om/services/login", {
        "username":username,
        "password":password
    }).success(function(data, status) {
        var error_no = data.error_no;
        if (error_no == 0) {
            localStorage.setItem("sessionId", data.sessionid);
            localStorage.setItem("userInfo", JSON.stringify(data.result));
        }
        callback(stripResult(data));
    })
    .error(function(error, status) {
        var error_no = error.statusCode();
        var error_info = error.statusText;
        callback(new HttpError(error_no, error_info));
    });
}

function httpGetOrders(pageNo, pageSize, filter, callback) {
    var userId = JSON.parse(localStorage.getItem("userInfo")).userid;
    var sessionId = localStorage.getItem("sessionId");

    var param = {
        "userid"      : userId,
        "sessionid"   : sessionId,
        "group"       : 1,
        "pageindex"   : pageNo,
        "pagesize"    : pageSize
    };
    if(filter.export_to_excel ==1){
        param.export_to_excel = filter.export_to_excel;
    }
    if(filter.export_to_excel ==0){
        param.export_to_excel = filter.export_to_excel;
    }
    if(filter.phone!=null && filter.phone.length>0){
    	param.phone = filter.phone;  
	}
    if(filter.orderid!=null && filter.orderid.length>0){
    	param.orderid = filter.orderid;  
	}
    if(filter.shipping_status!=null && filter.shipping_status.length>0){
    	param.shipping_status = filter.shipping_status;
	}
    if(filter.order_status!=null && filter.order_status.length>0){
    	param.order_status = filter.order_status;
	}
    if(filter.pay_status!=null && filter.pay_status.length>0){
    	param.pay_status = filter.pay_status;
	}
    if(filter.payid!=null && filter.payid.length>0){
    	param.payid = filter.payid;
	}
    if(filter.areaname!=null && filter.areaname.length>0){
    	param.areaname = filter.areaname;
	}
    if(filter.source!=null && filter.source.length>0){
        param.source = filter.source;
    }
    if(filter.sidx == "usit_price" && filter.sidx.length>0){
    	param.orderby = filter.sidx;
    	param.desc_or_asc = filter.sord;
    }
    if(filter.sidx == "createtime" && filter.sidx.length>0){
    	param.orderby = filter.sidx;
    	param.desc_or_asc = filter.sord;
    }
    if(filter.sidx == "effect_datetime" && filter.sidx.length>0){
    	param.orderby = filter.sidx;
    	param.desc_or_asc = filter.sord;
    }
    if(filter.sidx == "failure_datetime" && filter.sidx.length>0){
    	param.orderby = filter.sidx;
    	param.desc_or_asc = filter.sord;
    }
    if(filter.createtime_from!=null && filter.createtime_from.length>0 && filter.createtime_to!=null && filter.createtime_to.length>0){
    	param.createtime_from = filter.createtime_from;
    	param.createtime_to = filter.createtime_to;
    }
    $.post(base_server_url+"om/services/order_search", param).success(function (data, status) {
        callback(stripResult(data));
    }).error(function (error, status) {
        var error_no = error.statusCode();
        var error_info = error.statusText;
        callback(new HttpError(error_no, error_info));
    });
}

//关于通话记录的代码
function httpGetCalllog(pageNo, pageSize, filter, callback) {
    var userId = JSON.parse(localStorage.getItem("userInfo")).userid;
    var sessionId = localStorage.getItem("sessionId");
    var param = {
        "userid"      : userId,
        "sessionid"   : sessionId,
        "group"       : 1,
        "pageindex"   : pageNo,
        "pagesize"    : pageSize
    };
    if(filter.caller!=null && filter.caller.length>0){
    	param.caller = filter.caller;  
	}
    if(filter.userinfo!=null && filter.userinfo.length>0){
    	param.phone = filter.userinfo;  
	}
    if(filter.created!=null && filter.created.length>0 && filter.time!=null && filter.time.length>0){
    	param.createtime_from = filter.created;
    	param.createtime_to = filter.time;
    }
    $.post(base_server_url+"om/services/call_record_gets",param).success(function (data, status) {
        callback(stripResult(data));
    }).error(function (error, status) {
        var error_no = error.statusCode();
        var error_info = error.statusText;
        callback(new HttpError(error_no, error_info));
    });
}

//修改
function setOrder(orderData, callback) {
	var userId = JSON.parse(localStorage.getItem("userInfo")).userid;
    var sessionId = localStorage.getItem("sessionId");
	var param = {
		"userid"      : userId,
        "sessionid"   : sessionId,
		"id":orderData.id,
		"orderid":orderData.orderid
	}
    if(orderData.invoice_no!=null && orderData.invoice_no.length>0){
    	param.invoice_no = orderData.invoice_no;
	}
	$.post(base_server_url+"om/services/order_shipped",param).success(function(data,status){
		callback(stripResult(data));
	}).error(function (error, status) {
        var error_no = error.statusCode();
        var error_info = error.statusText;
        callback(new HttpError(error_no, error_info));
    });
}

//城市列表
//function cityGets(){
//	$.post(base_server_url+"uc/services/city_gets").success(function(data,status){
//		callback(stripResult(data));
//	}).error(function (error, status) {
//      var error_no = error.statusCode();
//      var error_info = error.statusText;
//      callback(new HttpError(error_no, error_info));
//  });
//}
//络漫宝设备
function httpGetTouchDev(pageNo, pageSize, filter, callback) {
    var userId = JSON.parse(localStorage.getItem("userInfo")).userid;
    var sessionId = localStorage.getItem("sessionId");
    var param = {
        "userid"      : userId,
        "sessionid"   : sessionId,
        "group"       : 1,
        "pageindex"   : pageNo,
        "pagesize"    : pageSize
    };
    if(filter.export_to_excel ==1){
        param.export_to_excel = filter.export_to_excel;
    }
    if(filter.export_to_excel ==0){
        param.export_to_excel = filter.export_to_excel;
    }
    if(filter.userphone!=null && filter.userphone.length>0){
    	param.userphone = filter.userphone;  
	}
    if(filter.devphone!=null && filter.devphone.length>0){
    	param.devphone = filter.devphone;  
	}
    $.post(base_server_url+"om/services/touchdev_search", param).success(function (data, status) {
        callback(stripResult(data));
    }).error(function (error, status) {
        var error_no = error.statusCode();
        var error_info = error.statusText;
        callback(new HttpError(error_no, error_info));
    });
}
//全球数据卡
function httpGetDatacard(pageNo, pageSize, filter, callback) {
    var userId = JSON.parse(localStorage.getItem("userInfo")).userid;
    var sessionId = localStorage.getItem("sessionId");
    var param = {
        "userid"      : userId,
        "sessionid"   : sessionId,
        "group"       : 1,
        "pageindex"   : pageNo,
        "pagesize"    : pageSize
    };
    if(filter.export_to_excel ==1){
        param.export_to_excel = filter.export_to_excel;
    }
    if(filter.export_to_excel ==0){
        param.export_to_excel = filter.export_to_excel;
    }
    if(filter.phone!=null && filter.phone.length>0){
    	param.phone = filter.phone;  
	}
    if(filter.areaname!=null && filter.areaname.length>0){
    	param.areaname = filter.areaname;
	}
    if(filter.effect_datetime!=null && filter.effect_datetime.length>0 && filter.failure_datetime!=null && filter.failure_datetime.length>0){
    	param.effect_datetime_from = filter.effect_datetime;
    	param.failure_datetime_to = filter.failure_datetime;
    }
    if(filter.sidx == "effect_datetime" && filter.sidx.length>0){
    	param.orderby = filter.sidx;
    	param.desc_or_asc = filter.sord;
    }
    if(filter.sidx == "failure_datetime" && filter.sidx.length>0){
    	param.orderby = filter.sidx;
    	param.desc_or_asc = filter.sord;
    }
    $.post(base_server_url+"om/services/datacard_gets", param).success(function (data, status) {
        callback(stripResult(data));
    }).error(function (error, status) {
        var error_no = error.statusCode();
        var error_info = error.statusText;
        callback(new HttpError(error_no, error_info));
    });
}











