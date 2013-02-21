$(".quick-add").click(function(){ $("#bodyInner").show(); });

$(function(){
    $("#NeededByDate").kendoDatePicker();

    $("#tabstrip").kendoTabStrip({
        animation:  {
            open: {
                effects: "fadeIn"
            }
        }            
    });    
    

    $("fieldset > legend > i").click(function(){
        if ($(this).hasClass("icon-chevron-right"))
            $(this).toggleClass("icon-chevron-right icon-chevron-down");
        else
            $(this).toggleClass("icon-chevron-down icon-chevron-right");

        $(this).parent().parent().find(".fieldset-content").toggle();
    });

    $("#files").kendoUpload();            

    var $input = $("#ShipToProperties");
    // var $picklistContainer = $("#picklist-container");
    
    $(".item-main-pane :input").focus(function() {
        $("#picklist-container").hide();
        $input = $(this);

        $input.keydown(function(e) {
            if (e.keyCode === kendo.keys.ENTER) {
                $("#picklist-container").show();
                picklistDataSource.read();
            }
        });
    });

    var properties = [{
        Name: "Colonial",
        Line1: "130 West 29th Street, 3rd Flr",
        City: "Charlotte",
        State: "NC"
    }, {
        Name: "WHAAAAAAT",
        Line1: "130 West 29th Street, 3rd Flr",
        City: "Charlotte",
        State: "NC"
    }, {
        Name: "Windsong",
        Line1: "130 West 29th Street, 3rd Flr",
        City: "Charlotte",
        State: "NC"
    }, {
        Name: "Westheimer",
        Line1: "130 West 29th Street, 3rd Flr",
        City: "Charlotte",
        State: "NC"
    }, {
        Name: "Comap",
        Line1: "130 West 29th Street, 3rd Flr",
        City: "Charlotte",
        State: "NC"
    }, {
        Name: "Cadillac Site",
        Line1: "130 West 29th Street, 3rd Flr",
        City: "Charlotte",
        State: "NC"
    },
    {
        Name: "1 KMG Test",
        Line1: "130 West 29th Street, 3rd Flr",
        City: "Charlotte",
        State: "NC"
    }, {
        Name: "PraxAir Address",
        Line1: "130 West 29th Street, 3rd Flr",
        City: "Charlotte",
        State: "NC"
    }, {
        Name: "RISING SUN ",
        Line1: "130 West 29th Street, 3rd Flr",
        City: "Charlotte",
        State: "NC"
    }, {
        Name: "Solomon",
        Line1: "130 West 29th Street, 3rd Flr",
        City: "Charlotte",
        State: "NC"
    }, {
        Name: "MANITOU ",
        Line1: "130 West 29th Street, 3rd Flr",
        City: "Charlotte",
        State: "NC"
    }, {
        Name: "Magnolia Layne ",
        Line1: "130 West 29th Street, 3rd Flr",
        City: "Charlotte",
        State: "NC"
    }];

    var picklistDataSource = new kendo.data.DataSource({
        data: properties,
        pageSize: 5
    });

    $("#picklist").kendoListView({
        autoBind: false,
        dataSource: picklistDataSource,
        selectable: "single",
        template: kendo.template($("#picklist-template").html()),
        navigatable: true,
        change: function() {
            var data = picklistDataSource.view(),
                selected = $.map(this.select(), function(item) {
                    return data[$(item).index()].Name;
                });

            $input.val(selected);
        }
    });

    $("#pager").kendoPager({
        dataSource: picklistDataSource
    });

    var fullscreen = false;

    function launchFullScreen(element) {
      if(element.requestFullScreen) {
        element.requestFullScreen();
      } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if(element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    }

    // Whack fullscreen
    function cancelFullscreen() {
      if(document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if(document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if(document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }

    $(".icon-fullscreen").click(function() {
        if (!fullscreen) {
            launchFullScreen(document.getElementById("bodyInner"));
            $(this).toggleClass("icon-fullscreen icon-resize-small");
            fullscreen = true;
        }
        else {
            cancelFullscreen();
            $(this).toggleClass("icon-resize-small icon-fullscreen");
            fullscreen = false;
        }
    });
});