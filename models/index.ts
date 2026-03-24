import CustomersModel from "./Customers";
import CoverageAreasModel from "./CoverageAreas";
import QuotesModel from "./Quotes";
import TrackingHistoryModel from "./TrackingHistory";

// 🔥 INIT MODEL DULU
const Customers = CustomersModel;
const CoverageAreas = CoverageAreasModel;
const Quotes = QuotesModel;
const TrackingHistory = TrackingHistoryModel;

// ================= RELATIONS ================= //

function initRelations() {
  // 🔥 Customers -> CoverageAreas
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

  // 🔥 Quotes -> CoverageAreas
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

  // 🔥 TrackingHistory -> Quotes
  TrackingHistory.belongsTo(Quotes, {
    foreignKey: "connote_no",
    targetKey: "connote_no",
    as: "quote",
  });
}

// 🔥 JALANKAN SEKALI
initRelations();

export { Customers, CoverageAreas, Quotes, TrackingHistory };