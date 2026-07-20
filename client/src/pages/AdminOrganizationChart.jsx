import React from "react";
import OrgChartTree from "../components/orgchart/OrgChartTree";

// Admins get full add / edit / remove control over the chart tree.
const AdminOrganizationChart = () => <OrgChartTree isAdmin={true} />;

export default AdminOrganizationChart;
