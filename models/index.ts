import CustomersModel from "./Customers";
import CoverageAreasModel from "./CoverageAreas";
import QuotesModel from "./Quotes";
import TrackingHistoryModel from "./TrackingHistory";
import PackageDetailModel from "./PackageDetail";
import UsersModel from "./Users";
import ResetTokensModel from "./ResetTokens";

import CarrierModel from "./Carriers";
import ShippingRatesModel from "./ShippingRates";

// ================= INIT MODEL =================
const Customers = CustomersModel;
const CoverageAreas = CoverageAreasModel;
const Quotes = QuotesModel;
const TrackingHistory = TrackingHistoryModel;
const Users = UsersModel;
const PackageDetails = PackageDetailModel;
const ResetTokens = ResetTokensModel; // ✅ sekarang valid

const Carriers = CarrierModel;
const ShippingRates = ShippingRatesModel;

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

  // ================= CARRIERS & SHIPPING RATES =================

  // 1. Carriers -> ShippingRates (1 to many)
  Carriers.hasMany(ShippingRates, {
    foreignKey: "carrier_code", // field di ShippingRates
    sourceKey: "carrier_code", // field di Carriers
    as: "rates",
  });

  // 2. ShippingRates -> Carriers (many to 1)
  ShippingRates.belongsTo(Carriers, {
    foreignKey: "carrier_code", // field di ShippingRates
    targetKey: "carrier_code", // field di Carriers
    as: "carrier_details",
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
  Carriers,
  ShippingRates,
};
