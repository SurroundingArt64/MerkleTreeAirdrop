import { ethers, deployments, getNamedAccounts, getUnnamedAccounts } from 'hardhat'
import { setupUsers, setupUser } from '../utils'
import { MerkleTreeAirdrop } from '../../src/types'

export const setupNFT = deployments.createFixture(async () => {
	// Deployment Setup
	await deployments.fixture('MerkleTreeAirdrop')
	const MerkleTreeAirdrop = (await ethers.getContract('MerkleTreeAirdrop')) as MerkleTreeAirdrop
	// Account Setup
	const accounts = await getNamedAccounts()
	const unnamedAccounts = await getUnnamedAccounts()
	const users = await setupUsers(unnamedAccounts, { MerkleTreeAirdrop })
	const deployer = await setupUser(accounts.deployer, { MerkleTreeAirdrop })

	return { MerkleTreeAirdrop, users, deployer }
})
