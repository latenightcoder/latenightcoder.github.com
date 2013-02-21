$(function(){
	var workflowSteps = [{
        Sequence: 1,
        StepName: "Step one",
        Description: "Sliiiide to the left",
        Responsibility: "Joel D'Souza",
        Status: "Pending"
    }, {
        Sequence: 2,
        StepName: "Step two",
        Description: "Sliiiide to the right",
        Responsibility: "Jodi Linke",
        Status: ""
    }];

    $("#WorkflowGrid").kendoGrid({
        dataSource: {
            data: workflowSteps,
            schema: {
                model: {
                    fields: {
                        Sequence: { type: "number"},
                        StepName: { type: "string"},
                        Description: { type: "string"},
                        Responsibility: { type: "string" },
                        Status: { type: "string" }
                    }
                }
            }
        },
        selectable: true,
        groupable: false,
        scrollable: true,
        sortable: false,
        filterable: false,
        pageable: false,
        height: 70,
        columns: [
            { field: "Sequence" },
            { field: "StepName", title: "Step Name" },
            { field: "Description" },
            { field: "Responsibility" },
            { field: "Status", width: 80 }
        ]
    });

    var grid = $("#WorkflowGrid").data("kendoGrid");
    // selects first grid item
    grid.select(grid.tbody.find(">tr:first"));
});