export default function RentalCard({ rental }) {
  return (
    <div style={{
      background: "#1a1a1a",
      padding: 15,
      marginTop: 10,
      borderLeft: "4px solid #f5c542"
    }}>
      <p>Tenant: {rental.tenant}</p>
      <p>Rent: {rental.rent}</p>
      <p>TX: {rental.tx_hash}</p>
    </div>
  );
}