import CustomersModel from "./Customers";
import CoverageAreasModel from "./CoverageAreas";
import QuotesModel from "./Quotes";
import TrackingHistoryModel from "./TrackingHistory";
import PackageDetailModel from "./PackageDetail";
import UsersModel from "./Users";
import ResetTokensModel from "./ResetTokens"; // ✅ FIX IMPORT

// ================= INIT MODEL =================
const Customers = CustomersModel;
const CoverageAreas = CoverageAreasModel;
const Quotes = QuotesModel;
const TrackingHistory = TrackingHistoryModel;
const Users = UsersModel;
const PackageDetails = PackageDetailModel;
const ResetTokens = ResetTokensModel; // ✅ sekarang valid

// ================= RELATIONS =================
function initRelations() {
  // Users -> Customers
  Users.belongsTo(Customers, {
    foreignKey: "customer_code",
    targetKey: "customer_code",
    as: "customer",
  });

  Customers.hasOne(Users, {
    foreignKey: "customer_code",
    sourceKey: "customer_code",
    as: "user",
  });

  // Customers -> CoverageAreas
  Customers.belongsTo(CoverageAreas, {
    foreignKey: "pickup_suburb_code",
    targetKey: "area_code",
    as: "pickupArea",
  });

  Customers.belongsTo(CoverageAreas, {
    foreignKey: "office_suburb_code",
    targetKey: "area_code",
    as: "officeArea",
  });

  // Quotes -> CoverageAreas
  Quotes.belongsTo(CoverageAreas, {
    foreignKey: "suburb_origin",
    targetKey: "area_code",
    as: "originArea",
  });

  Quotes.belongsTo(CoverageAreas, {
    foreignKey: "suburb_destination",
    targetKey: "area_code",
    as: "destinationArea",
  });

  // TrackingHistory -> Quotes
  TrackingHistory.belongsTo(Quotes, {
    foreignKey: "connote_no",
    targetKey: "connote_no",
    as: "quote",
  });

  // 🔥 OPTIONAL: ResetTokens relation
  ResetTokens.belongsTo(Users, {
    foreignKey: "email",
    targetKey: "email",
    as: "user",
  });
  // Quotes -> QuoteDetails (1 to many)
  Quotes.hasMany(PackageDetails, {
    foreignKey: "connote_no",
    sourceKey: "connote_no",
    as: "packageDetails",
  });

  PackageDetails.belongsTo(Quotes, {
    foreignKey: "connote_no",
    targetKey: "connote_no",
    as: "quote",
  });
}

// ================= INIT =================
initRelations();

// ================= EXPORT =================
export {
  Customers,
  CoverageAreas,
  Quotes,
  TrackingHistory,
  Users,
  ResetTokens,
  PackageDetails,
};
