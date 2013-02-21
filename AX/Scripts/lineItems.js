$(function(){
    var lineItems = [{
        LineNumber: 1,
        ItemNumber: "P1001",
        Quantity: 3,
        ItemDescription: "Hammer Time",
        UnitPrice: "4.99",
        UOMID: 1,
        Total: 14.97
    }, {
        LineNumber: 2,
        ItemNumber: "P1002",
        Quantity: 2000,
        ItemDescription: "LA Nails",
        UnitPrice: ".67",
        UOMID: 1,
        Total: 1340.00
    }];

    var unitOfMeasures = [{
        "value": 1,
        "text": "Each"
    }, {
        "value": 2,
        "text": "KG"
    }];

    var distributionLineItems = [{
        Id: 1,
        LineNumber: 1,
        PropertyCode: "Property 1",
        AccountingCode: "Accounting Code 1",
        Description: "I am not really that descriptive",
        Amount: 5
    }, {
        Id: 2,
        LineNumber: 1,
        PropertyCode: "Property 2",
        AccountingCode: "Accounting Code 2",
        Description: "I am not really that descriptive",
        Amount: 5
    }, {
        Id: 3,
        LineNumber: 2,
        PropertyCode: "Property 1",
        AccountingCode: "Accounting Code 2",
        Description: "I am not really that descriptive",
        Amount: 100
    }];

    var dataTransport = {
        read: function(options) {
            options.success(distributionLineItems);
        },
        create: function(options) {
            console.log(distributionLineItems.length);
        },
        update: function(options) {
           console.log(distributionLineItems);
        },
        destroy: function(options) {
            console.log(distributionLineItems.length);
        }
    };

    var lineItemDetailInit = function(e) {
        var $grid = $("<div/>").appendTo(e.detailCell).kendoGrid({
            dataSource: {
                transport: dataTransport,
                // data: distributionLineItems,
                schema: {
                    model: {
                        id: "Id",
                        fields: {
                            Id: { editable: false },
                            LineNumber: { editable: false, type: "number", defaultValue: e.data.LineNumber, },
                            PropertyCode: { type: "string", validation: { required: true } },
                            AccountingCode: { type: "string", validation: { required: true } },
                            Description: { type: "string" },
                            Amount: { type: "number" }
                        }
                    }
                },
                filter: {
                    logic: "or",
                    filters: [
                        { field: "LineNumber", operator: "eq", value: e.data.LineNumber },
                        { field: "LineNumber", operator: "eq", value: 0 }
                    ]
                }
            },
            toolbar: [{ name: "create", text: "Add new distribution" }, "save"],
            editable: { 
                confirmation: "Are you sure you want to delete this distribution?",
                createAt: "bottom"
            },
            scrollable: true,
            sortable: false,
            filterable: false,
            navigatable: true,
            pageable: false,
            columns: [
                { command: [{ name: "destroy", text: "" }], title: "&nbsp;", width: 100 },
                { field: "PropertyCode", title:"Property Code" },
                { field: "AccountingCode", title:"Accounting Code"},
                { field: "Description" },
                { field: "Amount", format: "{0:c}", }
            ]
        });
    };

    $("#LineItemsGrid").kendoGrid({
        dataSource: {
            data: lineItems,
            schema: {
                model: {
                    fields: {
                        // LineNumber: { editable: false, type: "number" },
                        ItemNumber: { type: "string", validation: { required: true } },
                        ItemDescription: { type: "string", validation: { required: true } },
                        Quantity: { type: "number", validation: { required: true } },
                        UnitPrice: { type: "number", validation: { required: true} },
                        UOMID: { field: "UOMID", type: "number", defaultValue: 1 },
                        Total: {  editable: false, type: "number" }
                    }
                }
            },
            change: function(e){ 
                if (e.field == "Quantity" || e.field == "UnitPrice")
                {
                    // var uid = e.items[0].uid;
                    // var total = e.items[0].Quantity * e.items[0].UnitPrice;
                    // var dataitem = this.getByUid(uid);
                    // dataitem.Total = total;

                    e.items[0].Total = e.items[0].Quantity * e.items[0].UnitPrice;
                    this.sync();
                }
            },
            aggregate: [
                { field: "ItemNumber", aggregate: "count" },
                { field: "Total", aggregate: "sum" }
            ],
            pageSize: 10
        },
        // batch: true,
        toolbar: [
            { name: "create", text: "Add new line item" }, 
            { name: "add-from-contract", text: "Add contract/history item(s)"},
            { name: "add-from-po", text: "Add from previous orders"}
        ],
        // editable: true,
        editable: { 
            "confirmation": "Are you sure you want to delete this item?",
            "createAt": "bottom"
        },
        detailInit: lineItemDetailInit,
        height: 600,
        scrollable: true,
        sortable: false,
        filterable: false,
        navigatable: true,
        pageable: false,
        columns: [
            {
                command: [
                    { name: "destroy", text: "" }
                ],
                title: "&nbsp;", 
                width: 100
            },
            {
                field: "ItemNumber",
                title: "Item Number",
                footerTemplate: "Lines: #=count#"
            },
            {
                field: "ItemDescription",
                title: "Item Description"
            },
            {
                field: "Quantity",
                title: "Quantity"
            },
            {
                field: "UnitPrice",
                title: "Unit Price",
                format: "{0:c}"
            },
            {
                field: "UOMID", 
                title: "UOM",
                values: unitOfMeasures,
                width: 100
            },
            {
                field: "Total",
                title: "Line Total",
                format: "{0:c}",
                template: "#= kendo.toString(Quantity * UnitPrice, 'c') #",
                footerTemplate: "Subtotal: #= kendo.toString(sum, 'c') #"
            }
        ]
    });

    $("#DistributionLineItemsGrid").kendoGrid({
        dataSource: {
            // data: distributionLineItems,
            transport: dataTransport,
            schema: {
                model: {
                    fields: {
                        LineNumber: { editable: false, type: "number" },
                        PropertyCode: { type: "string", validation: { required: true } },
                        AccountingCode: { type: "string", validation: { required: true } },
                        Description: { type: "string" },
                        Amount: { type: "number" }
                    }
                }
            }
        },
        toolbar: [{ name: "create", text: "Add new distribution" }],
        editable: { 
            "confirmation": "Are you sure you want to delete this item?",
            "createAt": "bottom"
        },
        scrollable: true,
        sortable: false,
        filterable: false,
        navigatable: true,
        pageable: false,
        height: 400,
        columns: [
            { command: [{ name: "destroy", text: "" }], title: "&nbsp;", width: 100 },
            { field: "PropertyCode", title:"Property Code" },
            { field: "AccountingCode", title:"Accounting Code"},
            { field: "Description" },
            { field: "Amount", format: "{0:c}", }
        ]
    });

    var contractItems = [{
        LineNumber: 1,
        ItemNumber: "P1011",
        Quantity: 0,
        ItemDescription: "Concrete",
        UnitPrice: "4.99",
        UOMID: 1,
        Total: 14.97
    }, {
        LineNumber: 2,
        ItemNumber: "P1012",
        Quantity: 0,
        ItemDescription: "Doors",
        UnitPrice: ".67",
        UOMID: 1,
        Total: 1340.00
    }];

    $("#ContractItemsGrid").kendoGrid({
        dataSource: {
            data: contractItems,
            schema: {
                model: {
                    fields: {
                        // LineNumber: { editable: false, type: "number" },
                        ItemNumber: { editable: false, type: "string", validation: { required: true } },
                        ItemDescription: { editable: false, type: "string", validation: { required: true } },
                        Quantity: { type: "number", validation: { required: true } },
                        UnitPrice: { editable: false, type: "number", validation: { required: true} },
                        UOMID: { editable: false, field: "UOMID", type: "number", defaultValue: 1 },
                        Total: {  editable: false, type: "number" }
                    }
                }
            },
            pageSize: 10
        },
        toolbar: [{ name: "add-to-requisition", text: "Add to requisition"},],
        editable: true,
        height: 600,
        scrollable: true,
        sortable: false,
        filterable: false,
        pageable: false,
        selectable: "multiple",
        columns: [        
            {
                field: "Quantity",
                title: "Quantity"
            },
            {
                field: "ItemNumber",
                title: "Item Number"
            },
            {
                field: "ItemDescription",
                title: "Item Description"
            },
            {
                field: "UnitPrice",
                title: "Unit Price",
                format: "{0:c}"
            },
            {
                field: "UOMID", 
                title: "UOM",
                values: unitOfMeasures,
                width: 100
            }
        ]
    });
    
    $(".k-grid-add-from-contract").click(function(){
        $(".grid-items-main-pane").width("50%");
        $(".grid-items-secondary-pane").width("45%");
        $(".grid-items-secondary-pane").show();
    });

    $(".k-grid-add-to-requisition").click(function(){
        $(".grid-items-secondary-pane").hide();
        $(".grid-items-main-pane").width("100%");
    });        
});