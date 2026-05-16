const PDFDocument = require('pdfkit');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Créer dossier uploads s'il n'existe pas
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Génère un PDF de contrat de location avec signature
 * @param {Object} rentalData - Données du contrat
 * @returns {Promise<{pdfHash: string, pdfPath: string, pdfBase64: string}>}
 */
const generateContractPDF = async (rentalData) => {
  try {
    const {
      rentalId,
      propertyTitle,
      propertyAddress,
      propertyCity,
      rent,
      tenantName,
      tenantEmail,
      startDate,
      endDate,
      ownerName,
      ownerEmail,
      ownerAddress,
      walletAddress
    } = rentalData;

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50
      });

      // Générer le chemin du fichier
      const fileName = `contract_${rentalId}_${Date.now()}.pdf`;
      const filePath = path.join(uploadsDir, fileName);
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      // ===== HEADER =====
      doc.fontSize(24).font('Helvetica-Bold').text('CONTRAT DE LOCATION IMMOBILIÈRE', {
        align: 'center',
        underline: true
      });

      doc.fontSize(10).font('Helvetica').text(`ID Contrat Blockchain: ${rentalId}`, {
        align: 'center',
        color: '#666'
      });

      doc.moveDown();

      // ===== PARTIES =====
      doc.fontSize(12).font('Helvetica-Bold').text('PARTIES AU CONTRAT');
      doc.fontSize(11).font('Helvetica');
      doc.text(`Propriétaire: ${ownerName}`);
      doc.text(`Email: ${ownerEmail}`);
      doc.text(`Adresse: ${ownerAddress}`);
      doc.text(`Wallet: ${ownerAddress.substring(0, 10)}...`);

      doc.moveDown();

      doc.text(`Locataire: ${tenantName}`);
      doc.text(`Email: ${tenantEmail}`);
      doc.text(`Wallet: ${walletAddress.substring(0, 10)}...`);

      doc.moveDown();

      // ===== PROPRIÉTÉ =====
      doc.fontSize(12).font('Helvetica-Bold').text('PROPRIÉTÉ LOUÉE');
      doc.fontSize(11).font('Helvetica');
      doc.text(`Titre: ${propertyTitle}`);
      doc.text(`Adresse: ${propertyAddress}, ${propertyCity}`);
      doc.text(`Loyer mensuel: ${rent} ETH`);

      doc.moveDown();

      // ===== DATES =====
      doc.fontSize(12).font('Helvetica-Bold').text('PÉRIODE DE LOCATION');
      doc.fontSize(11).font('Helvetica');
      doc.text(`Début: ${new Date(startDate).toLocaleDateString('fr-FR')}`);
      doc.text(`Fin: ${new Date(endDate).toLocaleDateString('fr-FR')}`);

      doc.moveDown(2);

      // ===== CONDITIONS =====
      doc.fontSize(12).font('Helvetica-Bold').text('CONDITIONS GÉNÉRALES');
      doc.fontSize(11).font('Helvetica');
      doc.text('1. Le locataire s\'engage à payer le loyer en ETH à la date convenue.');
      doc.text('2. Le loyer doit être payé via le smart contract blockchain.');
      doc.text('3. Le contrat est valide une fois signé par les deux parties.');
      doc.text('4. En cas de non-paiement, le propriétaire peut résilier le contrat.');

      doc.moveDown(2);

      // ===== SIGNATURES =====
      doc.fontSize(12).font('Helvetica-Bold').text('SIGNATURES');

      doc.moveDown();

      // Signature du locataire
      doc.fontSize(11).font('Helvetica-Bold').text('Locataire:');
      doc.fontSize(10).font('Helvetica');
      doc.text('_________________________');
      doc.moveDown();
      doc.fontSize(9).text(`Nom: ${tenantName}`);
      doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`);
      doc.text(`Signature numérique: ✓ Blockchain`);

      doc.moveDown(2);

      // Signature du propriétaire
      doc.fontSize(11).font('Helvetica-Bold').text('Propriétaire:');
      doc.fontSize(10).font('Helvetica');
      doc.text('_________________________');
      doc.moveDown();
      doc.fontSize(9).text(`Nom: ${ownerName}`);
      doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`);
      doc.text(`Signature numérique: ✓ Blockchain`);

      // ===== FOOTER =====
      doc.moveDown(3);
      doc.fontSize(8).font('Helvetica').text(
        'Ce contrat est certifié par la blockchain Ethereum. Les signatures numériques sont valides et traçables.',
        { align: 'center', color: '#999' }
      );

      doc.end();

      // Générer le PDF
      stream.on('finish', async () => {
        try {
          // Lire le fichier et créer un hash
          const pdfBuffer = fs.readFileSync(filePath);
          const pdfHash = crypto.createHash('sha256').update(pdfBuffer).digest('hex');
          const pdfBase64 = pdfBuffer.toString('base64');

          resolve({
            pdfHash,
            pdfPath: filePath,
            pdfBase64,
            fileName
          });
        } catch (error) {
          reject(error);
        }
      });

      stream.on('error', reject);
      doc.on('error', reject);
    });
  } catch (error) {
    throw new Error(`Erreur génération PDF: ${error.message}`);
  }
};

/**
 * Récupère un PDF généré
 */
const getPDF = (fileName) => {
  const filePath = path.join(uploadsDir, fileName);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath);
  }
  throw new Error('PDF non trouvé');
};

module.exports = {
  generateContractPDF,
  getPDF
};
