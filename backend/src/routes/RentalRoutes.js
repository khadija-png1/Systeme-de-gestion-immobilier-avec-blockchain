const express = require("express");
const router = express.Router();

const controller = require("../controllers/RentalController");

router.post("/create", controller.createRental);
router.post("/pay", controller.payRent);
router.get("/all", controller.getAllRentals);

router.get("/:id", controller.getRental);

module.exports = router;
