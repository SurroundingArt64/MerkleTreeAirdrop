import { deployments, getNamedAccounts } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/dist/types'

const func: DeployFunction = async () => {
	const { deploy } = deployments
	const { deployer } = await getNamedAccounts()

	await deploy('MerkleTreeAirdrop', {
		from: deployer,
		log: true,
		skipIfAlreadyDeployed: true,
		proxy: {
			proxyContract: 'OptimizedTransparentProxy',
			execute: {
				init: { methodName: 'initialize', args: [] },
			},
			upgradeIndex: 0,
		},
	})
}

export default func
func.tags = ['MerkleTreeAirdrop']
