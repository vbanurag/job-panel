import path from 'path'
import fetch from 'node-fetch'
import { spawn } from './lib/cp'
import { makeDir, moveDir, cleanDir } from './lib/fs'
import run from './run'

// Heroku url can be configured here for staging env.
const remote = {
    name: 'heroku',
    url: 'https://git.heroku.com/job-panel-env.git',
    branch: 'master',
    website: 'https://job-panel-env.herokuapp.com/'
}

const options = {
    cwd: path.resolve(__dirname, '../build'),
    stdio: ['ignore', 'inherit', 'inherit']
}

/**
 * Deploy the contents of the `/build` folder to a remote server via Git.
 */
async function deployToStaging () {
    console.log(process.argv[process.argv.length-1])
    const commitMessage = process.argv[process.argv.length-1]

    // Initialize a new repository
    await makeDir('build')
    await spawn('git', ['init', '--quiet'], options)

    // Changing a remote's URL
    let isRemoteExists = false
    try {
        await spawn('git', ['config', '--get', `remote.${remote.name}.url`], options)
        isRemoteExists = true
    } catch (error) {
        /* skip */
    }
    await spawn('git', ['remote', isRemoteExists ? 'set-url' : 'add', remote.name, remote.url], options)

    // Fetch the remote repository if it exists
    let isRefExists = false
    try {
        await spawn('git', ['ls-remote', '--quiet', '--exit-code', remote.url, remote.branch], options)
        isRefExists = true
    } catch (error) {
        await spawn('git', ['update-ref', '-d', 'HEAD'], options)
    }
    if (isRefExists) {
        await spawn('git', ['fetch', remote.name], options)
        await spawn('git', ['reset', `${remote.name}/${remote.branch}`, '--hard'], options)
        await spawn('git', ['clean', '--force'], options)
    }

    // Build the project in RELEASE mode which
    // generates optimized and minimized bundles
    process.argv.push('--release')
    if (remote.static) process.argv.push('--static')
    await run(require('./build').default) // eslint-disable-line global-require
    if (process.argv.includes('--static')) {
        await cleanDir('build/*', {
            nosort: true,
            dot: true,
            ignore: ['build/.git', 'build/public']
        })
        await moveDir('build/public', 'build')
    }

    // Push the contents of the build folder to the remote server via Git
    await spawn('git', ['add', '.', '--all'], options)
    try {
        await spawn('git', ['diff', '--cached', '--exit-code', '--quiet'], options)
    } catch (error) {
        await spawn('git', ['commit', '--message', `${commitMessage}`], options)
    }

    await spawn('git', ['push', remote.name, `master:${remote.branch}`, '--set-upstream'], options)

    // Check if the site was successfully deployed
    const response = await fetch(remote.website)
    console.info(`${remote.website} => ${response.status} ${response.statusText}`)
}

export default deployToStaging
