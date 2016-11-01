window.onload = function(){
	showMessageHandle.addMessageHandle();
};

var showMessageHandle = {
		createXHR : function(){
			if (window.XMLHttpRequest){	
				//IE7+、Firefox、Opera、Chrome 和Safari
				return new XMLHttpRequest();
			}else if(window.ActiveXObject){
				//IE6 及以下
				return new ActiveXObject('Microsoft.XMLHTTP');
			}else{
				throw new Error('浏览器不支持XHR对象！');
			}
		},

		ajax : function(obj){
			if(obj.dataType === 'json'){
				var xhr = this.createXHR();		//创建XHR
				//通过使用JS随机字符串解决IE浏览器第二次默认获取缓存的问题
				obj.url = obj.url + '?rand=' + Math.random();
				obj.data = this.formatParams(obj.data);	//通过params()将名值对转换成字符串
			
				if (obj.method === 'get'){
					obj.url += obj.url.indexOf('?') == -1 ? '?' + obj.data : '&' + obj.data; 
				}
				if (obj.async === true){   //true表示异步，false表示同步
					//使用异步调用的时候，需要触发readystatechange 事件
					xhr.onreadystatechange = function () {
						if (xhr.readyState == 4) {   //判断对象的状态是否交互完成
							callback();		 //回调
						}
					};
				}
				//在使用XHR对象时，必须先调用open()方法，
				//它接受三个参数：请求类型(get、post)、请求的URL和表示是否异步。
				xhr.open(obj.method, obj.url, obj.async);
				if (obj.method === 'post'){
					//post方式需要自己设置http的请求头，来模仿表单提交。
					//放在open方法之后，send方法之前。
					xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
					xhr.send(obj.data);		//post方式将数据放在send()方法里
				} else {
					xhr.send(null);			//get方式则填null
				}
				if(obj.async === false){  //同步
					callback();
				}

				var callback = function(){
					//判断http的交互是否成功，200表示成功
					if(xhr.status == 200){
						obj.success(xhr.responseText);			//回调传递参数
					} else {
						alert('获取数据错误！错误代号：' + xhr.status + '，错误信息：' + xhr.statusText);
					}	
				};
			} else if (obj.dataType === "jsonp"){
				var data = obj.data;
				var callbackName;
				var oHead = document.getElementsByTagName("head")[0];
				var oScript = document.createElement("script");
				var params = '', paraArr=[];
				var onEvent, supportLoad;
				var urlArr, iUrl = obj.url;


			    for(var i in data){  
			        if(data.hasOwnProperty(i)){  
			            paraArr.push(encodeURIComponent(i) + "=" +encodeURIComponent(data[i]));  
			        }
			    }


			    urlArr = obj.url.split("?");//链接中原有的参数


			    if(urlArr.length>1){  
			        paraArr.push(urlArr[1]);  
			    }


			    callbackName = 'callback'+new Date().getTime();
			    paraArr.push('callback='+callbackName);
			    params = paraArr.join("&");
				iUrl = urlArr[0] + "?"+ params;
				oScript.loaded = false;


				//jsonp的回调函数
				window[callbackName] = function(json){
					var callback = obj.success;
					callback(json);
					oScript.loaded = true;
				};


				oHead.insertBefore(oScript, oHead.firstChild);
				oScript.src = iUrl;
				supportLoad = "onload" in oScript;
				onEvent = supportLoad ? "onload" : "onreadystatechange";


			    oScript[onEvent] = function(){    
			        if(oScript.readyState && oScript.readyState !="loaded"){  
			            return;  
			        }  
			        if(oScript.readyState == 'loaded' && oScript.loaded === false){  
			            oScript.onerror();  
			            return;  
			        }  
			        //删除节点。  
			        (oScript.parentNode && oScript.parentNode.removeChild(oScript)) && (oHead.removeNode && oHead.removeNode(this));
			    };
			}
		},

		formatParams : function(data){
			var arr = [];
			for(var i in data){
				//特殊字符传参产生的问题可以使用encodeURIComponent()进行编码处理
				arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
			}
			return arr.join('&');
		},

		addMessageHandle : function(){
			var oBtn = document.getElementById('myBtn');
			oBtn.addEventListener("click", (this.searchMessage).bind(this), false);
		},

		searchMessage : function(){
			var oCity = document.getElementById('myCity');
			var showResult = document.getElementById('result').getElementsByTagName('span');
			console.log(showResult.length);
			var cityName = oCity.value;

			console.log(cityName);

			this.ajax({
				method : 'get',
				url : "http://api.jisuapi.com/weather/query",
				data : {
					appkey :  '0cd959d1554aacba',
					city : cityName
				},
				dataType : 'jsonp',
				success : function (data) {
					console.log(data);
						showResult[0].innerHTML = data.result.date;
						showResult[1].innerHTML = data.result.week;
						showResult[2].innerHTML = data.result.weather;
						showResult[3].innerHTML = data.result.temp;
						showResult[4].innerHTML = data.result.temphigh;
						showResult[5].innerHTML = data.result.templow;
						showResult[6].innerHTML = data.result.windspeed;
						showResult[7].innerHTML = data.result.winddirect;
						showResult[8].innerHTML = data.result.windpower;
						showResult[9].innerHTML = data.result.hourly[0].time;
						showResult[10].innerHTML = data.result.hourly[0].weather;
						showResult[11].innerHTML = data.result.hourly[0].temp;
						showResult[12].innerHTML = data.result.aqi.pm2_5;
						showResult[13].innerHTML = data.result.aqi.quality;
						showResult[14].innerHTML = data.result.aqi.aqiinfo.affect;
						showResult[15].innerHTML = data.result.aqi.aqiinfo.measure;
						showResult[showResult.length-1].innerHTML = data.result.index[1].detail;
				},
				async : true
			});
		}
	};