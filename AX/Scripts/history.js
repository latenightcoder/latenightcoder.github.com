$(function(){
	var historyItems = [{
        Description: "Created",
        Comment: "Order created and saved",
        PerformedBy: "Joel D'Souza",
        EntryDate: "02/19/2013"
    }, {
        Description: "Approval Required",
        Comment: "Workflow step [Step 1] assigned to Jodi Linke.",
        PerformedBy: "System",
        EntryDate: "02/20/2013"
    }];

    $("#HistoryGrid").kendoGrid({
        dataSource: {
            data: historyItems,
            schema: {
                model: {
                    fields: {
                        Description: { type: "string"},
                        Comment: { type: "string"},
                        PerformedBy: { type: "string" },
                        EntryDate: { type: "date" }
                    }
                }
            }
        },
        groupable: true,
        scrollable: true,
        sortable: true,
        filterable: true,
        pageable: false,
        height: 140,
        columns: [
            { field: "Description" },
            { field: "Comment" },
            { field: "PerformedBy", title: "Performed By" , width: 110 },
            { field: "EntryDate", format: "{0:MM/dd/yyyy}", width: 90 }
        ]
    });
});