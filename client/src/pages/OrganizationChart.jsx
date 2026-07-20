import React from "react";
import OrgChartTree from "../components/orgchart/OrgChartTree";

// Employees can browse the chart but never add/edit/remove — only admins can.
const OrganizationChart = () => <OrgChartTree isAdmin={false} />;

export default OrganizationChart;
