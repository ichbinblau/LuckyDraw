var g_Interval = 10;
var g_PersonCount = 0;
var g_Timer;
var running = false;
var data_file = "data/data.csv";
var data = new Array();
var weightedData = new Array();
var removed = new Array();
var dataInTable = false;

function addName(message) {
    //var positions = makeNewPosition();       
    var el = $('<li>'+message+'</li>');
    //el.css('left', positions[1]);
    //el.css('top', positions[0]);
    $('#messagebox').append(el);
    console.log('winner ' + message); 
}

function beginRndNum(trigger) {
    if (running) { // running -> stopped
        running = false;
        clearTimeout(g_Timer);
        $(trigger).val("Start");
        $('#ResultNum').css('color', '#FF0000');
        $('#Button input[value="Skip"]').show();
        addName($('#ResultNum').html());
        //$('#Report').append("<div>" + $('#ResultNum').html() + "</div>");
        //console.log($('#ResultNum').html());
    }
    else { // stopped to running
        running = true;
        $('#ResultNum').css('color', 'white');
        $(trigger).val("Stop");
        beginTimer();
        $('#Button input[value="Skip"]').hide();
    }
}

function skipCandidate() {
    var name = $('#ResultNum').html();
    if (running === false) {
        if ($.inArray(name, removed) === -1) {
            removed[removed.length] = name;
            console.log('skipped ' + name);
            //alert(removed.length);
        }
        else
            console.log(name + " already exists in the removed list.")
    }
}

function updateRndNum() {
    var num = Math.floor(Math.random() * g_PersonCount + 0);
    if (removed.length == data.length) {
        alert("There is no candidate left.");
        clearTimeout(g_Timer);
    }
    else {
        while ($.inArray(weightedData[num], removed) > -1) {
            num = Math.floor(Math.random() * g_PersonCount + 0);
        }
    }
    $('#ResultNum').html(weightedData[num]);
}

function beginTimer() {
    g_Timer = setTimeout(beat, g_Interval);
}

function beat() {
    g_Timer = setTimeout(beat, g_Interval);
    updateRndNum();
}

function processData(data) {
    var html;
    if (typeof (data[0]) === 'undefined') {
        return null;
    }

    // one dimension
    if (data[0].constructor === String) {
        html += '<tr>\r\n';
        for (var item in data) {
            html += '<td>' + data[item] + '</td>\r\n';
        }
        html += '</tr>\r\n';
        weightedData = data
    }

    // two dimension
    if (data[0].constructor === Array) {
        for (var row in data) {
            html += '<tr>\r\n';
            var i = 0;
            var name;
            for (var item in data[row]) {
                html += '<td>' + data[row][item] + '</td>\r\n';
                if (i % 2 == 0)
                    name = data[row][item];
                else {
                    if ($.isNumeric(data[row][item])) {
                        max = parseInt(data[row][item]);
                        for (j = 0; j < max; j++)
                            weightedData[weightedData.length] = name;
                    }
                    else
                        console.log("Wrong data format in data.csv");
                }
                i++;
            }
            html += '</tr>\r\n';
        }
    }
    return html;
}

function load_data() {
    $.ajax({
        url: data_file,
        async: false,
        success: function (csvd) {
            data = $.csv.toArrays(csvd);
            var tbl = processData(data);
            if (dataInTable && tbl) {
                $("#Data").empty();
                $("#Data").html(tbl);       
            }
            console.log("The size of the weighted array is " + weightedData.length);
            g_PersonCount = weightedData.length;
        },
        dataType: "text",
        complete: function () {
            console.log("The size of the array is " + data.length);
        },
        //statusCode: {
        //    404: function () {
        //        alert("The data file does not exist in project folder data/");
        //    },
        //},
        error: function () {
            alert("The data file does not exist in project folder data/");
        }
    });
}

//function makeNewPosition(){
//    
//    // Get viewport dimensions (remove the dimension of the div)
//    var h = $(window).height() - 20;
//    var w = $(window).width() - 200;
//    
//    var nh = Math.floor(Math.random() * h);
//    var nw = Math.floor(Math.random() * w);
//    
//    return [nh,nw];    
//    
//}
//
//function fixPopup() {
//    // Set this variable with the desired height
//	var offsetPixels = 670; 
//
//	$(window).scroll(function() {
//		if ($(window).scrollTop() > offsetPixels) {
//			$( ".scrollingBox" ).css({
//				"position": "fixed",
//				"top": "15px"
//			});
//		} else {
//			$( ".scrollingBox" ).css({
//				"position": "relative",
//				"top": "0"
//			});
//		}
//	});
//}


$(function () {
    load_data();

});