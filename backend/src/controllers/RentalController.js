const blockchainService = require("../services/BlockchainService");
const supabase = require("../config/supabase");

// 🔵 CREATE RENTAL
const createRental = async (req, res) => {
  try {
    const { tenant, rent, pdfHash } = req.body;

    if (!tenant || !rent || !pdfHash) {
      return res.status(400).json({
        success: false,
        error: "Missing fields"
      });
    }

    // ⛓ BLOCKCHAIN
    const tx = await blockchainService.createRental(
      tenant,
      rent,
      pdfHash
    );

    // 🟦 SUPABASE
    const { data, error } = await supabase
      .from("rentals")
      .insert([
        {
          tenant_id: tenant,
          rent,
          pdf_hash: pdfHash,
          tx_hash: tx.hash,
          status: "pending"
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return res.json({
      success: true,
      txHash: tx.hash,
      data
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// 💰 PAY RENT
const payRent = async (req, res) => {
  try {
    const { rentalId, amount } = req.body;

    const tx = await blockchainService.payRent(
      rentalId,
      amount
    );

    return res.json({
      success: true,
      txHash: tx.hash
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// 📖 GET ONE
const getRental = async (req, res) => {
  try {
    const { id } = req.params;

    const rental = await blockchainService.getRental(id);

    return res.json({
      success: true,
      data: rental
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// 📊 GET ALL SUPABASE
const getAllRentals = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("rentals")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return res.json({
      success: true,
      data
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  createRental,
  payRent,
  getRental,
  getAllRentals
};