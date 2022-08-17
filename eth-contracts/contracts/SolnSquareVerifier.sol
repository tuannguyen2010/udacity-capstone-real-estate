pragma solidity >=0.4.21 <0.6.0;
//pragma experimental ABIEncoderV2;

//import '../../zokrates/code/square/verifier.sol';
import './ERC721Mintable.sol';


library Pairing {
    struct G1Point {
        uint X;
        uint Y;
    }
    // Encoding of field elements is: X[0] * z + X[1]
    struct G2Point {
        uint[2] X;
        uint[2] Y;
    }
}

// library VerifyStruct {
//     struct Proof {
//         Pairing.G1Point a;
//         Pairing.G2Point b;
//         Pairing.G1Point c;
//     }
// }

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract Verifier {
    //using Pairing for *;
    // struct Proof {
    //     Pairing.G1Point a;
    //     Pairing.G2Point b;
    //     Pairing.G1Point c;
    // }
    //function verifyTx(Proof memory proof, uint[1] memory input) public view returns(bool);
    function verifyTx(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) public returns(bool);
}

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is ERC721Mintable {

    Verifier private verifier;
    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 index;
        address arr;
        uint256 key;
    }

    // TODO define an array of the above struct
    Solution[] solutionsArray;

    // TODO define a mapping to store unique solutions submitted
    mapping(uint256 => Solution) solutions;

    constructor(address verifierAddress) public ERC721Mintable() {

        verifier = Verifier(verifierAddress);
    }

    // TODO Create an event to emit when a solution is added
    event Added(uint256 key, address arr);

    // TODO Create a function to add the solutions to the array and emit the event
    //function add(uint[2] g1, uint[2] g2, uint1[2] g1) public {
    // function add(
    //     uint g1_a, 
    //     uint g1_b, 
    //     uint g2_a, 
    //     uint g2_b, 
    //     uint g2_c, 
    //     uint g2_d, 
    //     uint g1_c, 
    //     uint g1_d,
    //     uint[2] memory input) onlyOwner public { 
    //         Pairing.G1Point memory gpointA = Pairing.G1Point({X: g1_a, Y: g1_b});
    //         Pairing.G2Point memory gpointB = Pairing.G2Point({X: [g2_a, g2_b], Y: [g2_c, g2_d]});
    //         Pairing.G1Point memory gpointC = Pairing.G1Point({X: g1_c, Y: g1_d});
    //         Verifier.Proof memory proof = Verifier.Proof({
    //             a: gpointA,
    //             b: gpointB,
    //             c: gpointC
    //         });
    //         require(verifier.verifyTx(proof, input), "Cannot verify solution");
            
    //         uint256 key = uint256(keccak256(abi.encodePacked(input)));
    //         require(solutions[key].arr == address(0), "Solution exist");


    //         solutions[key] = Solution({
    //             index: solutionsArray.length,
    //             arr: msg.sender,
    //             key: key
    //         });

    //         solutionsArray.push(solutions[key]);

    //         emit Added(solutions[key].index, solutions[key].arr);
    // }

    function add(
        uint[2] memory g1_a,
        uint[2][2] memory g2_b,
        uint[2] memory g1_c,
        uint[2] memory input) 
        //onlyOwner 
        public { 
            // Pairing.G1Point memory gpointA = Pairing.G1Point({X: g1_a[0], Y: g1_a[1]});
            // Pairing.G2Point memory gpointB = Pairing.G2Point({X: [g2_b[0][0], g2_b[0][1]], Y: [g2_b[1][0], g2_b[1][1]]});
            // Pairing.G1Point memory gpointC = Pairing.G1Point({X: g1_c[0], Y: g1_c[1]});
            // Verifier.Proof memory proof = Verifier.Proof({
            //     a: gpointA,
            //     b: gpointB,
            //     c: gpointC
            // });
            // require(verifier.verifyTx(proof, input), "Cannot verify solution");

            require(verifier.verifyTx(g1_a, g2_b, g1_c , input), "Cannot verify solution");
            
            uint256 key = uint256(keccak256(abi.encodePacked(input[0], input[1])));
            require(solutions[key].arr == address(0), "Solution exist");


            solutions[key] = Solution({
                index: solutionsArray.length,
                arr: msg.sender,
                key: key
            });

            solutionsArray.push(solutions[key]);

            emit Added(solutions[key].index, solutions[key].arr);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mint(address to, uint256 tokenId, uint[2] memory input) public onlyOwner {
        uint256 key = uint256(keccak256(abi.encodePacked(input[0], input[1])));
        require(solutions[key].key == key, "Solution has not been verified");

        super.mint(to, tokenId);
    }

}





  


























