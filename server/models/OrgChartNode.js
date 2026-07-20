const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

// A node in the company's organization chart tree. Deliberately its own
// table (not just User.reportingManager) so admins can lay out a proper
// hierarchy — including boxes for names/roles that don't map 1:1 to a real
// login account — the way the reference chart (President -> VPs -> Managers)
// works. parentId is a self-reference: null = top of the chart.
const OrgChartNode = sequelize.define(
  "OrgChartNode",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: true }, // job role / designation, e.g. "VP - Sales"
    department: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: true },
    phone: { type: DataTypes.STRING, allowNull: true },
    avatarUrl: { type: DataTypes.STRING, allowNull: true },
    // Optional link to a real employee account, so the chart can stay in
    // sync with who they are — not required, since a chart may include
    // roles that aren't tied to a system login.
    userId: { type: DataTypes.UUID, allowNull: true },
    parentId: { type: DataTypes.UUID, allowNull: true },
    // Sibling display order under the same parent (lower = shown first).
    order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  {
    tableName: "org_chart_nodes",
    timestamps: true,
  }
);

module.exports = OrgChartNode;
