pragma solidity ^0.8.19;

contract RentalContract {

    uint public rentalCount = 0;

    struct Rental {
        uint id;
        address owner;
        address tenant;
        uint rent;
        string pdfHash;
        bool signed;
    }

    mapping(uint => Rental) public rentals;
//------------creation contrat ------------------
    function createRental(
        address _tenant,
        uint _rent,
        string memory _pdfHash
    ) public {

        rentalCount++;

        rentals[rentalCount] = Rental(
            rentalCount,
            msg.sender,
            _tenant,
            _rent,
            _pdfHash,
            false
        );
    }

    //----signature contrat ------------------
    function signContract(uint _id) public {

        require(msg.sender == rentals[_id].tenant);

        rentals[_id].signed = true;
    }

    //-----------payement contrat-------------------
    function payRent(uint _id) public payable {

        Rental memory rental = rentals[_id];

        require(msg.sender == rental.tenant);

        require(msg.value == rental.rent);

        payable(rental.owner).transfer(msg.value);
    }
}