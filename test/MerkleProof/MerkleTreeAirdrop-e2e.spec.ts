import { ethers } from 'ethers'
import { PromiseType } from 'utility-types'
import { setupNFT as setupTest } from './fixtures'
import { MerkleTree } from 'merkletreejs'
import keccak256 from 'keccak256'
import '../chai-setup'
import { expect } from 'chai'

describe('MerkleTreeAirdrop.sol', async () => {
	let data: PromiseType<ReturnType<typeof setupTest>>
	let merkleTree: MerkleTree
	before(async () => {
		data = await setupTest()
	})

	it('calculate merkle root and set root and verify', async () => {
		const addresses = [...data.users.map((elem) => elem.address)]
		const values = Array.from({ length: addresses.length }, (_, i) => i + 1)

		const leaves = values.map((value, idx) => {
			return ethers.utils.defaultAbiCoder.encode(['address', 'uint256'], [addresses[idx], value])
		})
		merkleTree = new MerkleTree(leaves, keccak256, { hashLeaves: true, sortPairs: true })

		const root = merkleTree.getHexRoot()

		const leaf = keccak256(leaves[0])

		const proof = merkleTree.getHexProof(leaf)

		await data.deployer.MerkleTreeAirdrop.setCommittedRoot(root)

		expect(await data.users[0].MerkleTreeAirdrop.canClaim(proof, leaf)).to.eq(true)
	})

	it('can claim', async () => {
		const leaf = keccak256(ethers.utils.defaultAbiCoder.encode(['address', 'uint256'], [data.users[0].address, 1]))

		const proof = merkleTree.getHexProof(leaf)

		await expect(
			data.users[0].MerkleTreeAirdrop.claim(proof, {
				owner: data.users[0].address,
				value: 1,
			})
		)
			.to.emit(data.MerkleTreeAirdrop, 'Claim')
			.withArgs(data.users[0].address, 1)
	})
})
