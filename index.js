import $ from "jquery";

/*
$("#test").append("<h1>Test Mest</h1>");


$.getJSON("/Users/akilsevim/Downloads/requests.json", function(json) {
    console.log("TEst");
    console.log(json); // this will show the info it in firebug console
});

$.ajax("/Users/akilsevim/Downloads/requests.json", function(json) {
    console.log("TEst");
    console.log(json); // this will show the info it in firebug console
});*/

var indexJson = require('./non-empty-tiles_9.json');
var bloomLimit = 9;

var bloomfilter = require("bloomfilter");
var bloom = new bloomfilter.BloomFilter(
    512 * 256, // number of bits to allocate.
    16        // number of hash functions.
);

$.each(indexJson, function (i,val) {
    bloom.add(indexJson[i]);
});

var TileRequests = {};
var maxTime = 0;
var totalTileRequests = 0;

function handleFileSelect(evt) {

    var files = evt.target.files; // FileList object

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
        output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
            f.size, ' bytes, last modified: ',
            f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
            '</li>');

        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile)  {
            return function(e) {
                //console.log(JSON.parse(e.target.result));
                var theJson = JSON.parse(e.target.result);
                $.each(theJson, function(i, val) {
                    if(i > maxTime) maxTime = i;
                    if(!TileRequests.hasOwnProperty(i)) {
                        TileRequests[i] = [];
                    }

                    TileRequests[i].push(val);
                });
                //requestsJson[theFile.name] = JSON.parse(e.target.result);*/
            };
        })(f);

        // Read in the image file as a data URL.
        reader.readAsText(f);

        reader.onloadend = (function() {
            $.each(TileRequests, function(i, val) {
                $.each(val, function () {
                    totalTileRequests++;
                })
            });
            $("#requestCounter").html(totalTileRequests + " requests loaded. <br/>");
        });
    }
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';

}

document.getElementById('files').addEventListener('change', handleFileSelect, false);



var tileURL;
var intervalV;

var multiplier = 1;
var boomIt = false;

$("#start").click(function () {
    if($("#bloom").prop("checked")) boomIt = true;
    tileURL = $("#serverURL").val();
    multiplier = $("#multiplier").val();
    intervalV = setInterval(sendRequest, 1);

    $("#requestCounter").prepend("Started. <br/>");

});

var sec = 0;
var requestCounter = 0;

var finishTimes = [];

function encode (z,x,y) {
    return (1 << (2*z)) | ((x) << z) | (y);
}

function sendRequest() {
    sec++;
    if(!TileRequests.hasOwnProperty(sec)) return;

    //$("#requestCounter").prepend("<b>"+sec+"</b><br/>");
    $.each(TileRequests[sec], function (i, val) {
        for(var i = 0; i < multiplier; i ++) {
            //const start = new Date().getTime();

            /*if(boomIt) {
                if(bloom.test(encode(val.z,val.x,val.y))) {
                    requestCounter++;
                    var df = new Date();
                    const finish = df.getTime();
                    finishTimes[requestCounter] = finish - start;
                }
            }*/

            $.ajax({
                url: tileURL + "tile-" + val.z + "-" + val.x + "-" + val.y + ".png?u="+requestCounter
            }).done(function () {
                //var df = new Date();
                //const finish = df.getTime();
                //requestCounter++;
                //finishTimes.push(finish - start);
                //$("#requestCounter").prepend("<i>tile-" + val.z + "-" + val.x + "-" + val.y + ".png</i><br/>");
            });
        }
    });

    if(maxTime == sec) {
        $("#requestCounter").prepend("Finished. MaxTime: "+maxTime+"."+ requestCounter +"requests has been made. <br/>");
        /*
        var over = 0;
        var count = 0;
        $.each(finishTimes,function (i,val) {
            var style = 'blue';
            count++;
            if(val >= 500) {
                over++;
                style = 'red';
            }
           $("#requestsOutput").append("<div><b>"+i+":</b><i class='"+style+"'>"+val+"</i></div>");
        });
        $("#requestsOutput").prepend("Total:"+count+"<br>");
        $("#requestsOutput").prepend("Over:"+over);*/
        clearInterval(intervalV);
        console.log(TileRequests)
    }
}
