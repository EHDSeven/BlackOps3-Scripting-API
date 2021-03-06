/* functions.js - Javascript for Function data
* 
* This file is part of the BlackOps3 Scripting API distribution (https://github.com/EHDSeven/BlackOps3-Scripting-API).
* Copyright (c) 2016 Michael "Seven" Larkin.
* 
* This program is free software: you can redistribute it and/or modify  
* it under the terms of the GNU General Public License as published by  
* the Free Software Foundation, version 3.
*
* This program is distributed in the hope that it will be useful, but 
* WITHOUT ANY WARRANTY; without even the implied warranty of 
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU 
* General Public License for more details.
*
* You should have received a copy of the GNU General Public License 
* along with this program. If not, see <http://www.gnu.org/licenses/>.
*/
var functionListRaw = {};
var returnList = [];
var entityList = [];
var categoryList = [];
var clientserverList = [];
//Draw Function Data on Main
function showFunction(functionName) {
    var functionData = {};
    //Get Function data from SQL
    $.getJSON( "api.php/get/function/"+functionName, function( data ) {
        $.each(data[0], function (key, val) {
            //Handle Vars to output as JSON - Offload to API?
            functionData[key] = {};
            if(key == "vars") {
                functionData[key] = jQuery.parseJSON(val);
            } else {
                functionData[key] = val;
            }
        });
        //Clear Main
        $("#main").text("");
        //Blank Funcion names array
        var functionNames = [];
        var title = "";
        //Print void + Function name
        if(functionData.entity === "") {
            title = "void " + functionData.functionName+"(";
        } else {
            title = "void <" + functionData.entity + "> " + functionData.functionName+"(";
        }
        //Loop through each function and add to array
        $.each(functionData.vars, function(index, val) {
            if(val.mandatory) {
                functionNames.push("<"+index+">");
            } else {
                functionNames.push("["+index+"]");
            }
        });
        //Print funcitons with comma separation
        title += functionNames.join(", ");
        //Close Function
        title +=")";
        //Print Function Name
        $("<h2 />").text(title).appendTo($("#main"));
        //Create Function List
        var li = $("<ul />").appendTo("#main");
        //Loop and add variables
        $(functionData.vars).each(function ()
        {
            $.each($(this)[0], function(index, val) {
                var sub_li = $("<li/>")
                    .appendTo(li);

                $("<span />").appendTo(sub_li);
                if(val.mandatory)
                {
                    $("<strong />")
                        .text("[MANDATORY]")
                        .appendTo(sub_li);
                    sub_li.append(" &lt;" + index + "&gt; " + val.description);
                } else {
                    $("<strong />")
                        .text("[OPTIONAL]")
                        .appendTo(sub_li);
                    sub_li.append(" [" +index + "] " + val.description);
                }
            });
        });
        //Category
        var div = $("<div />").appendTo(li);
        $("<br />").appendTo(div);
        $("<strong />")
            .text("CATEGORY: ")
            .appendTo(div);
        div.append(functionData.category);

        //ServerClient
        div = $("<div />").appendTo(li);
        $("<strong />")
            .text("SERVER/CLIENT: ")
            .appendTo(div);
        div.append(functionData.clientserver);

        //Summary
        div = $("<div />").appendTo(li);
        $("<strong />")
            .text("SUMMARY: ")
            .appendTo(div);
        div.append(functionData.summary);

        //ServerClient
        div = $("<div />").appendTo(li);
        $("<strong />")
            .text("EXAMPLE: ")
            .appendTo(div);
        div.append(functionData.example);
    });
}
//Update the list with our Filter Requirements
function filterList(navlist) {
    var tmplist = {};
    //Store our Filters in a variable for speed
    var returnval = $('#return').val();
    var entityval = $('#entity').val();
    var categoryval = $('#category').val();
    var clientserverval = $('#clientserver').val();

    $(navlist).each(function () {
            $.each(this, function(index, value) {
                //Loop through each filter and skip if it does not meet the filter requirements
                if(returnval != "none" && returnval != value.return) {
                    return true;
                }
                if(entityval != "none" && value.entity != entityval) {
                    return true;
                }
                if(categoryval != "none" && value.category != categoryval) {
                    return true;
                }
                if(clientserverval != "none" && value.clientserver != clientserverval) {
                    return true;
                }
                //If we get this car add the Function to the list
                tmplist[value.functionName] = {};
                tmplist[value.functionName].functionName = value.functionName;
            });
        });
    return tmplist;
}
//Function for drawing from list
function loadNavigation(navlist) {
    //Check List against filter
    navlist = filterList(navlist);
    //Clear any existing Functions
    $("#navlist").empty();
    //Create Functions header
    var li = $("<li/>")
        .appendTo("#navlist");
    li.append("Functions");
    var sub_ul = $("<ul/>")
        .appendTo(li);
    //List each Function
    $(navlist).each(function () {
        $.each(this, function(index, val) {
            var sub_li = $("<li/>").appendTo(sub_ul);
            $("<a />")
                .text(val.functionName)
                .attr("href", "#" + val.functionName)
                .appendTo(sub_li)
                .on("click", function () {
                    showFunction($( this ).text());
                });
        });
    });
}
//Repeatitve addOption function
function addOption(list, text, val=text) {
    $(list).append($('<option>', { 
                value: val,
                text : text 
    }));
}
//Function for Populating filter options
function loadFilter() {
    //Clear existing filter
    $('#return').empty();
    $('#entity').empty();
    $('#category').empty();
    $('#clientserver').empty();
    //Add "No Filter" Type to Each box
    addOption("#return", "No Filter", "none");
    addOption("#entity", "No Filter", "none");
    addOption("#category", "No Filter", "none");
    addOption("#clientserver", "No Filter", "none");
    //Get Return types
    $.getJSON( "api.php/get/return", function( data ) {
        $.each(data, function (key, val) {
            returnList.push(val.return);
            addOption("#return", val.return);
        });
    });
    //Get Entity Types
    $.getJSON( "api.php/get/entities", function( data ) {
        $.each(data, function (key, val) {
            entityList.push(val.entity);
            addOption("#entity", val.entity);
        });
    });
    //Get category Types
    $.getJSON( "api.php/get/categories", function( data ) {
        $.each(data, function (key, val) {
            categoryList.push(val.category);
            addOption("#category", val.category);
        });
    });
    //Get Client / Server Types
    $.getJSON( "api.php/get/clientserver", function( data ) {
        $.each(data, function (key, val) {
            clientserverList.push(val.clientserver);
            addOption("#clientserver", val.clientserver);
        });
    });
}
//Wildcard search for Function list
function searchFunctions() {
    var functionListSearch = {};
    //Trim spaces
    var search = $.trim($("#searchbox").val());
    //Check if 
    if(search != ""){
        //Use the list we already have to reduce SQL calls
        $(functionListRaw).each(function () {
            $.each(this, function(index, value) {
                if(value.functionName.toLowerCase().search(search.toLowerCase()) >= 0) {
                    functionListSearch[value.functionName] = {};
                    functionListSearch[value.functionName].functionName = value.functionName;
                }
            });
        });
        //Draw results in navigation
        loadNavigation(functionListSearch);
        //Clear Search Object
        functionListSearch = {};
    } else {
        //Draw full list
        loadNavigation(functionListRaw);
    }
}
//Get array from SQL Database
$(document).ready(function () {
    loadFilter();
    $.getJSON( "api.php/get/functionlist", function( data ) {
        $.each(data, function (key, val) {
            functionListRaw[val.functionName] = {};
            functionListRaw[val.functionName].functionName = val.functionName;
            functionListRaw[val.functionName].return = val.return;
            functionListRaw[val.functionName].entity = val.entity;
            functionListRaw[val.functionName].category = val.category;
            functionListRaw[val.functionName].clientserver = val.clientserver;
        });
        //Draw results in navigation
        loadNavigation(functionListRaw);
    });
    //Check if this was a direct link and load function
    var hash = window.location.hash.substring(1);
    if(hash != "") {
        showFunction(hash);
    }
});
//Monitor Keyup for Search
$("#searchbox").on("keyup", function() {
    searchFunctions();
});
//Hook Filter button
$('#filter').on("click", function() {
    if ( $("#filterlist").is( ":hidden" ) ) {
        $("#filterlist").slideDown();
    } else {
        $("#filterlist").slideUp();
    }
});

$('#return').change(function() {
    searchFunctions();
});

$('#entity').change(function() {
    searchFunctions();
});

$('#category').change(function() {
    searchFunctions();
});

$('#clientserver').change(function() {
    searchFunctions();
});
