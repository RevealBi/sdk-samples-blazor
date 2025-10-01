window.loadRevealView = function (viewId, dashboardName) {
    $.ig.RVDashboard.loadDashboard(dashboardName).then(dashboard => {
        var revealView = new $.ig.RevealView("#" + viewId);
        revealView.dashboard = dashboard;
    });
}